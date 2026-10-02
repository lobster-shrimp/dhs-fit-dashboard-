/**
 * Semantic scoring engine for matching DHS signals to SpaceXAI catalog products
 * 
 * Uses TF-IDF (Term Frequency-Inverse Document Frequency) with cosine similarity
 * to compute a 0-100 fit score for each product against a given opportunity text.
 */

interface CatalogItem {
  sku: string;
  name: string;
  family: string | null;
  keywords: string | null;
  description: string;
}

interface ScoredProduct {
  sku: string;
  product_name: string;
  family: string | null;
  fit_score: number;
  rationale: string;
  matched_terms: string[];
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2);
}

function buildVocabulary(documents: string[]): Set<string> {
  const vocab = new Set<string>();
  for (const doc of documents) {
    const tokens = tokenize(doc);
    tokens.forEach(token => vocab.add(token));
  }
  return vocab;
}

function computeTF(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  const totalTokens = tokens.length;
  
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  
  for (const [token, count] of tf.entries()) {
    tf.set(token, count / totalTokens);
  }
  
  return tf;
}

function computeIDF(documents: string[][], vocabulary: Set<string>): Map<string, number> {
  const idf = new Map<string, number>();
  const numDocs = documents.length;
  
  for (const term of vocabulary) {
    let docCount = 0;
    for (const doc of documents) {
      if (doc.includes(term)) {
        docCount++;
      }
    }
    idf.set(term, Math.log(numDocs / (1 + docCount)));
  }
  
  return idf;
}

function computeTFIDF(tf: Map<string, number>, idf: Map<string, number>): Map<string, number> {
  const tfidf = new Map<string, number>();
  
  for (const [term, tfValue] of tf.entries()) {
    const idfValue = idf.get(term) || 0;
    tfidf.set(term, tfValue * idfValue);
  }
  
  return tfidf;
}

function cosineSimilarity(vec1: Map<string, number>, vec2: Map<string, number>): number {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  const allTerms = new Set([...vec1.keys(), ...vec2.keys()]);
  
  for (const term of allTerms) {
    const val1 = vec1.get(term) || 0;
    const val2 = vec2.get(term) || 0;
    
    dotProduct += val1 * val2;
    norm1 += val1 * val1;
    norm2 += val2 * val2;
  }
  
  if (norm1 === 0 || norm2 === 0) return 0;
  
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

function extractMatchedTerms(
  queryTokens: string[],
  productText: string,
  topN: number = 5
): string[] {
  const productTokens = new Set(tokenize(productText));
  const matched = queryTokens.filter(token => productTokens.has(token));
  
  const termFreq = new Map<string, number>();
  for (const term of matched) {
    termFreq.set(term, (termFreq.get(term) || 0) + 1);
  }
  
  return Array.from(termFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([term]) => term);
}

function generateRationale(
  score: number,
  matchedTerms: string[],
  product: CatalogItem,
  queryText: string
): string {
  const hasAI = /\b(ai|artificial intelligence|machine learning|ml|llm|language model)\b/i.test(queryText);
  const hasData = /\b(data|database|analytics|intelligence|information)\b/i.test(queryText);
  const hasCloud = /\b(cloud|infrastructure|platform|saas|paas)\b/i.test(queryText);
  const hasSecurity = /\b(security|secure|classified|fedramp|compliance|zero trust)\b/i.test(queryText);
  const hasEnterprise = /\b(enterprise|agency|organization|department)\b/i.test(queryText);
  
  const reasons: string[] = [];
  
  if (score >= 75) {
    reasons.push('Strong semantic alignment');
  } else if (score >= 50) {
    reasons.push('Moderate semantic alignment');
  } else {
    reasons.push('Limited semantic alignment');
  }
  
  if (matchedTerms.length > 0) {
    reasons.push(`key terms: ${matchedTerms.slice(0, 3).join(', ')}`);
  }
  
  const productLower = `${product.name} ${product.description} ${product.keywords || ''}`.toLowerCase();
  
  if (hasAI && productLower.includes('ai')) {
    reasons.push('AI capability match');
  }
  if (hasData && (productLower.includes('data') || productLower.includes('intelligence'))) {
    reasons.push('data platform alignment');
  }
  if (hasCloud && (productLower.includes('cloud') || productLower.includes('platform'))) {
    reasons.push('cloud/platform fit');
  }
  if (hasSecurity && (productLower.includes('secure') || productLower.includes('fedramp') || productLower.includes('compliance'))) {
    reasons.push('security/compliance match');
  }
  if (hasEnterprise && (productLower.includes('enterprise') || productLower.includes('government'))) {
    reasons.push('enterprise scope alignment');
  }
  
  if (product.family === 'Platform Services' && hasEnterprise) {
    reasons.push('platform strategy fit');
  }
  if (product.family === 'Security & Compliance' && hasSecurity) {
    reasons.push('security mission alignment');
  }
  
  return reasons.join('; ');
}

export function scoreProductsAgainstSignal(
  signalText: string,
  catalogItems: CatalogItem[]
): ScoredProduct[] {
  const queryTokens = tokenize(signalText);
  
  const productTexts = catalogItems.map(item =>
    `${item.name} ${item.family || ''} ${item.keywords || ''} ${item.description}`.repeat(2)
  );
  
  const allDocuments = [signalText, ...productTexts];
  const allTokenizedDocs = allDocuments.map(tokenize);
  const vocabulary = buildVocabulary(allDocuments);
  const idf = computeIDF(allTokenizedDocs, vocabulary);
  
  const queryTF = computeTF(queryTokens);
  const queryTFIDF = computeTFIDF(queryTF, idf);
  
  const scores: ScoredProduct[] = catalogItems.map((item, index) => {
    const productTokens = allTokenizedDocs[index + 1];
    const productTF = computeTF(productTokens);
    const productTFIDF = computeTFIDF(productTF, idf);
    
    const similarity = cosineSimilarity(queryTFIDF, productTFIDF);
    const score = Math.min(100, Math.max(0, Math.round(similarity * 100 * 1.5)));
    
    const productFullText = `${item.name} ${item.family || ''} ${item.keywords || ''} ${item.description}`;
    const matchedTerms = extractMatchedTerms(queryTokens, productFullText);
    
    const rationale = generateRationale(score, matchedTerms, item, signalText);
    
    return {
      sku: item.sku,
      product_name: item.name,
      family: item.family,
      fit_score: score,
      rationale,
      matched_terms: matchedTerms
    };
  });
  
  return scores.sort((a, b) => b.fit_score - a.fit_score);
}

export function scoreSingleProduct(signalText: string, product: CatalogItem): ScoredProduct {
  const scores = scoreProductsAgainstSignal(signalText, [product]);
  return scores[0];
}
