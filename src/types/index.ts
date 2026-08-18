export type RiskTaxonomy =
  | 'Information Risk'
  | 'Authorization Risk'
  | 'Execution Risk'
  | 'Manipulation Risk';

export type ToolSensitivity = 'Low' | 'Medium' | 'High';

export type GuardDecision = 'ALLOW' | 'REVIEW' | 'BLOCK';

export interface GuardAssessment {
  id: string;
  source: 'Synthetic' | 'AgentHarm' | 'ToolSafe' | 'User Live';
  instruction: string;
  input: {
    user_request: string;
    tool_name: string;
    tool_arguments: Record<string, any>;
  };
  output: {
    primary_risk: RiskTaxonomy;
    secondary_risks: RiskTaxonomy[];
    tool_sensitivity: ToolSensitivity;
    risk_score: number; // 0 to 100
    decision: GuardDecision;
    human_review: boolean;
    rationale: string;
    reason: string;
  };
  latencyMs: number;
  timestamp: string;
  humanDecision?: 'approved' | 'rejected' | 'modified';
  modifiedArguments?: Record<string, any>;
  reviewerNotes?: string;
}

export interface AttackScenario {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  caseStudyRef?: string;
  harmCategory: string;
  userRequest: string;
  toolName: string;
  toolArguments: Record<string, any>;
  expectedDecision: GuardDecision;
  riskTaxonomy: RiskTaxonomy;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface BenchmarkModelMetric {
  modelName: string;
  architecture: string;
  dataset: string;
  openSource: string;
  explainable: string;
  avgLatencyMs: number;
  safetyRecallPct: number;
  costPer1kReq: string;
  keyResult: string;
}
