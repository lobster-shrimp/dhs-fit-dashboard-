import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSignal, getScoresForSignal, getCatalogSKU } from '@/lib/db';
import { formatDate, priorityColor, scoreColor, strengthBadge, calculatePercentage } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    id: string;
  };
}

export default function SignalDetailPage({ params }: PageProps) {
  const signal = getSignal(params.id);

  if (!signal) {
    notFound();
  }

  const scores = getScoresForSignal(signal.id);
  const scoredResults = scores
    .map(score => ({
      score,
      sku: getCatalogSKU(score.sku_id),
    }))
    .filter(r => r.sku !== null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/" className="text-sm text-blue-600 hover:text-blue-700">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{signal.title}</h1>
            {signal.processed && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Processed
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-600">
              <strong>Source:</strong> {signal.source}
            </span>
            <span className={`font-medium ${priorityColor(signal.priority)}`}>
              <strong>Priority:</strong> {signal.priority.toUpperCase()}
            </span>
            <span className="text-gray-600">
              <strong>Uploaded:</strong> {formatDate(signal.uploaded_at)}
            </span>
            {signal.deadline && (
              <span className="text-gray-600">
                <strong>Deadline:</strong> {formatDate(signal.deadline)}
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Summary</h2>
          <p className="text-gray-700 leading-relaxed">{signal.summary}</p>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Requirements</h3>
              <ul className="space-y-2">
                {signal.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-sm text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {signal.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Fit Scores</h2>
          <p className="text-sm text-gray-600 mt-1">
            {scoredResults.length} catalog SKU(s) scored
          </p>
        </div>

        {scoredResults.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {scoredResults.map(({ score, sku }) => {
              if (!sku) return null;

              return (
                <div key={sku.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{sku.name}</h3>
                      <p className="text-sm text-gray-500">{sku.category} • {sku.id}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`text-3xl font-bold ${scoreColor(score.score)}`}>
                        {Math.round(score.score * 100)}%
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${strengthBadge(
                          score.match_details.strength
                        )} mt-1`}
                      >
                        {score.match_details.strength}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{sku.description}</p>

                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="text-sm font-medium text-gray-900 mb-2">Match Analysis</div>
                    <p className="text-sm text-gray-700">{score.match_details.rationale}</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3 text-sm">
                    <div>
                      <div className="font-medium text-gray-700 mb-2">
                        Capability Matches ({score.match_details.capability_matches.length})
                      </div>
                      {score.match_details.capability_matches.length > 0 ? (
                        <ul className="space-y-1">
                          {score.match_details.capability_matches.map((cap, idx) => (
                            <li key={idx} className="text-gray-600">
                              ✓ {cap}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400 italic">None</p>
                      )}
                    </div>

                    <div>
                      <div className="font-medium text-gray-700 mb-2">
                        Keyword Matches ({score.match_details.keyword_matches.length})
                      </div>
                      {score.match_details.keyword_matches.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {score.match_details.keyword_matches.map((kw, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 text-green-700"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">None</p>
                      )}
                    </div>

                    <div>
                      <div className="font-medium text-gray-700 mb-2">Requirement Coverage</div>
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: calculatePercentage(score.match_details.requirement_coverage) }}
                          />
                        </div>
                        <span className="text-gray-900 font-medium">
                          {calculatePercentage(score.match_details.requirement_coverage)}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">
                        {Math.round(score.match_details.requirement_coverage * signal.requirements.length)} of{' '}
                        {signal.requirements.length} requirements
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-500">No fit scores calculated yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
