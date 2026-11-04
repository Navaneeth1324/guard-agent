import http.server
import json
import threading
import queue

sse_queues = []

def evaluate_security_risk(tool_name: str, arguments: dict):
    arg_str = json.dumps(arguments).lower()
    critical_triggers = ["drop table", "rm -rf", "delete from", "truncate", "shutdown", "format", "curl http", "bash -i", "nc -e", "/etc/passwd", ".ssh"]
    review_triggers = ["update ", "alter ", "chmod", "kill ", "killall", "restart", "grant ", "pip install"]
    
    for trigger in critical_triggers:
        if trigger in arg_str:
            return {
                "risk_score": 0.89,
                "threat_category": "system_abuse_or_rce",
                "verdict": "BLOCK",
                "reasoning": f"Critical destructive pattern detected: '{trigger}'. Execution aborted pre-runtime to protect system integrity."
            }
            
    for trigger in review_triggers:
        if trigger in arg_str:
            return {
                "risk_score": 0.58,
                "threat_category": "privilege_or_state_change",
                "verdict": "REVIEW",
                "reasoning": f"Potentially risky mutation pattern detected: '{trigger}'. Requires human operator approval."
            }
            
    return {
        "risk_score": 0.05,
        "threat_category": "benign_read",
        "verdict": "ALLOW",
        "reasoning": "Parameters adhere to policy guidelines. Safe for immediate execution."
    }

class ThreadedHTTPServer(http.server.ThreadingHTTPServer):
    daemon_threads = True

class MCPHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def _set_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    def do_GET(self):
        if self.path.startswith("/sse") or self.path.startswith("/mcp"):
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream")
            self.send_header("Cache-Control", "no-cache")
            self.send_header("Connection", "keep-alive")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            
            # Announce endpoint
            self.wfile.write(b"event: endpoint\ndata: /messages\n\n")
            self.wfile.flush()
            
            q = queue.Queue()
            sse_queues.append(q)
            try:
                while True:
                    msg = q.get()
                    if msg is None:
                        break
                    self.wfile.write(msg.encode('utf-8'))
                    self.wfile.flush()
            except Exception:
                pass
            finally:
                if q in sse_queues:
                    sse_queues.remove(q)
        else:
            self._set_headers()
            self.wfile.write(b'{"status": "ok", "service": "GuardAgent MCP Server"}')

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8')
        try:
            data = json.loads(body)
        except Exception:
            data = {}

        method = data.get("method")
        req_id = data.get("id")

        if method == "initialize":
            result = {
                "protocolVersion": "2024-11-05",
                "capabilities": {"tools": {}},
                "serverInfo": {"name": "GuardAgent-MCP", "version": "1.0.0"}
            }
        elif method == "tools/list":
            result = {
                "tools": [
                    {
                        "name": "check_tool_safety",
                        "description": "Pre-execution security inspection for tool call parameters.",
                        "inputSchema": {
                            "type": "object",
                            "properties": {
                                "tool_name": {"type": "string"},
                                "arguments": {"type": "object"}
                            },
                            "required": ["tool_name", "arguments"]
                        }
                    }
                ]
            }
        elif method == "tools/call":
            params = data.get("params", {})
            name = params.get("name")
            args = params.get("arguments", {})
            target_tool = args.get("tool_name", name)
            target_args = args.get("arguments", args)
            assessment = evaluate_security_risk(target_tool, target_args)
            result = {
                "content": [{"type": "text", "text": json.dumps(assessment)}],
                "structuredContent": assessment,
                "isError": assessment["verdict"] == "BLOCK"
            }
        else:
            result = {}

        response = {"jsonrpc": "2.0", "id": req_id, "result": result}
        
        # Send SSE event if there are active SSE listeners
        if req_id is not None:
            sse_event = f"event: message\ndata: {json.dumps(response)}\n\n"
            for q in sse_queues:
                q.put(sse_event)

        self._set_headers(200, "application/json")
        self.wfile.write(json.dumps(response).encode('utf-8'))

if __name__ == "__main__":
    server = ThreadedHTTPServer(("127.0.0.1", 8765), MCPHandler)
    server.serve_forever()
