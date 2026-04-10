/**
 * 测评问卷题目数据
 * 覆盖5个维度：性格特质、专业背景、技能基础、兴趣偏好、地理与期望
 */

export interface QuestionItem {
  id: string;
  section: 'personality' | 'professional' | 'skills' | 'interests' | 'location';
  type: 'likert' | 'select' | 'multiselect' | 'radio';
  question: string;
  description?: string;
  options?: { value: string; label: string }[];
  field: string;
}

export const sectionInfo: Record<string, { title: string; description: string; icon: string }> = {
  personality: {
    title: '性格特质',
    description: '了解你的性格偏好，帮助匹配最适合的工作环境',
    icon: '🧠',
  },
  professional: {
    title: '专业背景',
    description: '你的教育和专业经历是职业规划的重要参考',
    icon: '🎓',
  },
  skills: {
    title: '技能基础',
    description: '对你当前各项技能的真实评估，帮助精准匹配',
    icon: '💪',
  },
  interests: {
    title: '兴趣偏好',
    description: '兴趣是最好的老师，选择你真正热爱的方向',
    icon: '❤️',
  },
  location: {
    title: '地理与期望',
    description: '你的城市偏好和薪资期望',
    icon: '📍',
  },
};

export const sectionOrder = ['personality', 'professional', 'skills', 'interests', 'location'];

export const personalityQuestions: QuestionItem[] = [
  {
    id: 'p1',
    section: 'personality',
    type: 'likert',
    question: '你更喜欢独立工作还是团队协作？',
    description: '1分 = 非常喜欢独立，5分 = 非常喜欢团队',
    field: 'extraversion',
  },
  {
    id: 'p2',
    section: 'personality',
    type: 'likert',
    question: '遇到复杂问题时，你更关注细节还是整体？',
    description: '1分 = 非常关注细节，5分 = 非常关注全局',
    field: 'openness',
  },
  {
    id: 'p3',
    section: 'personality',
    type: 'likert',
    question: '面对计划变更，你更倾向灵活应对还是坚持原计划？',
    description: '1分 = 坚持原计划，5分 = 灵活调整',
    field: 'agreeableness',
  },
  {
    id: 'p4',
    section: 'personality',
    type: 'likert',
    question: '你做事时更注重效率和结果，还是过程和体验？',
    description: '1分 = 注重过程，5分 = 注重效率结果',
    field: 'conscientiousness',
  },
  {
    id: 'p5',
    section: 'personality',
    type: 'likert',
    question: '在压力下你能保持冷静和专注吗？',
    description: '1分 = 容易焦虑，5分 = 非常冷静',
    field: 'neuroticism',
  },
];

export const skillQuestions: QuestionItem[] = [
  {
    id: 's1',
    section: 'skills',
    type: 'likert',
    question: '编程能力',
    description: '你对编程语言和代码实现的熟练程度',
    field: 'programming',
  },
  {
    id: 's2',
    section: 'skills',
    type: 'likert',
    question: '数据分析能力',
    description: '使用SQL、Excel或Python进行数据处理和分析的能力',
    field: 'dataAnalysis',
  },
  {
    id: 's3',
    section: 'skills',
    type: 'likert',
    question: '沟通表达能力',
    description: '口头和书面表达、团队协调的能力',
    field: 'communication',
  },
  {
    id: 's4',
    section: 'skills',
    type: 'likert',
    question: '项目管理能力',
    description: '规划、组织和推进项目的能力',
    field: 'projectManagement',
  },
  {
    id: 's5',
    section: 'skills',
    type: 'likert',
    question: '设计能力',
    description: '界面设计、原型制作、用户体验设计的能力',
    field: 'design',
  },
  {
    id: 's6',
    section: 'skills',
    type: 'likert',
    question: '算法基础',
    description: '数据结构与算法知识的掌握程度',
    field: 'algorithms',
  },
  {
    id: 's7',
    section: 'skills',
    type: 'likert',
    question: '系统设计能力',
    description: '架构设计、模块划分、系统集成的能力',
    field: 'systemDesign',
  },
  {
    id: 's8',
    section: 'skills',
    type: 'likert',
    question: '机器学习基础',
    description: '机器学习理论和实践应用的了解程度',
    field: 'machineLearning',
  },
];
