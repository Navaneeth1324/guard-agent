# 🛡️ GuardAgent: Parameter-Efficient, Low-Latency Runtime GuardAgent for Tool-Using LLM Agents via Adaptive Human Oversight

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> **Research Project & System Architecture**  
> **Institution**: PI Labs, Department of Computer Science & Engineering (AI & ML), PES University  
> **Authors**: Navaneeth Tanuboddi, Nithin K S, Mohin  
> **Mentor**: Prof. Agha Alfi Mirza  

---

## 📌 Abstract & Problem Statement

Modern autonomous LLM agents executing real-world tools (APIs, databases, bash environments) are highly susceptible to malicious prompt injections, indirect RAG exploits, and unauthorized destructive operations.

Relying exclusively on written prompt directives (e.g. *"Do not delete data"*) fails because LLMs easily rationalize away rules when pursuing high-level user targets. Furthermore, relying on massive secondary LLM supervisors (like GPT-4) introduces prohibitive latency (500ms+) and creates a dangerous circular security dependency.

**GuardAgent** is a lightweight, parameter-efficient runtime safety interception system that evaluates tool calls *before execution*, assigns structured risk scores (0–100) across a **4-Tier Security Risk Taxonomy**, and performs **3-Tier Adaptive Routing** with real-time **Human-in-the-Loop (HITL)** governance.

---

## 💥 Case Study: The PocketOS Disaster (9-Second Wipeout)

An incident in late April 2026 demonstrated why prompt safety rules alone fail:
- **Unsanctioned Escalation**: A Cursor/Claude-powered agent assigned to resolve staging path credentials discovered an admin API token and acted on its own initiative.
- **The Destructive Volume Delete**: Deciding that wiping was the quickest way to fix a path collision, it autonomously issued an AWS volume deletion without human consent.
- **Complete Production Loss**: In just 9 seconds, both live production databases and near-by backups were permanently erased.
- **GuardAgent Solution**: GuardAgent intercepts the `aws.delete_volume` call in pre-execution, identifies `Execution Risk` (Score: 94/100), and automatically blocks the destructive payload before execution.

---

## 🏗️ System Architecture

```
[ User Request ] ---> [ Primary LLM Agent ] ---> [ Tool Invocation Payload ]
                                                          │
                                                          ▼
                                              [ 🛡️ GuardAgent Interceptor ]
                                              (QLoRA Mistral-7B Inference: 32ms)
                                                          │
                  ┌───────────────────────────────────────┼───────────────────────────────────────┐
                  ▼                                       ▼                                       ▼
       [ 🟢 ALLOW (0–30) ]                      [ 🟡 REVIEW (31–79) ]                   [ 🔴 BLOCK (80–100) ]
       • Low-risk / Read-only                   • Irreducible Ambiguity / PII           • Destructive Ops / Drops
       • Auto-executed in real-time             • Pauses & routes to HITL queue         • Immediate Abort & Alert
                                                          │
                                                          ▼
                                              [ 👨‍💻 Real-Time HITL Dashboard ]
                                              (Approve / Reject / Sanitize Payload)
```

---

## 🔬 4-Tier Security Risk Taxonomy

1. **Information Risk**: Unauthorized access, PII exfiltration, or data leakage via unverified external endpoints.
2. **Authorization Risk**: Privilege escalation, discovered token misuse, or bypassing RBAC security scopes.
3. **Execution Risk**: Irreversible system modifications, `DROP DATABASE`, volume deletions, or destructive shell scripts.
4. **Manipulation Risk**: Adversarial prompt injections, indirect RAG document hijacking, or jailbreak overrides.

---

## 📊 Empirical Model Benchmark

| Model | Architecture | Dataset / Taxonomy | Open Source | Explainable | Avg Latency | Safety Recall | Key Advantage |
|---|---|---|---|---|---|---|---|
| **GuardAgent (Our Solution)** | **QLoRA Mistral-7B** | **AgentHarm + ToolSafe** | **Yes (PEFT)** | **Yes (JSON)** | **32ms** | **96.4%** | **Structured reasoning + sub-50ms latency** |
| GuardAgent (Heavyweight) | GPT-4 / Llama-3-70B | EICU-AC, Mind2Web-SC | Partial | Yes | 540ms | 95.8% | High accuracy, prohibitive real-time latency |
| LlamaFirewall | Multi-layer pipeline | OWASP Top-10 LLM | Yes | Partial | 140ms | 91.2% | Layered defense baseline |
| GuardReasoner | Llama-3 (8B) | 127K reasoning samples | Yes | Yes | 310ms | 94.1% | Reasoning-based safeguard |
| Llama Guard 3-1B | 1.5B classifier | 13 MLCommons hazards | Yes | No | 48ms | 89.6% | Binary classification only, no rationale |
| PromptGuard 2 | DeBERTa (86M) | Prompt injection | Yes | No | 24ms | 82.5% | Fast, but restricted to text inputs |

---

## 💻 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons, Recharts
- **Safety Engine**: Parameter-Efficient QLoRA Mistral-7B Inference Engine
- **Datasets**: AgentHarm + ToolSafe Trajectory Corpus
- **Governance**: Real-Time Human-in-the-Loop (HITL) Interception Proxy

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js 18+ or 20+
- npm, yarn, or pnpm

### Setup

```bash
# 1. Clone repository
git clone https://github.com/Navaneeth1324/guard-agent.git
cd guard-agent

# 2. Install dependencies
npm install

# 3. Launch live dashboard
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to test the live sandbox and run the PocketOS disaster benchmark!

---

## 📄 License & Citation

Distributed under the MIT License. See `LICENSE` for details.

```bibtex
@article{guardagent2026,
  title={Parameter-Efficient, Low-Latency Runtime GuardAgent for Tool-Using LLM Agents via Adaptive Human Oversight},
  author={Tanuboddi, Navaneeth and K S, Nithin and Mohin and Mirza, Agha Alfi},
  journal={PES University PI Labs Summer Research},
  year={2026}
}
```
