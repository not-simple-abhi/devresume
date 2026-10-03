import { useState, useRef } from 'react'

export interface ScoreChartDataPoint {
  date: string
  resumeName: string
  overall: number
  ats: number
}

interface ScoreChartProps {
  data: ScoreChartDataPoint[]
}

export default function ScoreChart({ data }: ScoreChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const n = data.length
  const W = 540, H = 160, padL = 40, padR = 10, padT = 16, padB = 8
  const innerW = W - padL - padR
  const innerH = H - padT - padB

  const xAt = (i: number) => padL + (n > 1 ? (i / (n - 1)) * innerW : innerW / 2)
  const yAt = (v: number) => padT + ((100 - v) / 100) * innerH

  const overallPts = data.map((d, i) => `${xAt(i)},${yAt(d.overall)}`).join(' ')
  const atsPts     = data.map((d, i) => `${xAt(i)},${yAt(d.ats)}`).join(' ')

  // Area paths
  const overallArea = `M ${xAt(0)},${yAt(data[0]?.overall ?? 0)} ${data.map((d, i) => `L ${xAt(i)},${yAt(d.overall)}`).join(' ')} L ${xAt(n - 1)},${padT + innerH} L ${xAt(0)},${padT + innerH} Z`
  const atsArea     = `M ${xAt(0)},${yAt(data[0]?.ats ?? 0)} ${data.map((d, i) => `L ${xAt(i)},${yAt(d.ats)}`).join(' ')} L ${xAt(n - 1)},${padT + innerH} L ${xAt(0)},${padT + innerH} Z`

  const yTicks = [100, 75, 50, 25, 0]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Score History</p>
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-sm" style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7)', opacity: 0.8 }} />
            Overall
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-sm" style={{ background: 'linear-gradient(90deg, #6366f1, #818cf8)', opacity: 0.8 }} />
            ATS
          </span>
        </div>
      </div>

      <div className="relative">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H + padB}`} width="100%" className="overflow-visible">
          <defs>
            <linearGradient id="overallLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <linearGradient id="atsLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
            <linearGradient id="overallFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="atsFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Y grid lines + labels */}
          {yTicks.map(v => (
            <g key={v}>
              <line x1={padL} y1={yAt(v)} x2={W - padR} y2={yAt(v)}
                stroke="currentColor" strokeOpacity={v === 0 || v === 100 ? 0.12 : 0.06} strokeWidth="1" strokeDasharray={v === 0 || v === 100 ? '0' : '3,3'} />
              <text x={padL - 6} y={yAt(v) + 4} textAnchor="end" fontSize="9" fill="currentColor" fillOpacity="0.4" fontFamily="monospace">{v}</text>
            </g>
          ))}

          {/* Area fills */}
          {n > 1 && <path d={atsArea}     fill="url(#atsFill)" />}
          {n > 1 && <path d={overallArea} fill="url(#overallFill)" />}

          {/* Lines */}
          {n > 1 && <polyline points={atsPts}     fill="none" stroke="url(#atsLine)"     strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />}
          {n > 1 && <polyline points={overallPts} fill="none" stroke="url(#overallLine)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />}

          {/* Hover vertical line */}
          {hoveredIndex !== null && (
            <line x1={xAt(hoveredIndex)} y1={padT} x2={xAt(hoveredIndex)} y2={padT + innerH}
              stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3,2" />
          )}

          {/* Data points */}
          {data.map((d, i) => {
            const isHov = hoveredIndex === i
            return (
              <g key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}>
                {/* ATS dot */}
                <circle cx={xAt(i)} cy={yAt(d.ats)} r={isHov ? 5 : 3.5} fill="url(#atsLine)" stroke="white" strokeWidth="1.5"
                  style={{ transition: 'r 0.15s ease', filter: isHov ? 'drop-shadow(0 2px 6px rgba(99,102,241,0.5))' : 'none' }} />
                {/* Overall dot */}
                <circle cx={xAt(i)} cy={yAt(d.overall)} r={isHov ? 5.5 : 4} fill="url(#overallLine)" stroke="white" strokeWidth="2"
                  style={{ transition: 'r 0.15s ease', filter: isHov ? 'drop-shadow(0 2px 8px rgba(124,58,237,0.6))' : 'none' }} />
              </g>
            )
          })}

          {/* X-axis date labels */}
          {data.map((d, i) => (
            <text key={i} x={xAt(i)} y={padT + innerH + padB + 2} textAnchor="middle" fontSize="8" fill="currentColor" fillOpacity="0.35" fontFamily="monospace">
              {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </text>
          ))}
        </svg>

        {/* Tooltip */}
        {hoveredIndex !== null && data[hoveredIndex] && (() => {
          const d = data[hoveredIndex]
          const leftPct = ((xAt(hoveredIndex)) / W) * 100
          const flipLeft = leftPct > 70
          return (
            <div className="absolute top-0 z-20 pointer-events-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl px-3 py-2.5 text-xs animate-pop-in"
              style={{ left: `${leftPct}%`, transform: `translateX(${flipLeft ? '-100%' : '-50%'}) translateY(4px)`, minWidth: 160 }}>
              <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 truncate">{d.resumeName}</p>
              <p className="text-gray-400 dark:text-gray-500 text-[10px] mb-2">
                {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400"><span className="w-2 h-2 rounded-full bg-violet-500" />Overall</span>
                  <strong className="font-mono-data">{d.overall}</strong>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400"><span className="w-2 h-2 rounded-full bg-indigo-500" />ATS</span>
                  <strong className="font-mono-data">{d.ats}</strong>
                </div>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
