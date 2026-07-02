import { Outlet, Link } from 'react-router-dom';
import { Brain, Sparkles } from 'lucide-react';

/**
 * AuthLayout — full-screen split layout for authentication pages.
 *
 * Left panel  (hidden on mobile): brand hero with feature highlights.
 * Right panel: the auth form (Outlet).
 */
export function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-background">

      {/* ── Left brand panel (desktop only) ───────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] relative flex-col justify-between overflow-hidden bg-[hsl(252,75%,14%)] p-10 text-white">

        {/* Animated gradient orbs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-[hsl(252,82%,57%)] opacity-20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-[hsl(280,80%,60%)] opacity-15 blur-3xl animate-pulse [animation-delay:2s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-[hsl(252,82%,65%)] opacity-10 blur-2xl" />
        </div>

        {/* Grid pattern overlay */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-lg leading-tight">ResearchMind</p>
            <p className="text-xs text-white/60 leading-tight">Institutional Memory Platform</p>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm border border-white/10">
              <Sparkles className="w-3 h-3" />
              Powered by Cognee + Google Gemini
            </div>
            <h2 className="text-4xl font-bold leading-tight tracking-tight">
              Your lab's knowledge,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-300">
                never forgotten.
              </span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              Preserve every experiment, meeting, decision, and breakthrough. Query your institutional memory with natural language.
            </p>
          </div>

          {/* Feature pills */}
          <div className="grid grid-cols-1 gap-3">
            {[
              { emoji: '🧪', title: 'Experiment Tracking',  desc: 'Log protocols, results, and conclusions' },
              { emoji: '📄', title: 'Paper Management',      desc: 'Ingest and query your paper library' },
              { emoji: '🤝', title: 'Meeting Intelligence',  desc: 'Capture decisions and action items' },
              { emoji: '🔍', title: 'Natural Language Search', desc: 'Ask questions across your entire knowledge base' },
            ].map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-3 rounded-xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-sm"
              >
                <span className="text-xl shrink-0">{f.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="text-xs text-white/60 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-white/40">
          © {new Date().getFullYear()} ResearchMind. Built for researchers, by researchers.
        </div>
      </div>

      {/* ── Right form panel ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-8 overflow-y-auto">

        {/* Mobile logo (visible only on small screens) */}
        <div className="lg:hidden flex flex-col items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary shadow-lg shadow-primary/25">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight">ResearchMind</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Institutional Memory for Research Labs
            </p>
          </div>
        </div>

        {/* Page content — auth form renders here */}
        <div className="w-full max-w-[400px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
