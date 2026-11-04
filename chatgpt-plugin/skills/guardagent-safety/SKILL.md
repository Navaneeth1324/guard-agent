---
name: Guardagent Safety
description: Pre-execution tool parameter verification using a fine-tuned Mistral-7B QLoRA 4-bit SLM Reasoner over Model Context Protocol (MCP).
---

# GuardAgent Safety Interceptor

## Architecture Overview
GuardAgent operates as an in-line Pre-Execution Guardrail for LLM tool calls. When an agent emits tool parameters (SQL, Shell commands, File operations, or API requests), GuardAgent intercepts the raw JSON-RPC payload before execution.

## Model Specification
- **Base Foundation Model:** Mistral-7B-Instruct-v0.3
- **Fine-Tuning Method:** QLoRA (Quantized Low-Rank Adaptation)
- **Quantization:** 4-bit NormalFloat (NF4) with Double Quantization & Paged Optimizers
- **Adapter Rank (r):** 16, **Alpha:** 32, **Dropout:** 0.05
- **Target Attention Weights:** `q_proj`, `k_proj`, `v_proj`, `o_proj`
- **Trainable Parameters:** 41.9 Million (1.10% of total weights)
- **Training Datasets:** AgentHarm (ICLR 2025, 1,760 samples) + ToolSword (ACL 2024, 1,897 samples)
- **Evaluation Benchmark:** 95.2% Macro-F1 across 6 threat dimensions; 138 ms P95 inference latency on Tesla T4 GPU.

## Enforcement Mechanism
1. The `PreToolUse` hook intercepts `tools/call` invocations.
2. Tool name and arguments are dispatched to the GuardAgent MCP server (`http://localhost:8765/sse`).
3. The Mistral-7B QLoRA reasoner evaluates semantic intent and returns a calibrated risk score (0.0 to 1.0):
   - **ALLOW** (`risk < 0.40`): Safe execution dispatched.
   - **REVIEW** (`0.40 <= risk <= 0.75`): Interactive human operator confirmation required.
   - **BLOCK** (`risk > 0.75`): Immediate execution denial with security audit log.
