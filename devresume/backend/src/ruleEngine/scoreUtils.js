


export const clamp = (value, min = 0, max = 100) =>
  Math.min(Math.max(value, min), max);


export const normalize = (earnedScore, maxScore, targetWeight) => {
  if (!maxScore || maxScore === 0) return 0;
  return (earnedScore / maxScore) * targetWeight;
};


export const percentage = (part, total) => {
  if (!total || total === 0) return 0;
  return Math.round((part / total) * 1000) / 10;
};


export const round = (value, decimals = 0) => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};
