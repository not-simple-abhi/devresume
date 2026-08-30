import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  Upload, Play, Code2, Tag, Zap, RefreshCw, ScanText, Brain,
  Layers, Building2, Sparkles, ArrowRight, CheckCircle2, FileCheck2,
} from 'lucide-react'
import { useStats } from '@/hooks/useStats'

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedCount({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<number | null>(null)
  useEffect(() => {
    if (target === 0) return
    const steps = 60
    const increment = target / steps
    let current = 0
    ref.current = window.setInterval(() => {
      current += increment
      if (current >= target) { setCount(target); clearInterval(ref.current!) }
      else setCount(Math.floor(current))
    }, 1500 / steps)
    return () => clearInterval(ref.current!)
  }, [target])
  return <span className="font-mono-data font-bold">{count.toLocaleString()}{suffix}</span>
}

// ─── Stats strip ──────────────────────────────────────────────────────────────
function StatsStrip({ totalReviews }: { totalReviews: number }) {
  const stats = [
    { icon: FileCheck2,  value: totalReviews, suffix: '+', label: 'Resumes Reviewed',             color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/60 border-violet-200 dark:border-violet-800' },
    { icon: Sparkles,    value: 6,            suffix: '',  label: 'AI Agents Running in Parallel', color: 'text-blue-600 dark:text-blue-400',     bg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800' },
    { icon: CheckCircle2,value: 100,          suffix: '%', label: 'Free to Try',                   color: 'text-emerald-600 dark:text-emerald-400',bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800' },
  ]
  return (
    <div className="grid grid-cols-3 gap-4 mt-10 mb-2">
      {stats.map(({ icon: Icon, value, suffix, label, color, bg }) => (
        <div key={label} className={`flex flex-col items-center gap-1.5 rounded-2xl border px-4 py-4 ${bg}`}>
          <Icon size={18} className={color} />
          <p className={`text-2xl sm:text-3xl ${color}`}>
            <AnimatedCount target={value} suffix={suffix} />
          </p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center font-medium leading-tight">{label}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Hero mockup ──────────────────────────────────────────────────────────────
function HeroMockup() {
  const bars = [
    { label: 'ATS Parse Rate',       pct: 88, color: '#7c3aed' },
    { label: 'Active Verb Density',  pct: 72, color: '#7c3aed' },
    { label: 'Quantifiable Metrics', pct: 43, color: '#ef4444' },
  ]
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-violet-100/40 dark:shadow-violet-900/20 p-5 w-full max-w-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">Analysis Report</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">john_doe_backend.pdf</p>
        </div>
        <span className="text-[9px] px-2 py-0.5 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-full font-medium">
          ★ REVIEWED
        </span>
      </div>
      <div className="space-y-3 mb-4">
        {bars.map((b) => (
          <div key={b.label}>
            <div className="flex justify-between mb-1">
              <span className="text-[10px] text-gray-500 dark:text-gray-400">{b.label}</span>
              <span className="text-[10px] font-mono font-semibold" style={{ color: b.color }}>{b.pct}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${b.pct}%`, backgroundColor: b.color }} />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-violet-50 dark:bg-violet-950/60 border border-violet-100 dark:border-violet-800 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Sparkles size={12} className="text-violet-500 mt-0.5 shrink-0" />
          <p className="text-[10px] text-violet-700 dark:text-violet-300 leading-relaxed">
            Your architecture section lacks metric-driven outcomes. Consider quantifying the impact of your caching implementation.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Pipeline steps ───────────────────────────────────────────────────────────
const pipelineSteps = [
  { step: '01 / PARSE',    title: 'Structural Extraction', desc: 'Parse deep persons to ensure ATS systems can read your job metadata and experience timeline.', icon: Code2,     color: 'bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400' },
  { step: '02 / MAP',      title: 'Skill Taxonomy',        desc: "Map your titles' technologies against a library of 30,000+ developer tools and frameworks.",    icon: Tag,      color: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400' },
  { step: '03 / EVALUATE', title: 'Contextual Impact',     desc: 'LLMs evaluate bullet points for technical depth, architectural understanding, and business impact.', icon: Zap,  color: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' },
  { step: '04 / OPTIMIZE', title: 'Rewrite Suggestions',   desc: 'Generate technically sound, metric-focused rewrites that sound like an engineer, not a marketer.', icon: RefreshCw, color: 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400' },
]

// ─── Capabilities ─────────────────────────────────────────────────────────────
const capabilities = [
  { icon: ScanText,  title: 'Deep Syntax Highlighting', desc: "We don't just read words, we understand context. See exactly which phrases are strong action verbs and which are passive filler.", cta: 'Explore Feature', featured: false },
  { icon: Brain,     title: 'The "Seniority Scanner"',  desc: 'Our models detect language patterns associated with different seniority levels, helping you project authority and architectural leadership.', featured: true, badge: '+ AI LAYER' },
  { icon: ScanText,  title: 'Live ATS Parsing',         desc: 'See exactly how Workday or Greenhouse will extract your data before you hit submit.', featured: false },
  { icon: RefreshCw, title: 'Job Description Diff',     desc: 'Paste a JD and generate a missing keyword matrix instantly.', featured: false },
]

const companyScores = [
  { name: 'Google', match: 34 },
  { name: 'Amazon', match: 41 },
  { name: 'Zomato', match: 68 },
]

// ─── Capability card ──────────────────────────────────────────────────────────
function CapabilityCard({ icon: Icon, title, desc, cta, featured, badge }: (typeof capabilities)[number]) {
  if (featured) {
    return (
      <div className="row-span-2 bg-violet-600 dark:bg-violet-700 rounded-2xl p-6 flex flex-col text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/30 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-700/30 rounded-full translate-y-8 -translate-x-8" />
        {badge && (
          <span className="self-end text-[9px] px-2 py-0.5 bg-white/20 text-white rounded-full mb-4 font-medium relative z-10">{badge}</span>
        )}
        <div className="relative z-10 flex-1 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
              <Icon size={18} className="text-white" />
            </div>
            <h3 className="font-semibold text-base mb-2">{title}</h3>
            <p className="text-sm text-violet-200 leading-relaxed">{desc}</p>
          </div>
          <div className="mt-6 space-y-1.5">
            {['Junior', 'Mid', 'Senior'].map((l, i) => (
              <div key={l} className="flex items-center gap-2">
                <span className="text-[9px] text-violet-300 w-10 shrink-0">{l}</span>
                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white/70 rounded-full" style={{ width: `${30 + i * 25}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-md hover:border-violet-100 dark:hover:border-violet-800 transition-all">
      <div className="w-9 h-9 rounded-lg bg-violet-50 dark:bg-violet-950 flex items-center justify-center mb-3">
        <Icon size={16} className="text-violet-600 dark:text-violet-400" />
      </div>
      <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1.5">{title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
      {cta && (
        <button className="mt-3 text-xs text-violet-600 dark:text-violet-400 font-medium hover:text-violet-700 dark:hover:text-violet-300 flex items-center gap-1">
          {cta} <ArrowRight size={10} />
        </button>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { data: stats } = useStats()
  const totalReviews = stats?.totalReviews ?? 0

  return (
    <div className="landing-bg min-h-screen">

      {/* ── Hero ── */}
      <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center scroll-mt-14">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/70 border border-violet-200 dark:border-violet-800 rounded-full px-3 py-1 mb-5">
            <Sparkles size={11} />
            AI Resume Intelligence Platform
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
            Your Resume,<br />
            Analyzed Like an{' '}
            <span className="text-violet-600 dark:text-violet-400">Engineer</span>
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-lg">
            Not a spell checker. An AI Resume Intelligence Platform built for technical roles.
            We parse your syntax, evaluate your architecture, and benchmark your impact against FAANG standards.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-colors shadow-md shadow-violet-200 dark:shadow-violet-900/40"
            >
              <Upload size={15} />
              Upload Your Resume — It's Free
            </Link>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Play size={14} className="text-violet-500" />
              See a sample analysis
            </button>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-gray-400 dark:text-gray-500 mb-6">
            {['SOC2 Type II', 'No Data Storage', 'End-to-End Encryption'].map((t) => (
              <span key={t} className="flex items-center gap-1">
                <CheckCircle2 size={11} className="text-emerald-400" />
                {t}
              </span>
            ))}
          </div>
          <StatsStrip totalReviews={totalReviews} />
        </div>
        <div className="flex justify-center lg:justify-end">
          <HeroMockup />
        </div>
      </section>

      {/* ── Intelligence Pipeline ── */}
      <section id="pipeline" className="bg-white/60 dark:bg-gray-900/50 backdrop-blur-sm border-t border-b border-violet-100/50 dark:border-violet-900/40 py-20 scroll-mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              The Intelligence Pipeline
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Deterministic parsing combined with protocol LLMs for a comprehensive technical review.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pipelineSteps.map(({ step, title, desc, icon: Icon, color }) => (
              <div
                key={step}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-md hover:border-violet-100 dark:hover:border-violet-800 transition-all animate-slide-up"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                  <Icon size={16} />
                </div>
                <p className="text-[9px] font-mono font-bold text-gray-300 dark:text-gray-600 mb-1 tracking-widest">{step}</p>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1.5">{title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Capabilities ── */}
      <section id="capabilities" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 scroll-mt-14">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">Core Capabilities</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto">
          <CapabilityCard {...capabilities[0]} />
          <div className="lg:row-span-2"><CapabilityCard {...capabilities[1]} /></div>
          <CapabilityCard {...capabilities[2]} />
          <CapabilityCard {...capabilities[3]} />
        </div>
      </section>

      {/* ── Company Readiness ── */}
      <section className="bg-white/60 dark:bg-gray-900/50 backdrop-blur-sm border-t border-violet-100/50 dark:border-violet-900/40 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Company Readiness Scores
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              See how your resume stacks up against successful engineering candidates at top tech companies.
            </p>
          </div>
          <div className="flex justify-center gap-8 flex-wrap">
            {companyScores.map(({ name, match }) => (
              <div key={name} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-center">
                  <Building2 size={22} className="text-gray-300 dark:text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{name}</span>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: match >= 60 ? '#f0fdf4' : match >= 40 ? '#fefce8' : '#fef2f2',
                    color: match >= 60 ? '#16a34a' : match >= 40 ? '#ca8a04' : '#dc2626',
                  }}
                >
                  {match}% Match
                </span>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/company" className="inline-flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 font-medium hover:text-violet-700 dark:hover:text-violet-300">
              Try company fit analysis <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="bg-violet-600 dark:bg-violet-700 rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #a78bfa 0%, transparent 50%), radial-gradient(circle at 80% 50%, #818cf8 0%, transparent 50%)' }}
          />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to get started?</h2>
            <p className="text-violet-200 text-sm mb-8 max-w-md mx-auto">
              Join thousands of engineers who've already optimized their resumes with DevResume.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/analyze"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-600 text-sm font-semibold rounded-xl hover:bg-violet-50 transition-colors"
              >
                <Upload size={15} />
                Analyze My Resume
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-colors"
              >
                Sign up free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
              <Sparkles size={11} className="text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">DevResume</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} DevResume. Engineered for Devs.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">GitHub</a>
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
