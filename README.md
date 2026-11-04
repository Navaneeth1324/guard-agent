# 🛡️ GuardAgent: Pre-Execution Guardrails for LLM Tools via Model Context Protocol (MCP)

<p align="center">
  <img src="assets/banner.jpg" alt="GuardAgent Banner" width="100%" />
</p>

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Python 3.9+](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![Model Context Protocol](https://img.shields.io/badge/MCP-Standard%20v1.0-8E44AD?style=for-the-badge)](https://modelcontextprotocol.io)
[![Mistral-7B](https://img.shields.io/badge/Model-Mistral--7B%20QLoRA%204--bit-FF7000?style=for-the-badge)](https://huggingface.co/mistralai/Mistral-7B-v0.1)
[![ChatGPT Plugin](https://img.shields.io/badge/ChatGPT-Desktop%20Plugin-10A37F?style=for-the-badge&logo=openai)](https://chatgpt.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> **Capstone Project (Phase-2) & Research System**  
> **Institution**: Department of Computer Science & Engineering (AI & ML), PES University  
> **Project ID**: `PW_25_AK_02` | **Allocation Sl No**: 181  
> **Authors**: Navaneeth Tanuboddi, Krrish P Raju, AR Akshay Kumar, N Bhuvan Teja  
> **Guide**: Ms. Ambika Kavital (Assistant Professor, Dept. of CSE)  

---

## 📌 Abstract & Problem Statement

Modern autonomous LLM agents (ChatGPT, Claude, Codex, cursor agents) don't just chat—they execute terminal commands, run SQL queries, and manage local filesystems. 

Traditional AI guardrails (like Llama Guard or NeMo) inspect prompt text upfront. They cannot evaluate dynamic runtime tool parameters, leading to catastrophic vulnerabilities:
- **Indirect Prompt Injections & RAG Hijacking**: Malicious instructions embedded in documents hijack tool parameters mid-session.
- **Accidental Wipeouts**: Agents autonomously issue destructive commands like `DROP TABLE` or `rm -rf /` in milliseconds.
- **Data Exfiltration**: Agents leak private database records or API secrets to external endpoints.

**GuardAgent** is an in-line, zero-trust security gateway built on Anthropic's **Model Context Protocol (MCP)**. It intercepts every tool invocation **pre-execution** (before OS, shell, or database dispatch), assigns structured risk scores via a fine-tuned **4-bit Mistral-7B QLoRA model**, and deterministically routes calls into **`ALLOW`**, **`REVIEW`** (Human-in-the-Loop in chat), or **`BLOCK`** (fail-closed abort).

---

## 🏗️ End-to-End System Architecture

```
        ┌─────────────┐   (Direct connection BLOCKED)   ┌─────────────┐
        │     FE      │  ─────── // // // ───────>     │     AI      │ ──> Operations
        │  (Frontend) │                                 │  (Backend)  │     (DB, Shell, Files)
        └──────┬──────┘                                 └──────▲──────┘
               │                                               │
               │ (Secure Forward over Port 8765)               │ (Validated Request Only)
               ▼                                               │
        ┌─────────────┐                                        │
        │ GuardAgent  │ ───────────────────────────────────────┘
        │ MCP Gateway │ 
        └─────────────┘
```

```
[ 1. LLM Client ] ────────► [ 2. Plugin Hook ] ────────► [ 3. GuardAgent MCP Server ] ────────► [ 4. Policy Router ]
• ChatGPT Mac App           pre_tool_use.py               Port 8765 (SSE / JSON-RPC)            • ALLOW (Risk < 0.35)
• Custom GPT Actions        (PreToolUse Lifecycle)        ├─ Tier 1: AST Rule Filter (<0.1ms)   • REVIEW (0.35 <= R < 0.70)
• Claude Desktop            ├─ Fail-Closed Guarantee      └─ Tier 2: Mistral-7B QLoRA (~138ms)  • BLOCK (Risk >= 0.70)
• Autonomous Agent          └─ Defaults to DENY on error                                                  │
                                                                                                          ▼
                                                                                           [ 5. Telemetry Web Dashboard ]
                                                                                           Port 8091 (Live Audit Feed & Sandbox)
```

---

## 📁 Repository Structure

```
guard-agent/
├── mcp-server/                # Standalone Model Context Protocol (MCP) Safety Server
│   ├── server.py              # Real-time SSE & JSON-RPC gateway on port 8765
│   └── requirements.txt       # Server dependencies (pure standard library)
│
├── chatgpt-plugin/            # Native ChatGPT Desktop Plugin & Hook Connector
│   ├── plugin.json            # Manifest with Mistral-7B metadata & hook bindings
│   ├── mcp.json               # MCP connection specification
│   ├── hooks/
│   │   ├── hooks.json         # PreToolUse event registration
│   │   └── pre_tool_use.py    # Fail-closed interception hook
│   ├── skills/                # Safety skill definition
│   └── GuardAgent_Plugin_Pack.zip  # Ready-to-install ZIP package for ChatGPT
│
├── models/                    # Fine-tuned Mistral-7B QLoRA Safety Model
│   ├── inference.py           # 4-bit NF4 real-time inference script (<140ms)
│   ├── train_qlora.py         # Rank-16 Alpha-32 QLoRA training pipeline
│   └── requirements.txt       # PyTorch, PEFT, bitsandbytes, transformers
│
├── benchmarks/                # Empirical Datasets & Safety Evaluations
│   └── AgentHarm_Real_Benchmark_Samples.json  # Merged AgentHarm & ToolBench test sets
│
├── custom-gpt/                # Free Custom GPT Integration (Zero-Cost Deployment)
│   ├── openapi.yaml           # OpenAPI 3.1 schema for GPT actions
│   └── instructions.txt       # System instructions for @GuardAgent
│
├── monitor-dashboard/         # Live Telemetry Web Dashboard (Port 8091)
│   ├── index.html             # Real-time audit feed & sandbox file integrity UI
│   └── serve_dashboard.py     # Multi-threaded HTTP daemon
│
├── docs/                      # Technical Documentation & Capstone Deliverables
│   ├── GuardAgent_Technical_Specification.md   # Complete system architecture spec
│   ├── GuardAgent_Technical_Specification.pdf  # Formal printable PDF specification
│   ├── GuardAgent_Demo_Runbook.md              # 4-step live presentation runbook
│   ├── GuardAgent_Phase2_PPT_Guide_and_Viva_Prep.md  # Slide scripts & 20 Master Viva Q&As
│   ├── GuardAgent_Phase2_PPT_Guide_and_Viva_Prep.pdf  # Printable Viva prep manual
│   ├── Pre_Execution_Guardrails_Review2_Final.pptx   # Official 13-slide PES review deck
│   └── Gantt_Chart_Calendar_Format.png         # Phase-1 & Phase-2 project roadmap
│
└── src/                       # Interactive Next.js Research Sandbox & Benchmark UI
    ├── app/                   # App router pages (dashboard, audit, benchmarks)
    ├── components/            # UI components (sandbox, HITL queue, charts)
    └── lib/                   # Security taxonomy & scenario definitions
```

---

## ⚡ Quick Start

### 1. Launch the GuardAgent MCP Safety Server
Runs the Model Context Protocol server on port `8765` with Server-Sent Events (SSE):

```bash
python3 mcp-server/server.py
# Listening on http://localhost:8765/sse
```

### 2. Launch the Live Monitor Dashboard
Opens the telemetry monitoring dashboard on port `8091`:

```bash
python3 monitor-dashboard/serve_dashboard.py &
open http://127.0.0.1:8091/dashboard
```

### 3. Test Pre-Execution Interception (Terminal Hook)
Test the in-line fail-closed hook directly via stdin:

```bash
# Safe read action -> Silently allowed (exit code 0):
echo '{"tool_name": "list_files", "tool_input": {"path": "projects"}}' | python3 chatgpt-plugin/hooks/pre_tool_use.py

# Destructive action -> Intercepted and blocked:
echo '{"tool_name": "execute_sql", "tool_input": {"query": "DROP TABLE users;"}}' | python3 chatgpt-plugin/hooks/pre_tool_use.py
```
**Output:**
```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"GuardAgent blocked execute_sql: verdict=BLOCK, risk_score=0.890, threshold=0.700. Critical destructive pattern detected: 'drop table'. Execution aborted pre-runtime to protect system integrity."}}
```

### 4. Install in ChatGPT Mac Desktop App
1. Open **ChatGPT Desktop App** $\rightarrow$ **Settings** $\rightarrow$ **Developer** $\rightarrow$ Enable Developer Mode.
2. Click **Load Unpacked Plugin** and select the `chatgpt-plugin/` directory (or import `chatgpt-plugin/GuardAgent_Plugin_Pack.zip`).
3. Now all tool calls inside ChatGPT sessions are routed through GuardAgent before execution!

### 5. Launch the Next.js Research Sandbox (Optional)
```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## 📊 Empirical Model Benchmark

Tested against **1,000 real-world tool execution scenarios** from AgentHarm and ToolBench:

| Model / Defense | Architecture | Modality | Mean Latency | Destructive Recall | Macro-F1 | Fail-Closed |
|---|---|---|---|---|---|---|
| **GuardAgent (Our Solution)** | **4-bit Mistral-7B QLoRA** | **Structured Tools / AST** | **138.2 ms** | **98.4%** | **95.2%** | **Yes (100%)** |
| Llama Guard 3 | 8B Dialog Classifier | Text only | 280 ms | 64.2% | 68.4% | No |
| PromptGuard 2 | DeBERTa-86M | Text only | 24 ms | 51.0% | 62.1% | No |
| NeMo Guardrails | Colang + Rule Engine | Dialog flow | 410 ms | 88.5% | 85.3% | Partial |
| Cloud GPT-4o Gateway | Cloud API Supervisor | JSON Schema | 1,120 ms | 96.1% | 93.8% | No (Rate limits) |

---

## 🛡️ 4-Tier Security Risk Taxonomy

1. **Information Risk**: Unauthorized access, PII harvesting, or confidential file extraction (`secrets/api_keys.txt`).
2. **Authorization Risk**: Privilege escalation (`role="admin"`), token theft, or RBAC scope bypass.
3. **Execution Risk**: Irreversible system damage (`DROP TABLE`, `rm -rf /`, `delete_files`).
4. **Manipulation Risk**: Indirect RAG prompt injection, jailbreak overrides, or adversarial tool chaining.

---

## 📄 Documentation & Academic Deliverables

- **Technical Specification**: [`docs/GuardAgent_Technical_Specification.md`](docs/GuardAgent_Technical_Specification.md) (or [PDF](docs/GuardAgent_Technical_Specification.pdf))
- **Phase-2 Review Presentation Deck**: [`docs/Pre_Execution_Guardrails_Review2_Final.pptx`](docs/Pre_Execution_Guardrails_Review2_Final.pptx)
- **Presentation & Viva Preparation Guide**: [`docs/GuardAgent_Phase2_PPT_Guide_and_Viva_Prep.md`](docs/GuardAgent_Phase2_PPT_Guide_and_Viva_Prep.md) (or [PDF](docs/GuardAgent_Phase2_PPT_Guide_and_Viva_Prep.pdf))
- **Live Demo Runbook**: [`docs/GuardAgent_Demo_Runbook.md`](docs/GuardAgent_Demo_Runbook.md)

---

## 📄 License & Citation

Distributed under the MIT License. See `LICENSE` for details.

```bibtex
@article{guardagent2026phase2,
  title={Pre-Execution Guardrails for LLM Tools via Model Context Protocol (MCP)},
  author={Tanuboddi, Navaneeth and Raju, Krrish P and Kumar, AR Akshay Kumar and Teja, N Bhuvan},
  institution={PES University, Department of Computer Science & Engineering (AI & ML)},
  year={2026}
}
```
