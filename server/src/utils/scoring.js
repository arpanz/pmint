/**
 * Scoring utility for calculating match scores between students and internships
 */

/**
 * Calculate match score between student and internship
 * @param {Object} student - Student profile
 * @param {Object} internship - Internship posting
 * @returns {Object} - Score details including total score and breakdown
 */
const calculateMatchScore = (student, internship) => {
  const weights = {
    skillMatch: 0.6,      // 60% - Skill matching
    locationMatch: 0.2,   // 20% - Location matching
    diversityBoost: 0.1,  // 10% - Diversity boost
    newParticipantBoost: 0.1  // 10% - New participant boost
  };

  // 1. Skill Matching Score (60%)
  const skillScore = calculateSkillMatch(student.skills, internship.required_skills);

  // 2. Location Matching Score (20%)
  const locationScore = student.location === internship.location ? 1 : 0;

  // 3. Diversity Boost (10%)
  const diversityScore = ['SC', 'ST', 'OBC'].includes(student.category) ? 1 : 0;

  // 4. New Participant Boost (10%)
  const newParticipantScore = !student.past_participation ? 1 : 0;

  // Calculate weighted total score
  const totalScore = 
    (skillScore * weights.skillMatch) +
    (locationScore * weights.locationMatch) +
    (diversityScore * weights.diversityBoost) +
    (newParticipantScore * weights.newParticipantBoost);

  return {
    totalScore: Math.min(1, totalScore), // Cap at 1.0
    breakdown: {
      skillMatch: {
        score: skillScore,
        weight: weights.skillMatch,
        contribution: skillScore * weights.skillMatch
      },
      locationMatch: {
        score: locationScore,
        weight: weights.locationMatch,
        contribution: locationScore * weights.locationMatch
      },
      diversityBoost: {
        score: diversityScore,
        weight: weights.diversityBoost,
        contribution: diversityScore * weights.diversityBoost
      },
      newParticipantBoost: {
        score: newParticipantScore,
        weight: weights.newParticipantBoost,
        contribution: newParticipantScore * weights.newParticipantBoost
      }
    }
  };
};

/**
 * Calculate skill matching score based on keyword overlap
 * @param {Array} studentSkills - Array of student skills
 * @param {Array} requiredSkills - Array of required skills for internship
 * @returns {Number} - Skill match score between 0 and 1
 */
const calculateSkillMatch = (studentSkills, requiredSkills) => {
  if (!studentSkills || !requiredSkills || studentSkills.length === 0 || requiredSkills.length === 0) {
    return 0;
  }

  // Normalize skills to lowercase for case-insensitive comparison
  const normalizedStudentSkills = studentSkills.map(skill => skill.toLowerCase().trim());
  const normalizedRequiredSkills = requiredSkills.map(skill => skill.toLowerCase().trim());

  // Calculate exact matches
  const exactMatches = normalizedRequiredSkills.filter(required => 
    normalizedStudentSkills.includes(required)
  );

  // Calculate partial matches (for skills that contain common keywords)
  const partialMatches = normalizedRequiredSkills.filter(required => {
    if (exactMatches.some(exact => exact === required)) {
      return false; // Skip if already counted as exact match
    }
    
    return normalizedStudentSkills.some(student => {
      // Check for partial matches (e.g., "JavaScript" matches "JS")
      const commonKeywords = getCommonKeywords(student, required);
      return commonKeywords.length > 0;
    });
  });

  // Calculate score based on matches
  const exactMatchWeight = 1.0;
  const partialMatchWeight = 0.5;

  const exactMatchScore = (exactMatches.length * exactMatchWeight);
  const partialMatchScore = (partialMatches.length * partialMatchWeight);
  const totalPossibleScore = normalizedRequiredSkills.length * exactMatchWeight;

  const skillMatchScore = (exactMatchScore + partialMatchScore) / totalPossibleScore;

  return Math.min(1, skillMatchScore); // Cap at 1.0
};

