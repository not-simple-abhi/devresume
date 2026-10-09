import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as fc from 'fast-check'

import ShimmerSkeleton from '@/components/ui/ShimmerSkeleton'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ScoreRing from '@/components/ui/ScoreRing'
import ScoreChart, { type ScoreChartDataPoint } from '@/components/ui/ScoreChart'
import { scoreLabel } from '@/lib/utils'

// ─── ShimmerSkeleton ──────────────────────────────────────────────────────────

describe('ShimmerSkeleton', () => {
  it('renders a div with the animate-shimmer class', () => {
    const { container } = render(<ShimmerSkeleton />)
    const div = container.firstElementChild as HTMLElement
    expect(div.tagName).toBe('DIV')
    expect(div.className).toContain('animate-shimmer')
  })

  it('applies inline width and height styles correctly', () => {
    const { container } = render(<ShimmerSkeleton width="200px" height="40px" />)
    const div = container.firstElementChild as HTMLElement
    expect(div.style.width).toBe('200px')
    expect(div.style.height).toBe('40px')
  })

  it('falls back to 100% width and 1rem height when not specified', () => {
    const { container } = render(<ShimmerSkeleton />)
    const div = container.firstElementChild as HTMLElement
    expect(div.style.width).toBe('100%')
    expect(div.style.height).toBe('1rem')
  })

  it('merges extra className with animate-shimmer', () => {
    const { container } = render(<ShimmerSkeleton className="my-custom-class" />)
    const div = container.firstElementChild as HTMLElement
    expect(div.className).toContain('animate-shimmer')
    expect(div.className).toContain('my-custom-class')
  })

  // Property test
  it('Property 13: renders with any valid string width and height', () => {
    // Use safe CSS-like strings to avoid jsdom style parse issues
    fc.assert(
      fc.property(
        fc.nat({ max: 9999 }).map(n => `${n}px`),
        fc.nat({ max: 9999 }).map(n => `${n}px`),
        (width, height) => {
          const { container } = render(<ShimmerSkeleton width={width} height={height} />)
          const div = container.firstElementChild as HTMLElement
          expect(div.className).toContain('animate-shimmer')
          expect(div.style.width).toBe(width)
          expect(div.style.height).toBe(height)
          container.remove()
        }
      )
    )
  })
})

// ─── Button ───────────────────────────────────────────────────────────────────

describe('Button', () => {
  it('renders aria-disabled="true" and aria-busy="true" when loading', () => {
    render(<Button loading>Save</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-disabled', 'true')
    expect(btn).toHaveAttribute('aria-busy', 'true')
  })

  it('renders a spinner (Loader2 svg) when loading', () => {
    const { container } = render(<Button loading>Save</Button>)
    // Loader2 renders an <svg> inside the button
    const svg = container.querySelector('button svg')
    expect(svg).not.toBeNull()
  })

  it('sets aria-label to "${children}, loading" when loading with string children', () => {
    render(<Button loading>Submit</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-label', 'Submit, loading')
  })

  it('does not set aria-label when not loading', () => {
    render(<Button>Submit</Button>)
    const btn = screen.getByRole('button')
    expect(btn).not.toHaveAttribute('aria-label')
  })

  it('contains focus-visible:ring-2 in its className', () => {
    const { container } = render(<Button>Click</Button>)
    const btn = container.querySelector('button')!
    expect(btn.className).toContain('focus-visible:ring-2')
  })

  // Property test
  it('Property 14: aria-label equals "${label}, loading" for any non-empty string label', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        (label) => {
          const { container } = render(<Button loading>{label}</Button>)
          const btn = container.querySelector('button')!
          expect(btn.getAttribute('aria-label')).toBe(`${label}, loading`)
          container.remove()
        }
      )
    )
  })
})

// ─── Card ─────────────────────────────────────────────────────────────────────

