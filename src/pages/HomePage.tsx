import React from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storage';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const state = storageService.getAppState();

  return (
    <div className="bg-mesh" style={{ minHeight: '100vh', paddingTop: '64px' }}>
      {/* Hero Section */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        textAlign: 'center',
        padding: '2rem 1.5rem',
      }}>
        <div className="animate-fade-in-up">
          <div style={{
            fontSize: '4rem',
            marginBottom: '1.5rem',
            filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.3))',
          }}>
            ✨
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '1.5rem',
          }}>
            <span className="text-gradient">人才素描</span>
            <br />
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.6em', fontWeight: 400 }}>
              发现你的职业优势区
            </span>
          </h1>

          <p style={{
            maxWidth: '600px',
            margin: '0 auto 2.5rem',
            fontSize: '1.1rem',
            lineHeight: 1.8,
            color: 'var(--color-text-secondary)',
          }}>
            基于多维数据的智能职业方向匹配系统。通过性格特质、专业背景、技能基础、
            兴趣偏好等多维度测评，结合市场数据，为你精准推荐最适合的职业发展方向。
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {state.hasCompletedAssessment ? (
              <>
                <button className="btn-primary" onClick={() => navigate('/dashboard')}>
                  📈 查看我的面板
                </button>
                <button className="btn-secondary" onClick={() => navigate('/report')}>
                  📊 查看匹配报告
                </button>
              </>
            ) : (
              <>
                <button className="btn-primary" onClick={() => navigate('/assessment')}
                  style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                  🚀 开始测评
                </button>
                <button className="btn-secondary" onClick={() => navigate('/assessment')}>
                  了解更多 →
                </button>
              </>
            )}
          </div>
        </div>

        {/* Feature Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          maxWidth: '900px',
          width: '100%',
          marginTop: '4rem',
        }}>
          {[
            {
              icon: '🧠',
              title: '多维测评',
              desc: '涵盖性格、技能、兴趣、背景等5大维度的综合评估',
            },
            {
              icon: '🎯',
              title: '精准匹配',
              desc: '加权评分算法，实时计算与5+职业方向的匹配度',
            },
            {
              icon: '📊',
              title: '可视化报告',
              desc: '直观的匹配度分析报告，清晰展示你的优势方向',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="glass-card animate-fade-in-up"
              style={{
                padding: '2rem',
                animationDelay: `${0.2 + i * 0.15}s`,
                opacity: 0,
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {feature.title}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container" style={{ padding: '4rem 1.5rem 6rem' }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '1.8rem',
          fontWeight: 700,
          marginBottom: '3rem',
        }}>
          <span className="text-gradient">三步发现</span>你的职业方向
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          {[
            { step: '01', title: '完成测评', desc: '约10分钟完成五大维度的综合测评问卷', icon: '📝' },
            { step: '02', title: '查看报告', desc: '系统实时计算匹配度，生成可视化报告', icon: '📊' },
            { step: '03', title: '确定方向', desc: '选择主副职业方向，开启成长之路', icon: '🎯' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                fontSize: '1.5rem',
              }}>
                {item.icon}
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: 'var(--color-primary-light)',
                fontWeight: 600,
                marginBottom: '0.5rem',
              }}>
                STEP {item.step}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {item.title}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
