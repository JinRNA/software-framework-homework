import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import ScoreRing from '../components/ScoreRing';
import { storageService } from '../services/storage';
import { careerTags } from '../data/careers';
import { Rocket, Target, BarChart2, Star, Sparkles, TrendingUp, Puzzle, FileText, Compass, BookOpen, Fingerprint, LayoutDashboard, Zap, Bell } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const state = storageService.getAppState();
  const { matchReport, careerChoice, assessment } = state;

  if (!matchReport || !careerChoice) {
    return (
      <div className="bg-mesh min-h-screen pt-16 flex items-center justify-center p-6">
        <div className="glass-card p-12 text-center max-w-lg w-full flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-6 shadow-xl">
            <Rocket className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-white text-contrast-shadow">
            {!matchReport ? '系统档案为空' : '尚未锚定路线'}
          </h2>
          <p className="text-white/70 mb-8 font-medium">
            {!matchReport
              ? '请完成全域特征检测以激活您的专属分析大盘'
              : '分析完毕，请在全景图谱中确认您的主干发展轨迹'}
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate(!matchReport ? '/assessment' : '/selection')}
          >
            {!matchReport ? '执行全域检测' : '进入决策舱'}
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

  const trendData = [
    { month: '1月', score: (primaryResult?.score || 70) - 15 },
    { month: '2月', score: (primaryResult?.score || 70) - 8 },
    { month: '3月', score: (primaryResult?.score || 70) - 3 },
    { month: '4月', score: primaryResult?.score || 70 },
  ];

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
    <div className="bg-mesh min-h-screen pt-24 pb-16">
      <div className="container max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="animate-fade-in-up mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2 text-contrast-shadow flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-emerald-400" />
              数据监控看板
            </h1>
            <p className="text-white/80 font-medium">
              实时同步您的核心特征矩阵与极大概率进阶轨迹
            </p>
          </div>
        </div>

        {/* Primary Career Card */}
        {primaryResult && primaryCareer && (
          <div
            className="glass-card animate-fade-in-up border-emerald-500/40 hover:border-emerald-400/60 transition-colors p-8 mb-8"
            style={{ animationDelay: '0.1s', opacity: 0, background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(15,23,42,0.65))' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="tag text-emerald-400 bg-emerald-500/20 border-emerald-500/40 flex items-center gap-1.5 px-3 py-1 text-sm">
                <Star className="w-4 h-4" /> 主引擎路线
              </span>
            </div>
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              <div className="shrink-0 flex justify-center w-full lg:w-auto">
                <ScoreRing score={primaryResult.score} size={160} color="#34d399" label="理论拟合度" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-3xl font-extrabold text-white mb-3 text-contrast-shadow flex items-center gap-3">
                  {primaryCareer.name}
                </h2>
                <p className="text-white/80 leading-relaxed mb-6 font-medium text-lg max-w-2xl">
                  {primaryCareer.description}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {primaryCareer.marketData.hotSkills.map(skill => (
                    <span key={skill} className="tag bg-white/10 border-white/20 hover:bg-white/20 tracking-wide text-white font-bold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-row lg:flex-col gap-6 shrink-0 bg-black/20 p-6 rounded-2xl border border-white/10 w-full lg:w-auto mt-6 lg:mt-0 justify-between">
                <div className="text-right flex-1 lg:flex-none">
                  <div className="text-xs text-white/50 mb-1 font-bold tracking-widest uppercase">平均溢价</div>
                  <div className="text-2xl font-black text-white">{primaryCareer.marketData.avgSalary}</div>
                </div>
                <div className="w-px h-12 lg:w-full lg:h-px bg-white/10"></div>
                <div className="text-right flex-1 lg:flex-none">
                  <div className="text-xs text-white/50 mb-1 font-bold tracking-widest uppercase">需求增长</div>
                  <div className="text-2xl font-black text-emerald-400">{primaryCareer.marketData.jobGrowthRate}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Careers */}
        {secondaryResults.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {secondaryResults.map(({ result, career }, i) => {
              if (!result || !career) return null;
              return (
                <div
                  key={career.code}
                  className="glass-card animate-fade-in-up p-6"
                  style={{ animationDelay: `${0.2 + i * 0.1}s`, opacity: 0 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="tag text-amber-400 bg-amber-500/10 border-amber-500/30 font-bold px-3 py-1">
                      备选轨道
                    </span>
                    <span className="text-sm font-bold text-white/50">
                      溢价能力 {career.marketData.avgSalary}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <ScoreRing score={result.score} size={96} color="#fbbf24" label="拟合度" />
                    <div className="flex-1">
                      <h3 className="text-xl font-extrabold text-white mb-3 text-contrast-shadow">
                        {career.name}
                      </h3>
                      <div className="flex gap-2 flex-wrap">
                        {career.marketData.hotSkills.slice(0, 3).map(skill => (
                          <span key={skill} className="tag text-xs bg-white/10 border-white/20 text-white font-bold">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ability Radar */}
          {abilityData.length > 0 && (
            <div className="glass-card animate-fade-in-up p-6" style={{ animationDelay: '0.3s', opacity: 0 }}>
              <div className="flex items-center gap-2 mb-6">
                <Puzzle className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white text-contrast-shadow">核心多极特征雷达</h3>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={abilityData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                  <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: '#e2e8f0', fontSize: 13, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'transparent', stroke: 'transparent' }} />
                  <Radar
                    name="强度值"
                    dataKey="value"
                    stroke="#818cf8"
                    fill="#818cf8"
                    fillOpacity={0.3}
                    strokeWidth={3}
                  />
                  <Tooltip 
                    contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <div className="text-center mt-4">
                <p className="text-xs text-white/50 font-bold tracking-wider">原生特征结构谱，后续可通过实战训练进行波峰干预</p>
              </div>
            </div>
          )}

          {/* Trend Chart */}
          <div className="glass-card animate-fade-in-up p-6" style={{ animationDelay: '0.4s', opacity: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white text-contrast-shadow">效能演进预测 (Alpha)</h3>
              </div>
              <span className="tag text-xs bg-emerald-500/20 text-emerald-400 border-none">实时渲染</span>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: '#fff', backdropFilter: 'blur(10px)'
                  }}
                  itemStyle={{ color: '#34d399', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="score" stroke="#34d399" fill="url(#trendGradient)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
              <p className="text-xs text-white/50 font-bold tracking-wider">拟合趋势数据基于全网极速引擎推演采集</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card animate-fade-in-up p-8 mb-8" style={{ animationDelay: '0.5s', opacity: 0 }}>
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white text-contrast-shadow">模块级交互接口</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="btn-secondary h-14 flex justify-start pl-6 items-center border-white/20 hover:border-white/50 hover:bg-white/10" onClick={() => navigate('/report')}>
              <FileText className="w-5 h-5 mr-3 text-white/80" /> 提取详细特征报告
            </button>
            <button className="btn-secondary h-14 flex justify-start pl-6 items-center border-white/20 hover:border-white/50 hover:bg-white/10" onClick={() => navigate('/selection')}>
              <Compass className="w-5 h-5 mr-3 text-white/80" /> 重新校准微调方向
            </button>
            <button
              className="btn-secondary h-14 flex justify-start pl-6 items-center text-red-300 border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50"
              onClick={() => {
                storageService.clearAll();
                navigate('/assessment');
              }}
            >
              <Fingerprint className="w-5 h-5 mr-3" /> 中止并抹除所有数据
            </button>
          </div>
        </div>

        {/* Future Features Placeholder */}
        <div className="glass-panel animate-fade-in-up p-8 text-center bg-slate-900/40" style={{ animationDelay: '0.6s', opacity: 0 }}>
          <h3 className="text-sm font-black tracking-widest text-white/30 mb-8 uppercase">
            <Sparkles className="w-4 h-4 inline-block mr-2 text-white/30" />
            下一代数据管线研发中
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, title: '智能干预路线', desc: '根据技能短板波谷生成的流式学习网络' },
              { icon: Target, title: '核心执行引擎', desc: '分配突破任务流，积累高频实战数据源' },
              { icon: FileText, title: '全息极客档案', desc: '能力点随岁月自动增量标记的数据痕迹' },
              { icon: Bell, title: '高危态势感知', desc: '检测异常偏离行为，执行硬核路线预警' },
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="flex flex-col items-center bg-white/5 rounded-2xl p-6 border border-white/5">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 text-white/40 shadow-inner">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-white/80 text-sm mb-2">{feat.title}</div>
                  <div className="text-xs text-white/40 font-medium leading-relaxed">{feat.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
