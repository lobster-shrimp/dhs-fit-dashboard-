export interface CatalogSKU {
  id: string;
  name: string;
  category: string;
  capabilities: string[];
  tags: string[];
  description: string;
  created_at: string;
}

export interface Signal {
  id: string;
  source: string;
  title: string;
  summary: string;
  requirements: string[];
  keywords: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline?: string;
  uploaded_at: string;
  processed: boolean;
}

export interface FitScore {
  signal_id: string;
  sku_id: string;
  score: number;
  match_details: MatchDetails;
  calculated_at: string;
}

export interface MatchDetails {
  capability_matches: string[];
  keyword_matches: string[];
  requirement_coverage: number;
  strength: 'weak' | 'moderate' | 'strong' | 'excellent';
  rationale: string;
}

export interface StreamEvent {
  type: 'signal' | 'score' | 'heartbeat';
  timestamp: string;
  data: Signal | FitScore | { status: string };
}

export interface ScoringResult {
  signal: Signal;
  matches: Array<{
    sku: CatalogSKU;
    score: number;
    details: MatchDetails;
  }>;
}
