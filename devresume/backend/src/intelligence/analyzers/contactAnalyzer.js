

export const analyzeContact = (resume) => {
  const checks = {
    email:     Boolean(resume.email && resume.email.trim()),
    phone:     Boolean(resume.phone && resume.phone.trim()),
    linkedin:  Boolean(resume.linkedin && resume.linkedin.trim()),
    github:    Boolean(resume.github && resume.github.trim()),
    portfolio: Boolean(resume.portfolio && resume.portfolio.trim()),
  };

  const deductions = [];
  let earnedScore = 0;

  
  if (checks.email) {
    earnedScore += 4;
  } else {
    deductions.push({ reason: 'Email missing — recruiters cannot contact you', points: -4 });
  }

  
  if (checks.phone) {
    earnedScore += 3;
  } else {
    deductions.push({ reason: 'Phone number missing', points: -3 });
  }

  
  if (checks.linkedin) {
    earnedScore += 2;
  } else {
    deductions.push({ reason: 'LinkedIn profile missing', points: -2 });
  }

  
  if (checks.github) {
    earnedScore += 1;
  } else {
    deductions.push({ reason: 'GitHub profile missing', points: -1 });
  }

  
  if (checks.portfolio) {
    earnedScore += 1;
  } else {
    deductions.push({ reason: 'Portfolio/website missing', points: -1 });
  }

  return {
    maxScore: 10,
    earnedScore: Math.min(earnedScore, 10), 
    checks,
    deductions,
  };
};
