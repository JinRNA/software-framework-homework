import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LikertScale from '../components/LikertScale';
import {
  personalityQuestions,
  skillQuestions,
  sectionInfo,
  sectionOrder,
} from '../data/questions';
import {
  interestOptions,
  workTypeOptions,
  majorOptions,
  cityOptions,
} from '../data/careers';
import { storageService } from '../services/storage';
import { calculateMatch } from '../services/matchingEngine';
import type {
  PersonalityTraits,
  SkillsRating,
  InterestPreference,
  ProfessionalBackground,
  LocationPreference,
  AssessmentData,
  WorkType,
  EducationLevel,
  SalaryRange,
} from '../types';
import { BrainCircuit, GraduationCap, Dumbbell, Heart, MapPin, Sparkles, Check, ChevronRight, ChevronLeft, Hexagon } from 'lucide-react';

const sectionIconMap: Record<string, any> = {
  personality: BrainCircuit,
  professional: GraduationCap,
  skills: Dumbbell,
  interests: Heart,
  location: MapPin
};

const AssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [personality, setPersonality] = useState<PersonalityTraits>({
    openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0,
  });

  const [skills, setSkills] = useState<SkillsRating>({
    programming: 0, dataAnalysis: 0, communication: 0, projectManagement: 0,
    design: 0, algorithms: 0, systemDesign: 0, machineLearning: 0,
  });

  const [interests, setInterests] = useState<InterestPreference>({
    selectedInterests: [],
    workTypePreference: [],
  });

  const [professional, setProfessional] = useState<ProfessionalBackground>({
    education: 'bachelor',
    major: '',
    stage: 'student',
  });

  const [location, setLocation] = useState<LocationPreference>({
    city: '',
    acceptRemote: false,
    salaryRange: '8k-15k',
  });

  const section = sectionOrder[currentSection];
  const info = sectionInfo[section];
  const totalSections = sectionOrder.length;
  const progress = ((currentSection + 1) / totalSections) * 100;

  // Validation
  const validateSection = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    switch (section) {
      case 'personality': {
        const vals = Object.values(personality);
        if (vals.some(v => v === 0)) {
          newErrors.personality = '未能检测到完整基准参数，请补全特质评估面板。';
        }
        break;
      }
      case 'skills': {
        const vals = Object.values(skills);
        if (vals.some(v => v === 0)) {
          newErrors.skills = '技能矩阵残缺，请设定全量技能刻度。';
        }
        break;
      }
      case 'interests': {
        if (interests.selectedInterests.length < 2) {
          newErrors.interests = '引擎需要至少2个偏好方向锚点以启动推演。';
        }
        if (interests.workTypePreference.length === 0) {
          newErrors.workType = '工作模型未设定，请选定介入方式。';
        }
        break;
      }
      case 'professional': {
        if (!professional.major) {
          newErrors.major = '未输入所属知识网络（专业领域）。';
        }
        break;
      }
      case 'location': {
        if (!location.city) {
          newErrors.city = '物理降落坐标未锚定，请选定城市。';
        }
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [section, personality, skills, interests, professional, location]);

  const handleNext = () => {
    if (!validateSection()) return;

    if (currentSection < totalSections - 1) {
      setCurrentSection(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!validateSection()) return;

    setIsCalculating(true);

    const assessmentData: AssessmentData = {
      personality,
      skills,
      interests,
      professional,
      location,
      completedAt: new Date().toISOString(),
    };

    // Simulate calculation delay for UX
    await new Promise(resolve => setTimeout(resolve, 2500));

    const report = calculateMatch(assessmentData);

    storageService.saveAssessment(assessmentData);
    storageService.saveMatchReport(report);

    setIsCalculating(false);
    navigate('/report');
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(interest)
        ? prev.selectedInterests.filter(i => i !== interest)
        : [...prev.selectedInterests, interest],
    }));
  };

  const toggleWorkType = (workType: string) => {
    setInterests(prev => ({
      ...prev,
      workTypePreference: prev.workTypePreference.includes(workType as WorkType)
        ? prev.workTypePreference.filter(w => w !== workType)
        : [...prev.workTypePreference, workType as WorkType],
    }));
  };

  // Loading overlay
  if (isCalculating) {
    return (
      <div className="bg-mesh min-h-screen pt-16 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm z-0"></div>
        <div className="animate-fade-in relative z-10 flex flex-col items-center max-w-sm w-full mx-auto text-center glass-card p-12 shadow-2xl">
          <div className="w-24 h-24 rounded-full bg-indigo-500/10 border border-indigo-400/30 flex items-center justify-center mb-8 relative">
             <Hexagon className="w-12 h-12 text-indigo-400 animate-spin-slow" />
             <div className="absolute inset-0 rounded-full border-t-2 border-emerald-400 animate-spin"></div>
          </div>
          <h2 className="text-2xl font-black mb-3 text-white text-contrast-shadow tracking-wide">
            正在解算个人级特征矩阵...
          </h2>
          <p className="text-white/60 mb-10 text-sm font-bold tracking-widest">
            正在调集数据引擎提取拟合度指标
          </p>
          <div className="progress-bar max-w-xs h-2 bg-white/10 w-full overflow-hidden border border-white/5">
            <div
              className="progress-bar-fill h-full bg-gradient-to-r from-emerald-500 to-indigo-500 shadow-[0_0_15px_rgba(52,211,153,0.8)] rounded-full"
              style={{
                width: '80%',
                animation: 'gradient-shift 1.5s ease infinite alternate'
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  const SectionIcon = sectionIconMap[section];

  return (
    <div className="bg-mesh min-h-screen pt-24 pb-16">
      <div className="container max-w-3xl mx-auto px-4">
        {/* Progress */}
        <div className="mb-10 animate-fade-in-up">
          <div className="flex justify-between items-end mb-3">
            <span className="text-xs font-black tracking-widest text-white/50 uppercase">
              采集进度
            </span>
            <span className="text-sm font-black text-emerald-400">
              {currentSection + 1} / {totalSections}
            </span>
          </div>
          <div className="progress-bar h-2 bg-white/10 w-full shadow-inner border border-white/5">
            <div className="progress-bar-fill h-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          {/* Section tabs */}
          <div className="flex gap-2 mt-6 flex-wrap justify-center">
            {sectionOrder.map((s, i) => {
               const TabIcon = sectionIconMap[s];
               const isActive = i === currentSection;
               const isCompleted = i < currentSection;
               return (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    if (isCompleted) setCurrentSection(i);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg'
                      : isCompleted
                        ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20 cursor-pointer'
                        : 'bg-black/20 text-white/30 border border-transparent cursor-not-allowed'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" /> 
                  <span className="hidden sm:inline">{sectionInfo[s].title}</span>
                  {isCompleted && <Check className="w-3.5 h-3.5 ml-1 hidden sm:inline" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Section Header */}
        <div className="glass-card p-8 mb-8 animate-fade-in flex items-center gap-6 shadow-xl border-white/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
          <div className="w-16 h-16 rounded-2xl glass-panel flex-shrink-0 flex items-center justify-center border-white/30 shadow-lg relative z-10">
            <SectionIcon className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-white mb-2 tracking-wide text-contrast-shadow">{info.title}</h2>
            <p className="text-white/70 font-medium text-sm leading-relaxed">{info.description}</p>
          </div>
        </div>

        {/* Section Content */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {section === 'personality' && (
            <div className="flex flex-col gap-6">
              {personalityQuestions.map((q, idx) => (
                <div key={q.id} className="glass-card p-8 group hover:border-white/30 transition-colors" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <h3 className="text-lg font-bold text-white mb-2 text-contrast-shadow">
                    {q.question}
                  </h3>
                  {q.description && (
                    <p className="text-white/50 text-xs font-bold tracking-widest mb-6">
                      {q.description}
                    </p>
                  )}
                  <LikertScale
                    value={personality[q.field as keyof PersonalityTraits] || 0}
                    onChange={v => setPersonality(prev => ({ ...prev, [q.field]: v }))}
                  />
                </div>
              ))}
            </div>
          )}

          {section === 'skills' && (
            <div className="flex flex-col gap-6">
              {skillQuestions.map((q, idx) => (
                <div key={q.id} className="glass-card p-8 group hover:border-white/30 transition-colors" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <h3 className="text-lg font-bold text-white mb-2 text-contrast-shadow">
                    {q.question}
                  </h3>
                  {q.description && (
                    <p className="text-white/50 text-xs font-bold tracking-widest mb-6">
                      {q.description}
                    </p>
                  )}
                  <LikertScale
                    value={skills[q.field as keyof SkillsRating] || 0}
                    onChange={v => setSkills(prev => ({ ...prev, [q.field]: v }))}
                    labels={['基 础 了 解', '专 家 级 掌 握']}
                  />
                </div>
              ))}
            </div>
          )}

          {section === 'interests' && (
            <div className="flex flex-col gap-6">
              <div className="glass-card p-8">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-2 text-contrast-shadow">
                    偏好的技术赛道矩阵
                  </h3>
                  <span className="text-white/50 font-bold text-xs tracking-widest block">
                    要求: 最少激活两个技术赛道信号
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {interestOptions.map(opt => {
                    const selected = interests.selectedInterests.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleInterest(opt)}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border shadow-lg ${
                          selected
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30'
                        }`}
                      >
                        {opt} {selected && <Check className="w-3 h-3 inline-block ml-1" />}
                      </button>
                    );
                  })}
                </div>
                {errors.interests && (
                  <p className="text-red-400 text-xs font-bold mt-4 tracking-wide">
                    {errors.interests}
                  </p>
                )}
              </div>

              <div className="glass-card p-8">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-2 text-contrast-shadow">
                    操作模型倾向
                  </h3>
                  <span className="text-white/50 font-bold text-xs tracking-widest block">
                    要求: 指定至少一个可容忍的开发节奏
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {workTypeOptions.map(opt => {
                    const selected = interests.workTypePreference.includes(opt.value as WorkType);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleWorkType(opt.value)}
                        className={`px-5 py-4 w-full rounded-xl flex items-center text-sm font-bold transition-all duration-300 border shadow-sm ${
                          selected
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center mr-4 transition-colors ${selected ? 'border-emerald-400 bg-emerald-400/20 text-emerald-400' : 'border-white/30'}`}>
                          {selected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                {errors.workType && (
                  <p className="text-red-400 text-xs font-bold mt-4 tracking-wide">
                    {errors.workType}
                  </p>
                )}
              </div>
            </div>
          )}

          {section === 'professional' && (
            <div className="flex flex-col gap-6">
              <div className="glass-card p-8">
                <label className="form-label uppercase tracking-widest text-xs font-bold text-white/50">基础教育底座</label>
                <select
                  className="form-input text-white font-bold bg-slate-900/40 border-white/20 mt-2 hover:border-emerald-400/50 transition-colors cursor-pointer"
                  value={professional.education}
                  onChange={e => setProfessional(prev => ({
                    ...prev,
                    education: e.target.value as EducationLevel,
                  }))}
                >
                  <option value="highSchool">高中/中专集群</option>
                  <option value="associate">专科序列</option>
                  <option value="bachelor">本科学位</option>
                  <option value="master">硕士学位</option>
                  <option value="phd">博士及以上理论层</option>
                </select>
              </div>

              <div className="glass-card p-8">
                <label className="form-label uppercase tracking-widest text-xs font-bold text-white/50">核心专业领域</label>
                <select
                  className="form-input text-white font-bold bg-slate-900/40 border-white/20 mt-2 hover:border-emerald-400/50 transition-colors cursor-pointer"
                  value={professional.major}
                  onChange={e => setProfessional(prev => ({ ...prev, major: e.target.value }))}
                >
                  <option value="">-- 请求挂载专业体系 --</option>
                  {majorOptions.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                {errors.major && (
                  <p className="text-red-400 text-xs font-bold mt-4 tracking-wide">
                    {errors.major}
                  </p>
                )}
              </div>

              <div className="glass-card p-8">
                <label className="form-label uppercase tracking-widest text-xs font-bold text-white/50 mb-4">社会化接入阶段</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  {[
                    { value: 'student', label: '实习节点 (在校数据流)' },
                    { value: 'graduated', label: '实弹演练 (社会层接入)' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setProfessional(prev => ({
                        ...prev,
                        stage: opt.value as 'student' | 'graduated',
                      }))}
                      className={`flex-1 px-6 py-4 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 border shadow-sm ${
                        professional.stage === opt.value
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {section === 'location' && (
            <div className="flex flex-col gap-6">
              <div className="glass-card p-8">
                <label className="form-label uppercase tracking-widest text-xs font-bold text-white/50">物理主控节点城市</label>
                <select
                  className="form-input text-white font-bold bg-slate-900/40 border-white/20 mt-2 hover:border-emerald-400/50 transition-colors cursor-pointer"
                  value={location.city}
                  onChange={e => setLocation(prev => ({ ...prev, city: e.target.value }))}
                >
                  <option value="">-- 选择期望降落服务器 --</option>
                  {cityOptions.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-red-400 text-xs font-bold mt-4 tracking-wide">
                    {errors.city}
                  </p>
                )}
              </div>

              <div className="glass-card p-8">
                <label className="form-label uppercase tracking-widest text-xs font-bold text-white/50 mb-4">远程接入权限许可</label>
                <button
                  type="button"
                  onClick={() => setLocation(prev => ({ ...prev, acceptRemote: !prev.acceptRemote }))}
                  className={`px-5 py-4 w-full rounded-xl flex items-center gap-4 text-sm font-bold transition-all duration-300 border shadow-sm ${
                    location.acceptRemote
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${location.acceptRemote ? 'border-emerald-400 bg-emerald-400/20 text-emerald-400' : 'border-white/30'}`}>
                    {location.acceptRemote && <Check className="w-3.5 h-3.5" />}
                  </div>
                  {location.acceptRemote ? '已授权：允许通过网络协议进行分布式任务输出' : '未授权：限制本地全职作业环境'}
                </button>
              </div>

              <div className="glass-card p-8">
                <label className="form-label uppercase tracking-widest text-xs font-bold text-white/50">能源配给基准值 (薪资期望)</label>
                <select
                  className="form-input text-white font-bold bg-slate-900/40 border-white/20 mt-2 hover:border-emerald-400/50 transition-colors cursor-pointer"
                  value={location.salaryRange}
                  onChange={e => setLocation(prev => ({
                    ...prev,
                    salaryRange: e.target.value as SalaryRange,
                  }))}
                >
                  <option value="below8k">8K 阈值以下基座保障</option>
                  <option value="8k-15k">8K - 15K 常规执行区间</option>
                  <option value="15k-25k">15K - 25K 高级算力供给</option>
                  <option value="25k-40k">25K - 40K 专家级引擎超频档</option>
                  <option value="above40k">40K 以上结构领袖梯队</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Global Error summary */}
        {Object.keys(errors).length > 0 && (
          <div className="mt-8 bg-red-500/10 border border-red-500/30 rounded-xl p-6 shadow-xl backdrop-blur-md animate-fade-in text-center">
             <h4 className="text-red-400 font-bold mb-2">系统警告：信息输入不合规</h4>
             <p className="text-red-300 text-sm font-medium tracking-wide">存在缺失的核心测量特征，请依照页面红色提示纠正输入项，以便引擎启动解算。</p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-12 gap-4">
          <button
            className="btn-secondary h-14 w-full sm:w-auto px-8 flex items-center justify-center border-white/20 hover:border-white/40 group text-white/80"
            onClick={handlePrev}
            disabled={currentSection === 0}
            style={{ opacity: currentSection === 0 ? 0.3 : 1 }}
          >
            <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> 退回拦截点
          </button>
          <button
            className="btn-primary h-14 w-full sm:w-auto px-8 text-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] group"
            onClick={handleNext}
          >
            {currentSection === totalSections - 1 
              ? <><Sparkles className="w-5 h-5 mr-2" /> 触发主引擎运算</> 
              : <>推送下一梯队数据 <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;
