import type { CareerTag } from '../types';

/**
 * 职业标签库 - 内置5个职业方向样本
 * 每个职业具备：编码、名称、技能标签、兴趣标签、性格偏好、市场参考信息
 */
export const careerTags: CareerTag[] = [
  {
    code: 'frontend_dev',
    name: '前端开发工程师',
    icon: '🎨',
    description: '负责Web应用的用户界面开发，将设计稿转化为高质量的交互页面，关注用户体验与性能优化。',
    requiredSkills: {
      programming: 0.9,
      design: 0.6,
      systemDesign: 0.5,
      communication: 0.4,
      algorithms: 0.4,
      dataAnalysis: 0.2,
      projectManagement: 0.3,
      machineLearning: 0.1,
    },
    interestTags: ['前端开发', '用户体验', '可视化', '创意设计'],
    personalityPreference: {
      openness: 4,
      conscientiousness: 4,
      extraversion: 3,
      agreeableness: 3,
      neuroticism: 2,
    },
    marketData: {
      avgSalary: '15k-30k',
      jobGrowthRate: '+12%',
      demandLevel: 'high',
      hotSkills: ['React', 'TypeScript', 'Vue', 'Next.js', 'CSS'],
      jobCount: '45,000+',
    },
    color: '#6366f1',
  },
  {
    code: 'backend_dev',
    name: '后端开发工程师',
    icon: '⚙️',
    description: '负责服务端架构设计与开发，处理高并发、数据存储与系统安全，构建稳定可靠的后端服务。',
    requiredSkills: {
      programming: 0.95,
      systemDesign: 0.85,
      algorithms: 0.7,
      dataAnalysis: 0.4,
      projectManagement: 0.4,
      communication: 0.3,
      design: 0.1,
      machineLearning: 0.2,
    },
    interestTags: ['后端开发', '系统架构', '数据库', '分布式系统'],
    personalityPreference: {
      openness: 3,
      conscientiousness: 5,
      extraversion: 2,
      agreeableness: 3,
      neuroticism: 2,
    },
    marketData: {
      avgSalary: '18k-35k',
      jobGrowthRate: '+10%',
      demandLevel: 'high',
      hotSkills: ['Java', 'Go', 'Python', 'MySQL', '微服务'],
      jobCount: '52,000+',
    },
    color: '#06b6d4',
  },
  {
    code: 'data_analyst',
    name: '数据分析师',
    icon: '📊',
    description: '通过数据挖掘与统计分析，发现业务洞察，支撑数据驱动的决策，提升业务效率与用户增长。',
    requiredSkills: {
      dataAnalysis: 0.95,
      programming: 0.5,
      communication: 0.6,
      machineLearning: 0.4,
      algorithms: 0.5,
      projectManagement: 0.3,
      systemDesign: 0.2,
      design: 0.3,
    },
    interestTags: ['数据科学', '商业分析', '数据可视化', '统计学'],
    personalityPreference: {
      openness: 4,
      conscientiousness: 4,
      extraversion: 3,
      agreeableness: 3,
      neuroticism: 2,
    },
    marketData: {
      avgSalary: '14k-28k',
      jobGrowthRate: '+18%',
      demandLevel: 'high',
      hotSkills: ['SQL', 'Python', 'Excel', 'Tableau', '统计分析'],
      jobCount: '38,000+',
    },
    color: '#10b981',
  },
  {
    code: 'ai_engineer',
    name: 'AI 工程师',
    icon: '🤖',
    description: '研发人工智能模型与算法，构建智能系统，将机器学习研究成果转化为实际产品应用。',
    requiredSkills: {
      machineLearning: 0.95,
      programming: 0.8,
      algorithms: 0.85,
      dataAnalysis: 0.7,
      systemDesign: 0.5,
      communication: 0.3,
      projectManagement: 0.2,
      design: 0.1,
    },
    interestTags: ['人工智能', '深度学习', '自然语言处理', '计算机视觉'],
    personalityPreference: {
      openness: 5,
      conscientiousness: 4,
      extraversion: 2,
      agreeableness: 3,
      neuroticism: 2,
    },
    marketData: {
      avgSalary: '25k-50k',
      jobGrowthRate: '+35%',
      demandLevel: 'high',
      hotSkills: ['PyTorch', 'TensorFlow', 'LLM', 'NLP', 'Python'],
      jobCount: '28,000+',
    },
    color: '#f59e0b',
  },
  {
    code: 'product_manager',
    name: '产品经理',
    icon: '💡',
    description: '定义产品方向与策略，协调技术、设计、运营团队，推动产品从概念到落地的全生命周期管理。',
    requiredSkills: {
      communication: 0.9,
      projectManagement: 0.85,
      design: 0.5,
      dataAnalysis: 0.5,
      programming: 0.3,
      systemDesign: 0.4,
      algorithms: 0.1,
      machineLearning: 0.1,
    },
    interestTags: ['产品设计', '用户研究', '商业分析', '项目管理'],
    personalityPreference: {
      openness: 4,
      conscientiousness: 4,
      extraversion: 5,
      agreeableness: 4,
      neuroticism: 2,
    },
    marketData: {
      avgSalary: '16k-35k',
      jobGrowthRate: '+8%',
      demandLevel: 'medium',
      hotSkills: ['需求分析', '原型设计', '数据分析', '用户研究', 'Axure'],
      jobCount: '32,000+',
    },
    color: '#ec4899',
  },
];

/**
 * 兴趣选项
 */
export const interestOptions = [
  '人工智能', '后端开发', '前端开发', '数据科学',
  '用户体验', '产品设计', '系统架构', '分布式系统',
  '移动开发', '云计算', '网络安全', '项目管理',
  '商业分析', '运营', '创意设计', '数据可视化',
  '深度学习', '自然语言处理', '计算机视觉', '用户研究',
  '统计学', '数据库',
];

/**
 * 工作类型选项
 */
export const workTypeOptions: { value: string; label: string }[] = [
  { value: 'research', label: '研究型 — 喜欢深入探索与创新' },
  { value: 'engineering', label: '工程型 — 喜欢构建和实现系统' },
  { value: 'management', label: '管理型 — 喜欢协调团队与推动项目' },
  { value: 'creative', label: '创意型 — 喜欢设计与用户体验' },
  { value: 'analytical', label: '分析型 — 喜欢数据驱动决策' },
];

/**
 * 专业选项
 */
export const majorOptions = [
  '计算机科学与技术', '软件工程', '人工智能', '数据科学',
  '信息管理', '电子信息', '数学', '统计学',
  '自动化', '通信工程', '经济学', '管理学',
  '设计学', '心理学', '其他理工类', '其他文科类',
];

/**
 * 城市选项
 */
export const cityOptions = [
  '北京', '上海', '深圳', '杭州', '广州',
  '成都', '南京', '武汉', '西安', '长沙',
  '苏州', '重庆', '天津', '其他',
];
