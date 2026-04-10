import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScoreRing from '../components/ScoreRing';
import { storageService } from '../services/storage';
import { careerTags } from '../data/careers';

const SelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const report = storageService.getMatchReport();
  const existingChoice = storageService.getCareerChoice();

  const [primaryCareer, setPrimaryCareer] = useState<string>(
    existingChoice?.primaryCareer || ''
  );
  const [secondaryCareers, setSecondaryCareers] = useState<string[]>(
    existingChoice?.secondaryCareers || []
  );
  const [error, setError] = useState('');

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
            请先完成测评
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            完成测评后才能选择职业方向
          </p>
          <button className="btn-primary" onClick={() => navigate('/assessment')}>
            🚀 开始测评
          </button>
        </div>
      </div>
    );
  }

  const handlePrimarySelect = (code: string) => {
    setPrimaryCareer(code);
    // Remove from secondary if it was there
    setSecondaryCareers(prev => prev.filter(c => c !== code));
    setError('');
  };

  const handleSecondaryToggle = (code: string) => {
    if (code === primaryCareer) return;

    setSecondaryCareers(prev => {
      if (prev.includes(code)) {
        return prev.filter(c => c !== code);
      }
      if (prev.length >= 2) {
        setError('最多只能选择2个副方向');
        return prev;
      }
      setError('');
      return [...prev, code];
    });
  };

  const handleConfirm = () => {
    if (!primaryCareer) {
      setError('请选择1个主职业方向');
      return;
    }

    storageService.saveCareerChoice({
      primaryCareer,
      secondaryCareers,
      selectedAt: new Date().toISOString(),
    });

    navigate('/dashboard');
  };

  return (
    <div className="bg-mesh" style={{ minHeight: '100vh', paddingTop: '64px' }}>
      <div className="container" style={{ maxWidth: '800px', padding: '2rem 1.5rem 4rem' }}>
        {/* Header */}
        <div className="animate-fade-in-up" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎯</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <span className="text-gradient">选择你的职业方向</span>
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            请选择 <strong>1个主方向</strong>（必选）和 <strong>最多2个副方向</strong>（可选）
          </p>
        </div>

        {/* Instructions */}
        <div className="glass-card" style={{
          padding: '1rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'var(--color-primary)',
            }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              点击"设为主方向"选择主方向
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'var(--color-accent)',
            }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              点击"设为副方向"添加副方向
            </span>
          </div>
        </div>

        {/* Career Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {report.results.map((result, i) => {
            const career = careerTags.find(c => c.code === result.careerCode)!;
            const isPrimary = primaryCareer === result.careerCode;
            const isSecondary = secondaryCareers.includes(result.careerCode);
            const isSelected = isPrimary || isSecondary;

            return (
              <div
                key={result.careerCode}
                className="glass-card animate-fade-in-up"
                style={{
                  padding: '1.5rem',
                  animationDelay: `${i * 0.1}s`,
                  opacity: 0,
                  border: isPrimary
                    ? `2px solid ${career.color}`
                    : isSecondary
                      ? `2px solid ${career.color}60`
                      : '1px solid var(--color-border)',
                  background: isSelected
                    ? `linear-gradient(135deg, ${career.color}08, transparent)`
                    : undefined,
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  flexWrap: 'wrap',
                }}>
                  <ScoreRing score={result.score} size={80} color={career.color} />

                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '1.3rem' }}>{career.icon}</span>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0 }}>
                        {career.name}
                      </h3>
                      {isPrimary && (
                        <span className="tag tag-success">⭐ 主方向</span>
                      )}
                      {isSecondary && (
                        <span className="tag tag-warning">副方向</span>
                      )}
                    </div>
                    <p style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      margin: '0 0 0.75rem 0',
                    }}>
                      {career.description}
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {career.marketData.hotSkills.slice(0, 3).map(skill => (
                        <span key={skill} className="tag" style={{ fontSize: '0.75rem' }}>
                          {skill}
                        </span>
                      ))}
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        薪资 {career.marketData.avgSalary}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    flexShrink: 0,
                  }}>
                    <button
                      className={isPrimary ? 'btn-primary' : 'btn-secondary'}
                      onClick={() => handlePrimarySelect(result.careerCode)}
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                      {isPrimary ? '✓ 已设为主方向' : '设为主方向'}
                    </button>
                    {!isPrimary && (
                      <button
                        className="btn-secondary"
                        onClick={() => handleSecondaryToggle(result.careerCode)}
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.85rem',
                          borderColor: isSecondary ? 'var(--color-accent)' : undefined,
                          color: isSecondary ? 'var(--color-accent)' : undefined,
                        }}
                      >
                        {isSecondary ? '✓ 取消副方向' : '设为副方向'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-danger)',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {/* Summary & Confirm */}
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>当前选择</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>主方向：</span>
              <span style={{ fontWeight: 600, color: primaryCareer ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {primaryCareer
                  ? careerTags.find(c => c.code === primaryCareer)?.name
                  : '未选择'}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>副方向：</span>
              <span style={{ fontWeight: 500 }}>
                {secondaryCareers.length > 0
                  ? secondaryCareers.map(c => careerTags.find(t => t.code === c)?.name).join('、')
                  : '未选择'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            className="btn-primary"
            onClick={handleConfirm}
            disabled={!primaryCareer}
            style={{
              padding: '1rem 3rem',
              fontSize: '1.05rem',
              opacity: primaryCareer ? 1 : 0.5,
            }}
          >
            ✅ 确认选择，进入面板
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionPage;
