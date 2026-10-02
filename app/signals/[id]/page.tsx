'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Signal, FitScore } from '@/lib/types';
import { formatDate, formatDeadline, getStatusColor, getScoreBadgeColor, cn } from '@/lib/utils';

export default function SignalDetail() {
  const params = useParams();
  const router = useRouter();
  const [signal, setSignal] = useState<Signal | null>(null);
  const [fitScores, setFitScores] = useState<FitScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchSignal();
    }
  }, [params.id]);

  const fetchSignal = async () => {
    try {
      const response = await fetch(`/api/signals/${params.id}`);
      const data = await response.json();
      setSignal(data.signal);
      setFitScores(data.fit_scores);
    } catch (error) {
      console.error('Error fetching signal:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      await fetch(`/api/signals/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchSignal();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const rescore = async () => {
    if (!signal?.full_text) return;
    
    setScoring(true);
    try {
      await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signal_id: params.id,
          text: signal.full_text,
        }),
      });
      fetchSignal();
    } catch (error) {
      console.error('Error rescoring:', error);
    } finally {
      setScoring(false);
    }
  };

  const copyAlert = () => {
    if (!signal) return;
    
    const alert = `🚨 DHS ALERT: ${signal.account}

${signal.title}

Due: ${signal.deadline ? formatDate(signal.deadline) + ' (' + formatDeadline(signal.deadline) + ')' : 'No deadline'}
Type: ${signal.type}
Status: ${signal.status.toUpperCase()}

${signal.action ? `Action: ${signal.action}` : ''}

Top Fit: ${signal.top_sku || 'Not scored'} (${signal.fit_score || 0}/100)

Source: ${signal.source || 'N/A'}`;
    
    navigator.clipboard.writeText(alert);
    alert('Alert copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">Loading signal...</div>
        </div>
      </div>
    );
  }

  if (!signal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">Signal not found</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const getAccountBadgeColor = (account: string) => {
    const colors: Record<string, string> = {
      'ICE': 'bg-blue-100 text-blue-800',
      'CBP': 'bg-purple-100 text-purple-800',
      'USCIS': 'bg-green-100 text-green-800',
      'FEMA': 'bg-orange-100 text-orange-800',
      'CISA': 'bg-red-100 text-red-800',
      'DHS HQ': 'bg-gray-100 text-gray-800',
    };
    return colors[account] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className={cn('px-3 py-1 rounded text-sm font-medium', getAccountBadgeColor(signal.account))}>
                  {signal.account}
                </span>
                <span className={cn('px-3 py-1 rounded text-sm font-medium', getStatusColor(signal.status))}>
                  {signal.status}
                </span>
              </div>
              <button
                onClick={copyAlert}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                Copy Alert
              </button>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">{signal.title}</h1>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <span className="text-gray-500">Type:</span>
                <span className="ml-2 font-medium">{signal.type}</span>
              </div>
              <div>
                <span className="text-gray-500">Posted:</span>
                <span className="ml-2 font-medium">{formatDate(signal.date)}</span>
              </div>
              {signal.deadline && (
                <div>
                  <span className="text-gray-500">Deadline:</span>
                  <span className="ml-2 font-medium">{formatDate(signal.deadline)}</span>
                  <span className="ml-2 text-orange-600">({formatDeadline(signal.deadline)})</span>
                </div>
              )}
              {signal.source && (
                <div className="col-span-2">
                  <span className="text-gray-500">Source:</span>
                  <a href={signal.source} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline">
                    {signal.source}
                  </a>
                </div>
              )}
            </div>

            {signal.action && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="text-sm font-medium text-blue-900 mb-1">Recommended Action</div>
                <div className="text-sm text-blue-800">{signal.action}</div>
              </div>
            )}

            <div className="flex gap-2 mb-6">
              {['open', 'watch', 'responding', 'closed'].map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(status)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    signal.status === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {signal.full_text && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Full Text</h2>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {signal.full_text}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">SpaceXAI Fit Scores</h2>
              <button
                onClick={rescore}
                disabled={scoring || !signal.full_text}
                className={cn(
                  'px-3 py-1 rounded text-sm font-medium transition-colors',
                  scoring || !signal.full_text
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                )}
              >
                {scoring ? 'Scoring...' : 'Rescore'}
              </button>
            </div>

            {fitScores.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No scores yet</p>
                {signal.full_text && (
                  <button
                    onClick={rescore}
                    disabled={scoring}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Score Now
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {fitScores.map((score) => (
                  <div key={score.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900 truncate">
                          {score.product_name}
                        </div>
                        <div className="text-xs text-gray-500">{score.sku}</div>
                      </div>
                      <div className={cn('text-lg font-bold', getScoreBadgeColor(score.fit_score))}>
                        {score.fit_score}
                      </div>
                    </div>
                    {score.rationale && (
                      <div className="text-xs text-gray-600 leading-relaxed">
                        {score.rationale}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
