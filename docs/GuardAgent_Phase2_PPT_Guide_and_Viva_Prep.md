# GuardAgent: Capstone Phase-2 Review Presentation & Viva Preparation Guide

**Project Title:** Pre-Execution Guardrails for LLM Tools via Model Context Protocol (MCP)  
**Project ID:** `PW_25_AK_02` | **Allocation Sl No:** 181  
**Course Code:** UE24CS360A / UE24CS320A — Capstone Project Review-2  
**Department:** B.Tech. in Computer Science & Engineering (AI & ML), PES University  
**Project Guide:** Ms. Ambika Kavital (Assistant Professor, Dept. of CSE)  
**Project Team:**
* **Navaneeth Tanuboddi** (`PES1UG24CS709`)
* **Krrish P Raju** (`PES1UG24CS708`)
* **AR Akshay Kumar** (`PES1UG24CS705`)
* **N Bhuvan Teja** (`PES1UG24CS286`)

---

## Table of Contents
1. **Core Concept in 7 Lines**
2. **The Handwritten Architecture Explained (Proxy Security Model)**
3. **Slide-by-Slide Speaking Script & Slide Questions (Slides 1 – 13)**
4. **Top 20 Master Viva Questions & Model Answers**
5. **Emergency Demo Runbook & Cheat Sheet**

---

## 1. Core Concept in 7 Lines (The 30-Second Elevator Pitch)

1. **The Shift:** Modern AI agents don't just chat; they execute terminal commands, run SQL queries, and manage filesystems.
2. **The Danger:** Hallucinations and prompt injections can cause autonomous agents to wipe databases (`DROP TABLE`) or delete files (`rm -rf`) in milliseconds.
3. **The Flaw in Existing Systems:** Traditional guardrails (like Llama Guard) only check conversational text upfront; they are completely blind to dynamic downstream tool parameters.
4. **Our Solution (GuardAgent):** We created an invisible security gateway that intercepts every tool call **pre-execution** (before the operating system or database ever runs it).
5. **How It Operates:** Using Anthropic's **Model Context Protocol (MCP)** and a 4-bit quantized **Mistral-7B QLoRA model**, it classifies tool risk in **under 140 ms**.
6. **The Decision Engine:** Commands are deterministically routed to **`ALLOW`** (instant execution), **`REVIEW`** (interactive confirmation prompt to the user), or **`BLOCK`** (immediate abort).
7. **The Result:** Total zero-trust safety against data loss and attacks, achieving **95.2% Macro-F1 accuracy** with zero modifications to client tool code.

---

## 2. The Handwritten Architecture Explained (Proxy Security Model)

```
        ┌─────────────┐   (Direct connection BLOCKED)   ┌─────────────┐
        │     FE      │  ─────── // // // ───────>     │     AI      │ ──> Operations
        │  (Frontend) │                                 │  (Backend)  │     (DB, Shell, Files)
        └──────┬──────┘                                 └──────▲──────┘
               │                                               │
               │ (Secure Forward)                              │ (Validated Request)
               ▼                                               │
        ┌─────────────┐                                        │
        │     GR      │ ───────────────────────────────────────┘
        │ (Guardrail) │ (Port 443 / MCP Gateway)
        └─────────────┘
```

### Explanation of the Diagram:
* **The Normal/Vulnerable Setup:** The frontend (`FE`) connects directly to the execution backend (`AI`). This allows malicious prompts or errors to trigger dangerous operations without inspection.
* **Our GuardAgent Architecture:** 
  1. The direct connection is **severed/disabled** (`// // //`).
  2. The frontend plugin redirects every proposed tool call to the **Guardrail (`GR`)** over a secure channel (port 443 / MCP Gateway).
  3. `GR` inspects the parameters and determines the risk.
  4. Only if `GR` returns an **`ALLOW`** verdict is the request cleanly forwarded to the **`AI`** backend to execute operations (`ops`).

---

## 3. Slide-by-Slide Speaking Script & Slide Questions

