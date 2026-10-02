import Link from 'next/link';
import { getAllSignals, getScoresForSignal, getCatalogSKU } from '@/lib/db';
import { formatDate, priorityColor, scoreColor, strengthBadge } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default function Dashboard() {
  const signals = getAllSignals();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Monitor DHS opportunity signals and fit scores</p>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Signals</div>
          <div className="text-3xl font-bold text-gray-900">{signals.length}</div>
          <div className="text-xs text-gray-500 mt-1">Opportunity tracking</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">High Priority</div>
          <div className="text-3xl font-bold text-orange-600">
            {signals.filter(s => s.priority === 'high' || s.priority === 'critical').length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Requires attention</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Processed</div>
          <div className="text-3xl font-bold text-green-600">
            {signals.filter(s => s.processed).length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Scored and analyzed</div>
        </div>
      </div>

      <div className="space-y-6">
        {signals.map(signal => {
          const scores = getScoresForSignal(signal.id);
          const topScores = scores.slice(0, 3);

          return (
            <div key={signal.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Link
                      href={`/signals/${signal.id}`}
                      className="text-xl font-semibold text-gray-900 hover:text-blue-600"
                    >
                      {signal.title}
                    </Link>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="text-sm text-gray-500">{signal.source}</span>
                      <span className={`text-sm font-medium ${priorityColor(signal.priority)}`}>
                        {signal.priority.toUpperCase()}
                      </span>
                      {signal.deadline && (
                        <span className="text-sm text-gray-500">
                          Due: {formatDate(signal.deadline)}
                        </span>
                      )}
                    </div>
                  </div>
                  {signal.processed && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Processed
                    </span>
                  )}
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{signal.summary}</p>

                <div className="border-t border-gray-200 pt-4">
                  <div className="text-sm font-medium text-gray-700 mb-3">Top Matches:</div>
                  {topScores.length > 0 ? (
                    <div className="space-y-2">
                      {topScores.map(score => {
                        const sku = getCatalogSKU(score.sku_id);
                        if (!sku) return null;

                        return (
                          <div
                            key={score.sku_id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded"
                          >
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{sku.name}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {score.match_details.rationale}
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 ml-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${strengthBadge(
                                  score.match_details.strength
                                )}`}
                              >
                                {score.match_details.strength}
                              </span>
                              <span className={`text-lg font-bold ${scoreColor(score.score)}`}>
                                {Math.round(score.score * 100)}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No scores calculated yet</p>
                  )}
                </div>

                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/signals/${signal.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {signals.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No signals found</p>
            <p className="text-gray-400 text-sm mt-2">Run npm run init-db to seed the database</p>
          </div>
        )}
      </div>
    </div>
  );
}
