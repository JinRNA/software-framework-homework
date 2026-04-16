import React from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storage';
import { BrainCircuit, Target, BarChart2 } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const state = storageService.getAppState();

  return (
    <div className="bg-mesh min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] text-center px-6">
        <div className="animate-fade-in-up max-w-3xl flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel mb-8 border-white/30 text-white/90 text-sm font-bold shadow-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            v3.0 数据处理引擎重构上线
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6 text-white text-contrast-shadow">
            智能定位你的未来航向
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-white/90 font-medium mb-10 leading-relaxed text-contrast-shadow">
            全维度人才极速量化系统。基于深层隐性指标精准运算，为你挖掘潜能，匹配最具爆发力的职业主干道。
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            {state.hasCompletedAssessment ? (
              <>
                <button className="btn-primary" onClick={() => navigate('/dashboard')}>
                  <BarChart2 className="w-5 h-5" />
                  进入数据大盘
                </button>
                <button className="btn-secondary" onClick={() => navigate('/report')}>
                  <Target className="w-5 h-5" />
                  提取匹配报告
                </button>
              </>
            ) : (
              <>
                <button className="btn-primary" onClick={() => navigate('/assessment')}>
                  <Target className="w-5 h-5" />
                  即刻初始化测试
                </button>
                <button className="btn-secondary" onClick={() => navigate('/assessment')}>
                  了解运作机制
                </button>
              </>
            )}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full mt-24">
          {[
            {
              icon: BrainCircuit,
              title: '多维数据解析网络',
              desc: '穿透性格、技能、兴趣等多重隐性维度，重塑能力边界模型，生成极致客观的个人素描结构。',
            },
            {
              icon: Target,
              title: '最优干线极速匹配',
              desc: '搭载前沿量化分流过滤算法，与标准化岗位数据库实时拟合，硬核推荐主副修路线。',
            },
            {
              icon: BarChart2,
              title: '高反差态势雷达',
              desc: '全量生成交互式战力面盘数据可视化图，提供最专业、最透明的方向微调实时监控。',
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="glass-card flex flex-col p-8 items-start text-left animate-fade-in-up hover:border-white/40"
                style={{ animationDelay: `${0.2 + i * 0.15}s`, opacity: 0 }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 border border-white/30 text-white mb-6 shadow-lg">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-wide text-contrast-shadow">
                  {feature.title}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="container max-w-6xl py-24 px-6 animate-fade-in mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-16 text-white text-contrast-shadow">
          高纯度的数据清洗流转
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {[
            { step: '01', title: '采集样本', desc: '约10分钟高速输出全域维系特征的底层测量变量。' },
            { step: '02', title: '核心推演', desc: '算法介入分析计算数据波峰，确定优势重合倾向。' },
            { step: '03', title: '定轨观测', desc: '生成专业级大盘矩阵指引战力补足，确立突围方向。' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center relative">
              {i !== 2 && (
                <div className="hidden md:block absolute w-full h-[1px] bg-white/20 left-1/2 top-11 -z-10" />
              )}
              <div className="flex items-center justify-center w-[88px] h-[88px] rounded-full glass-panel border border-white/40 mb-6 shadow-xl relative bg-slate-900/40">
                <span className="text-2xl font-black text-white/90">
                  {item.step}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 text-contrast-shadow">
                {item.title}
              </h3>
              <p className="text-white/70 text-sm font-medium px-4">
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
