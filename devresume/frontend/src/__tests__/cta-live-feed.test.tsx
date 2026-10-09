import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import CTALiveFeed from '@/components/ui/CTALiveFeed'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Mock matchMedia so `prefers-reduced-motion` is reported as NOT active by default */
function mockMatchMedia(prefersReducedMotion: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: prefersReducedMotion
        ? query === '(prefers-reduced-motion: reduce)'
        : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  })
}

// ─── CTALiveFeed ─────────────────────────────────────────────────────────────

describe('CTALiveFeed', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockMatchMedia(false)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('shows "Parsing structure…" on first render before any interval fires', () => {
    render(<CTALiveFeed />)
    expect(screen.getByText('Parsing structure…')).toBeInTheDocument()
  })

  it('shows the first step from the steps prop on initial render', () => {
    const steps = ['Step Alpha', 'Step Beta', 'Step Gamma']
    render(<CTALiveFeed steps={steps} />)
    expect(screen.getByText('Step Alpha')).toBeInTheDocument()
  })

  it('advances to the second step after one interval (1800ms)', () => {
    const steps = ['Step One', 'Step Two', 'Step Three']
    render(<CTALiveFeed steps={steps} />)

    act(() => {
      vi.advanceTimersByTime(1800)
    })

    expect(screen.getByText('Step Two')).toBeInTheDocument()
  })

  it('cycles back to the first step after all steps have shown', () => {
    const steps = ['A', 'B', 'C']
    render(<CTALiveFeed steps={steps} />)

    act(() => {
      // 3 intervals → wraps back to index 0
      vi.advanceTimersByTime(1800 * 3)
    })

    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('renders the Activity icon (svg)', () => {
    const { container } = render(<CTALiveFeed />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
  })

  it('renders the pulsing left accent bar', () => {
    const { container } = render(<CTALiveFeed />)
    // The accent bar has the animate-pulse-accent class
    const accentBar = container.querySelector('.animate-pulse-accent')
    expect(accentBar).not.toBeNull()
  })

  // ── prefers-reduced-motion ─────────────────────────────────────────────────

  describe('when prefers-reduced-motion is active', () => {
    beforeEach(() => {
      mockMatchMedia(true)
    })

    it('still shows the first label on initial render', () => {
      render(<CTALiveFeed />)
      expect(screen.getByText('Parsing structure…')).toBeInTheDocument()
    })

    it('does NOT advance to the next step after 1800ms', () => {
      const steps = ['First', 'Second', 'Third']
      render(<CTALiveFeed steps={steps} />)

      act(() => {
        vi.advanceTimersByTime(1800 * 5)
      })

      // Should still show "First" — no cycling
      expect(screen.getByText('First')).toBeInTheDocument()
      expect(screen.queryByText('Second')).toBeNull()
    })

    it('with custom steps prop, still shows steps[0] only', () => {
      const steps = ['Alpha', 'Beta']
      render(<CTALiveFeed steps={steps} />)

      act(() => {
        vi.advanceTimersByTime(1800 * 10)
      })

      expect(screen.getByText('Alpha')).toBeInTheDocument()
      expect(screen.queryByText('Beta')).toBeNull()
    })
  })
})