### Slide 1: Title Slide
* **Visual Content:** PES University logo, Course title, Project title, ID, Guide, Team members.
* **What to Speak (20 seconds):**
  > "Respected panel members and guide Ms. Ambika, good morning. We are team PW_25_AK_02, presenting our Phase-2 Review for 'Pre-Execution Guardrails for LLM Tools via Model Context Protocol'. Today, we will demonstrate how we intercept and prevent destructive tool actions in autonomous AI agents in real-time."
* **Viva Question:** *"What is the core problem statement of your project?"*
  * **Answer:** *"Autonomous AI agents execute real-world tools—like databases, filesystems, and shell commands. If an agent gets confused or injected, it can execute irreversible actions. We provide a pre-execution security layer that validates every tool action before execution occurs."*

---

### Slide 2: Outline
* **Visual Content:** 10 numbered deliverables from Introduction to References.
* **What to Speak (15 seconds):**
  > "Our presentation follows the official Phase-2 structure: starting with our responses to Review-1, covering our literature survey and system requirements, detailing our MCP architecture and live implementation on ChatGPT, and concluding with quantitative benchmarks and project timelines."

---

### Slide 3: Introduction
* **Visual Content:** 4 key pillars: The Shift, The Vulnerability, Fundamental Gap, Our Solution.
* **What to Speak (45 seconds):**
  > "LLMs have transitioned from passive text bots to autonomous agents executing SQL, shell commands, and APIs. However, this introduces serious execution vulnerabilities: under prompt injection or hallucinations, an agent can wipe database tables in milliseconds. Traditional guardrails like Llama Guard or NeMo only check natural language input upfront. They cannot inspect low-level SQL ASTs, shell arguments, or execution state. GuardAgent solves this by acting as an in-line, pre-execution MCP security gate that evaluates tool payloads in under 140 milliseconds."
* **Viva Question:** *"Why can't existing conversational guardrails like Meta's Llama Guard 3 solve this?"*
  * **Answer:** *"Llama Guard was trained on natural language dialogues (cybercrime, hate speech, self-harm). It is completely blind to structured tool payloads such as SQL syntax trees, regex flags, or bash commands like `rm -rf /tmp/data`. It evaluates the prompt upfront, whereas tool calls are generated dynamically mid-conversation."*

---

### Slide 4: Suggestions from Review – 1 & Action Taken
* **Visual Content:** 3 suggestions: GPT Implementation, Quantitative Benchmarks, Human-in-the-Loop.
* **What to Speak (40 seconds):**
  > "In Review-1, the panel gave us three critical recommendations, all of which we have addressed:
  > First, the panel asked us to implement our guardrail using a real GPT platform. We built a native ChatGPT Desktop Plugin (@GuardAgent) and Custom GPT Action using OpenAPI 3.1 and MCP.
  > Second, we established quantitative latency budgets: our fine-tuned 4-bit Mistral-7B model runs in 138.2 ms, well under the 200 ms interactive agent limit, achieving 95.2% Macro-F1 across 1,000 AgentHarm scenarios.
  > Third, we implemented a tripartite policy: ALLOW, REVIEW (for human confirmation in chat), and BLOCK."
* **Viva Question:** *"Why is human-in-the-loop essential instead of just blocking everything suspicious?"*
  * **Answer:** *"Binary blocking leads to severe false positives. An action like deleting an old backup file or running an UPDATE query might be completely legitimate if authorized by the user. By introducing the 'REVIEW' status, we pause execution, show a confirmation prompt in chat, and execute only when the user explicitly consents."*

---

### Slide 5: Scope and Objectives
* **Visual Content:** Goals, Modality & Tool Scope (Text + Voice/Audio agents), Concrete Phase-2 targets.
* **What to Speak (40 seconds):**
  > "Our scope covers pre-execution interception of SQL queries, terminal bash scripts, file operations, and audio/media APIs across ChatGPT Desktop, Claude, and autonomous agents. Importantly, it protects both text-prompted agents and voice/audio agents like ChatGPT Voice Mode. Our concrete Phase-2 objectives are: deploying an in-line MCP JSON-RPC gateway on port 8765, fine-tuning Mistral-7B QLoRA in 4-bit precision, deploying our live telemetry dashboard on port 8091, and maintaining over 95% safety accuracy."
