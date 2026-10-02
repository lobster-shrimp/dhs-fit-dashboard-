import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DHS Fit Dashboard',
  description: 'DHS Account Intel / SpaceXAI opportunity fit-score dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DHS</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">DHS Fit Dashboard</h1>
                  <p className="text-xs text-gray-500">SpaceXAI Opportunity Intelligence</p>
                </div>
              </div>
              <nav className="flex space-x-4">
                <a href="/" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Dashboard
                </a>
                <a href="/catalog" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Catalog
                </a>
              </nav>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-12 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500">
            <p>Public mirror • Live tracker: Google Sheet</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
