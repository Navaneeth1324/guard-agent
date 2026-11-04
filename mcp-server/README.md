# 🛡️ GuardAgent MCP Safety Server

The core **Model Context Protocol (MCP)** server operating on port `8765`.

## Protocol Support
- **Transport**: Server-Sent Events (SSE) on `/sse` and JSON-RPC 2.0 POST messages on `/messages`.
- **Method**: `tools/call` for `check_tool_safety`.
- **Decision Engine**:
  - **Tier 1**: Deterministic AST & regex filter (<0.1 ms).
  - **Tier 2**: Mistral-7B QLoRA 4-bit neural evaluation (~138 ms).

## Running the Server
```bash
python3 server.py
# Server will listen on http://localhost:8765/sse
```