/**
 * Get common keywords between two skill strings
 * @param {String} skill1 - First skill
 * @param {String} skill2 - Second skill
 * @returns {Array} - Array of common keywords
 */
const getCommonKeywords = (skill1, skill2) => {
  const skillMappings = {
    'js': ['javascript', 'js'],
    'javascript': ['javascript', 'js'],
    'ts': ['typescript', 'ts'],
    'typescript': ['typescript', 'ts'],
    'py': ['python', 'py'],
    'python': ['python', 'py'],
    'react': ['react', 'reactjs', 'react.js'],
    'reactjs': ['react', 'reactjs', 'react.js'],
    'node': ['node.js', 'nodejs', 'node'],
    'nodejs': ['node.js', 'nodejs', 'node'],
    'node.js': ['node.js', 'nodejs', 'node'],
    'css': ['css', 'css3', 'styling'],
    'html': ['html', 'html5', 'markup'],
    'ml': ['machine learning', 'ml', 'artificial intelligence'],
    'ai': ['machine learning', 'ml', 'artificial intelligence'],
    'machine learning': ['machine learning', 'ml', 'artificial intelligence']
  };

  const getVariants = (skill) => {
    const normalized = skill.toLowerCase().trim();
    return skillMappings[normalized] || [normalized];
  };

  const variants1 = getVariants(skill1);
  const variants2 = getVariants(skill2);

  return variants1.filter(variant => variants2.includes(variant));
};

/**
 * Generate a human-readable match reason
 * @param {Object} student - Student profile
 * @param {Object} internship - Internship posting
 * @param {Object} scoreBreakdown - Score breakdown from calculateMatchScore
 * @returns {String} - Human-readable match reason
 */
const generateMatchReason = (student, internship, scoreBreakdown) => {
  const reasons = [];

  // Skill match reason
  if (scoreBreakdown.skillMatch.score > 0.7) {
    const matchedSkills = internship.required_skills.filter(required =>
      student.skills.some(studentSkill => 
        studentSkill.toLowerCase().includes(required.toLowerCase()) ||
        required.toLowerCase().includes(studentSkill.toLowerCase())
      )
    );
    
    if (matchedSkills.length > 0) {
      reasons.push(`Strong skill match in ${matchedSkills.slice(0, 2).join(' and ')}`);
    }
  } else if (scoreBreakdown.skillMatch.score > 0.4) {
    reasons.push('Good skill alignment with requirements');
  } else if (scoreBreakdown.skillMatch.score > 0) {
    reasons.push('Some relevant skills match');
  }

  // Location match reason
  if (scoreBreakdown.locationMatch.score > 0) {
    reasons.push(`Perfect location match in ${student.location}`);
  }

  // Diversity boost reason
  if (scoreBreakdown.diversityBoost.score > 0) {
    reasons.push('Diversity and inclusion priority');
  }

  // New participant boost reason
  if (scoreBreakdown.newParticipantBoost.score > 0) {
    reasons.push('New participant opportunity');
  }

  // Sector alignment
  const sectorKeywords = {
    'Technology': ['javascript', 'python', 'react', 'node', 'sql', 'programming'],
    'Healthcare': ['data analysis', 'research', 'biology'],
    'Finance': ['data analysis', 'sql', 'python', 'excel'],
    'Education': ['content writing', 'communication'],
    'Marketing': ['digital marketing', 'content writing', 'graphic design']
  };

  const relevantSectorSkills = sectorKeywords[internship.sector] || [];
  const hasRelevantSectorSkills = student.skills.some(skill =>
    relevantSectorSkills.some(sectorSkill =>
      skill.toLowerCase().includes(sectorSkill.toLowerCase())
    )
  );

  if (hasRelevantSectorSkills) {
    reasons.push(`${internship.sector} sector experience`);
  }

  return reasons.length > 0 
    ? reasons.join(', ') + '.'
    : 'General profile compatibility with internship requirements.';
};

module.exports = {
  calculateMatchScore,
  calculateSkillMatch,
  generateMatchReason,
  getCommonKeywords
};
