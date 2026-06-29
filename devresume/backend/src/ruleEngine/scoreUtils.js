/**
 * scoreUtils.js
 *
 * Pure helper functions for score calculation.
 * No business logic here — just math utilities.
 */

/**
 * clamp(value, min, max)
 * Ensures a number stays within bounds.
 * Example: clamp(105, 0, 100) → 100
 */
export const clamp = (value, min = 0, max = 100) =>
  Math.min(Math.max(value, min), max);

/**
 * normalize(earnedScore, maxScore, targetWeight)
 * Converts an analyzer's raw score into the weighted score.
 *
 * Example:
 *   earnedScore = 18, maxScore = 25, targetWeight = 25
 *   → (18 / 25) * 25 = 18
 *
 *   earnedScore = 7, maxScore = 10, targetWeight = 10
 *   → (7 / 10) * 10 = 7
 */
export const normalize = (earnedScore, maxScore, targetWeight) => {
  if (!maxScore || maxScore === 0) return 0;
  return (earnedScore / maxScore) * targetWeight;
};

/**
 * percentage(part, total)
 * Returns a percentage rounded to 1 decimal.
 * Example: percentage(18, 25) → 72.0
 */
export const percentage = (part, total) => {
  if (!total || total === 0) return 0;
  return Math.round((part / total) * 1000) / 10;
};

/**
 * round(value, decimals)
 * Rounds to specified decimal places.
 * Default: round to nearest integer.
 */
export const round = (value, decimals = 0) => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};
