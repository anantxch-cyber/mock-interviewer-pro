import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Mock Interviewer Pro | The Future of Hiring',
  description: 'Practice interviews with intelligent AI, receive deep personality insights, and secure your dream job.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-primary">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none -z-10" />
        
        {/* Navigation Bar */}
        <nav className="fixed top-0 w-full z-50 border-b border-borderBase bg-surface/50 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-premium flex items-center justify-center text-white font-bold">
                M
              </div>
              <span className="font-semibold text-lg tracking-tight">Mock Pro</span>
            </div>
            <div className="flex items-center gap-6 text-sm font-medium text-textMuted">
              <a href="#" className="hover:text-textMain transition-colors">Dashboard</a>
              <a href="#" className="hover:text-textMain transition-colors">Analytics</a>
              <a href="#" className="hover:text-textMain transition-colors">Resumes</a>
              <button className="px-5 py-2 rounded-full bg-textMain text-background hover:bg-gray-200 transition-colors">
                New Interview
              </button>
            </div>
          </div>
        </nav>

        <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  )
}
