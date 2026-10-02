'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Signal } from '@/lib/types';
import { formatDeadline, formatDate, getStatusColor, getScoreBadgeColor, cn } from '@/lib/utils';

export default function Dashboard() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    fetchSignals();
    
    const eventSource = new EventSource('/api/stream');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'update') {
        setLastUpdate(data.timestamp);
        fetchSignals();
      }
    };
    
    eventSource.onerror = () => {
      console.error('SSE connection error');
    };
    
    return () => {
      eventSource.close();
    };
  }, []);

  const fetchSignals = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('status', filter);
      }
      
      const response = await fetch(`/api/signals?${params}`);
      const data = await response.json();
      setSignals(data.signals);
    } catch (error) {
      console.error('Error fetching signals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, [filter]);

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

  const getDeadlineUrgency = (deadline: string | null) => {
    if (!deadline) return 'text-gray-500';
    
    const date = new Date(deadline);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (diff < 0) return 'text-red-600 font-semibold';
    if (days <= 7) return 'text-orange-600 font-semibold';
    if (days <= 14) return 'text-yellow-600';
    return 'text-gray-700';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">Loading signals...</div>
        </div>
      </div>
    );
  }

    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">DHS Buying Signals</h1>
        <p className="text-gray-600">
          Live intelligence on DHS component opportunities with SpaceXAI product fit scoring
        </p>
        {lastUpdate && (
          <p className="text-xs text-gray-500 mt-1">
            Last update: {new Date(lastUpdate).toLocaleTimeString()}
        )}
      </div>

      <div className="mb-6 flex gap-2">
        {['all', 'open', 'watch', 'responding', 'closed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            )}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {signals.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <p className="text-gray-500">No signals found</p>
      ) : (
        <div className="space-y-4">
          {signals.map((signal) => (
            <Link
              key={signal.id}
              href={`/signals/${signal.id}`}
              className="block bg-white rounded-lg border hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn('px-2 py-1 rounded text-xs font-medium', getAccountBadgeColor(signal.account))}>
                      {signal.account}
                    </span>
                    <span className={cn('px-2 py-1 rounded text-xs font-medium', getStatusColor(signal.status))}>
                      {signal.status}
                    </span>
                    <span className="text-xs text-gray-500">{signal.type}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {signal.title}
                  </h3>
                  
                  {signal.action && (
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Action:</span> {signal.action}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Posted: {formatDate(signal.date)}</span>
                    {signal.deadline && (
                      <span className={getDeadlineUrgency(signal.deadline)}>
                        Due: {formatDate(signal.deadline)} ({formatDeadline(signal.deadline)})
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  {signal.fit_score !== null && (
                    <div className="text-right">
                      <div className={cn('text-3xl font-bold', getScoreBadgeColor(signal.fit_score))}>
                        {signal.fit_score}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Fit Score</div>
                      {signal.top_sku && (
                        <div className="text-xs text-gray-600 mt-1 font-medium">
                          {signal.top_sku}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
