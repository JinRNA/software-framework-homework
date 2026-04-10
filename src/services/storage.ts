import type { AssessmentData, MatchReport, CareerChoice, AppState } from '../types';

const STORAGE_KEYS = {
  assessment: 'talent_sketch_assessment',
  matchReport: 'talent_sketch_report',
  careerChoice: 'talent_sketch_choice',
};

/**
 * 存储服务 - localStorage 封装
 * 后续可替换为真实API调用
 */
export const storageService = {
  /** 保存测评数据 */
  saveAssessment(data: AssessmentData): void {
    localStorage.setItem(STORAGE_KEYS.assessment, JSON.stringify(data));
  },

  /** 获取测评数据 */
  getAssessment(): AssessmentData | null {
    const raw = localStorage.getItem(STORAGE_KEYS.assessment);
    return raw ? JSON.parse(raw) : null;
  },

  /** 保存匹配报告 */
  saveMatchReport(report: MatchReport): void {
    localStorage.setItem(STORAGE_KEYS.matchReport, JSON.stringify(report));
  },

  /** 获取匹配报告 */
  getMatchReport(): MatchReport | null {
    const raw = localStorage.getItem(STORAGE_KEYS.matchReport);
    return raw ? JSON.parse(raw) : null;
  },

  /** 保存职业选择 */
  saveCareerChoice(choice: CareerChoice): void {
    localStorage.setItem(STORAGE_KEYS.careerChoice, JSON.stringify(choice));
  },

  /** 获取职业选择 */
  getCareerChoice(): CareerChoice | null {
    const raw = localStorage.getItem(STORAGE_KEYS.careerChoice);
    return raw ? JSON.parse(raw) : null;
  },

  /** 获取完整应用状态 */
  getAppState(): AppState {
    const assessment = this.getAssessment();
    const matchReport = this.getMatchReport();
    const careerChoice = this.getCareerChoice();

    return {
      assessment,
      matchReport,
      careerChoice,
      hasCompletedAssessment: !!assessment && !!matchReport,
    };
  },

  /** 清除所有数据 */
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  },
};
