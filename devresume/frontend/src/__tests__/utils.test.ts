import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { relativeTime, formatFileSize } from '@/lib/utils'

// Helper: build a dateString that is exactly `diffMs` milliseconds in the past
function dateFromDiff(diffMs: number): string {
  return new Date(Date.now() - diffMs).toISOString()
}

// ─── relativeTime ─────────────────────────────────────────────────────────────

describe('relativeTime', () => {
  // ── Unit tests — one example per bucket boundary ──────────────────────────

  describe('unit tests', () => {
    it('returns "just now" for 0 seconds ago', () => {
      expect(relativeTime(dateFromDiff(0))).toBe('just now')
    })

    it('returns "just now" for 59 seconds ago', () => {
      expect(relativeTime(dateFromDiff(59_000))).toBe('just now')
    })

    it('returns "1 minute ago" for exactly 60 seconds ago', () => {
      expect(relativeTime(dateFromDiff(60_000))).toBe('1 minute ago')
    })

    it('returns "59 minutes ago" for 3599 seconds ago', () => {
      expect(relativeTime(dateFromDiff(3_599_000))).toBe('59 minutes ago')
    })

    it('returns "1 hour ago" for exactly 3600 seconds ago', () => {
      expect(relativeTime(dateFromDiff(3_600_000))).toBe('1 hour ago')
    })

    it('returns "23 hours ago" for 86399 seconds ago', () => {
      expect(relativeTime(dateFromDiff(86_399_000))).toBe('23 hours ago')
    })

    it('returns "yesterday" for exactly 86400 seconds ago', () => {
      expect(relativeTime(dateFromDiff(86_400_000))).toBe('yesterday')
    })

    it('returns "yesterday" for 172799 seconds ago', () => {
      expect(relativeTime(dateFromDiff(172_799_000))).toBe('yesterday')
    })

    it('returns "2 days ago" for exactly 172800 seconds ago', () => {
      expect(relativeTime(dateFromDiff(172_800_000))).toBe('2 days ago')
    })

    it('returns "6 days ago" for 604799 seconds ago', () => {
      expect(relativeTime(dateFromDiff(604_799_000))).toBe('6 days ago')
    })

    it('returns "1 week ago" for exactly 604800 seconds ago', () => {
      expect(relativeTime(dateFromDiff(604_800_000))).toBe('1 week ago')
    })

    it('returns "4 weeks ago" for 2591999 seconds ago', () => {
      expect(relativeTime(dateFromDiff(2_591_999_000))).toBe('4 weeks ago')
    })

    it('returns "1 month ago" for exactly 2592000 seconds ago', () => {
      expect(relativeTime(dateFromDiff(2_592_000_000))).toBe('1 month ago')
    })
  })

  // ── Property test ──────────────────────────────────────────────────────────

  describe('property tests', () => {
    /**
     * **Validates: Requirements 6.3**
     *
     * For any diff in [0, 365 days], the output must be a non-empty string
     * that matches exactly one of the expected bucket formats.
     */
    it('Property 10: output matches the correct bucket for any date difference', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 365 * 24 * 3600 * 1000 }),
          (diffMs) => {
            const result = relativeTime(dateFromDiff(diffMs))
            expect(result.length).toBeGreaterThan(0)

            const diffSec = Math.floor(diffMs / 1000)

            if (diffSec < 60) {
              expect(result).toBe('just now')
            } else if (diffSec < 3600) {
              const n = Math.floor(diffSec / 60)
              expect(result).toBe(`${n} ${n === 1 ? 'minute' : 'minutes'} ago`)
            } else if (diffSec < 86400) {
              const n = Math.floor(diffSec / 3600)
              expect(result).toBe(`${n} ${n === 1 ? 'hour' : 'hours'} ago`)
            } else if (diffSec < 172800) {
              expect(result).toBe('yesterday')
            } else if (diffSec < 604800) {
              const n = Math.floor(diffSec / 86400)
              expect(result).toBe(`${n} days ago`)
            } else if (diffSec < 2592000) {
              const n = Math.floor(diffSec / 604800)
              expect(result).toBe(`${n} ${n === 1 ? 'week' : 'weeks'} ago`)
            } else {
              const n = Math.floor(diffSec / 2592000)
              expect(result).toBe(`${n} ${n === 1 ? 'month' : 'months'} ago`)
            }
          }
        )
      )
    })
  })
})

// ─── formatFileSize ───────────────────────────────────────────────────────────

describe('formatFileSize', () => {
  // ── Unit tests — boundary values ──────────────────────────────────────────

  describe('unit tests', () => {
    it('returns "0.0 KB" for 0 bytes', () => {
      expect(formatFileSize(0)).toBe('0.0 KB')
    })

    it('returns KB for 1023 bytes', () => {
      expect(formatFileSize(1023)).toBe('1.0 KB')
    })

    it('returns KB for 1024 bytes', () => {
      expect(formatFileSize(1024)).toBe('1.0 KB')
    })

    it('returns KB for 1_048_575 bytes (just below 1 MB)', () => {
      expect(formatFileSize(1_048_575)).toBe('1024.0 KB')
    })

    it('returns "1.0 MB" for exactly 1_048_576 bytes', () => {
      expect(formatFileSize(1_048_576)).toBe('1.0 MB')
    })

    it('returns "5.0 MB" for 5_242_880 bytes', () => {
      expect(formatFileSize(5_242_880)).toBe('5.0 MB')
    })
  })

  // ── Property test ──────────────────────────────────────────────────────────

  describe('property tests', () => {
    /**
     * **Validates: Requirements 7.2**
     *
     * For any byte count in [0, 10 MB]:
     * - output is never empty
     * - ends with " KB" or " MB"
     * - numeric part is non-negative
     * - numeric part has exactly one decimal place
     */
    it('Property 11: file size formatter produces valid human-readable output', () => {
      fc.assert(
        fc.property(
          fc.nat({ max: 10 * 1024 * 1024 }),
          (bytes) => {
            const result = formatFileSize(bytes)

            // Never empty
            expect(result.length).toBeGreaterThan(0)

            // Ends with " KB" or " MB"
            expect(result).toMatch(/ (KB|MB)$/)

            // Extract the numeric part
            const numPart = parseFloat(result)
            expect(numPart).toBeGreaterThanOrEqual(0)

            // Exactly one decimal place
            const dotIndex = result.indexOf('.')
            expect(dotIndex).toBeGreaterThan(-1)
            const afterDot = result.slice(dotIndex + 1).split(' ')[0]
            expect(afterDot).toHaveLength(1)
          }
        )
      )
    })
  })
})
