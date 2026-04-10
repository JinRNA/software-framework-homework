import type {
  AssessmentData,
  MatchResult,
  MatchBreakdown,
  MatchReport,
  CareerTag,
  SkillsRating,
  PersonalityTraits,
} from '../types';
import { careerTags } from '../data/careers';

/**
 * 匹配算法权重配置
 * 技能：40%  兴趣：25%  性格：20%  专业背景：10%  市场热度：5%
 */
const WEIGHTS = {
  skill: 0.40,
  interest: 0.25,
  personality: 0.20,
  background: 0.10,
  market: 0.05,
};

/**
 * 计算技能匹配度 (0-100)
 */
function calcSkillScore(userSkills: SkillsRating, career: CareerTag): number {
  const skillKeys = Object.keys(career.requiredSkills) as (keyof SkillsRating)[];
  let weightedSum = 0;
  let totalWeight = 0;

  for (const key of skillKeys) {
    const requirement = career.requiredSkills[key] || 0;
    const userLevel = (userSkills[key] || 1) / 5; // normalize to 0-1
    const match = 1 - Math.abs(requirement - userLevel);
    weightedSum += match * requirement;
    totalWeight += requirement;
  }

  return totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 50;
}

/**
 * 计算兴趣匹配度 (0-100)
 */
function calcInterestScore(assessment: AssessmentData, career: CareerTag): number {
  const userInterests = assessment.interests.selectedInterests;
  const careerInterests = career.interestTags;

  if (careerInterests.length === 0) return 50;

  const matchCount = careerInterests.filter(tag => userInterests.includes(tag)).length;
  const interestScore = (matchCount / careerInterests.length) * 80;

  // Bonus for work type alignment
  const workTypeBonus = getWorkTypeBonus(assessment.interests.workTypePreference, career.code);

  return Math.min(100, interestScore + workTypeBonus);
}

function getWorkTypeBonus(workTypes: string[], careerCode: string): number {
  const careerWorkTypes: Record<string, string[]> = {
    frontend_dev: ['engineering', 'creative'],
    backend_dev: ['engineering', 'research'],
    data_analyst: ['analytical', 'research'],
    ai_engineer: ['research', 'engineering'],
    product_manager: ['management', 'creative', 'analytical'],
  };

  const expected = careerWorkTypes[careerCode] || [];
  const bonus = expected.filter(t => workTypes.includes(t)).length;
  return bonus * 10;
}

/**
 * 计算性格匹配度 (0-100)
 */
function calcPersonalityScore(userPersonality: PersonalityTraits, career: CareerTag): number {
  const pref = career.personalityPreference;
  const traits = Object.keys(pref) as (keyof PersonalityTraits)[];

  if (traits.length === 0) return 50;

  let totalDiff = 0;
  let count = 0;

  for (const trait of traits) {
    const expected = pref[trait];
    if (expected === undefined) continue;
    const diff = Math.abs((userPersonality[trait] || 3) - expected);
    totalDiff += diff;
    count++;
  }

  if (count === 0) return 50;

  const avgDiff = totalDiff / count;
  // Max diff is 4 (between 1 and 5), normalize to 0-100
  return Math.max(0, (1 - avgDiff / 4) * 100);
}

/**
 * 计算专业背景匹配度 (0-100)
 */
function calcBackgroundScore(assessment: AssessmentData, career: CareerTag): number {
  const { major, education } = assessment.professional;

  // Major relevance mapping
  const majorRelevance: Record<string, Record<string, number>> = {
    frontend_dev: {
      '计算机科学与技术': 90, '软件工程': 95, '设计学': 70,
      '人工智能': 60, '数据科学': 50, '信息管理': 60,
      '电子信息': 55, '数学': 45, '其他理工类': 40,
    },
    backend_dev: {
      '计算机科学与技术': 95, '软件工程': 95, '人工智能': 65,
      '数据科学': 55, '信息管理': 50, '电子信息': 60,
      '数学': 55, '自动化': 50, '其他理工类': 45,
    },
    data_analyst: {
      '数据科学': 95, '统计学': 90, '计算机科学与技术': 70,
      '数学': 80, '信息管理': 65, '经济学': 60,
      '管理学': 50, '软件工程': 55, '其他理工类': 40,
    },
    ai_engineer: {
      '人工智能': 95, '计算机科学与技术': 85, '数据科学': 80,
      '数学': 75, '统计学': 70, '软件工程': 65,
      '电子信息': 55, '自动化': 50, '其他理工类': 40,
    },
    product_manager: {
      '信息管理': 80, '管理学': 85, '软件工程': 70,
      '计算机科学与技术': 65, '设计学': 70, '心理学': 65,
      '经济学': 60, '数据科学': 55, '其他文科类': 50,
    },
  };

  let baseScore = majorRelevance[career.code]?.[major] || 35;

  // Education level bonus
  const eduBonus: Record<string, number> = {
    phd: 15, master: 10, bachelor: 5, associate: 0, highSchool: -5,
  };
  baseScore += eduBonus[education] || 0;

  return Math.max(0, Math.min(100, baseScore));
}

