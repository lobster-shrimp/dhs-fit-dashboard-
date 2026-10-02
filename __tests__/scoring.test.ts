import { scoreProductsAgainstSignal } from '../lib/scoring';

const iceRFIText = `ICE OFFICE OF THE CHIEF INFORMATION OFFICER

RFI-ICE_ADTS_Sep2026: Enterprise AI, Data, and Technology Strategy/Architecture: Operations & Maintenance, Enhancement, and Design

This is a REQUEST FOR INFORMATION (RFI) ONLY. This is not a solicitation for proposals, proposal abstracts, or quotations. The purpose of this RFI is to conduct market research to identify potential qualified contractors to support the Immigration and Customs Enforcement (ICE) Office of the Chief Information Officer in developing, enhancing, and operating a comprehensive Enterprise AI, Data, and Technology Strategy and Architecture.

BACKGROUND:
ICE is implementing an enterprise-wide artificial intelligence, data management, and technology modernization strategy to support mission operations across Homeland Security Investigations (HSI), Enforcement and Removal Operations (ERO), and mission support functions. The agency currently operates 40+ AI use cases and requires a unified architecture, governance framework, and operational platform to scale AI capabilities while maintaining security, compliance, and operational effectiveness.

SCOPE:
The contractor shall provide strategy development, architecture design, implementation support, and ongoing operations & maintenance for:

1. Enterprise AI Platform & LLMOps
   - Multi-model AI orchestration and deployment (government and commercial models)
   - Large Language Model Operations (LLMOps) including fine-tuning, evaluation, and monitoring
   - Secure AI inference infrastructure with FedRAMP High and IL5 support
   - Model governance, testing, and compliance frameworks

2. Data Platform & Integration
   - Enterprise data fabric connecting 50+ systems across HSI, ERO, and support functions
   - Real-time and batch data pipelines with classification-aware handling
   - Data quality, master data management, and metadata governance
   - Legacy system integration and modernization support

3. Technology Architecture & Modernization
   - Cloud-native architecture design (AWS GovCloud, Azure Government)
   - Zero-trust security architecture and implementation
   - DevSecOps pipeline automation and continuous ATO
   - Application modernization and containerization strategy

4. Governance, Compliance & Training
   - AI ethics, bias detection, and responsible AI framework
   - Privacy-preserving AI and differential privacy implementation
   - Compliance automation (FISMA, NIST 800-53, ICE policies)
   - Training and change management for 20,000+ ICE personnel`;

const testCatalog = [
  {
    sku: 'GOV-FDE',
    name: 'Federal Data & Enterprise Platform',
    family: 'Platform Services',
    keywords: 'enterprise AI, data platform, MLOps, LLMOps, model management, orchestration',
    description: 'Comprehensive federal data and enterprise AI platform providing LLMOps, model management, data orchestration, and multi-tenant enterprise AI capabilities. Designed for agency-wide AI strategy implementation with centralized governance.'
  },
  {
    sku: 'GOV-SECURE',
    name: 'Secure Government Cloud',
    family: 'Security & Compliance',
    keywords: 'secure cloud, IL5, classified, airgap, compliance, NIST',
    description: 'Hardened AI infrastructure for classified and sensitive government workloads. Supports IL5, airgapped deployments, continuous compliance monitoring, and government-specific security controls (NIST 800-53, CMMC).'
  },
  {
    sku: 'GOV-GROK4',
    name: 'Grok 4 for Government',
    family: 'AI Models',
    keywords: 'LLM, conversational AI, chat, government AI, secure AI',
    description: 'Advanced large language model optimized for government use cases with FedRAMP High authorization. Provides real-time information synthesis, multi-domain reasoning, and secure conversational AI capabilities.'
  },
  {
    sku: 'GOV-SEARCH',
    name: 'Government Search & Discovery',
    family: 'Data & Search',
    keywords: 'search, discovery, information retrieval, semantic search, RAG',
    description: 'Enterprise search and discovery platform with semantic understanding for government data repositories. Supports retrieval-augmented generation (RAG), multi-source federation, and classification-aware indexing.'
  },
  {
    sku: 'GOV-CODE',
    name: 'Government Code Assistant',
    family: 'Developer Tools',
    keywords: 'code generation, DevSecOps, IDE, developer productivity, secure coding',
    description: 'AI-powered code assistant for government developers with secure code generation, vulnerability detection, compliance checking, and government coding standards enforcement.'
  }
];

