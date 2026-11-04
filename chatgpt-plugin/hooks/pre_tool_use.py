#!/usr/bin/env python3
"""Codex PreToolUse hook that asks GuardAgent's local MCP SSE server."""
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

DEFAULT_URL = "http://localhost:8765/sse"
DEFAULT_THRESHOLD = 0.7
TIMEOUT = 5


def emit(payload):
    sys.stdout.write(json.dumps(payload, separators=(",", ":")) + "\n")
    sys.stdout.flush()


def block(reason):
    emit({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": reason,
    }})


def post_json(url, payload):
    body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=body,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json, text/event-stream",
        },
    )
    with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
        response.read(65536)


def read_sse_message(stream, wanted_id):
    data_lines = []
    while True:
        raw = stream.readline()
        if not raw:
            raise RuntimeError("Safety gateway closed its SSE stream")
        line = raw.decode("utf-8", "replace").rstrip("\r\n")
        if not line:
            if data_lines:
                data = "\n".join(data_lines)
                data_lines.clear()
                try:
                    message = json.loads(data)
                except json.JSONDecodeError:
                    continue
                if message.get("id") == wanted_id:
                    if "error" in message:
                        raise RuntimeError("Safety gateway returned a JSON-RPC error")
                    return message.get("result", {})
            continue
        if line.startswith("data:"):
            data_lines.append(line[5:].lstrip())


def open_sse(url):
    request = urllib.request.Request(url, headers={"Accept": "text/event-stream"})
    stream = urllib.request.urlopen(request, timeout=TIMEOUT)
    event_name = None
    data = []
    while True:
        raw = stream.readline()
        if not raw:
            stream.close()
            raise RuntimeError("Safety gateway did not announce an SSE message endpoint")
        line = raw.decode("utf-8", "replace").rstrip("\r\n")
        if not line:
            if event_name == "endpoint" and data:
                endpoint = urllib.parse.urljoin(url, "\n".join(data))
                return stream, endpoint
            event_name, data = None, []
        elif line.startswith("event:"):
            event_name = line[6:].strip()
        elif line.startswith("data:"):
            data.append(line[5:].lstrip())


def result_object(result):
    structured = result.get("structuredContent")
    if isinstance(structured, dict):
        return structured
    for item in result.get("content", []):
        if isinstance(item, dict) and item.get("type") == "text":
            try:
                value = json.loads(item.get("text", ""))
                if isinstance(value, dict):
                    return value
            except (json.JSONDecodeError, TypeError):
                pass
    raise RuntimeError("Safety gateway returned no structured safety result")


def inspect(tool_name, arguments):
    url = os.environ.get("GUARDAGENT_MCP_SSE_URL", DEFAULT_URL)
    stream, message_url = open_sse(url)
    try:
        post_json(message_url, {
            "jsonrpc": "2.0", "id": 1, "method": "initialize",
            "params": {
                "protocolVersion": "2024-11-05",
                "capabilities": {},
                "clientInfo": {"name": "guardagent-codex-hook", "version": "0.1.0"},
            },
        })
        read_sse_message(stream, 1)
        post_json(message_url, {
            "jsonrpc": "2.0", "method": "notifications/initialized", "params": {},
        })
        post_json(message_url, {
            "jsonrpc": "2.0", "id": 2, "method": "tools/call",
            "params": {
                "name": "check_tool_safety",
                "arguments": {"tool_name": tool_name, "arguments": arguments},
            },
        })
        return result_object(read_sse_message(stream, 2))
    finally:
        stream.close()


def main():
    try:
        hook_input = json.load(sys.stdin)
        tool_name = hook_input.get("tool_name") or "unknown"
        arguments = hook_input.get("tool_input", {})
        if not isinstance(arguments, dict):
            arguments = {"value": arguments}
        if tool_name.endswith("__check_tool_safety"):
            return

        threshold = float(os.environ.get("GUARDAGENT_RISK_THRESHOLD", DEFAULT_THRESHOLD))
        if not 0.0 <= threshold <= 1.0:
            raise ValueError("GUARDAGENT_RISK_THRESHOLD must be between 0 and 1")
        result = inspect(tool_name, arguments)
        risk = float(result["risk_score"])
        verdict = str(result["verdict"]).upper()
        reasoning = str(result.get("reasoning") or result.get("threat_category") or "No reason supplied")
        reason = f"GuardAgent blocked {tool_name}: verdict={verdict}, risk_score={risk:.3f}, threshold={threshold:.3f}. {reasoning}"

        if verdict == "BLOCK" or risk >= threshold:
            block(reason)
        elif verdict == "REVIEW":
            emit({"hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "systemMessage": f"GuardAgent marked {tool_name} for review (risk_score={risk:.3f}): {reasoning}",
            }})
    except Exception as exc:
        block(f"GuardAgent could not verify this tool call; blocked by fail-closed policy. {type(exc).__name__}: {exc}")


if __name__ == "__main__":
    main()
