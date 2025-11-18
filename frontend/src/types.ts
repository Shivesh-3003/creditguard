/**
 * TypeScript types matching backend Pydantic schemas.
 * Ensures type safety across API boundary.
 */

export interface Transaction {
  user_id: string;
  amount: number;
  currency: string;
  country: string;
  merchant: string;
  timestamp?: string;
}

export interface RuleTrigger {
  rule_name: string;
  reason: string;
  score_contribution: number;
}

export interface FraudResult {
  user_id: string;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  total_score: number;
  triggered_rules: RuleTrigger[];
  timestamp: string;
}
