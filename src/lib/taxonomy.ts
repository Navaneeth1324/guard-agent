import { BenchmarkModelMetric, RiskTaxonomy, ToolSensitivity } from '@/types';

export const TAXONOMY_DEFINITIONS: Record<
  RiskTaxonomy,
  { label: string; description: string; examples: string[]; color: string }
> = {
  'Information Risk': {
    label: 'Information Risk',
    description: 'Unauthorized access, exfiltration, or disclosure of confidential data and records.',
    examples: ['Customer PII exfiltration', 'Internal database dump', 'Credential leakage via external email'],
    color: '#3b82f6', // Blue
  },
  'Authorization Risk': {
    label: 'Authorization Risk',
    description: 'Privilege escalation, bypassing RBAC, or executing tools beyond user permissions.',
    examples: ['Discovered admin API token misuse', 'Role escalation to superuser', 'Access violation'],
    color: '#a855f7', // Purple
  },
  'Execution Risk': {
    label: 'Execution Risk',
    description: 'Destructive system modifications, resource deletion, or irreversible shell operations.',
    examples: ['DROP TABLE / DELETE DATABASE', 'AWS Volume Deletion', 'rm -rf / system modification'],
    color: '#ef4444', // Red
  },
  'Manipulation Risk': {
    label: 'Manipulation Risk',
    description: 'Adversarial prompt injection, jailbreaking, or indirect hijacking via RAG payloads.',
    examples: ['Indirect RAG injection in PDF', 'System prompt overriding', 'Agent goal hijacking'],
    color: '#f59e0b', // Amber
  },
};

export const TOOL_SENSITIVITIES: Record<string, ToolSensitivity> = {
  'weather.get_forecast': 'Low',
  'calculator.eval': 'Low',
  'search.query_docs': 'Low',
  'email.send_attachment': 'Medium',
  'filesystem.read_file': 'Medium',
  'filesystem.delete_file': 'High',
  'database.execute_query': 'High',
  'database.delete_records': 'High',
  'aws.delete_volume': 'High',
  'shell.execute_command': 'High',
  'admin.update_permissions': 'High',
};

// Benchmark Comparison Models from Slide 14 & 15
export const BENCHMARK_MODELS: BenchmarkModelMetric[] = [
  {
    modelName: 'GuardAgent (Our Solution)',
    architecture: 'QLoRA Fine-Tuned Mistral-7B',
    dataset: 'AgentHarm + ToolSafe',
    openSource: 'Yes (PEFT)',
    explainable: 'Yes (Structured JSON)',
    avgLatencyMs: 32,
    safetyRecallPct: 96.4,
    costPer1kReq: '$0.0004 (Local GPU)',
    keyResult: 'Structured risk reasoning + ultra-low latency & cost',
  },
  {
    modelName: 'GuardAgent (Heavyweight)',
    architecture: 'GPT-4 / Llama-3-70B',
    dataset: 'EICU-AC, Mind2Web-SC',
    openSource: 'No / Partial',
    explainable: 'Yes',
    avgLatencyMs: 540,
    safetyRecallPct: 95.8,
    costPer1kReq: '$15.00',
    keyResult: 'High safety accuracy, but prohibitive latency for real-time runtime',
  },
  {
    modelName: 'LlamaFirewall',
    architecture: 'Multi-layer guardrail pipeline',
    dataset: 'OWASP Top-10 LLM risks',
    openSource: 'Yes',
    explainable: 'Partial',
    avgLatencyMs: 140,
    safetyRecallPct: 91.2,
    costPer1kReq: '$2.50',
    keyResult: 'Production-grade layered defense, moderate latency',
  },
  {
    modelName: 'GuardReasoner',
    architecture: 'Llama-3 (8B)',
    dataset: '127K reasoning samples',
    openSource: 'Yes',
    explainable: 'Yes',
    avgLatencyMs: 310,
    safetyRecallPct: 94.1,
    costPer1kReq: '$1.80',
    keyResult: 'Strong reasoning safeguards, higher execution overhead',
  },
  {
    modelName: 'Llama Guard 3-1B',
    architecture: '1.5B safety classifier',
    dataset: '13 MLCommons hazards',
    openSource: 'Yes',
    explainable: 'No (Binary only)',
    avgLatencyMs: 48,
    safetyRecallPct: 89.6,
    costPer1kReq: '$0.0002',
    keyResult: 'Fast classification, but lacks explainable safety reasoning for HITL',
  },
  {
    modelName: 'PromptGuard 2',
    architecture: 'DeBERTa (86M)',
    dataset: 'Prompt injection detection',
    openSource: 'Yes',
    explainable: 'No',
    avgLatencyMs: 24,
    safetyRecallPct: 82.5,
    costPer1kReq: '$0.0001',
    keyResult: 'Ultra-low latency baseline, but restricted to input text only',
  },
];