describe('Card', () => {
  it('renders role="button" and tabIndex=0 when hover=true and onClick is provided', () => {
    const onClick = vi.fn()
    render(<Card hover onClick={onClick}>Content</Card>)
    const card = screen.getByRole('button')
    expect(card).toHaveAttribute('tabindex', '0')
  })

  it('does NOT render role="button" when onClick is not provided', () => {
    render(<Card hover>Content</Card>)
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('does NOT render role="button" when hover is false even with onClick', () => {
    const onClick = vi.fn()
    render(<Card onClick={onClick}>Content</Card>)
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('invokes onClick when Enter is pressed', () => {
    const onClick = vi.fn()
    render(<Card hover onClick={onClick}>Content</Card>)
    const card = screen.getByRole('button')
    fireEvent.keyDown(card, { key: 'Enter' })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('invokes onClick when Space is pressed', () => {
    const onClick = vi.fn()
    render(<Card hover onClick={onClick}>Content</Card>)
    const card = screen.getByRole('button')
    fireEvent.keyDown(card, { key: ' ' })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does NOT invoke onClick when Tab is pressed', () => {
    const onClick = vi.fn()
    render(<Card hover onClick={onClick}>Content</Card>)
    const card = screen.getByRole('button')
    fireEvent.keyDown(card, { key: 'Tab' })
    expect(onClick).not.toHaveBeenCalled()
  })
})

// ─── ScoreRing ────────────────────────────────────────────────────────────────

describe('ScoreRing', () => {
  it('renders aria-label="Score: 75 out of 100, Good" for score=75', () => {
    const { container } = render(<ScoreRing score={75} />)
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper).toHaveAttribute('aria-label', 'Score: 75 out of 100, Good')
  })

  it('renders aria-label="Score: 90 out of 100, Excellent" for score=90', () => {
    const { container } = render(<ScoreRing score={90} />)
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper).toHaveAttribute('aria-label', 'Score: 90 out of 100, Excellent')
  })

  it('renders aria-label="Score: 55 out of 100, Fair" for score=55', () => {
    const { container } = render(<ScoreRing score={55} />)
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper).toHaveAttribute('aria-label', 'Score: 55 out of 100, Fair')
  })

  it('renders aria-label="Score: 30 out of 100, Needs Work" for score=30', () => {
    const { container } = render(<ScoreRing score={30} />)
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper).toHaveAttribute('aria-label', 'Score: 30 out of 100, Needs Work')
  })

  // Property test
  it('Property 17: aria-label matches score and label tier for any integer 0–100', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        (score) => {
          const { container } = render(<ScoreRing score={score} />)
          const wrapper = container.firstElementChild as HTMLElement
          const expected = `Score: ${score} out of 100, ${scoreLabel(score)}`
          expect(wrapper).toHaveAttribute('aria-label', expected)
          container.remove()
        }
      )
    )
  })
})

// ─── ScoreChart ───────────────────────────────────────────────────────────────

const sampleData: ScoreChartDataPoint[] = [
  { date: '2024-01-01T00:00:00Z', resumeName: 'Resume A', overall: 60, ats: 70 },
  { date: '2024-02-01T00:00:00Z', resumeName: 'Resume B', overall: 80, ats: 85 },
]

describe('ScoreChart', () => {
  it('renders SVG Y-axis tick labels: 0, 25, 50, 75, 100', () => {
    render(<ScoreChart data={sampleData} />)
    for (const tick of [0, 25, 50, 75, 100]) {
      expect(screen.getByText(String(tick))).toBeInTheDocument()
    }
  })

  it('renders two <polyline> elements with 2 data points', () => {
    const { container } = render(<ScoreChart data={sampleData} />)
    const polylines = container.querySelectorAll('polyline')
    expect(polylines).toHaveLength(2)
  })

  it('renders no <polyline> elements with 1 data point (circles only)', () => {
    const singlePoint: ScoreChartDataPoint[] = [
      { date: '2024-01-01T00:00:00Z', resumeName: 'Only Resume', overall: 70, ats: 65 },
    ]
    const { container } = render(<ScoreChart data={singlePoint} />)
    const polylines = container.querySelectorAll('polyline')
    expect(polylines).toHaveLength(0)
  })

  it('renders without throwing when all scores are identical', () => {
    const flatData: ScoreChartDataPoint[] = [
      { date: '2024-01-01T00:00:00Z', resumeName: 'Resume A', overall: 50, ats: 50 },
      { date: '2024-02-01T00:00:00Z', resumeName: 'Resume B', overall: 50, ats: 50 },
    ]
    expect(() => render(<ScoreChart data={flatData} />)).not.toThrow()
  })

  it('renders the legend labels "Overall Score" and "ATS Score"', () => {
    render(<ScoreChart data={sampleData} />)
    expect(screen.getByText('Overall Score')).toBeInTheDocument()
    expect(screen.getByText('ATS Score')).toBeInTheDocument()
  })
})
