import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import ScoreRing from '../components/ScoreRing';
import { storageService } from '../services/storage';
import { careerTags } from '../data/careers';
import type { MatchResult } from '../types';

const ReportPage: React.FC = () => {
  const navigate = useNavigate();
  const report = storageService.getMatchReport();

  if (!report) {
    return (
      <div className="bg-mesh" style={{
        minHeight: '100vh',
        paddingTop: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            尚未完成测评
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            请先完成首次职业测评，系统将为你生成匹配报告
          </p>
          <button className="btn-primary" onClick={() => navigate('/assessment')}>
            🚀 开始测评
          </button>
        </div>
      </div>
    );
  }

  const top = report.results[0];
  const topCareer = careerTags.find(c => c.code === top.careerCode)!;

  // Radar data for top career
  const radarData = [
    { subject: '技能', value: top.breakdown.skillScore },
    { subject: '兴趣', value: top.breakdown.interestScore },
    { subject: '性格', value: top.breakdown.personalityScore },
    { subject: '背景', value: top.breakdown.backgroundScore },
    { subject: '市场', value: top.breakdown.marketScore },
  ];

  // Bar chart data
  const barData = report.results.map(r => ({
    name: r.careerName.replace('工程师', '').replace('分析师', '分析'),
    score: r.score,
    code: r.careerCode,
  }));

  const getColor = (code: string) => careerTags.find(c => c.code === code)?.color || '#6366f1';

  return (
    <div className="bg-mesh" style={{ minHeight: '100vh', paddingTop: '64px' }}>
      <div className="container" style={{ maxWidth: '960px', padding: '2rem 1.5rem 4rem' }}>
        {/* Header */}
        <div className="animate-fade-in-up" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎯</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <span className="text-gradient">职业方向匹配报告</span>
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            基于你的多维测评数据，系统已计算出以下匹配结果
          </p>
        </div>

        {/* Primary Recommendation Card */}
        <div
          className="glass-card animate-fade-in-up"
          style={{
            padding: '2rem',
            marginBottom: '2rem',
            border: `1px solid ${topCareer.color}40`,
            background: `linear-gradient(135deg, ${topCareer.color}10, transparent)`,
            animationDelay: '0.1s',
            opacity: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span className="tag" style={{
              background: `${topCareer.color}25`,
              color: topCareer.color,
            }}>
              🏆 最佳匹配
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
          }}>
            <ScoreRing score={top.score} size={140} color={topCareer.color} label="匹配度" />

            <div style={{ flex: 1, minWidth: '260px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {topCareer.icon} {topCareer.name}
              </h2>
              <p style={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                marginBottom: '1rem',
              }}>
                {topCareer.description}
              </p>

              {/* Reasons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {top.reasons.map((reason, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)',
                  }}>
                    <span style={{ color: 'var(--color-success)', flexShrink: 0 }}>✓</span>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Market Data */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 'var(--radius-md)',
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                平均薪资
              </div>
              <div style={{ fontWeight: 600, color: 'var(--color-accent)' }}>
                {topCareer.marketData.avgSalary}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                岗位增长
              </div>
              <div style={{ fontWeight: 600, color: 'var(--color-success)' }}>
                {topCareer.marketData.jobGrowthRate}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                市场需求
              </div>
              <div style={{ fontWeight: 600 }}>
                <span className={`tag tag-${topCareer.marketData.demandLevel === 'high' ? 'success' : 'warning'}`}>
                  {topCareer.marketData.demandLevel === 'high' ? '需求旺盛' : '需求一般'}
                </span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                岗位数量
              </div>
              <div style={{ fontWeight: 600 }}>
                {topCareer.marketData.jobCount}
              </div>
            </div>
          </div>

          {/* Hot Skills */}
          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
              热门技能要求
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {topCareer.marketData.hotSkills.map(skill => (
                <span key={skill} className="tag">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}>
          {/* Radar Chart */}
          <div
            className="glass-card animate-fade-in-up"
            style={{ padding: '1.5rem', animationDelay: '0.2s', opacity: 0 }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
              📊 最佳匹配维度分析
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(148, 163, 184, 0.2)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 13 }} />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <Radar
                  name="匹配度"
                  dataKey="value"
                  stroke={topCareer.color}
                  fill={topCareer.color}
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div
            className="glass-card animate-fade-in-up"
            style={{ padding: '1.5rem', animationDelay: '0.3s', opacity: 0 }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
              📈 全部职业匹配度对比
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={80}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: '#1e293b',
                    border: '1px solid rgba(148,163,184,0.2)',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                  }}
                  formatter={(value: number) => [`${value}%`, '匹配度']}
                />
                <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                  {barData.map((entry) => (
                    <Cell key={entry.code} fill={getColor(entry.code)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* All Results Cards */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>
          全部匹配结果
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {report.results.map((result: MatchResult, i: number) => {
            const career = careerTags.find(c => c.code === result.careerCode)!;
            return (
              <div
                key={result.careerCode}
                className="glass-card animate-fade-in-up"
                style={{
                  padding: '1.25rem 1.5rem',
                  animationDelay: `${0.3 + i * 0.1}s`,
                  opacity: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  background: `${career.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  flexShrink: 0,
                }}>
                  {career.icon}
                </div>

                <div style={{ flex: 1, minWidth: '150px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '1rem' }}>{career.name}</span>
                    {result.rank === 1 && <span className="tag tag-success" style={{ fontSize: '0.7rem' }}>主推</span>}
                    {(result.rank === 2 || result.rank === 3) && (
                      <span className="tag tag-warning" style={{ fontSize: '0.7rem' }}>副推</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                    {result.reasons[0]}
                  </div>
                </div>

                {/* Score breakdown mini */}
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                }}>
                  <span>技能 {result.breakdown.skillScore}</span>
                  <span>兴趣 {result.breakdown.interestScore}</span>
                  <span>性格 {result.breakdown.personalityScore}</span>
                </div>

                <div style={{
                  fontWeight: 700,
                  fontSize: '1.4rem',
                  color: career.color,
                  flexShrink: 0,
                }}>
                  {result.score}%
                </div>
              </div>
            );
          })}
        </div>

        {/* Action */}
        <div style={{ textAlign: 'center' }}>
          <button
            className="btn-primary"
            onClick={() => navigate('/selection')}
            style={{ padding: '1rem 3rem', fontSize: '1.05rem' }}
          >
            🎯 选择我的职业方向
          </button>
          <p style={{
            color: 'var(--color-text-muted)',
            fontSize: '0.85rem',
            marginTop: '0.75rem',
          }}>
            选择1个主方向和最多2个副方向
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
