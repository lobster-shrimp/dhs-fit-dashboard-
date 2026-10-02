import { scoreProductsAgainstSignal } from '../lib/scoring';

const iceRFIText = `ICE OFFICE OF THE CHIEF INFORMATION OFFICER

RFI-ICE_ADTS_Sep2026: Enterprise AI, Data, and Technology Strategy/Architecture: Operations & Maintenance, Enhancement, and Design

BACKGROUND:
ICE is implementing an enterprise-wide artificial intelligence, data management, and technology modernization strategy to support mission operations. The agency currently operates 40+ AI use cases and requires a unified architecture, governance framework, and operational platform to scale AI capabilities while maintaining security, compliance, and operational effectiveness.

SCOPE:
The contractor shall provide strategy development, architecture design, implementation support, and ongoing operations & maintenance for:

1. Enterprise AI Platform & LLMOps
   - Multi-model AI orchestration and deployment
   - Large Language Model Operations (LLMOps) including fine-tuning, evaluation, and monitoring
   - Secure AI inference infrastructure with FedRAMP High and IL5 support
   - Model governance, testing, and compliance frameworks

2. Data Platform & Integration
   - Enterprise data fabric connecting 50+ systems
   - Real-time and batch data pipelines with classification-aware handling
   - Data quality, master data management, and metadata governance
   - Legacy system integration and modernization support`;

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
  }
];

const scores = scoreProductsAgainstSignal(iceRFIText, testCatalog);

console.log('\n=== ICE RFI Scoring Results ===\n');
scores.forEach((score, idx) => {
  console.log(`${idx + 1}. ${score.sku}: ${score.fit_score}/100`);
  console.log(`   ${score.product_name}`);
  console.log(`   Rationale: ${score.rationale}`);
  console.log(`   Matched: ${score.matched_terms.join(', ')}`);
  console.log('');
});
