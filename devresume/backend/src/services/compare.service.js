import prisma from '../database/client.js';

// Compare two saved reviews side by side
export const compareReviews = async (reviewId1, reviewId2, userId) => {
  const [review1, review2] = await Promise.all([
    prisma.review.findFirst({ where: { id: reviewId1, userId } }),
    prisma.review.findFirst({ where: { id: reviewId2, userId } }),
  ]);

  if (!review1 || !review2) {
    const error = new Error('One or both reviews not found');
    error.statusCode = 404;
    throw error;
  }

  const score1 = review1.overallScore;
  const score2 = review2.overallScore;

  return {
    review1: {
      id: review1.id,
      resumeName: review1.resumeName,
      atsScore: review1.atsScore,
      overallScore: score1,
      detailedScores: review1.reportJson.detailedScores,
      date: review1.createdAt,
    },
    review2: {
      id: review2.id,
      resumeName: review2.resumeName,
      atsScore: review2.atsScore,
      overallScore: score2,
      detailedScores: review2.reportJson.detailedScores,
      date: review2.createdAt,
    },
    differences: {
      atsScore: review2.atsScore - review1.atsScore,
      overallScore: score2 - score1,
    },
    recommendation:
      score2 > score1
        ? `Version 2 is stronger by ${score2 - score1} points`
        : score1 > score2
        ? `Version 1 is stronger by ${score1 - score2} points`
        : 'Both versions score equally overall',
  };
};
