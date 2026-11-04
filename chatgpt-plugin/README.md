# 🔌 GuardAgent ChatGPT Desktop Plugin & Hook

Enables real-time, pre-execution tool interception inside the **ChatGPT Mac Desktop App** and **Custom GPT Actions**.

## Structure
- `plugin.json`: Developer manifest specifying `PreToolUse` lifecycle hooks and Mistral-7B metadata.
- `hooks/pre_tool_use.py`: The fail-closed hook that intercepts tool calls, communicates with `localhost:8765/sse`, and blocks or flags commands.
- `hooks/hooks.json`: Event registration.
- `mcp.json`: Local MCP server configuration.

## Installation in ChatGPT Desktop
1. Open ChatGPT Mac App -> Settings -> Developer -> Enable Developer Mode.
2. Select **Load Unpacked Plugin** and select this directory (or upload `GuardAgent_Plugin_Pack.zip`).
3. Ensure the GuardAgent MCP server is running on `http://localhost:8765/sse`.
