import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import ScoreRing from '../components/ScoreRing';
import { storageService } from '../services/storage';
import { careerTags } from '../data/careers';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const state = storageService.getAppState();
  const { matchReport, careerChoice, assessment } = state;

  if (!matchReport || !careerChoice) {
    return (
      <div className="bg-mesh" style={{
        minHeight: '100vh',
        paddingTop: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '450px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            {!matchReport ? '请先完成测评' : '请先选择职业方向'}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            {!matchReport
              ? '完成测评后可以查看个人面板'
              : '查看报告后请选择你的职业方向'}
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate(!matchReport ? '/assessment' : '/selection')}
          >
            {!matchReport ? '📝 开始测评' : '🎯 选择方向'}
          </button>
        </div>
      </div>
    );
  }

  const primaryResult = matchReport.results.find(r => r.careerCode === careerChoice.primaryCareer);
  const primaryCareer = careerTags.find(c => c.code === careerChoice.primaryCareer);
  const secondaryResults = careerChoice.secondaryCareers.map(code => ({
    result: matchReport.results.find(r => r.careerCode === code),
    career: careerTags.find(c => c.code === code),
  }));

  // Mock trend data for future feature
  const trendData = [
    { month: '1月', score: (primaryResult?.score || 70) - 15 },
    { month: '2月', score: (primaryResult?.score || 70) - 8 },
    { month: '3月', score: (primaryResult?.score || 70) - 3 },
    { month: '4月', score: primaryResult?.score || 70 },
  ];

  // Ability profile from skills
  const abilityData = assessment ? [
    { skill: '编程', value: assessment.skills.programming * 20 },
    { skill: '数据分析', value: assessment.skills.dataAnalysis * 20 },
    { skill: '沟通', value: assessment.skills.communication * 20 },
    { skill: '设计', value: assessment.skills.design * 20 },
    { skill: '算法', value: assessment.skills.algorithms * 20 },
    { skill: '系统设计', value: assessment.skills.systemDesign * 20 },
    { skill: 'ML', value: assessment.skills.machineLearning * 20 },
    { skill: '项目管理', value: assessment.skills.projectManagement * 20 },
  ] : [];

  return (
    <div className="bg-mesh" style={{ minHeight: '100vh', paddingTop: '64px' }}>
      <div className="container" style={{ maxWidth: '1100px', padding: '2rem 1.5rem 4rem' }}>
        {/* Header */}
        <div className="animate-fade-in-up" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            📈 我的职业面板
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            你的职业方向概览和能力画像
          </p>
        </div>

        {/* Primary Career Card */}
        {primaryResult && primaryCareer && (
          <div
            className="glass-card animate-fade-in-up"
            style={{
              padding: '2rem',
              marginBottom: '1.5rem',
              animationDelay: '0.1s',
              opacity: 0,
              border: `1px solid ${primaryCareer.color}40`,
              background: `linear-gradient(135deg, ${primaryCareer.color}08, transparent)`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span className="tag tag-success">⭐ 主职业方向</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              flexWrap: 'wrap',
            }}>
              <ScoreRing score={primaryResult.score} size={130} color={primaryCareer.color} label="匹配度" />
              <div style={{ flex: 1, minWidth: '250px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {primaryCareer.icon} {primaryCareer.name}
                </h2>
                <p style={{
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '1rem',
                  fontSize: '0.95rem',
                }}>
                  {primaryCareer.description}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {primaryCareer.marketData.hotSkills.map(skill => (
                    <span key={skill} className="tag">{skill}</span>
                  ))}
                </div>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                alignItems: 'flex-end',
                flexShrink: 0,
              }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>平均薪资</div>
                  <div style={{ fontWeight: 600, color: 'var(--color-accent)' }}>
                    {primaryCareer.marketData.avgSalary}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>岗位增长</div>
                  <div style={{ fontWeight: 600, color: 'var(--color-success)' }}>
                    {primaryCareer.marketData.jobGrowthRate}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Careers */}
        {secondaryResults.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}>
            {secondaryResults.map(({ result, career }, i) => {
              if (!result || !career) return null;
              return (
                <div
                  key={career.code}
                  className="glass-card animate-fade-in-up"
                  style={{
                    padding: '1.5rem',
                    animationDelay: `${0.2 + i * 0.1}s`,
                    opacity: 0,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span className="tag tag-warning">副方向</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <ScoreRing score={result.score} size={80} color={career.color} />
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        {career.icon} {career.name}
                      </h3>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        薪资 {career.marketData.avgSalary}
                      </div>
                      <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                        {career.marketData.hotSkills.slice(0, 3).map(skill => (
                          <span key={skill} className="tag" style={{ fontSize: '0.7rem' }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Charts Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}>
          {/* Ability Radar */}
          {abilityData.length > 0 && (
            <div
              className="glass-card animate-fade-in-up"
              style={{ padding: '1.5rem', animationDelay: '0.3s', opacity: 0 }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
                🧩 能力画像
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={abilityData}>
                  <PolarGrid stroke="rgba(148, 163, 184, 0.2)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Radar
                    name="能力值"
                    dataKey="value"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <p style={{
                textAlign: 'center',
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
                marginTop: '0.5rem',
              }}>
                基于你的技能自评，后续可通过学习任务动态更新
              </p>
            </div>
          )}

          {/* Trend Chart */}
          <div
            className="glass-card animate-fade-in-up"
            style={{ padding: '1.5rem', animationDelay: '0.4s', opacity: 0 }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
              📈 匹配度趋势（预览）
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: '#1e293b',
                    border: '1px solid rgba(148,163,184,0.2)',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                  }}
                  formatter={(value: number) => [`${value}%`, '匹配度']}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1"
                  fill="url(#trendGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
            <p style={{
              textAlign: 'center',
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              marginTop: '0.5rem',
            }}>
              趋势数据为模拟预览，后续将根据学习行为实时更新
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className="glass-card animate-fade-in-up"
          style={{ padding: '1.5rem', animationDelay: '0.5s', opacity: 0 }}
        >
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
            ⚡ 快捷操作
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem',
          }}>
            <button className="btn-secondary" onClick={() => navigate('/report')} style={{ justifyContent: 'flex-start' }}>
              📊 查看完整报告
            </button>
            <button className="btn-secondary" onClick={() => navigate('/selection')} style={{ justifyContent: 'flex-start' }}>
              🎯 调整职业方向
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                storageService.clearAll();
                navigate('/assessment');
              }}
              style={{ justifyContent: 'flex-start' }}
            >
              🔄 重新测评
            </button>
          </div>
        </div>

        {/* Future Features Placeholder */}
        <div
          className="glass-card animate-fade-in-up"
          style={{
            padding: '2rem',
            marginTop: '1.5rem',
            animationDelay: '0.6s',
            opacity: 0,
            textAlign: 'center',
          }}
        >
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
            🔮 未来功能预览
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginTop: '1rem',
          }}>
            {[
              { icon: '📖', title: '学习路线', desc: '基于职业方向的定制学习路径' },
              { icon: '📋', title: '任务引擎', desc: '智能推荐的成长任务' },
              { icon: '📄', title: '电子简历', desc: '展示职业成长轨迹' },
              { icon: '🔔', title: '方向提醒', desc: '行为偏离提醒与建议' },
            ].map((feat, i) => (
              <div key={i} style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(100, 116, 139, 0.1)',
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{feat.icon}</div>
                <div style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{feat.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{feat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
