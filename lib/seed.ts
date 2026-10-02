import db from './db';

const catalogData = [
  {
    sku: 'GOV-GROK4',
    family: 'AI Models',
    name: 'Grok 4 for Government',
    channel: 'FedRAMP High',
    keywords: 'LLM, conversational AI, chat, government AI, secure AI',
    description: 'Advanced large language model optimized for government use cases with FedRAMP High authorization. Provides real-time information synthesis, multi-domain reasoning, and secure conversational AI capabilities for federal missions.',
    source: 'https://x.ai/grok/government',
    updated: '2026-09-15'
  },
  {
    sku: 'GOV-GROK4F',
    family: 'AI Models',
    name: 'Grok 4 Fast for Government',
    channel: 'FedRAMP High',
    keywords: 'LLM, fast inference, low latency, real-time AI',
    description: 'High-performance version of Grok 4 optimized for low-latency government operations. Ideal for real-time decision support, tactical operations, and time-sensitive analysis requiring sub-second response times.',
    source: 'https://x.ai/grok/government',
    updated: '2026-09-15'
  },
  {
    sku: 'GOV-SEARCH',
    family: 'Data & Search',
    name: 'Government Search & Discovery',
    channel: 'FedRAMP High',
    keywords: 'search, discovery, information retrieval, semantic search, RAG',
    description: 'Enterprise search and discovery platform with semantic understanding for government data repositories. Supports retrieval-augmented generation (RAG), multi-source federation, and classification-aware indexing.',
    source: 'https://x.ai/solutions',
    updated: '2026-09-01'
  },
  {
    sku: 'GOV-DOCS',
    family: 'Data & Search',
    name: 'Document Intelligence',
    channel: 'FedRAMP High',
    keywords: 'document processing, OCR, extraction, classification, NLP',
    description: 'Automated document processing and intelligence extraction for government documents. Handles classification markings, redaction detection, entity extraction, and multi-format ingestion including legacy formats.',
    source: 'https://x.ai/solutions',
    updated: '2026-08-20'
  },
  {
    sku: 'GOV-SECURE',
    family: 'Security & Compliance',
    name: 'Secure Government Cloud',
    channel: 'FedRAMP High / IL5',
    keywords: 'secure cloud, IL5, classified, airgap, compliance, NIST',
    description: 'Hardened AI infrastructure for classified and sensitive government workloads. Supports IL5, airgapped deployments, continuous compliance monitoring, and government-specific security controls (NIST 800-53, CMMC).',
    source: 'https://x.ai/news/government',
    updated: '2026-09-30'
  },
  {
    sku: 'GOV-CODE',
    family: 'Developer Tools',
    name: 'Government Code Assistant',
    channel: 'FedRAMP High',
    keywords: 'code generation, DevSecOps, IDE, developer productivity, secure coding',
    description: 'AI-powered code assistant for government developers with secure code generation, vulnerability detection, compliance checking, and government coding standards enforcement. Integrates with DevSecOps pipelines.',
    source: 'https://x.ai/solutions',
    updated: '2026-08-15'
  },
  {
    sku: 'GOV-FDE',
    family: 'Platform Services',
    name: 'Federal Data & Enterprise Platform',
    channel: 'FedRAMP High',
    keywords: 'enterprise AI, data platform, MLOps, LLMOps, model management, orchestration',
    description: 'Comprehensive federal data and enterprise AI platform providing LLMOps, model management, data orchestration, and multi-tenant enterprise AI capabilities. Designed for agency-wide AI strategy implementation with centralized governance.',
    source: 'https://x.ai/news/onegov',
    updated: '2026-09-28'
  },
  {
    sku: 'GOV-CUSTOM',
    family: 'Custom Solutions',
    name: 'Custom Model Development',
    channel: 'All classifications',
    keywords: 'custom models, fine-tuning, domain adaptation, specialized AI',
    description: 'Custom AI model development and domain adaptation for specialized government missions. Includes fine-tuning, mission-specific training, and deployment of bespoke models for unique operational requirements.',
    source: 'https://x.ai/solutions',
    updated: '2026-09-01'
  },
  {
    sku: 'GOV-INTEL',
    family: 'Intelligence',
    name: 'Intelligence Analysis Suite',
    channel: 'FedRAMP High / IL5',
    keywords: 'intelligence, analysis, OSINT, threat intelligence, geospatial, multi-INT',
    description: 'AI-powered intelligence analysis suite for multi-INT fusion, pattern detection, threat assessment, and predictive analysis. Supports OSINT, SIGINT, GEOINT integration with classification-aware workflows.',
    source: 'https://x.ai/solutions',
    updated: '2026-09-10'
  },
  {
    sku: 'GOV-PLAN',
    family: 'Operations',
    name: 'Mission Planning & Strategy',
    channel: 'FedRAMP High',
    keywords: 'planning, operations, strategy, decision support, wargaming, scenario analysis',
    description: 'AI-assisted mission planning, strategy development, and operational decision support. Includes scenario analysis, wargaming capabilities, resource optimization, and multi-variable constraint solving for complex operations.',
    source: 'https://x.ai/solutions',
    updated: '2026-08-25'
  },
  {
    sku: 'GOV-SEC',
    family: 'Security & Compliance',
    name: 'Cybersecurity & Threat Detection',
    channel: 'FedRAMP High / IL5',
    keywords: 'cybersecurity, threat detection, SIEM, SOC, incident response, zero trust',
    description: 'AI-enhanced cybersecurity platform with threat detection, behavioral analysis, automated incident response, and zero-trust architecture support. Integrates with government SOC and SIEM platforms.',
    source: 'https://x.ai/solutions',
    updated: '2026-09-05'
  },
  {
    sku: 'GOV-LEGAL',
    family: 'Professional Services',
    name: 'Legal & Regulatory AI',
    channel: 'FedRAMP High',
    keywords: 'legal, regulatory, compliance, contract analysis, policy review',
    description: 'AI support for legal operations, regulatory compliance analysis, contract review, and policy impact assessment. Trained on government legal frameworks, CFR, USC, and agency regulations.',
    source: 'https://x.ai/solutions',
    updated: '2026-08-30'
  },
  {
    sku: 'GOV-SUPPORT',
    family: 'Support & Training',
    name: 'Government Support & Training',
    channel: 'All channels',
    keywords: 'training, support, onboarding, professional services, technical support',
    description: 'Comprehensive government support including 24/7 technical support, security clearance-holding staff, on-site training, certification programs, and ongoing operational support for mission-critical deployments.',
    source: 'https://x.ai/solutions',
    updated: '2026-09-01'
  },
  {
    sku: 'GOV-BIZ',
    family: 'Business Operations',
    name: 'Business Intelligence & Analytics',
    channel: 'FedRAMP High',
    keywords: 'business intelligence, analytics, reporting, dashboards, financial analysis, acquisition',
    description: 'AI-powered business intelligence and analytics for government operations. Supports financial management, acquisition analytics, performance measurement, and automated reporting with government-specific metrics and compliance.',
    source: 'https://x.ai/solutions',
    updated: '2026-08-28'
  }
];

