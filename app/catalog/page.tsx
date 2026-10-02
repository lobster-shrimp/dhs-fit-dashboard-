import { getAllCatalogSKUs } from '@/lib/db';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default function CatalogPage() {
  const catalog = getAllCatalogSKUs();

  const categories = Array.from(new Set(catalog.map(sku => sku.category)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Catalog</h2>
        <p className="text-gray-600">SpaceXAI product and service catalog</p>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Total SKUs</div>
          <div className="text-3xl font-bold text-gray-900">{catalog.length}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Categories</div>
          <div className="text-3xl font-bold text-blue-600">{categories.length}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Connectivity</div>
          <div className="text-3xl font-bold text-green-600">
            {catalog.filter(s => s.category === 'Connectivity').length}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Defense</div>
          <div className="text-3xl font-bold text-purple-600">
            {catalog.filter(s => s.category === 'Defense & Security').length}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map(category => {
          const skus = catalog.filter(sku => sku.category === category);

          return (
            <div key={category} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
                <p className="text-sm text-gray-500">{skus.length} product(s)</p>
              </div>

              <div className="divide-y divide-gray-200">
                {skus.map(sku => (
                  <div key={sku.id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{sku.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">SKU: {sku.id}</p>
                      </div>
                      <span className="text-xs text-gray-400">{formatDate(sku.created_at)}</span>
                    </div>

                    <p className="text-gray-600 mb-4">{sku.description}</p>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Capabilities:</div>
                        <div className="flex flex-wrap gap-2">
                          {sku.capabilities.map((cap, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Tags:</div>
                        <div className="flex flex-wrap gap-2">
                          {sku.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
