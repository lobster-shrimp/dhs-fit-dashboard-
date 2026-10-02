import { Inter } from "next/font/google";
import Link from "next/link";
const inter = Inter({ subsets: ["latin"] });
  title: "DHS Account Intel + SpaceXAI Fit",
  description: "Realtime DHS buying signals with SpaceXAI product fit scoring",
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b bg-white sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <Link href="/" className="text-xl font-bold text-blue-600">
                    DHS Account Intel
                  </Link>
                  <nav className="flex gap-6">
                    <Link 
                      href="/" 
                      className="text-sm font-medium hover:text-blue-600 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/catalog" 
                      className="text-sm font-medium hover:text-blue-600 transition-colors"
                    >
                      Catalog
                    </Link>
                  </nav>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Live
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t bg-gray-50 py-6">
            <div className="container mx-auto px-4">
              <div className="text-center text-sm text-gray-600">
                <p>DHS Account Intel + SpaceXAI Fit Scoring</p>
                <p className="text-xs mt-1">Semantic scoring powered by TF-IDF • Realtime updates via SSE</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