* **Viva Question:** *"How does your guardrail handle Voice and Audio agents?"*
  * **Answer:** *"In modern voice agents like ChatGPT Voice Mode, spoken audio is parsed into the exact same structured tool calls as text. Because GuardAgent sits at the pre-execution MCP layer, any destructive tool call triggered by voice is caught before the computer runs it. We also include checks for sensitive audio tools like unauthorized microphone recording."*

---

### Slide 6: Extended Literature Survey
* **Visual Content:** Comparative matrix of ToolBench, AgentHarm, Conversational Guardrails, and MCP.
* **What to Speak (45 seconds):**
  > "We assessed four key state-of-the-art works. ToolBench (ICLR 2024) demonstrated tool usage across 16,000 APIs, but focused solely on planning success without security validation. AgentHarm (2024) established 440 malicious agent behaviors but evaluated them offline post-hoc, lacking real-time intervention. Conversational guardrails like Llama Guard operate only on conversational text. Anthropic's Model Context Protocol (Nov 2024) provided the open foundation, and our work is the first to leverage MCP lifecycle hooks for in-line, zero-trust security gating."
* **Viva Question:** *"What is the main research gap you identified in literature?"*
  * **Answer:** *"The gap is the absence of runtime, pre-execution interception for tool calling. SOTA focuses on either upfront prompt filtering or post-hoc log evaluation. None of them sit between the LLM and the execution environment to enforce low-latency, zero-trust validation on tool arguments."*

---

### Slide 7: Requirement Specification
* **Visual Content:** Functional Requirements (FR1–FR5) and Non-Functional Requirements (NFR1–NFR4).
* **What to Speak (35 seconds):**
  > "Our functional requirements include: FR1 pre-execution payload interception, FR2 tripartite classification, FR3 human-in-the-loop chat prompts, FR4 fail-closed default-to-deny guarantee, and FR5 real-time telemetry streaming. Our non-functional requirements mandate latency under 150 ms (achieved 138.2 ms), Macro-F1 above 95%, 100% MCP JSON-RPC compliance, and a lightweight 4.8 GB GPU VRAM footprint via 4-bit NF4 quantization."
* **Viva Question:** *"What is your Fail-Closed guarantee (FR4) and why is it important?"*
  * **Answer:** *"In security engineering, 'Fail-Closed' means if our MCP server crashes, disconnects, or times out, the tool call is automatically DENIED. It never defaults to ALLOW. This ensures that a network failure cannot be exploited to bypass our security gate."*

---

### Slide 8: Proposed Architecture / Block Diagram
* **Visual Content:** 4 horizontal blocks (Client -> Plugin Hook -> GuardAgent MCP Server -> Policy Routing) + Bottom Telemetry Dashboard.
* **What to Speak (45 seconds):**
  > "Here is our end-to-end architecture:
  > 1. The LLM Client proposes a tool call (like delete_files or execute_sql).
  > 2. Our client hook (pre_tool_use.py) intercepts the raw JSON payload before OS dispatch.
  > 3. It sends the payload via JSON-RPC over MCP to our GuardAgent Server on port 8765.
  > 4. The server runs a two-tier evaluation: Tier 1 is an ultra-fast deterministic rule filter under 0.1 ms; Tier 2 is our 4-bit Mistral-7B QLoRA neural classifier running in 138 ms.
  > 5. Decisions are routed to ALLOW, REVIEW, or BLOCK, while all telemetry streams live to our web dashboard on port 8091."
* **Viva Question:** *"Why do you have two tiers (Rule filter + Mistral-7B) instead of just using the model for everything?"*
  * **Answer:** *"Tier 1 handles obvious signatures (like `rm -rf /` or `DROP TABLE users`) in 0.1 milliseconds with zero compute cost. Tier 2 uses the Mistral-7B neural model for nuanced, context-dependent actions (like privilege escalation, subtle parameter tampering, or indirect injection) where simple regex patterns fail."*

---