const iceRFISignal = {
  date: '2026-09-25',
  account: 'ICE',
  type: 'Sources Sought / RFI',
  title: 'ICE Enterprise AI, Data, and Technology Strategy/Architecture: O&M, Enhancement, and Design RFI',
  deadline: '2026-10-16T10:00:00-04:00',
  source: 'https://sam.gov/opp/1d49244e7dbc44fc9ee14f4b22cc9f0d',
  action: 'Respond by Oct 16; request one-on-one demo; contact SWIFT holders',
  status: 'open',
  full_text: `ICE OFFICE OF THE CHIEF INFORMATION OFFICER

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
   - Training and change management for 20,000+ ICE personnel

TECHNICAL ENVIRONMENT:
- Current AI Platform: STELLA (ICE Enterprise AI Assistant) operational since June 2026
- Contract Vehicles: SWIFT IDIQ ($340M, expires Sep 2027), EITSS (recompete expected Q2 FY27)
- Cloud Platforms: AWS GovCloud, Azure Government
- Data Sources: 50+ operational systems, biometric databases, investigative case management
- Classification Levels: Unclassified through Secret
- User Base: 20,000+ personnel across field offices nationwide

INFORMATION REQUESTED:
Interested contractors should address the following 12 questions in their response (5 pages maximum):

1. Enterprise AI Platform Experience: Describe your experience deploying and operating enterprise-scale AI platforms for federal law enforcement or national security missions. Include specific examples of LLMOps implementations, multi-model orchestration, and handling of sensitive/classified data.

2. Data Platform & Integration: Detail your approach to building enterprise data fabrics that integrate 50+ heterogeneous systems with varying classification levels. How do you ensure data quality, lineage, and governance at scale?

3. Legacy System Modernization: ICE operates numerous legacy systems requiring integration with modern AI/data platforms. Describe your methodology for legacy modernization while maintaining operational continuity.

4. Security & Compliance: Explain your approach to implementing AI systems with FedRAMP High authorization, continuous ATO, and zero-trust architecture in federal law enforcement contexts.

5. Responsible AI & Ethics: Describe your framework for AI ethics, bias detection, explainability, and privacy-preserving AI in law enforcement use cases. Include specific tools and methodologies.

6. Contract Strategy: This requirement may be competed under ICE SWIFT IDIQ or a new acquisition vehicle. Provide your recommendation for contract strategy, including IDIQ vs. standalone, contract type (FFP, T&M, hybrid), and ceiling value for a 5-year period of performance.

7. Pricing Model: Provide rough order of magnitude (ROM) pricing for:
   - Initial architecture design and implementation (12-18 months)
   - Steady-state operations & maintenance (annual)
   - Per-user licensing for enterprise AI capabilities
   - Infrastructure costs (cloud, compute, storage)

8. Teaming & Partnerships: Identify your teaming strategy, including any technology partners, subcontractors, or OEM relationships critical to your solution. Note which team members hold ICE SWIFT or other relevant DHS contract vehicles.

9. Technology Stack: Specify the core technologies, platforms, and tools you would propose for each component (AI/LLM platform, data integration, orchestration, security, monitoring). Indicate government vs. commercial AI models.

10. Operational Support: Describe your approach to 24/7 operational support for mission-critical AI systems, including incident response, model monitoring, and performance optimization.

11. Implementation Timeline: Provide a notional timeline for standing up the enterprise platform from contract award through full operational capability. Identify key milestones and dependencies.

12. Unique Differentiators: What unique capabilities, experience, or technological advantages differentiate your solution for this ICE mission? Include any relevant case studies or federal references.

RESPONSE INSTRUCTIONS:
- Responses due: October 16, 2026, 10:00 AM Eastern Daylight Time
- Submission method: Via Microsoft Form (link to be provided to registered vendors)
- Page limit: 5 pages (11pt font minimum, 1-inch margins)
- Contact for questions: OAQ-ITD-SD-requirements@ice.dhs.gov
- One-on-one demo opportunities available for responsive vendors (30-minute slots, week of Oct 21-25)

DISCLAIMER:
This RFI is for informational and planning purposes only and shall not be construed as a solicitation or as an obligation on the part of ICE or DHS. ICE will not pay for any information or administrative costs incurred in response to this RFI. Responses will not be returned.

POINT OF CONTACT:
OAQ-ITD-SD-requirements@ice.dhs.gov
Immigration and Customs Enforcement
Office of the Chief Information Officer
Technology Strategy and Design Division

SAM.gov Notice ID: 1d49244e7dbc44fc9ee14f4b22cc9f0d
Posted: September 25, 2026
Response Deadline: October 16, 2026, 10:00 AM EDT
Set-Aside: None (full and open competition)
NAICS: 541512 (Computer Systems Design Services)
Place of Performance: Nationwide (ICE facilities and field offices)`
};

export function seedDatabase() {
  try {
    const insertCatalog = db.prepare(`
      INSERT OR REPLACE INTO catalog (sku, family, name, channel, keywords, description, source, updated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of catalogData) {
      insertCatalog.run(
        item.sku,
        item.family,
        item.name,
        item.channel,
        item.keywords,
        item.description,
        item.source,
        item.updated
      );
    }

    const insertSignal = db.prepare(`
      INSERT INTO signals (date, account, type, title, deadline, source, action, status, full_text)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertSignal.run(
      iceRFISignal.date,
      iceRFISignal.account,
      iceRFISignal.type,
      iceRFISignal.title,
      iceRFISignal.deadline,
      iceRFISignal.source,
      iceRFISignal.action,
      iceRFISignal.status,
      iceRFISignal.full_text
    );

    console.log(`Seeded ${catalogData.length} catalog items`);
    console.log(`Seeded ICE RFI signal with ID: ${result.lastInsertRowid}`);
    
    return { success: true, signalId: result.lastInsertRowid };
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  }
}

if (require.main === module) {
  seedDatabase();
  console.log('Database seeded successfully');
}
