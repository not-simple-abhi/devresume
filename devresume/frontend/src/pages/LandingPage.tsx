import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  Upload, Code2, Tag, Zap, RefreshCw, ScanText, Brain,
  Building2, Sparkles, ArrowRight, CheckCircle2, FileCheck2,
  Shield, Cpu, TrendingUp, Star,
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
    { icon: FileCheck2,   value: totalReviews, suffix: '+', label: 'Resumes Reviewed',            color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/60 border-violet-200 dark:border-violet-800' },
    { icon: Sparkles,     value: 6,            suffix: '',  label: 'AI Agents in Parallel',        color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800' },
    { icon: CheckCircle2, value: 100,          suffix: '%', label: 'Free to Try',                  color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800' },
  ]
  return (
    <div className="grid grid-cols-3 gap-3 mt-10 mb-2">
      {stats.map(({ icon: Icon, value, suffix, label, color, bg }) => (
        <div key={label} className={`relative flex flex-col items-center gap-1.5 rounded-2xl border px-3 py-4 card-hover-premium cursor-default overflow-hidden ${bg}`}>
          <Icon size={17} className={color} />
          <p className={`text-xl sm:text-2xl ${color}`}>
            <AnimatedCount target={value} suffix={suffix} isVisible={isVisible} />
          </p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center font-medium leading-tight">{label}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Hero mockup — full browser window with live agent feed ───────────────────
const SCORE_SECTIONS = [
  { label: 'ATS Compatibility',  pct: 88, status: 'pass' as const },
  { label: 'Quantifying Impact', pct: 74, status: 'pass' as const },
  { label: 'Active Voice',       pct: 61, status: 'warn' as const },
  { label: 'Keyword Density',    pct: 43, status: 'fail' as const },
  { label: 'Section Structure',  pct: 90, status: 'pass' as const },
]

const ACTIVE_SECTIONS = [
  { title: 'ATS COMPATIBILITY', pct: 88, color: '#7c3aed' },
  { title: 'ACTIVE VOICE',      pct: 61, color: '#f59e0b' },
  { title: 'KEYWORD DENSITY',   pct: 43, color: '#ef4444' },
]

const AGENT_STEPS = [
  { label: 'Parsing structure…',    icon: '⬡', color: '#7c3aed' },
  { label: 'Running ATS scan…',     icon: '⬡', color: '#6366f1' },
  { label: 'Scoring impact…',       icon: '⬡', color: '#7c3aed' },
  { label: 'Analyzing keywords…',   icon: '⬡', color: '#8b5cf6' },
  { label: 'Evaluating seniority…', icon: '⬡', color: '#a855f7' },
]

function ScoreArc({ score }: { score: number }) {
  const r = 34
  const circ = Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <svg width="84" height="50" viewBox="0 0 84 50" className="overflow-visible">
      <path d="M 8 42 A 34 34 0 0 1 76 42" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-gray-100 dark:text-gray-800" />
      <path d="M 8 42 A 34 34 0 0 1 76 42" fill="none" stroke="url(#arcGrad)" strokeWidth="6" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)' }} />
      <defs>
        <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <circle cx="76" cy="42" r="3" fill="#a855f7" />
    </svg>
  )
}

function HeroMockup() {
  const [score, setScore]         = useState(0)
  const [activeIdx, setActiveIdx] = useState(0)
  const [barPct, setBarPct]       = useState(0)
  const [tick, setTick]           = useState(0)
  const [agentIdx, setAgentIdx]   = useState(0)
  const [agentVisible, setAgentVisible] = useState(true)
  const reduced = useRef(false)

  useEffect(() => { reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches }, [])
  useEffect(() => {
    if (reduced.current) { setScore(78); return }
    const t = setTimeout(() => setScore(78), 300)
    return () => clearTimeout(t)
  }, [])
  useEffect(() => {
    if (reduced.current) return
    const t = setInterval(() => { setActiveIdx(i => (i + 1) % ACTIVE_SECTIONS.length); setTick(n => n + 1) }, 3000)
    return () => clearInterval(t)
  }, [])
  useEffect(() => {
    if (reduced.current) { setBarPct(ACTIVE_SECTIONS[activeIdx].pct); return }
    setBarPct(0)
    const t = setTimeout(() => setBarPct(ACTIVE_SECTIONS[activeIdx].pct), 100)
    return () => clearTimeout(t)
  }, [activeIdx, tick])
  useEffect(() => {
    if (reduced.current) return
    const t = setInterval(() => {
      setAgentVisible(false)
      setTimeout(() => { setAgentIdx(i => (i + 1) % AGENT_STEPS.length); setAgentVisible(true) }, 200)
    }, 1600)
    return () => clearInterval(t)
  }, [])

  const section = ACTIVE_SECTIONS[activeIdx]
  const agent = AGENT_STEPS[agentIdx]

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200/80 dark:border-[var(--border)] bg-white dark:bg-[var(--bg-surface)]"
      style={{ width: 580, height: 350, boxShadow: '0 32px 80px rgba(109,40,217,0.18), 0 8px 24px rgba(0,0,0,0.08)' }}>

      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/60 shrink-0">
        <span className="w-3 h-3 rounded-full bg-red-400/80 hover:bg-red-400 transition-colors" />
        <span className="w-3 h-3 rounded-full bg-amber-400/80 hover:bg-amber-400 transition-colors" />
        <span className="w-3 h-3 rounded-full bg-emerald-400/80 hover:bg-emerald-400 transition-colors" />
        <div className="flex-1 mx-4 flex items-center justify-center">
          <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-0.5 w-44">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">devresume.app/analysis</span>
          </div>
        </div>
      </div>

      {/* App sub-header */}
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-transparent shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
            <Sparkles size={10} className="text-white" />
          </div>
          <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">DevResume</span>
        </div>
        {/* Live agent ticker */}
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full animate-live-dot" />
          <span
            className="text-[10px] text-gray-500 dark:text-gray-400 transition-opacity duration-200"
            style={{ opacity: agentVisible ? 1 : 0, color: agent.color }}
          >
            {agent.label}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex overflow-hidden" style={{ height: 'calc(350px - 38px - 30px)' }}>

        {/* Left panel */}
        <div style={{ width: 148 }} className="shrink-0 border-r border-gray-100 dark:border-gray-800 px-4 py-3 flex flex-col overflow-hidden bg-white dark:bg-transparent">
          <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 mb-2 tracking-widest uppercase">Resume Score</p>
          <div className="flex justify-center mb-0.5"><ScoreArc score={score} /></div>
          <p className="text-center text-xl font-bold font-mono-data gradient-text-violet" style={{ marginTop: -2 }}>{score}/100</p>
          <p className="text-center text-[9px] text-gray-400 mb-3">24 Issues Found</p>

          <div className="space-y-1.5 overflow-hidden">
            {SCORE_SECTIONS.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span className={`text-[10px] leading-none font-bold ${s.status === 'pass' ? 'text-emerald-500' : s.status === 'warn' ? 'text-amber-500' : 'text-red-500'}`}>
                  {s.status === 'pass' ? '✓' : s.status === 'warn' ? '⚬' : '✕'}
                </span>
                <span className="text-[9px] text-gray-600 dark:text-gray-400 truncate">{s.label}</span>
                <span className={`ml-auto text-[8px] font-mono font-bold shrink-0 ${s.status === 'pass' ? 'text-emerald-500' : s.status === 'warn' ? 'text-amber-500' : 'text-red-400'}`}>{s.pct}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 bg-gray-50/80 dark:bg-gray-900/20 px-4 py-3 flex flex-col gap-2 overflow-hidden">

          {/* Section header */}
          <div className="flex items-center justify-between h-5 shrink-0">
            <div className="flex items-center gap-1.5 flex-1 overflow-hidden">
              <span className="w-1 h-4 rounded-full shrink-0 transition-colors duration-500" style={{ backgroundColor: section.color }} />
              <div className="relative h-4 flex-1 overflow-hidden">
                {ACTIVE_SECTIONS.map((s, i) => (
                  <span key={s.title} className="absolute inset-0 text-[10px] font-bold tracking-widest whitespace-nowrap transition-opacity duration-400"
                    style={{ color: s.color, opacity: i === activeIdx ? 1 : 0 }}>
                    {s.title}
                  </span>
                ))}
              </div>
            </div>
            <div className="w-8 text-right shrink-0">
              <span className="text-[9px] font-bold font-mono" style={{ color: section.color }}>{section.pct}%</span>
            </div>
          </div>

          {/* Skeleton lines */}
          <div className="space-y-1.5 shrink-0">
            {[78, 92, 65, 85].map((w, i) => (
              <div key={i} className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700/80" style={{ width: `${w}%` }} />
            ))}
          </div>

          {/* Progress bar card */}
          <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/60 px-3 pt-2.5 pb-2 shrink-0">
            <div className="relative h-4 mb-1.5 overflow-hidden">
              <div className="absolute top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800 shadow-md -translate-x-1/2"
                style={{
                  backgroundColor: section.color,
                  left: `${barPct}%`,
                  transition: barPct === 0 ? 'none' : 'left 900ms cubic-bezier(0.16,1,0.3,1), background-color 500ms',
                  boxShadow: `0 2px 8px ${section.color}80`,
                }} />
            </div>
            <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full rounded-full relative overflow-hidden"
                style={{
                  width: `${barPct}%`,
                  backgroundColor: section.color,
                  transition: barPct === 0 ? 'none' : 'width 900ms cubic-bezier(0.16,1,0.3,1), background-color 500ms',
                }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
              </div>
            </div>
          </div>

          {/* More skeleton lines */}
          <div className="space-y-1.5 shrink-0">
            {[88, 60, 73, 52, 80].map((w, i) => (
              <div key={i} className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700/80" style={{ width: `${w}%` }} />
            ))}
          </div>

          {/* Mini insight badge */}
          <div className="mt-auto shrink-0 flex items-center gap-2 bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-800/60 rounded-lg px-2.5 py-1.5">
            <Sparkles size={10} className="text-violet-500 shrink-0" />
            <span className="text-[9px] text-violet-700 dark:text-violet-300 leading-relaxed truncate">
              Add metrics to quantify your system design impact
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Pipeline steps ───────────────────────────────────────────────────────────
const pipelineSteps = [
  { step: '01', label: 'PARSE',    title: 'Structural Extraction', desc: 'ATS-grade parsing that maps your experience, skills, and metrics with surgical precision.', icon: Code2,     color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950', border: 'border-violet-100 dark:border-violet-900' },
  { step: '02', label: 'MAP',      title: 'Skill Taxonomy',        desc: "Your technologies mapped against a library of 30,000+ developer tools and frameworks.", icon: Tag,       color: 'text-blue-600 dark:text-blue-400',   bg: 'bg-blue-50 dark:bg-blue-950',   border: 'border-blue-100 dark:border-blue-900' },
  { step: '03', label: 'EVALUATE', title: 'Contextual Impact',     desc: 'LLMs evaluate bullet points for technical depth, architectural thinking, and business impact.', icon: Zap,       color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950', border: 'border-emerald-100 dark:border-emerald-900' },
  { step: '04', label: 'OPTIMIZE', title: 'Rewrite Suggestions',   desc: 'Technically sound, metric-focused rewrites that sound like an engineer, not a marketer.', icon: RefreshCw, color: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-50 dark:bg-amber-950',  border: 'border-amber-100 dark:border-amber-900' },
]

// ─── Capabilities ─────────────────────────────────────────────────────────────
const capabilities = [
  { icon: ScanText,   title: 'Deep Syntax Analysis',   desc: "We don't just read words — we understand context. See exactly which phrases are strong action verbs and which are passive filler.", cta: 'Explore Feature', featured: false },
  { icon: Brain,      title: 'The Seniority Scanner',  desc: 'Our models detect language patterns associated with different seniority levels, helping you project architectural leadership.', featured: true, badge: 'AI LAYER' },
  { icon: Cpu,        title: 'Live ATS Parsing',       desc: 'See exactly how Workday or Greenhouse will extract your data before you hit submit.', featured: false },
  { icon: TrendingUp, title: 'Job Description Diff',   desc: 'Paste a JD and generate a missing keyword matrix with gap analysis instantly.', featured: false },
]

const companyScores = [
  { name: 'Google',    match: 34, color: '#4285F4' },
  { name: 'Amazon',    match: 41, color: '#FF9900' },
  { name: 'Stripe',    match: 72, color: '#635BFF' },
  { name: 'Vercel',    match: 68, color: '#000000' },
]

// ─── Capability card ──────────────────────────────────────────────────────────
function CapabilityCard({ icon: Icon, title, desc, cta, featured, badge }: (typeof capabilities)[number]) {
  if (featured) {
    return (
      <div className="row-span-2 relative rounded-2xl p-6 flex flex-col text-white overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #4f46e5 100%)' }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 -translate-y-12 translate-x-12"
          style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-15 translate-y-8 -translate-x-8"
          style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />
        {badge && (
          <span className="self-end text-[9px] px-2.5 py-1 bg-white/15 backdrop-blur text-white rounded-full mb-4 font-bold tracking-wider relative z-10">⬡ {badge}</span>
        )}
        <div className="relative z-10 flex-1 flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center mb-4 border border-white/20">
              <Icon size={19} className="text-white" />
            </div>
            <h3 className="font-bold text-base mb-2 leading-snug">{title}</h3>
            <p className="text-sm text-white/75 leading-relaxed">{desc}</p>
          </div>
          <div className="mt-6 space-y-2">
            {['Junior', 'Mid-level', 'Senior'].map((l, i) => (
              <div key={l} className="flex items-center gap-2.5">
                <span className="text-[9px] text-white/60 w-12 shrink-0 font-medium">{l}</span>
                <div className="flex-1 h-1.5 bg-white/15 rounded-full overflow-hidden">
                  <div className="h-full bg-white/70 rounded-full" style={{ width: `${28 + i * 24}%` }} />
                </div>
                <span className="text-[9px] text-white/50 w-6 text-right">{28 + i * 24}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="bg-white dark:bg-[var(--bg-surface)] rounded-2xl border border-gray-100 dark:border-[var(--border)] p-5 card-hover-premium group">
      <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 flex items-center justify-center mb-3 border border-violet-100 dark:border-violet-900 group-hover:scale-110 transition-transform duration-200">
        <Icon size={17} className="text-violet-600 dark:text-violet-400" />
      </div>
      <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-1.5">{title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
      {cta && (
        <button className="mt-3 text-xs text-violet-600 dark:text-violet-400 font-semibold hover:text-violet-700 dark:hover:text-violet-300 flex items-center gap-1 group/btn">
          {cta} <ArrowRight size={11} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  )
}

// ─── Trusted by badge ─────────────────────────────────────────────────────────
function TrustBadge({ icon: Icon, text }: { icon: React.ComponentType<{size?: number; className?: string}>; text: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500">
      <Icon size={11} className="text-emerald-400 shrink-0" />
      {text}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { data: stats } = useStats()
  const totalReviews = stats?.totalReviews ?? 0

  const { ref: statsRef,        isVisible: statsVisible }        = useIntersectionObserver()
  const { ref: pipelineRef,     isVisible: pipelineVisible }     = useIntersectionObserver()
  const { ref: capabilitiesRef, isVisible: capabilitiesVisible } = useIntersectionObserver()
  const { ref: companyRef,      isVisible: companyVisible }      = useIntersectionObserver()

  const [isIdle, setIsIdle] = useState(false)
  const lastInteractionRef = useRef(Date.now())

  useEffect(() => {
    const resetIdle = () => { lastInteractionRef.current = Date.now(); setIsIdle(false) }
    window.addEventListener('pointermove', resetIdle)
    window.addEventListener('keydown', resetIdle)
    window.addEventListener('scroll', resetIdle, { passive: true })
    const interval = setInterval(() => {
      if (Date.now() - lastInteractionRef.current >= 3000) setIsIdle(true)
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

      {/* ══ Hero ══════════════════════════════════════════════════════════════ */}
      <section id="hero" className="relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-16 items-center scroll-mt-14">

        {/* Floating particles */}
        {[
          { size: 6,  top: '8%',  left: '4%',   dur: '3.2s', delay: '0s',   opacity: 0.5 },
          { size: 10, top: '18%', left: '88%',  dur: '4.8s', delay: '0.6s', opacity: 0.4 },
          { size: 5,  top: '55%', left: '1%',   dur: '3.8s', delay: '1.1s', opacity: 0.35 },
          { size: 8,  top: '72%', left: '92%',  dur: '5.2s', delay: '0.4s', opacity: 0.4 },
          { size: 6,  top: '38%', left: '94%',  dur: '4.1s', delay: '1.4s', opacity: 0.3 },
          { size: 7,  top: '82%', left: '12%',  dur: '3.6s', delay: '0.8s', opacity: 0.45 },
          { size: 4,  top: '25%', left: '30%',  dur: '6s',   delay: '2s',   opacity: 0.2 },
          { size: 9,  top: '65%', left: '45%',  dur: '4.5s', delay: '0.3s', opacity: 0.15 },
        ].map((p, i) => (
          <div key={i} className="absolute rounded-full bg-violet-400 dark:bg-violet-500 animate-float pointer-events-none"
            style={{ width: p.size, height: p.size, top: p.top, left: p.left, opacity: p.opacity, ['--float-duration' as string]: p.dur, animationDelay: p.delay } as React.CSSProperties} />
        ))}

        {/* ── Left column ── */}
        <div>
          {/* Eyebrow badge */}
          <div className="animate-slide-up" style={{ animationDelay: '0ms' }}>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-violet-700 dark:text-violet-300 bg-violet-100/80 dark:bg-violet-950/80 border border-violet-200 dark:border-violet-800 rounded-full px-3.5 py-1.5 mb-6 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-glow-pulse" />
              AI Resume Intelligence Platform
              <span className="text-violet-400 dark:text-violet-500">·</span>
              <span className="text-violet-500 dark:text-violet-400 font-bold">New</span>
            </div>
          </div>

          {/* Headline */}
          <div className="animate-slide-up" style={{ animationDelay: '80ms' }}>
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight mb-5">
              Your Resume,<br />
              <span className="relative">
                Analyzed Like{' '}
                <span className="gradient-text-animated pb-1">an Engineer</span>
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className="animate-slide-up" style={{ animationDelay: '160ms' }}>
            <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-md">
              Not a spell checker. A full-stack AI platform that parses your syntax, evaluates your architecture, and benchmarks your impact against FAANG engineering bar.
            </p>
          </div>

          {/* CTA row */}
          <div className="animate-slide-up" style={{ animationDelay: '240ms' }}>
            <div className="flex flex-wrap gap-3 mb-6 items-center">
              <div className="relative inline-flex">
                {isIdle && <div className="absolute inset-0 rounded-xl border-2 border-violet-400 animate-pulse-ring pointer-events-none" />}
                <Link to="/analyze"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl transition-all shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 8px 24px rgba(109,40,217,0.35)' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = '')}
                >
                  <Upload size={15} />
                  Upload Your Resume — It's Free
                </Link>
              </div>
              <CTALiveFeed />
            </div>
          </div>

          {/* Trust row */}
          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <TrustBadge icon={Shield}       text="SOC2 Type II" />
              <TrustBadge icon={CheckCircle2} text="No Data Storage" />
              <TrustBadge icon={CheckCircle2} text="End-to-End Encrypted" />
            </div>
          </div>

          <div ref={statsRef}><StatsStrip totalReviews={totalReviews} isVisible={statsVisible} /></div>
        </div>

        {/* ── Right column: mockup ── */}
        <div className="flex justify-center lg:justify-end">
          <div className="animate-slide-in-right transition-all duration-300 hover:-translate-y-1" style={{ animationDelay: '100ms' }}>
            <HeroMockup />
          </div>
        </div>
      </section>

      {/* ══ Intelligence Pipeline ══════════════════════════════════════════════ */}
      <section id="pipeline" className="relative border-t border-violet-100/60 dark:border-violet-900/40 py-24 scroll-mt-14 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(248,247,255,0.9) 100%)' }}>
        <div className="absolute inset-0 dark:block hidden" style={{ background: 'linear-gradient(180deg, rgba(17,15,28,0.6) 0%, rgba(7,6,14,0.9) 100%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800 rounded-full px-3 py-1 mb-4">
              <Cpu size={11} />
              How It Works
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
              The Intelligence Pipeline
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Deterministic parsing combined with six specialized LLM agents for a comprehensive technical review.
            </p>
          </div>

          {/* Connector line (desktop) */}
          <div className="hidden lg:block relative mb-0">
            <div className="absolute top-[28px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-violet-200 via-violet-400 to-violet-200 dark:from-violet-900 dark:via-violet-600 dark:to-violet-900 z-0" />
          </div>

          <div ref={pipelineRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
            {pipelineSteps.map(({ step, label, title, desc, icon: Icon, color, bg, border }, index) => (
              <div key={step}
                className={`relative bg-white dark:bg-[var(--bg-surface)] rounded-2xl border ${border} p-5 card-hover-premium group ${pipelineVisible ? 'animate-reveal-up' : 'opacity-0'}`}
                style={pipelineVisible ? { animationDelay: `${index * 100}ms` } : {}}>
                {/* Step number bubble */}
                <div className={`w-14 h-7 rounded-full ${bg} ${border} border flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                  <span className={`text-[9px] font-black tracking-widest ${color}`}>{step} / {label}</span>
                </div>
                {/* Left accent on hover */}
                <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                  <Icon size={16} className={color} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1.5">{title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Core Capabilities ══════════════════════════════════════════════════ */}
      <section id="capabilities" className="max-w-7xl mx-auto px-4 sm:px-6 py-24 scroll-mt-14">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800 rounded-full px-3 py-1 mb-4">
            <Star size={11} />
            Capabilities
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Core Capabilities</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 max-w-sm mx-auto">
            Six AI agents running in parallel, each specialized in a different dimension of resume quality.
          </p>
        </div>
        <div ref={capabilitiesRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto">
          <div className={capabilitiesVisible ? 'animate-fade-in stagger-1' : 'opacity-0'}><CapabilityCard {...capabilities[0]} /></div>
          <div className={`lg:row-span-2 ${capabilitiesVisible ? 'animate-fade-in stagger-2' : 'opacity-0'}`}><CapabilityCard {...capabilities[1]} /></div>
          <div className={capabilitiesVisible ? 'animate-fade-in stagger-3' : 'opacity-0'}><CapabilityCard {...capabilities[2]} /></div>
          <div className={capabilitiesVisible ? 'animate-fade-in stagger-4' : 'opacity-0'}><CapabilityCard {...capabilities[3]} /></div>
        </div>
      </section>

      {/* ══ Company Readiness ══════════════════════════════════════════════════ */}
      <section className="border-t border-violet-100/50 dark:border-violet-900/40 py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.05), transparent)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800 rounded-full px-3 py-1 mb-4">
              <Building2 size={11} />
              Company Fit
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Company Readiness Scores</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              See how your resume stacks up against successful engineering candidates at top tech companies.
            </p>
          </div>
          <div ref={companyRef} className="flex justify-center gap-6 flex-wrap">
            {companyScores.map(({ name, match, color }, index) => (
              <div key={name}
                className={`flex flex-col items-center gap-2.5 ${companyVisible ? 'animate-reveal-up' : 'opacity-0'}`}
                style={companyVisible ? { animationDelay: `${index * 80}ms` } : {}}>
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md flex items-center justify-center card-hover-premium">
                  <Building2 size={24} style={{ color }} />
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{name}</span>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-14 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000"
                      style={{ width: companyVisible ? `${match}%` : '0%', backgroundColor: match >= 60 ? '#10b981' : match >= 40 ? '#f59e0b' : '#ef4444' }} />
                  </div>
                  <span className="text-xs font-bold" style={{ color: match >= 60 ? '#10b981' : match >= 40 ? '#f59e0b' : '#ef4444' }}>{match}% match</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/company" className="inline-flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 font-semibold hover:text-violet-700 dark:hover:text-violet-300 group">
              Try company fit analysis <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ Final CTA ══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="relative rounded-3xl p-10 sm:p-16 text-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #5b21b6 0%, #4f46e5 50%, #6d28d9 100%)' }}>
          {/* Background orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-30 -translate-y-1/2"
            style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full blur-3xl opacity-25 translate-y-1/2"
            style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-3 py-1 text-xs text-white/80 font-medium mb-6">
              <Sparkles size={11} className="text-yellow-300" />
              Free to try — no credit card required
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">Ready to get the job?</h2>
            <p className="text-white/70 text-sm mb-10 max-w-md mx-auto leading-relaxed">
              Join thousands of engineers who've already leveled up their resume with DevResume's AI analysis.
            </p>
            <div className="flex flex-wrap gap-3 justify-center items-center">
              <Link to="/analyze"
                className="inline-flex items-center gap-2 px-7 py-3 bg-white text-violet-700 text-sm font-bold rounded-xl hover:bg-violet-50 transition-all shadow-xl hover:-translate-y-0.5">
                <Upload size={15} />
                Analyze My Resume
              </Link>
              <CTALiveFeed />
              <Link to="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/25 text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-all backdrop-blur">
                Sign up free <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Footer ══════════════════════════════════════════════════════════════ */}
      <div className="h-px w-full animate-gradient-sweep" />
      <footer className="border-t border-gray-100 dark:border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
              <Sparkles size={11} className="text-white" />
            </div>
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">DevResume</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} DevResume. Engineered for Devs.
          </p>
          <div className="flex items-center gap-5 text-xs text-gray-400 dark:text-gray-500">
            <a href="#" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">GitHub</a>
            <a href="#" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