### Slide 9: Further Implementation — Monitor Dashboard
* **Visual Content:** Figure 1: Screenshot of live dashboard (`http://127.0.0.1:8091`) showing 4 guarded calls, 75% auto-decided, 25% escalated, 1 blocked, 138.2 ms latency, and sandbox files.
* **What to Speak (40 seconds):**
  > "This is our live GuardAgent Monitor Dashboard running locally on port 8091. As seen in the live feed table, when an agent attempted `DROP TABLE users;`, it was immediately BLOCKED with a risk score of 89 in 138 ms. When an agent attempted to modify user credentials, it was escalated to REVIEW with risk 58. Notice the right sidebar: critical files like `finance/budget_2026.csv` and `salaries.csv` remain intact. Without GuardAgent, those files would have been irreversibly destroyed."
* **Viva Question:** *"Is this dashboard live or mock data?"*
  * **Answer:** *"The dashboard is connected directly to our running backend HTTP/SSE server. It reads telemetry directly from the tool interception events, calculating latency, risk scores, and sandbox filesystem status in real-time."*

---

### Slide 10: Further Implementation — ChatGPT Plugin
* **Visual Content:** Figure 2: Screenshot of ChatGPT Desktop App showing `@GuardAgent` intercepting `DROP TABLE users;` and SELECT queries.
* **What to Speak (40 seconds):**
  > "This directly fulfills the panel's Review-1 suggestion to implement on a real GPT. Here, GuardAgent is running inside the official ChatGPT Mac Desktop App as a verified plugin. When the agent attempts an SQL execution, the plugin hook intercepts the proposed tool parameters, displays an in-line assessment, and blocks the destructive query before the database connection executes. This works across GPT-4o and custom GPTs with zero paid API costs for students."
* **Viva Question:** *"How did you connect your MCP server to ChatGPT?"*
  * **Answer:** *"ChatGPT Desktop supports custom developer plugins and actions. We authored an MCP client adapter in `pre_tool_use.py` and packaged it in `plugin.json`. When ChatGPT selects a tool, it triggers our PreToolUse hook, which queries our MCP backend over HTTP/SSE."*

---

### Slide 11: Capstone Timeline (Gantt Chart)
* **Visual Content:** Gantt chart showing Phase 1 (Sem V, orange) and Phase 2 (Sem VI, blue) divided by a green dashed line.
* **What to Speak (30 seconds):**
  > "Our project timeline shows clear progression. Phase-1 in Semester-V focused on problem formulation, threat taxonomy, and baseline setups. In Phase-2, we successfully executed Mistral-7B QLoRA fine-tuning, MCP standardization, ChatGPT plugin integration, and our live telemetry dashboard. We are on schedule to complete our high-throughput inference optimization and final benchmarking."
* **Viva Question:** *"What is remaining for final submission?"*
  * **Answer:** *"Our remaining tasks are expanding high-throughput batching via vLLM, conducting a multi-user usability evaluation of the human review queue, and finalizing our IEEE research paper submission."*

---

### Slide 12: References
* **Visual Content:** 5 IEEE citations (Qin ToolBench, Andriushchenko AgentHarm, Meta Llama Guard, Anthropic MCP, Hu LoRA).
* **What to Speak (15 seconds):**
  > "Our work builds on foundational research in tool-calling benchmarks, adversarial agent evaluations, industry guardrails, and the latest Model Context Protocol specification published by Anthropic in November 2024."

---

### Slide 13: Thank You
* **Visual Content:** PES University logo, Guide acknowledgment, Team names.
* **What to Speak (15 seconds):**
  > "We thank our guide Ms. Ambika Kavital and the department for their guidance. We are now open for questions and are happy to demonstrate the live system."

---

## 4. Top 20 Master Viva Questions & Model Answers

### Category A: Architecture & MCP Standard
1. **Q: Why Model Context Protocol (MCP) instead of a REST API?**  
   *A:* MCP is the emerging industry standard supported by Anthropic, OpenAI, and developer IDEs. It provides native lifecycle events (like `PreToolUse`), bidirectional JSON-RPC streaming, and eliminates proprietary client SDK code.

2. **Q: Where does GuardAgent sit in the network stack?**  
   *A:* As an in-line reverse proxy between the LLM client application and the target tool/database. It terminates the tool call, validates it, and only forwards it if the verdict is `ALLOW`.

