import { Mic, Brain, User, Activity, BrainCircuit, Waves } from "lucide-react"

export default function InterviewSession() {
  return (
    <div className="h-[80vh] flex flex-col gap-6 animate-fade-in relative">

      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            Interview in Progress
          </h2>
          <p className="text-textMuted text-sm mt-1">Senior Frontend Engineer • Technical Round</p>
        </div>
        <div className="flex items-center gap-4 bg-surface px-4 py-2 rounded-full border border-borderBase shadow-lg">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AI Analyzing...</span>
          </div>
          <div className="w-px h-4 bg-borderBase" />
          <span className="text-sm font-mono text-textMuted">04:12</span>
        </div>
      </div>

      <div className="flex flex-1 gap-6">

        {/* Main Video/AI Area */}
        <div className="flex-2 flex flex-col gap-4 w-2/3">
          {/* AI Avatar / Question space */}
          <div className="flex-1 glass-card overflow-hidden relative group">
            {/* Ambient Background reflecting AI tone */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/20" />

            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-24 h-24 rounded-full border border-primary/30 flex items-center justify-center mb-8 relative animate-pulse-glow bg-surface">
                <Waves className="w-10 h-10 text-primary" />
              </div>
              <p className="text-3xl font-light leading-relaxed text-blue-50">
                "Tell me about a time you had to pivot your technical architecture mid-project due to changing requirements. How did you handle the team's morale?"
              </p>
            </div>

            {/* Transcription Overlay */}
            <div className="absolute bottom-6 inset-x-12 bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/10 text-sm text-gray-300">
              <span className="text-white font-medium">You:</span> "So, initially we were using a monolith, but uh... we realized the scaling was..." <span className="bg-primary/20 text-indigo-300 animate-pulse">|</span>
            </div>
          </div>

          {/* Controls */}
          <div className="h-20 glass-card flex items-center justify-center gap-6">
            <button className="w-12 h-12 rounded-full bg-surfaceHover border border-borderBase flex items-center justify-center text-textMuted hover:text-white transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button className="w-16 h-16 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:bg-primary/30 transition-all">
              <Mic className="w-6 h-6" />
            </button>
            <button className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/50 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors">
              <MonitorPlay className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="w-1/3 flex flex-col gap-6">
          <div className="flex-1 glass-card p-6">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Real-time Telemetry
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-textMuted">Speaking Pace</span>
                  <span className="text-green-400">Optimal</span>
                </div>
                <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                  <div className="h-full w-[65%] bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-textMuted">Filler Words Expected</span>
                  <span className="text-orange-400">High</span>
                </div>
                <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden flex gap-0.5">
                  {/* Simulated timeline blocks */}
                  {[...Array(15)].map((_, i) => (
                    <div key={i} className={`h-full flex-1 ${i === 3 || i === 7 ? 'bg-orange-500' : 'bg-surfaceHover'}`} />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-borderBase">
              <h4 className="text-sm font-medium text-textMuted mb-3">AI Suggestions</h4>
              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-200">
                Try to elaborate more on the specific architecture change, rather than just saying "scaling was bad".
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
