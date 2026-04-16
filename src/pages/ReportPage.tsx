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
import { FileText, Target, Trophy, ChartBar, Check, Cpu, Workflow, CircleDot, Star } from 'lucide-react';

const ReportPage: React.FC = () => {
  const navigate = useNavigate();
  const report = storageService.getMatchReport();

  if (!report) {
    return (
      <div className="bg-mesh min-h-screen pt-16 flex items-center justify-center p-6">
        <div className="glass-card p-12 text-center max-w-md w-full flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-6 shadow-xl">
            <FileText className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-white text-contrast-shadow">
            档案未初始化
          </h2>
          <p className="text-white/70 mb-8 font-medium">
            矩阵解算失败。系统尚未获取您的特征参数集，无法生成深度检测报告。
          </p>
          <button className="btn-primary" onClick={() => navigate('/assessment')}>
            返回重新采样
          </button>
        </div>
      </div>
    );
  }

  const top = report.results[0];
  const topCareer = careerTags.find(c => c.code === top.careerCode)!;

  // Radar data for top career
  const radarData = [
    { subject: '底层技能', value: top.breakdown.skillScore },
    { subject: '偏好推演', value: top.breakdown.interestScore },
    { subject: '隐性特质', value: top.breakdown.personalityScore },
    { subject: '知识基座', value: top.breakdown.backgroundScore },
    { subject: '生态契合', value: top.breakdown.marketScore },
  ];

  // Bar chart data
  const barData = report.results.map(r => ({
    name: r.careerName.replace('工程师', '').replace('分析师', '分析'),
    score: r.score,
    code: r.careerCode,
  }));

  const getColor = (code: string) => careerTags.find(c => c.code === code)?.color || '#34d399';

  return (
    <div className="bg-mesh min-h-screen pt-24 pb-16">
      <div className="container max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="animate-fade-in-up text-center mb-16 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full glass-panel border border-white/30 flex items-center justify-center mb-6 shadow-xl">
            <ChartBar className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4 text-contrast-shadow tracking-tight">
            高维度图谱解析报告
          </h1>
          <p className="text-white/80 font-medium text-lg">
            全维度特征解算完毕，以下是引擎为您输出的最优干线拟合图谱
          </p>
        </div>

        {/* Primary Recommendation Card */}
        <div
          className="glass-card animate-fade-in-up border-emerald-500/40 hover:border-emerald-400/60 transition-colors p-10 mb-10 overflow-hidden relative shadow-2xl"
          style={{
            background: `linear-gradient(135deg, rgba(16,185,129,0.15), rgba(15,23,42,0.8))`,
            animationDelay: '0.1s',
            opacity: 0,
          }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3"></div>
          
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <span className="tag text-emerald-300 bg-emerald-500/20 border-emerald-500/40 flex items-center gap-2 px-4 py-1.5 font-black tracking-widest uppercase shadow-lg">
              <Trophy className="w-4 h-4" /> 算法判定极值点 (干线)
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10 w-full">
            <div className="shrink-0 flex justify-center w-full md:w-auto">
              <ScoreRing score={top.score} size={180} color="#34d399" label="绝对综合得分" />
            </div>

            <div className="flex-1 w-full">
              <h2 className="text-4xl font-extrabold text-white mb-4 text-contrast-shadow flex items-center gap-3 tracking-tight">
                {topCareer.name}
              </h2>
              <p className="text-white/80 text-base leading-relaxed mb-6 font-medium max-w-2xl">
                {topCareer.description}
              </p>

              {/* Reasons */}
              <div className="flex flex-col gap-3 mb-8 bg-black/30 p-6 rounded-2xl border border-white/5 shadow-inner">
                {top.reasons.map((reason, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0" />
                    <span className="text-white/90 font-medium text-sm leading-relaxed">{reason}</span>
                  </div>
                ))}
              </div>
              
              {/* Hot Skills */}
              <div className="flex gap-2 flex-wrap items-center">
                 <Cpu className="w-4 h-4 text-white/40 mr-2" />
                 <span className="text-white/50 text-[11px] font-bold uppercase tracking-widest mr-2">要求核心节点</span>
                 {topCareer.marketData.hotSkills.map(skill => (
                  <span key={skill} className="tag bg-white/10 border-white/20 text-white font-bold tracking-wider shadow-sm py-1.5 px-3">
                    {skill}
                  </span>
                 ))}
              </div>
            </div>
          </div>

          {/* Market Data */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 p-6 bg-slate-900/60 border border-white/10 rounded-2xl shadow-inner relative z-10 w-full">
            <div className="flex flex-col items-center justify-center p-2">
              <div className="text-[11px] text-white/50 font-black tracking-widest uppercase mb-2">基准溢价</div>
              <div className="text-3xl font-black text-amber-400 font-mono tracking-tighter">{topCareer.marketData.avgSalary}</div>
            </div>
            <div className="flex flex-col items-center justify-center p-2 border-l border-white/5">
              <div className="text-[11px] text-white/50 font-black tracking-widest uppercase mb-2">年复合增长</div>
              <div className="text-3xl font-black text-emerald-400 font-mono tracking-tighter">{topCareer.marketData.jobGrowthRate}</div>
            </div>
            <div className="flex flex-col items-center justify-center p-2 border-t md:border-t-0 md:border-l border-white/5">
              <div className="text-[11px] text-white/50 font-black tracking-widest uppercase mb-2">算力需求热度</div>
              <div className="mt-1">
                <span className={`tag border-2 font-black px-4 ${topCareer.marketData.demandLevel === 'high' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border-amber-500/40'}`}>
                  {topCareer.marketData.demandLevel === 'high' ? '高流通' : '存量平稳'}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-2 border-t md:border-t-0 md:border-l border-white/5">
              <div className="text-[11px] text-white/50 font-black tracking-widest uppercase mb-2">活跃挂网量</div>
              <div className="text-3xl font-black text-white font-mono tracking-tighter">{topCareer.marketData.jobCount}</div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Radar Chart */}
          <div
            className="glass-card animate-fade-in-up p-8 shadow-xl"
            style={{ animationDelay: '0.2s', opacity: 0 }}
          >
            <h3 className="text-xl font-bold text-white text-contrast-shadow mb-6 flex items-center gap-3">
              <CircleDot className="w-5 h-5 text-emerald-400" />
              微观维度拟合切片
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#e2e8f0', fontSize: 13, fontWeight: 600 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'transparent', stroke: 'transparent' }} />
                <Radar
                   name="契合解析度"
                   dataKey="value"
                   stroke="#34d399"
                   fill="#34d399"
                   fillOpacity={0.3}
                   strokeWidth={3}
                />
                <Tooltip 
                  contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div
            className="glass-card animate-fade-in-up p-8 shadow-xl"
            style={{ animationDelay: '0.3s', opacity: 0 }}
          >
            <h3 className="text-xl font-bold text-white text-contrast-shadow mb-6 flex items-center gap-3">
              <Workflow className="w-5 h-5 text-indigo-400" />
              全域干线相对战力面盘
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} layout="vertical" margin={{ left: -10, bottom: -10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={90}
                  tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: '#f1f5f9',
                    backdropFilter: 'blur(10px)'
                  }}
                  itemStyle={{ fontWeight: 'bold', color: '#34d399' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={24}>
                  {barData.map((entry) => (
                    <Cell key={entry.code} fill={getColor(entry.code)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* All Results Cards */}
        <h3 className="text-2xl font-extrabold text-white text-contrast-shadow mb-6 flex items-center gap-3 mt-16">
          <Target className="w-6 h-6 text-white" />底层解算全量排位图
        </h3>
        <div className="flex flex-col gap-4 mb-12 relative z-10 w-full">
          {report.results.map((result: MatchResult, i: number) => {
            const career = careerTags.find(c => c.code === result.careerCode)!;
            const isTop = result.rank === 1;
            return (
              <div
                key={result.careerCode}
                className={`glass-card animate-fade-in-up p-6 flex flex-col sm:flex-row items-center w-full shadow-lg overflow-hidden group ${isTop ? 'border-emerald-500/40 bg-emerald-900/10' : 'border-white/10 hover:border-white/30'}`}
                style={{ animationDelay: `${0.3 + i * 0.1}s`, opacity: 0 }}
              >
                <div className={`hidden sm:flex w-14 h-14 rounded-2xl flex-shrink-0 items-center justify-center mr-8 font-black text-2xl shadow-inner ${isTop ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800/50 text-white/40 border border-white/10 group-hover:bg-slate-800'}`}>
                  {result.rank}
                </div>
                
                <div className="flex-1 w-full text-center sm:text-left mb-6 sm:mb-0">
                  <div className="flex items-center gap-4 mb-4 justify-center sm:justify-start">
                    <span className="font-extrabold text-2xl text-white text-contrast-shadow">{career.name}</span>
                    {result.rank === 1 && <span className="tag bg-emerald-500/20 text-emerald-400 border-none font-bold text-xs uppercase tracking-widest"><Star className="w-3.5 h-3.5 mr-1 inline" />算法推荐</span>}
                    {(result.rank === 2 || result.rank === 3) && (
                      <span className="tag bg-amber-500/20 text-amber-400 border-none font-bold text-xs uppercase tracking-widest">潜力次生</span>
                    )}
                  </div>
                  <div className="text-[11px] tracking-widest font-bold text-white/50 bg-black/20 inline-block px-4 py-2 rounded-lg border border-white/5">
                    <span className="mr-5">技能点: <span className="text-white/80">{result.breakdown.skillScore}</span></span>
                    <span className="mr-5">偏好共鸣: <span className="text-white/80">{result.breakdown.interestScore}</span></span>
                    <span className="mr-0">性格吻合: <span className="text-white/80">{result.breakdown.personalityScore}</span></span>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center sm:items-end shrink-0 sm:pl-8 sm:border-l border-white/10 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0">
                  <span className="text-[11px] text-white/40 uppercase tracking-widest font-black mb-1">全局加权得分</span>
                  <div className={`font-black text-4xl tracking-tighter ${isTop ? 'text-emerald-400' : 'text-white'}`}>
                    {result.score}<span className="text-xl text-white/40 ml-1">%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action */}
        <div className="glass-panel p-10 lg:p-14 mt-20 mb-8 w-full border border-white/30 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden group text-center flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-indigo-500/10 to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="relative z-10 w-full max-w-2xl">
            <h3 className="text-3xl font-black text-white text-contrast-shadow mb-6 tracking-tight">查阅完毕，准备激活引擎连结</h3>
            <p className="text-white/80 font-medium mb-12 leading-relaxed text-lg">
              图谱解算与展示流转环节已全部闭环。<br/>点击进入挂载平台，选择您的目标干线并录入个人面板特征数据库。
            </p>
            <button
              className="btn-primary flex items-center justify-center gap-3 w-full sm:w-auto mx-auto h-16 px-12 text-lg shadow-[0_10px_30px_rgba(52,211,153,0.4)] transition-all duration-300 hover:scale-105 group-hover:animate-none"
              onClick={() => navigate('/selection')}
            >
              <Target className="w-6 h-6 border-2 border-white/40 rounded-full p-0.5" />
              跳转轨道决策系统
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
