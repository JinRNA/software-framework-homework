// ===== 测评相关类型 =====

/** 性格特质得分 */
export interface PersonalityTraits {
  openness: number;       // 开放性 1-5
  conscientiousness: number; // 尽责性 1-5
  extraversion: number;   // 外向性 1-5
  agreeableness: number;  // 宜人性 1-5
  neuroticism: number;    // 情绪稳定性 1-5
}

/** 技能自评 */
export interface SkillsRating {
  programming: number;    // 编程能力 1-5
  dataAnalysis: number;   // 数据分析 1-5
  communication: number;  // 沟通表达 1-5
  projectManagement: number; // 项目管理 1-5
  design: number;         // 设计能力 1-5
  algorithms: number;     // 算法基础 1-5
  systemDesign: number;   // 系统设计 1-5
  machineLearning: number; // 机器学习 1-5
}

/** 兴趣偏好 */
export interface InterestPreference {
  selectedInterests: string[];      // 选中的兴趣领域
  workTypePreference: WorkType[];   // 工作类型偏好
}

export type WorkType = 'research' | 'engineering' | 'management' | 'creative' | 'analytical';

/** 专业背景 */
export interface ProfessionalBackground {
  education: EducationLevel;
  major: string;
  stage: 'student' | 'graduated';
}

export type EducationLevel = 'highSchool' | 'associate' | 'bachelor' | 'master' | 'phd';

/** 地理与期望 */
export interface LocationPreference {
  city: string;
  acceptRemote: boolean;
  salaryRange: SalaryRange;
}

export type SalaryRange = 'below8k' | '8k-15k' | '15k-25k' | '25k-40k' | 'above40k';

/** 完整测评数据 */
export interface AssessmentData {
  personality: PersonalityTraits;
  skills: SkillsRating;
  interests: InterestPreference;
  professional: ProfessionalBackground;
  location: LocationPreference;
  completedAt: string;
}

// ===== 职业相关类型 =====

/** 职业标签 */
export interface CareerTag {
  code: string;
  name: string;
  icon: string;
  description: string;
  requiredSkills: Record<string, number>;  // 技能名 -> 权重(0-1)
  interestTags: string[];
  personalityPreference: Partial<PersonalityTraits>;
  marketData: MarketData;
  color: string;
}

/** 市场数据 */
export interface MarketData {
  avgSalary: string;
  jobGrowthRate: string;
  demandLevel: 'high' | 'medium' | 'low';
  hotSkills: string[];
  jobCount: string;
}

/** 匹配结果 */
export interface MatchResult {
  careerCode: string;
  careerName: string;
  score: number;          // 0-100
  breakdown: MatchBreakdown;
  reasons: string[];
  rank: number;
}

/** 匹配度分项 */
export interface MatchBreakdown {
  skillScore: number;
  interestScore: number;
  personalityScore: number;
  backgroundScore: number;
  marketScore: number;
}

/** 匹配报告 */
export interface MatchReport {
  results: MatchResult[];
  primaryRecommendation: string;
  secondaryRecommendations: string[];
  generatedAt: string;
}

// ===== 用户选择 =====

export interface CareerChoice {
  primaryCareer: string;       // career code
  secondaryCareers: string[];  // max 2
  selectedAt: string;
}

// ===== 应用状态 =====

export interface AppState {
  assessment: AssessmentData | null;
  matchReport: MatchReport | null;
  careerChoice: CareerChoice | null;
  hasCompletedAssessment: boolean;
}
