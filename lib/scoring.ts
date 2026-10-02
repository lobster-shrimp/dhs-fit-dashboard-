import type { CatalogSKU, Signal, MatchDetails } from './types';

export function calculateFitScore(signal: Signal, sku: CatalogSKU): {
  score: number;
  details: MatchDetails;
} {
  const capabilityMatches: string[] = [];
  const keywordMatches: string[] = [];
  
  const signalText = `${signal.title} ${signal.summary} ${signal.requirements.join(' ')} ${signal.keywords.join(' ')}`.toLowerCase();
  const skuText = `${sku.name} ${sku.description} ${sku.capabilities.join(' ')} ${sku.tags.join(' ')}`.toLowerCase();
  
  for (const capability of sku.capabilities) {
    const capLower = capability.toLowerCase();
    if (signalText.includes(capLower) || signal.requirements.some(req => 
      req.toLowerCase().includes(capLower) || capLower.includes(req.toLowerCase())
    )) {
      capabilityMatches.push(capability);
    }
  }
  
  for (const keyword of signal.keywords) {
    const keyLower = keyword.toLowerCase();
    if (skuText.includes(keyLower) || sku.tags.some(tag => 
      tag.toLowerCase().includes(keyLower) || keyLower.includes(tag.toLowerCase())
    )) {
      keywordMatches.push(keyword);
    }
  }
  
  const requirementsCovered = signal.requirements.filter(req => {
    const reqLower = req.toLowerCase();
    return sku.capabilities.some(cap => 
      cap.toLowerCase().includes(reqLower) || reqLower.includes(cap.toLowerCase())
    ) || sku.description.toLowerCase().includes(reqLower);
  }).length;
  
  const requirementCoverage = signal.requirements.length > 0 
    ? requirementsCovered / signal.requirements.length 
    : 0;
  
  const capabilityScore = sku.capabilities.length > 0
    ? capabilityMatches.length / sku.capabilities.length
    : 0;
  
  const keywordScore = signal.keywords.length > 0
    ? keywordMatches.length / signal.keywords.length
    : 0;
  
  const priorityBoost = {
    critical: 0.15,
    high: 0.10,
    medium: 0.05,
    low: 0,
  }[signal.priority] || 0;
  
  const categoryBonus = signal.keywords.some(kw => 
    sku.category.toLowerCase().includes(kw.toLowerCase())
  ) ? 0.1 : 0;
  
  let rawScore = (
    requirementCoverage * 0.40 +
    capabilityScore * 0.30 +
    keywordScore * 0.20 +
    (capabilityMatches.length > 0 ? 0.10 : 0)
  );
  
  rawScore = Math.min(1.0, rawScore + priorityBoost + categoryBonus);
  
  const score = Math.max(0, Math.min(1.0, rawScore));
  
  let strength: 'weak' | 'moderate' | 'strong' | 'excellent';
  if (score >= 0.75) strength = 'excellent';
  else if (score >= 0.55) strength = 'strong';
  else if (score >= 0.35) strength = 'moderate';
  else strength = 'weak';
  
  const rationale = generateRationale(
    score,
    strength,
    capabilityMatches.length,
    keywordMatches.length,
    requirementCoverage,
    signal,
    sku
  );
  
  return {
    score: Math.round(score * 100) / 100,
    details: {
      capability_matches: capabilityMatches,
      keyword_matches: keywordMatches,
      requirement_coverage: Math.round(requirementCoverage * 100) / 100,
      strength,
      rationale,
    },
  };
}

function generateRationale(
  score: number,
  strength: string,
  capMatches: number,
  kwMatches: number,
  reqCoverage: number,
  signal: Signal,
  sku: CatalogSKU
): string {
  const parts: string[] = [];
  
  if (strength === 'excellent') {
    parts.push(`Strong alignment between ${sku.name} and ${signal.source} requirements.`);
  } else if (strength === 'strong') {
    parts.push(`Good fit for ${signal.source} needs.`);
  } else if (strength === 'moderate') {
    parts.push(`Partial match with ${signal.source} requirements.`);
  } else {
    parts.push(`Limited alignment with ${signal.source} specifications.`);
  }
  
  if (capMatches > 0) {
    parts.push(`${capMatches} capability match${capMatches > 1 ? 'es' : ''} found.`);
  }
  
  if (kwMatches > 0) {
    parts.push(`${kwMatches} keyword overlap${kwMatches > 1 ? 's' : ''}.`);
  }
  
  if (reqCoverage > 0) {
    const pct = Math.round(reqCoverage * 100);
    parts.push(`Covers ${pct}% of stated requirements.`);
  }
  
  if (signal.priority === 'critical' || signal.priority === 'high') {
    parts.push(`Priority: ${signal.priority}.`);
  }
  
  return parts.join(' ');
}

export function scoreAllSKUsForSignal(
  signal: Signal,
  catalog: CatalogSKU[]
): Array<{ sku: CatalogSKU; score: number; details: MatchDetails }> {
  const results = catalog.map(sku => {
    const { score, details } = calculateFitScore(signal, sku);
    return { sku, score, details };
  });
  
  return results.sort((a, b) => b.score - a.score);
}
