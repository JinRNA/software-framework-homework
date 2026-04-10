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
          newErrors.personality = '请完成所有性格特质评分';
        }
        break;
      }
      case 'skills': {
        const vals = Object.values(skills);
        if (vals.some(v => v === 0)) {
          newErrors.skills = '请完成所有技能评分';
        }
        break;
      }
      case 'interests': {
        if (interests.selectedInterests.length < 2) {
          newErrors.interests = '请至少选择2个感兴趣的领域';
        }
        if (interests.workTypePreference.length === 0) {
          newErrors.workType = '请至少选择1种工作类型偏好';
        }
        break;
      }
      case 'professional': {
        if (!professional.major) {
          newErrors.major = '请选择你的专业';
        }
        break;
      }
      case 'location': {
        if (!location.city) {
          newErrors.city = '请选择期望工作城市';
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
    await new Promise(resolve => setTimeout(resolve, 1500));

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
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-primary)',
        paddingTop: '64px',
      }}>
        <div className="animate-fade-in" style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '1.5rem',
            animation: 'pulse-glow 2s ease-in-out infinite',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            background: 'rgba(99, 102, 241, 0.1)',
          }}>
            🔮
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            正在分析你的职业画像...
          </h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            系统正在综合计算匹配度，请稍候
          </p>
          <div className="progress-bar" style={{ maxWidth: '300px', margin: '1.5rem auto 0' }}>
            <div
              className="progress-bar-fill"
              style={{
                width: '80%',
                animation: 'gradient-shift 2s ease infinite',
                backgroundSize: '200% 200%',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-mesh" style={{ minHeight: '100vh', paddingTop: '64px' }}>
      <div className="container" style={{ maxWidth: '720px', padding: '2rem 1.5rem 4rem' }}>
        {/* Progress */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              测评进度
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-primary-light)', fontWeight: 600 }}>
              {currentSection + 1} / {totalSections}
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          {/* Section tabs */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '1rem',
            flexWrap: 'wrap',
          }}>
            {sectionOrder.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  if (i < currentSection) setCurrentSection(i);
                }}
                style={{
                  padding: '0.375rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.8rem',
                  cursor: i <= currentSection ? 'pointer' : 'default',
                  background: i === currentSection
                    ? 'rgba(99, 102, 241, 0.2)'
                    : i < currentSection
                      ? 'rgba(16, 185, 129, 0.15)'
                      : 'var(--color-bg-tertiary)',
                  color: i === currentSection
                    ? 'var(--color-primary-light)'
                    : i < currentSection
                      ? 'var(--color-success)'
                      : 'var(--color-text-muted)',
                  fontWeight: i === currentSection ? 600 : 400,
                }}
              >
                {sectionInfo[s].icon} {sectionInfo[s].title}
                {i < currentSection && ' ✓'}
              </button>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div className="glass-card animate-fade-in" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }}>{info.icon}</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{info.title}</h2>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>{info.description}</p>
        </div>

        {/* Section Content */}
        <div className="animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.1s' }}>
          {section === 'personality' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {personalityQuestions.map(q => (
                <div key={q.id} className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    {q.question}
                  </h3>
                  {q.description && (
                    <p style={{
                      color: 'var(--color-text-muted)',
                      fontSize: '0.85rem',
                      marginBottom: '1rem',
                    }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {skillQuestions.map(q => (
                <div key={q.id} className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    {q.question}
                  </h3>
                  {q.description && (
                    <p style={{
                      color: 'var(--color-text-muted)',
                      fontSize: '0.85rem',
                      marginBottom: '1rem',
                    }}>
                      {q.description}
                    </p>
                  )}
                  <LikertScale
                    value={skills[q.field as keyof SkillsRating] || 0}
                    onChange={v => setSkills(prev => ({ ...prev, [q.field]: v }))}
                    labels={['初学者', '精通']}
                  />
                </div>
              ))}
            </div>
          )}

          {section === 'interests' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                  你对以下哪些技术领域感兴趣？
                  <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, fontSize: '0.85rem' }}>
                    （至少选2个）
                  </span>
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {interestOptions.map(opt => {
                    const selected = interests.selectedInterests.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleInterest(opt)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: 'var(--radius-full)',
                          border: selected
                            ? '1px solid var(--color-primary)'
                            : '1px solid var(--color-border)',
                          background: selected
                            ? 'rgba(99, 102, 241, 0.2)'
                            : 'transparent',
                          color: selected
                            ? 'var(--color-primary-light)'
                            : 'var(--color-text-secondary)',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: selected ? 600 : 400,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {errors.interests && (
                  <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    {errors.interests}
                  </p>
                )}
              </div>

              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                  你更倾向哪种工作类型？
                  <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, fontSize: '0.85rem' }}>
                    （至少选1个）
                  </span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {workTypeOptions.map(opt => {
                    const selected = interests.workTypePreference.includes(opt.value as WorkType);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleWorkType(opt.value)}
                        style={{
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          border: selected
                            ? '1px solid var(--color-primary)'
                            : '1px solid var(--color-border)',
                          background: selected
                            ? 'rgba(99, 102, 241, 0.12)'
                            : 'transparent',
                          color: selected
                            ? 'var(--color-primary-light)'
                            : 'var(--color-text-secondary)',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          textAlign: 'left',
                          fontWeight: selected ? 500 : 400,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {selected ? '✓ ' : ''}{opt.label}
                      </button>
                    );
                  })}
                </div>
                {errors.workType && (
                  <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    {errors.workType}
                  </p>
                )}
              </div>
            </div>
          )}

          {section === 'professional' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <label className="form-label">学历</label>
                <select
                  className="form-input"
                  value={professional.education}
                  onChange={e => setProfessional(prev => ({
                    ...prev,
                    education: e.target.value as EducationLevel,
                  }))}
                >
                  <option value="highSchool">高中/中专</option>
                  <option value="associate">大专</option>
                  <option value="bachelor">本科</option>
                  <option value="master">硕士</option>
                  <option value="phd">博士</option>
                </select>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <label className="form-label">专业方向</label>
                <select
                  className="form-input"
                  value={professional.major}
                  onChange={e => setProfessional(prev => ({ ...prev, major: e.target.value }))}
                >
                  <option value="">请选择专业</option>
                  {majorOptions.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                {errors.major && (
                  <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    {errors.major}
                  </p>
                )}
              </div>

              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <label className="form-label">当前阶段</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {[
                    { value: 'student', label: '在校学生' },
                    { value: 'graduated', label: '已毕业' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setProfessional(prev => ({
                        ...prev,
                        stage: opt.value as 'student' | 'graduated',
                      }))}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: professional.stage === opt.value
                          ? '1px solid var(--color-primary)'
                          : '1px solid var(--color-border)',
                        background: professional.stage === opt.value
                          ? 'rgba(99, 102, 241, 0.15)'
                          : 'transparent',
                        color: professional.stage === opt.value
                          ? 'var(--color-primary-light)'
                          : 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {section === 'location' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <label className="form-label">期望工作城市</label>
                <select
                  className="form-input"
                  value={location.city}
                  onChange={e => setLocation(prev => ({ ...prev, city: e.target.value }))}
                >
                  <option value="">请选择城市</option>
                  {cityOptions.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.city && (
                  <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    {errors.city}
                  </p>
                )}
              </div>

              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <label className="form-label">是否接受远程工作</label>
                <button
                  type="button"
                  onClick={() => setLocation(prev => ({ ...prev, acceptRemote: !prev.acceptRemote }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: location.acceptRemote
                      ? '1px solid var(--color-success)'
                      : '1px solid var(--color-border)',
                    background: location.acceptRemote
                      ? 'rgba(16, 185, 129, 0.12)'
                      : 'transparent',
                    color: location.acceptRemote
                      ? 'var(--color-success)'
                      : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {location.acceptRemote ? '✓ 接受远程工作' : '不接受远程工作'}
                </button>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <label className="form-label">期望薪资范围</label>
                <select
                  className="form-input"
                  value={location.salaryRange}
                  onChange={e => setLocation(prev => ({
                    ...prev,
                    salaryRange: e.target.value as SalaryRange,
                  }))}
                >
                  <option value="below8k">8K以下</option>
                  <option value="8k-15k">8K - 15K</option>
                  <option value="15k-25k">15K - 25K</option>
                  <option value="25k-40k">25K - 40K</option>
                  <option value="above40k">40K以上</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Error summary */}
        {Object.keys(errors).length > 0 && errors.personality && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-danger)',
            fontSize: '0.85rem',
          }}>
            {errors.personality}
          </div>
        )}
        {errors.skills && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-danger)',
            fontSize: '0.85rem',
          }}>
            {errors.skills}
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '2rem',
          gap: '1rem',
        }}>
          <button
            className="btn-secondary"
            onClick={handlePrev}
            disabled={currentSection === 0}
            style={{ opacity: currentSection === 0 ? 0.3 : 1 }}
          >
            ← 上一步
          </button>
          <button
            className="btn-primary"
            onClick={handleNext}
          >
            {currentSection === totalSections - 1 ? '🔮 提交并计算' : '下一步 →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;
