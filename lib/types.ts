export interface Signal {
  id: number;
  date: string;
  account: string;
  type: string;
  title: string;
  deadline: string | null;
  source: string | null;
  action: string | null;
  status: string;
  top_sku: string | null;
  fit_score: number | null;
  fit_note: string | null;
  full_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface CatalogItem {
  id: number;
  sku: string;
  family: string | null;
  name: string;
  channel: string | null;
  keywords: string | null;
  description: string;
  source: string | null;
  updated: string | null;
}

export interface FitScore {
  id: number;
  signal_id: number;
  sku: string;
  product_name: string;
  fit_score: number;
  rationale: string | null;
  scored_at: string;
}

export interface ScoredProduct {
  sku: string;
  product_name: string;
  family: string | null;
  fit_score: number;
  rationale: string;
  matched_terms: string[];
}