describe('TF-IDF Semantic Scoring', () => {
  test('scores all products against ICE RFI', () => {
    const scores = scoreProductsAgainstSignal(iceRFIText, testCatalog);
    
    expect(scores).toHaveLength(testCatalog.length);
    
    scores.forEach(score => {
      expect(score.fit_score).toBeGreaterThanOrEqual(0);
      expect(score.fit_score).toBeLessThanOrEqual(100);
      expect(score).toHaveProperty('sku');
      expect(score).toHaveProperty('product_name');
      expect(score).toHaveProperty('rationale');
    });
  });

  test('GOV-FDE ranks highest for ICE Enterprise AI RFI', () => {
    const scores = scoreProductsAgainstSignal(iceRFIText, testCatalog);
    
    const topScore = scores[0];
    expect(topScore.sku).toBe('GOV-FDE');
    
    expect(topScore.fit_score).toBeGreaterThanOrEqual(80);
    
    expect(topScore.rationale).toContain('enterprise');
  });

  test('GOV-SECURE ranks in top 3 due to security/compliance emphasis', () => {
    const scores = scoreProductsAgainstSignal(iceRFIText, testCatalog);
    
    const secureIndex = scores.findIndex(s => s.sku === 'GOV-SECURE');
    expect(secureIndex).toBeLessThan(3);
    
    const secureScore = scores.find(s => s.sku === 'GOV-SECURE');
    expect(secureScore?.fit_score).toBeGreaterThanOrEqual(70);
  });

  test('scores are ordered from highest to lowest', () => {
    const scores = scoreProductsAgainstSignal(iceRFIText, testCatalog);
    
    for (let i = 0; i < scores.length - 1; i++) {
      expect(scores[i].fit_score).toBeGreaterThanOrEqual(scores[i + 1].fit_score);
    }
  });

  test('rationale generation includes matched terms', () => {
    const scores = scoreProductsAgainstSignal(iceRFIText, testCatalog);
    
    scores.forEach(score => {
      expect(score.rationale).toBeTruthy();
      expect(score.rationale.length).toBeGreaterThan(10);
    });
  });

  test('scoring is deterministic (same input = same output)', () => {
    const scores1 = scoreProductsAgainstSignal(iceRFIText, testCatalog);
    const scores2 = scoreProductsAgainstSignal(iceRFIText, testCatalog);
    
    expect(scores1).toEqual(scores2);
  });

  test('matched terms are extracted correctly', () => {
    const scores = scoreProductsAgainstSignal(iceRFIText, testCatalog);
    
    const fdeScore = scores.find(s => s.sku === 'GOV-FDE');
    expect(fdeScore?.matched_terms).toBeDefined();
    expect(fdeScore?.matched_terms.length).toBeGreaterThan(0);
  });

  test('platform services get enterprise scope alignment bonus', () => {
    const scores = scoreProductsAgainstSignal(iceRFIText, testCatalog);
    
    const fdeScore = scores.find(s => s.sku === 'GOV-FDE');
    expect(fdeScore?.rationale).toMatch(/enterprise|platform/i);
  });

  test('security products get security/compliance match bonus', () => {
    const scores = scoreProductsAgainstSignal(iceRFIText, testCatalog);
    
    const secureScore = scores.find(s => s.sku === 'GOV-SECURE');
    expect(secureScore?.rationale).toMatch(/security|compliance/i);
  });

  test('handles empty or short text gracefully', () => {
    const scores = scoreProductsAgainstSignal('AI platform', testCatalog);
    
    expect(scores).toHaveLength(testCatalog.length);
    scores.forEach(score => {
      expect(score.fit_score).toBeGreaterThanOrEqual(0);
      expect(score.fit_score).toBeLessThanOrEqual(100);
    });
  });
});

describe('Scoring Rationale Quality', () => {
  test('high scores (>75) indicate strong alignment', () => {
    const scores = scoreProductsAgainstSignal(iceRFIText, testCatalog);
    
    const highScores = scores.filter(s => s.fit_score >= 75);
    highScores.forEach(score => {
      expect(score.rationale).toMatch(/strong|moderate/i);
    });
  });

  test('low scores (<40) indicate limited alignment', () => {
    const scores = scoreProductsAgainstSignal('simple calculator app', testCatalog);
    
    const lowScores = scores.filter(s => s.fit_score < 40);
    lowScores.forEach(score => {
      expect(score.rationale).toMatch(/limited/i);
    });
  });
});
