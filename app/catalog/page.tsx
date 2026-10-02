'use client';

import { useEffect, useState } from 'react';
import { CatalogItem } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function CatalogPage() {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [families, setFamilies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');

  useEffect(() => {
    fetchCatalog();
  }, [search, selectedFamily]);

  const fetchCatalog = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedFamily !== 'all') params.append('family', selectedFamily);
      
      const response = await fetch(`/api/catalog?${params}`);
      const data = await response.json();
      setCatalog(data.catalog);
      if (data.families) setFamilies(data.families);
    } catch (error) {
      console.error('Error fetching catalog:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedCatalog = catalog.reduce((acc, item) => {
    const family = item.family || 'Other';
    if (!acc[family]) acc[family] = [];
    acc[family].push(item);
    return acc;
  }, {} as Record<string, CatalogItem[]>);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">Loading catalog...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SpaceXAI Product Catalog</h1>
        <p className="text-gray-600">
          Government AI solutions and services with FedRAMP High authorization
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Search products, keywords, or descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedFamily('all')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              selectedFamily === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            )}
          >
            All Products
          </button>
          {families.map((family) => (
            <button
              key={family}
              onClick={() => setSelectedFamily(family)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                selectedFamily === family
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              )}
            >
              {family}
            </button>
          ))}
        </div>
      </div>

      {catalog.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedCatalog).map(([family, items]) => (
            <div key={family}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">
                {family}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {item.sku}
                          </span>
                          {item.channel && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {item.channel}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {item.description}
                    </p>

                    {item.keywords && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.keywords.split(',').map((keyword, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                          >
                            {keyword.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.source && (
                      <div className="text-xs text-gray-500">
                        <a
                          href={item.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Learn more →
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
