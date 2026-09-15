import { useState } from 'react'

export interface ScoreChartDataPoint {
  date: string       // ISO date string (createdAt)
  resumeName: string
  overall: number    // 0-100
  ats: number        // 0-100
}

interface ScoreChartProps {
  data: ScoreChartDataPoint[]  // pre-sorted ascending by date (caller's responsibility)
}

export default function ScoreChart({ data }: ScoreChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Coordinate helpers
  const n = data.length
  const chartW = 530, chartH = 160
  const xAt = (i: number) => n > 1 ? 50 + i * (chartW / (n - 1)) : 50 + chartW / 2
  const yAt = (score: number) => 20 + ((100 - score) / 100) * chartH

  const overallPoints = data.map((d, i) => `${xAt(i)},${yAt(d.overall)}`).join(' ')
  const atsPoints = data.map((d, i) => `${xAt(i)},${yAt(d.ats)}`).join(' ')
  const yTicks = [0, 25, 50, 75, 100]

  return (
    <div>
      {/* Legend */}
      <div className="flex items-center gap-4 mb-2 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-violet-600 inline-block rounded" />
          Overall Score
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-blue-500 inline-block rounded" />
          ATS Score
        </span>
      </div>

      {/* Chart wrapper — relative for absolute tooltip */}
      <div className="relative">
        <svg viewBox="0 0 600 220" width="100%" className="overflow-visible">
          {/* Y-axis grid lines and labels */}
          {yTicks.map(v => (
            <g key={v}>
              <line
                x1={50} y1={yAt(v)} x2={580} y2={yAt(v)}
                stroke="currentColor" strokeOpacity="0.08" strokeWidth="1"
              />
              <text
                x={42} y={yAt(v) + 4}
                textAnchor="end" fontSize="10"
                fill="currentColor" fillOpacity="0.5"
              >
                {v}
              </text>
            </g>
          ))}

          {/* Overall polyline */}
          {n > 1 && (
            <polyline
              points={overallPoints}
              fill="none"
              stroke="#7c3aed"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          )}

          {/* ATS polyline */}
          {n > 1 && (
            <polyline
              points={atsPoints}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          )}

          {/* Data point circles */}
          {data.map((d, i) => (
            <g key={i}>
              <circle
                cx={xAt(i)} cy={yAt(d.overall)} r={4}
                fill="#7c3aed" stroke="white" strokeWidth="1.5"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              <circle
                cx={xAt(i)} cy={yAt(d.ats)} r={4}
                fill="#3b82f6" stroke="white" strokeWidth="1.5"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </g>
          ))}
        </svg>

        {/* Hover tooltip */}
        {hoveredIndex !== null && data[hoveredIndex] && (() => {
          const d = data[hoveredIndex]
          const x = xAt(hoveredIndex)
          const leftPct = (x / 600) * 100
          return (
            <div
              className="absolute top-0 z-10 pointer-events-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg px-3 py-2 text-xs"
              style={{ left: `${leftPct}%`, transform: 'translateX(-50%) translateY(4px)' }}
            >
              <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1 truncate max-w-[160px]">
                {d.resumeName}
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-1">
                {new Date(d.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <div className="flex gap-3">
                <span className="text-violet-600 dark:text-violet-400">
                  Overall: <strong>{d.overall}</strong>
                </span>
                <span className="text-blue-500">
                  ATS: <strong>{d.ats}</strong>
                </span>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