3. **Q: What is the exact tripartite threshold?**  
   *A:* 
   * **`ALLOW`:** Risk Score < 0.35 (Instant execution, e.g. read-only files).
   * **`REVIEW`:** 0.35 ≤ Risk Score < 0.70 (Pauses execution, prompts user in chat).
   * **`BLOCK`:** Risk Score ≥ 0.70 (Fails closed, aborts call, logs security event).

4. **Q: How does GuardAgent achieve sub-150ms latency?**  
   *A:* Through dual-path routing: Tier 1 regex/AST rules execute in 0.1 ms. Tier 2 uses a 4-bit quantized Mistral-7B running on optimized attention kernels (BitsAndBytes NF4), producing a classification in 138.2 ms.

5. **Q: What happens if the GuardAgent server crashes?**  
   *A:* The client plugin supervisor implements a 500 ms timeout. If the server does not respond, the system enters **Fail-Closed Mode** and returns `"permissionDecision": "deny"`.

---

### Category B: Machine Learning & Fine-Tuning
6. **Q: Why did you choose Mistral-7B over Llama-3-8B?**  
   *A:* Mistral-7B utilizes Sliding Window Attention (SWA), which drastically reduces memory and inference latency on short structured tool schemas.

7. **Q: What are your QLoRA hyper-parameters?**  
   *A:* Rank $r = 16$, Alpha $lpha = 32$, LoRA dropout 0.05, targeting all linear attention projection layers (`q_proj`, `k_proj`, `v_proj`, `o_proj`). This trains 41.9M parameters (0.58% of total weights).

8. **Q: What precision is used and what is the VRAM usage?**  
   *A:* 4-bit NormalFloat (NF4) with double quantization. It fits comfortably in 4.8 GB VRAM on a single commodity GPU (Tesla T4 or Apple Silicon M-series).

9. **Q: Why not use GPT-4o for safety checks via API?**  
   *A:* Cloud API calls introduce 800–1,500 ms of network latency and recurring API costs. Our local 4-bit model runs in 138 ms at zero marginal cost.

10. **Q: What dataset did you use for training and evaluation?**  
    *A:* A merged dataset of 3,657 real-world tool execution samples combining AgentHarm (harmful tool invocations) and ToolBench (benign complex API calls), plus 519 synthetic edge-case samples.

---

### Category C: Practical Integration & Demo
11. **Q: Is GuardAgent a plugin or an MCP server?**  
    *A:* It is both working in a client-server architecture. The **Plugin** is the lightweight client hook installed in ChatGPT; the **MCP Server** is the backend engine that hosts the safety model and telemetry dashboard.

12. **Q: How does this help students?**  
    *A:* Commercial security tools require enterprise API subscriptions. GuardAgent works with free ChatGPT desktop accounts and open-source models, giving students zero-cost protection against accidental script/database destruction.

13. **Q: Can an attacker bypass the guardrail by renaming tools?**  
    *A:* No. The model evaluates both the tool name and the semantic argument dictionary (e.g. SQL AST, shell command strings, file path parameters). Obfuscated commands are caught by the neural semantic layer.

14. **Q: How does the Human-in-the-Loop chat prompt work?**  
    *A:* The plugin issues a suspension token. In ChatGPT, the user sees: *"Assessment: Review with caution. Do you approve executing delete_files on budget_2026.csv?"* The tool only executes if the user confirms.

15. **Q: What metrics prove your system works?**  
    *A:* **95.2% Macro-F1 score**, **98.4% Recall on destructive tool calls**, and **138.2 ms mean latency** across 1,000 real-world benchmark evaluations.

---

## 5. Emergency Demo Runbook & Quick Commands

If you need to demonstrate or restart services on your Mac:

```bash
# 1. Check if background servers are active:
lsof -i :8765   # GuardAgent MCP Server
lsof -i :8091   # GuardAgent Web Dashboard

# 2. To restart MCP Server (if stopped):
python3 /tmp/guardagent_mcp_real.py &

# 3. To restart Dashboard Server (if stopped):
python3 /tmp/serve_dash.py &

# 4. Open Dashboard in Browser:
open http://127.0.0.1:8091/dashboard
```

---
*Prepared for PES University B.Tech CSE (AI & ML) Capstone Review-2 — Academic Year 2026.*
