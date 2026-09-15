import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  Upload, Code2, Tag, Zap, RefreshCw, ScanText, Brain,
  Layers, Building2, Sparkles, ArrowRight, CheckCircle2, FileCheck2,
} from 'lucide-react'
import { useStats } from '@/hooks/useStats'
import CTALiveFeed from '@/components/ui/CTALiveFeed'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedCount({ target, suffix = '', isVisible }: { target: number; suffix?: string; isVisible?: boolean }) {
  const [count, setCount] = useState(0)
  const ref = useRef<number | null>(null)
  useEffect(() => {
    if (!isVisible || target === 0) return
    const steps = 60
    const increment = target / steps
    let current = 0
    ref.current = window.setInterval(() => {
      current += increment
      if (current >= target) { setCount(target); clearInterval(ref.current!) }
      else setCount(Math.floor(current))
    }, 1500 / steps)
    return () => clearInterval(ref.current!)
  }, [target, isVisible])
  return <span className="font-mono-data font-bold">{count.toLocaleString()}{suffix}</span>
}

// ─── Stats strip ──────────────────────────────────────────────────────────────
function StatsStrip({ totalReviews, isVisible }: { totalReviews: number; isVisible: boolean }) {
  const stats = [
    { icon: FileCheck2,  value: totalReviews, suffix: '+', label: 'Resumes Reviewed',             color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/60 border-violet-200 dark:border-violet-800' },
    { icon: Sparkles,    value: 6,            suffix: '',  label: 'AI Agents Running in Parallel', color: 'text-blue-600 dark:text-blue-400',     bg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800' },
    { icon: CheckCircle2,value: 100,          suffix: '%', label: 'Free to Try',                   color: 'text-emerald-600 dark:text-emerald-400',bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800' },
  ]
  return (
    <div className="grid grid-cols-3 gap-4 mt-10 mb-2">
      {stats.map(({ icon: Icon, value, suffix, label, color, bg }) => (
        <div key={label} className={`flex flex-col items-center gap-1.5 rounded-2xl border px-4 py-4 hover:-translate-y-0.5 hover:border-violet-300 dark:hover:border-violet-600 transition-all duration-150 cursor-default ${bg}`}>
          <Icon size={18} className={color} />
          <p className={`text-2xl sm:text-3xl ${color}`}>
            <AnimatedCount target={value} suffix={suffix} isVisible={isVisible} />
          </p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center font-medium leading-tight">{label}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Hero mockup ──────────────────────────────────────────────────────────────
// Dashboard-style browser window: left score panel + right content panel

const SCORE_SECTIONS = [
  { label: 'ATS Compatibility', pct: 88, status: 'pass'  as const },
  { label: 'Quantifying Impact', pct: 74, status: 'pass'  as const },
  { label: 'Active Voice',       pct: 61, status: 'warn'  as const },
  { label: 'Keyword Density',    pct: 43, status: 'fail'  as const },
  { label: 'Section Structure',  pct: 90, status: 'pass'  as const },
]

const ACTIVE_SECTIONS = [
  { title: 'ATS COMPATIBILITY', pct: 88, color: '#7c3aed' },
  { title: 'ACTIVE VOICE',      pct: 61, color: '#f59e0b' },
  { title: 'KEYWORD DENSITY',   pct: 43, color: '#ef4444' },
]

function ScoreArc({ score }: { score: number }) {
  // Half-circle arc: r=36, circumference of half = π*r ≈ 113
  const r = 36
  const circ = Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <svg width="88" height="52" viewBox="0 0 88 52" className="overflow-visible">
      {/* Track */}
      <path
        d="M 8 44 A 36 36 0 0 1 80 44"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        className="text-gray-100 dark:text-gray-800"
      />
      {/* Fill */}
      <path
        d="M 8 44 A 36 36 0 0 1 80 44"
        fill="none"
        stroke="#7c3aed"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
      />
      {/* Dot at tip */}
      <circle cx="80" cy="44" r="3.5" fill="#7c3aed" />
    </svg>
  )
}

function HeroMockup() {
  const [score, setScore]         = useState(0)
  const [activeIdx, setActiveIdx] = useState(0)
  const [barPct, setBarPct]       = useState(0)
  const [tick, setTick]           = useState(0)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (reduced.current) { setScore(78); return }
    const t = setTimeout(() => setScore(78), 200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (reduced.current) return
    const t = setInterval(() => {
      setActiveIdx(i => (i + 1) % ACTIVE_SECTIONS.length)
      setTick(n => n + 1)
    }, 3000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (reduced.current) { setBarPct(ACTIVE_SECTIONS[activeIdx].pct); return }
    setBarPct(0)
    const t = setTimeout(() => setBarPct(ACTIVE_SECTIONS[activeIdx].pct), 80)
    return () => clearTimeout(t)
  }, [activeIdx, tick])

  const section = ACTIVE_SECTIONS[activeIdx]

  return (
    /* Fixed size — nothing inside should ever change the outer dimensions */
    <div className="rounded-2xl overflow-hidden shadow-2xl shadow-violet-200/40 dark:shadow-violet-900/30 border border-gray-100 dark:border-[var(--border)] bg-white dark:bg-[var(--bg-surface)]"
      style={{ width: 580, height: 340 }}>

      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
        <div className="flex-1 mx-3">
          <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded-full w-40 mx-auto" />
        </div>
      </div>

      {/* App header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <Sparkles size={13} className="text-violet-600 dark:text-violet-400" />
        <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 tracking-wide">DevResume</span>
      </div>

      {/* Body — fixed height, overflow hidden, never grows */}
      <div className="flex overflow-hidden" style={{ height: 'calc(340px - 37px - 33px)' }}>

        {/* ── Left panel ── */}
        <div style={{ width: 152 }} className="shrink-0 border-r border-gray-100 dark:border-gray-800 px-4 py-3 flex flex-col overflow-hidden">
          <p className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 mb-2 tracking-widest uppercase">Resume Score</p>

          <div className="flex justify-center mb-0.5">
            <ScoreArc score={score} />
          </div>
          <p className="text-center text-lg font-bold text-violet-600 dark:text-violet-400 font-mono-data" style={{ marginTop: -4 }}>
            {score}/100
          </p>
          <p className="text-center text-[9px] text-gray-400 dark:text-gray-500 mb-3">24 Issues</p>

          <div className="space-y-1.5 overflow-hidden">
            {SCORE_SECTIONS.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span className={`text-[10px] leading-none ${
                  s.status === 'pass' ? 'text-emerald-500' :
                  s.status === 'warn' ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {s.status === 'pass' ? '✓' : s.status === 'warn' ? '○' : '✕'}
                </span>
                <span className="text-[9px] text-gray-600 dark:text-gray-400 truncate">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="flex-1 bg-gray-50/60 dark:bg-gray-900/30 px-4 py-3 flex flex-col gap-2.5 overflow-hidden">

          {/* Section header — fixed height, text crossfades in place */}
          <div className="flex items-center justify-between h-5 shrink-0">
            <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
              <span className="w-1 h-3.5 rounded-full shrink-0 transition-colors duration-500"
                style={{ backgroundColor: section.color }} />
              {/* Overlay technique: all labels stacked, only active one visible */}
              <div className="relative h-4 flex-1 overflow-hidden">
                {ACTIVE_SECTIONS.map((s, i) => (
                  <span
                    key={s.title}
                    className="absolute inset-0 text-[10px] font-bold tracking-widest whitespace-nowrap transition-opacity duration-400"
                    style={{
                      color: s.color,
                      opacity: i === activeIdx ? 1 : 0,
                    }}
                  >
                    {s.title}
                  </span>
                ))}
              </div>
            </div>
            {/* Fixed-width badge so layout never shifts */}
            <div className="w-9 text-center shrink-0">
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-medium">
                {section.pct}%
              </span>
            </div>
          </div>

          {/* Fixed skeleton lines above bar */}
          <div className="space-y-1.5 shrink-0">
            {[82, 94, 68, 88].map((w, i) => (
              <div key={i} className="h-2 rounded-full bg-gray-200 dark:bg-gray-700" style={{ width: `${w}%` }} />
            ))}
          </div>

          {/* ── Progress bar card — fixed height ── */}
          <div className="bg-white dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700 px-3 pt-2 pb-2.5 shrink-0">
            {/* Dot marker that rides with the bar */}
            <div className="relative h-4 mb-1 overflow-hidden">
              <div
                className="absolute top-0 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 shadow-md -translate-x-1/2"
                style={{
                  backgroundColor: section.color,
                  left: `${barPct}%`,
                  transition: barPct === 0 ? 'none' : 'left 900ms cubic-bezier(0.4,0,0.2,1), background-color 500ms',
                }}
              />
            </div>
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${barPct}%`,
                  backgroundColor: section.color,
                  transition: barPct === 0 ? 'none' : 'width 900ms cubic-bezier(0.4,0,0.2,1), background-color 500ms',
                }}
              />
            </div>
          </div>

          {/* Fixed skeleton lines below bar */}
          <div className="space-y-1.5 shrink-0">
            {[90, 62, 76, 55, 80].map((w, i) => (
              <div key={i} className="h-2 rounded-full bg-gray-200 dark:bg-gray-700" style={{ width: `${w}%` }} />
            ))}
          </div>
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

  const { ref: statsRef, isVisible: statsVisible } = useIntersectionObserver()
  const { ref: pipelineRef, isVisible: pipelineVisible } = useIntersectionObserver()
  const { ref: capabilitiesRef, isVisible: capabilitiesVisible } = useIntersectionObserver()
  const { ref: companyRef, isVisible: companyVisible } = useIntersectionObserver()

  const [isIdle, setIsIdle] = useState(false)
  const lastInteractionRef = useRef(Date.now())

  useEffect(() => {
    const resetIdle = () => {
      lastInteractionRef.current = Date.now()
      setIsIdle(false)
    }
    window.addEventListener('pointermove', resetIdle)
    window.addEventListener('keydown', resetIdle)
    window.addEventListener('scroll', resetIdle, { passive: true })

    const interval = setInterval(() => {
      if (Date.now() - lastInteractionRef.current >= 3000) {
        setIsIdle(true)
      }
    }, 500)

    return () => {
      window.removeEventListener('pointermove', resetIdle)
      window.removeEventListener('keydown', resetIdle)
      window.removeEventListener('scroll', resetIdle)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="landing-bg min-h-screen">

      {/* ── Hero ── */}
      <section id="hero" className="relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center scroll-mt-14">
        {/* Floating particles */}
        {[
          { size: 8,  top: '10%', left: '5%',   duration: '3s',   delay: '0s'   },
          { size: 12, top: '20%', left: '85%',  duration: '4.5s', delay: '0.5s' },
          { size: 6,  top: '60%', left: '2%',   duration: '3.5s', delay: '1s'   },
          { size: 10, top: '75%', left: '90%',  duration: '5s',   delay: '0.3s' },
          { size: 7,  top: '40%', left: '92%',  duration: '4s',   delay: '1.2s' },
          { size: 9,  top: '85%', left: '15%',  duration: '3.8s', delay: '0.7s' },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-violet-400/20 dark:bg-violet-500/20 animate-float pointer-events-none"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              top: p.top,
              left: p.left,
              ['--float-duration' as string]: p.duration,
              animationDelay: p.delay,
            } as React.CSSProperties}
          />
        ))}
        <div>
          <div className="animate-slide-up" style={{ animationDelay: '0ms' }}>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/70 border border-violet-200 dark:border-violet-800 rounded-full px-3 py-1 mb-5">
              <Sparkles size={11} />
              AI Resume Intelligence Platform
            </div>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              Your Resume,<br />
              Analyzed Like an{' '}
              <span className="pb-1 bg-gradient-to-r from-violet-600 via-purple-500 to-blue-500 bg-clip-text text-transparent">Engineer</span>
            </h1>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-lg">
              Not a spell checker. An AI Resume Intelligence Platform built for technical roles.
              We parse your syntax, evaluate your architecture, and benchmark your impact against FAANG standards.
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex flex-wrap gap-3 mb-6 items-center">
              <div className="relative inline-flex">
                {isIdle && (
                  <div className="absolute inset-0 rounded-xl border-2 border-violet-400 animate-pulse-ring pointer-events-none" />
                )}
                <Link
                  to="/analyze"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-colors shadow-md shadow-violet-200 dark:shadow-violet-900/40"
                >
                  <Upload size={15} />
                  Upload Your Resume — It's Free
                </Link>
              </div>
              <CTALiveFeed />
            </div>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '350ms' }}>
            <div className="flex items-center gap-4 text-[11px] text-gray-400 dark:text-gray-500 mb-6">
              {['SOC2 Type II', 'No Data Storage', 'End-to-End Encryption'].map((t) => (
                <span key={t} className="flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-400" />
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div ref={statsRef}><StatsStrip totalReviews={totalReviews} isVisible={statsVisible} /></div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <div
            className="animate-slide-up transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-200/40 dark:hover:shadow-violet-900/30"
            style={{ animationDelay: '200ms' }}
          >
            <HeroMockup />
          </div>
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
          <div ref={pipelineRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pipelineSteps.map(({ step, title, desc, icon: Icon, color }, index) => (
              <div
                key={step}
                className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-md transition-all hover:border-l-[3px] hover:border-l-violet-500 dark:hover:border-l-violet-400 ${pipelineVisible ? 'animate-slide-up' : 'opacity-0'}`}
                style={pipelineVisible ? { animationDelay: `${index * 100}ms` } : {}}
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
        <div ref={capabilitiesRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto">
          <div className={capabilitiesVisible ? 'animate-fade-in' : 'opacity-0'} style={capabilitiesVisible ? { animationDelay: '0ms' } : {}}>
            <CapabilityCard {...capabilities[0]} />
          </div>
          <div className={`lg:row-span-2 ${capabilitiesVisible ? 'animate-fade-in' : 'opacity-0'}`} style={capabilitiesVisible ? { animationDelay: '80ms' } : {}}>
            <CapabilityCard {...capabilities[1]} />
          </div>
          <div className={capabilitiesVisible ? 'animate-fade-in' : 'opacity-0'} style={capabilitiesVisible ? { animationDelay: '160ms' } : {}}>
            <CapabilityCard {...capabilities[2]} />
          </div>
          <div className={capabilitiesVisible ? 'animate-fade-in' : 'opacity-0'} style={capabilitiesVisible ? { animationDelay: '240ms' } : {}}>
            <CapabilityCard {...capabilities[3]} />
          </div>
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
          <div ref={companyRef} className="flex justify-center gap-8 flex-wrap">
            {companyScores.map(({ name, match }, index) => (
              <div
                key={name}
                className={`flex flex-col items-center gap-2 ${companyVisible ? 'animate-slide-up' : 'opacity-0'}`}
                style={companyVisible ? { animationDelay: `${index * 100}ms` } : {}}
              >
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
            <div className="flex flex-wrap gap-3 justify-center items-center">
              <Link
                to="/analyze"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-600 text-sm font-semibold rounded-xl hover:bg-violet-50 transition-colors"
              >
                <Upload size={15} />
                Analyze My Resume
              </Link>
              <CTALiveFeed />
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
      <div className="h-px w-full animate-gradient-sweep" />
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
