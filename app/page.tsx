import { Briefcase, Activity, Target, Zap, Shield, ChevronRight } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header Section */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-2">
            Welcome back, Sarah.
          </h1>
          <p className="text-textMuted text-lg">Your interview readiness is at <span className="text-primary font-semibold">84%</span>. You are improving!</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]">
          <Zap className="w-4 h-4 fill-current" />
          Start Mock Interview
        </button>
      </div>

      {/* Grid Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-4 mb-4 text-textMuted">
            <Activity className="w-5 h-5 text-indigo-400" />
            <span className="font-medium tracking-wide text-sm uppercase">Overall Score</span>
          </div>
          <div className="text-5xl font-light tracking-tight">84<span className="text-xl text-textMuted ml-1">/100</span></div>
          <div className="mt-4 pt-4 border-t border-borderBase text-sm text-green-400 flex items-center gap-2">
            ↑ 12% from last week
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4 mb-4 text-textMuted">
            <Shield className="w-5 h-5 text-purple-400" />
            <span className="font-medium tracking-wide text-sm uppercase">Confidence</span>
          </div>
          <div className="text-5xl font-light tracking-tight">High</div>
          <div className="mt-4 pt-4 border-t border-borderBase text-sm text-textMuted flex items-center gap-2">
            Eye contact improved by 15%
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col justify-center items-center text-center relative overflow-hidden group cursor-pointer border-dashed border-2 bg-transparent hover:bg-surface/40">
          <div className="absolute inset-0 bg-gradient-premium opacity-0 group-hover:opacity-5 transition-opacity" />
          <Target className="w-8 h-8 text-primary mb-3" />
          <h3 className="font-medium text-lg">Upload Target Resume</h3>
          <p className="text-sm text-textMuted mt-1">Let AI extract customized questions.</p>
        </div>
      </div>

      {/* Recent Interviews */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Recent Sessions</h2>
        <div className="space-y-4">
          {[
            { role: "Senior Frontend Engineer", type: "Technical", score: 88, date: "Today, 10:00 AM", icon: <Briefcase /> },
            { role: "Product Manager", type: "Behavioral", score: 76, date: "Yesterday", icon: <Target /> },
            { role: "Google DNA Check", type: "Stress", score: 92, date: "Oct 12", icon: <Zap /> },
          ].map((session, i) => (
            <div key={i} className="glass-card p-5 flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-surfaceHover flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  {session.icon}
                </div>
                <div>
                  <h4 className="font-medium text-lg">{session.role}</h4>
                  <p className="text-sm text-textMuted flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-surface border border-borderBase text-xs">{session.type}</span>
                    {session.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right flex flex-col">
                  <span className="text-2xl font-semibold">{session.score}</span>
                  <span className="text-xs text-textMuted uppercase tracking-wider">Score</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