/**
 * 计算市场热度得分 (0-100)
 */
function calcMarketScore(career: CareerTag): number {
  const demandScores: Record<string, number> = {
    high: 85, medium: 60, low: 40,
  };
  return demandScores[career.marketData.demandLevel] || 50;
}

/**
 * 生成推荐原因
 */
function generateReasons(
  assessment: AssessmentData,
  career: CareerTag,
  breakdown: MatchBreakdown,
): string[] {
  const reasons: string[] = [];

  if (breakdown.skillScore >= 70) {
    const topSkills = Object.entries(career.requiredSkills)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([key]) => {
        const labels: Record<string, string> = {
          programming: '编程', dataAnalysis: '数据分析', communication: '沟通表达',
          projectManagement: '项目管理', design: '设计', algorithms: '算法',
          systemDesign: '系统设计', machineLearning: '机器学习',
        };
        return labels[key] || key;
      });
    reasons.push(`你的${topSkills.join('和')}能力与该职业的核心要求高度匹配`);
  }

  if (breakdown.interestScore >= 70) {
    const matchedInterests = career.interestTags.filter(
      tag => assessment.interests.selectedInterests.includes(tag)
    );
    if (matchedInterests.length > 0) {
      reasons.push(`你对${matchedInterests.slice(0, 2).join('、')}的兴趣与该职业方向高度相关`);
    }
  }

  if (breakdown.personalityScore >= 70) {
    reasons.push('你的性格特质非常适合这个职业的工作环境');
  }

  if (breakdown.backgroundScore >= 70) {
    reasons.push(`你的专业背景（${assessment.professional.major}）为该职业提供了良好基础`);
  }

  if (career.marketData.demandLevel === 'high') {
    reasons.push(`该职业市场需求旺盛，岗位增长率${career.marketData.jobGrowthRate}`);
  }

  // Ensure at least 2 reasons
  if (reasons.length < 2) {
    if (breakdown.skillScore >= 50) {
      reasons.push('你具备该职业所需的部分基础技能，有较好的成长空间');
    }
    if (reasons.length < 2) {
      reasons.push('该职业发展前景良好，值得关注和培养');
    }
  }

  return reasons.slice(0, 3);
}

/**
 * 核心匹配计算函数
 * 输入：用户测评数据
 * 输出：完整的匹配报告
 */
export function calculateMatch(assessment: AssessmentData): MatchReport {
  const results: MatchResult[] = careerTags.map(career => {
    const breakdown: MatchBreakdown = {
      skillScore: Math.round(calcSkillScore(assessment.skills, career)),
      interestScore: Math.round(calcInterestScore(assessment, career)),
      personalityScore: Math.round(calcPersonalityScore(assessment.personality, career)),
      backgroundScore: Math.round(calcBackgroundScore(assessment, career)),
      marketScore: Math.round(calcMarketScore(career)),
    };

    const score = Math.round(
      breakdown.skillScore * WEIGHTS.skill +
      breakdown.interestScore * WEIGHTS.interest +
      breakdown.personalityScore * WEIGHTS.personality +
      breakdown.backgroundScore * WEIGHTS.background +
      breakdown.marketScore * WEIGHTS.market
    );

    const reasons = generateReasons(assessment, career, breakdown);

    return {
      careerCode: career.code,
      careerName: career.name,
      score: Math.max(10, Math.min(98, score)), // clamp to 10-98
      breakdown,
      reasons,
      rank: 0, // will be set after sorting
    };
  });

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  results.forEach((r, i) => { r.rank = i + 1; });

  return {
    results,
    primaryRecommendation: results[0].careerCode,
    secondaryRecommendations: results.slice(1, 3).map(r => r.careerCode),
    generatedAt: new Date().toISOString(),
  };
}
