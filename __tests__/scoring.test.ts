import { calculateFitScore } from '../lib/scoring';
import type { CatalogSKU, Signal } from '../lib/types';

describe('Scoring Algorithm', () => {
  const testSKU: CatalogSKU = {
    id: 'test-001',
    name: 'Test Satellite System',
    category: 'Connectivity',
    capabilities: [
      'Secure communications',
      'Global coverage',
      'Low latency',
    ],
    tags: ['satellite', 'secure', 'internet'],
    description: 'High-speed secure satellite internet for government use',
    created_at: new Date().toISOString(),
  };

  const testSignal: Signal = {
    id: 'sig-test-001',
    source: 'Test Agency RFI',
    title: 'Secure Communications Requirement',
    summary: 'Need secure satellite communications for remote operations',
    requirements: [
      'Secure encrypted communications',
      'Global coverage',
      'Low latency',
    ],
    keywords: ['satellite', 'secure', 'remote', 'encrypted'],
    priority: 'high',
    uploaded_at: new Date().toISOString(),
    processed: false,
  };

  it('should calculate a high score for exact capability matches', () => {
    const { score, details } = calculateFitScore(testSignal, testSKU);
    
    expect(score).toBeGreaterThan(0.6);
    expect(details.capability_matches.length).toBeGreaterThan(0);
    expect(details.strength).toMatch(/strong|excellent/);
  });

  it('should identify keyword matches', () => {
    const { score, details } = calculateFitScore(testSignal, testSKU);
    
    expect(details.keyword_matches.length).toBeGreaterThan(0);
    expect(details.keyword_matches).toContain('satellite');
  });

  it('should calculate requirement coverage', () => {
    const { score, details } = calculateFitScore(testSignal, testSKU);
    
    expect(details.requirement_coverage).toBeGreaterThan(0);
    expect(details.requirement_coverage).toBeLessThanOrEqual(1);
  });

  it('should return a score between 0 and 1', () => {
    const { score } = calculateFitScore(testSignal, testSKU);
    
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });

  it('should provide a rationale', () => {
    const { score, details } = calculateFitScore(testSignal, testSKU);
    
    expect(details.rationale).toBeDefined();
    expect(typeof details.rationale).toBe('string');
    expect(details.rationale.length).toBeGreaterThan(0);
  });

  it('should handle SKUs with no matches', () => {
    const unmatchedSKU: CatalogSKU = {
      ...testSKU,
      id: 'test-002',
      name: 'Unrelated Product',
      capabilities: ['Completely different', 'No overlap'],
      tags: ['different', 'unrelated'],
    };

    const { score, details } = calculateFitScore(testSignal, unmatchedSKU);
    
    expect(score).toBeLessThan(0.5);
    expect(details.strength).toMatch(/weak|moderate/);
  });

  it('should boost critical priority signals', () => {
    const criticalSignal: Signal = {
      ...testSignal,
      priority: 'critical',
    };

    const normalResult = calculateFitScore(testSignal, testSKU);
    const criticalResult = calculateFitScore(criticalSignal, testSKU);
    
    expect(criticalResult.score).toBeGreaterThanOrEqual(normalResult.score);
  });
});
