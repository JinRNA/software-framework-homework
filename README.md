# 人才技能量化系统 · 人才素描模块

> 基于多维数据的智能职业方向匹配与推荐平台

人才素描是"人才技能量化系统"的核心指南针模块，帮助用户通过多维测评发现自身优势区，并智能推荐最适合的职业发展方向。

## 📋 PRD 对应关系

本项目基于 `人才技能量化系统·人才素描模块PRD.md` 实现，当前完成了 **PRD 第一阶段（初入系统期）** 的完整闭环：

| PRD 章节 | 功能 | 实现状态 |
|---------|------|---------|
| 3.1.1 测评内容设计 | 5维度测评问卷 | ✅ 已实现 |
| 3.1.2 数据输入 | 用户主动填写 | ✅ 已实现 |
| 3.1.3 匹配计算逻辑 | 加权评分算法 | ✅ 已实现 |
| 3.1.4 职业方向匹配报告 | 可视化报告页 | ✅ 已实现 |
| 3.1.5 用户确认 | 主/副方向选择 | ✅ 已实现 |
| 3.2 日常迭代期 | 动态匹配度更新 | 🔄 趋势图占位 |
| 3.2.3 主动提示 | 行为变化提醒 | 📋 后续实现 |

## ✅ 已实现功能

### 核心流程（完整闭环）
1. **欢迎页/模块首页** — 项目介绍、功能特性展示
2. **首次测评** — 性格特质 → 专业背景 → 技能基础 → 兴趣偏好 → 地理与期望
3. **提交测评** — 表单校验 + 计算动画
4. **职业匹配报告** — 主推职业卡片、雷达图、匹配度对比、市场数据、推荐原因
5. **方向选择** — 1个主方向 + 最多2个副方向的规则校验
6. **个人面板** — 职业方向展示、能力画像、趋势图预览、快捷操作

### 数据与算法
- 5个内置职业方向样本
- 真实可运行的加权匹配算法
- localStorage 持久化存储
- 表单完整校验

## 🛠 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript |
| 构建 | Vite 8 |
| 样式 | Tailwind CSS 4 + 自定义 CSS 变量 |
| 图表 | Recharts |
| 路由 | React Router v7 |
| 存储 | localStorage（可替换） |
| 部署 | 兼容 Vercel / Netlify |

## 🚀 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问
# http://localhost:5173
```

## 📦 构建

```bash
# 生产构建
npm run build

# 预览构建结果
npm run preview
```

构建产物输出到 `dist/` 目录，可直接部署到静态托管平台。

## 📁 目录结构

```
├── docs/                    # 文档
│   ├── screenshots/         # 截图目录
│   └── 提交材料清单.md
├── spec/                    # 规格文档
│   └── 项目总控Spec.md
├── src/
│   ├── components/          # 可复用组件
│   │   ├── LikertScale.tsx  # 李克特量表评分组件
│   │   ├── Navbar.tsx       # 导航栏
│   │   └── ScoreRing.tsx    # 匹配度环形图
│   ├── data/                # 数据层
│   │   ├── careers.ts       # 职业标签库（5个职业样本）
│   │   └── questions.ts     # 测评问卷题目
│   ├── pages/               # 页面
│   │   ├── HomePage.tsx     # 首页/欢迎页
│   │   ├── AssessmentPage.tsx  # 测评问卷页
│   │   ├── ReportPage.tsx   # 匹配报告页
│   │   ├── SelectionPage.tsx   # 方向选择页
│   │   └── DashboardPage.tsx   # 个人面板页
│   ├── services/            # 服务层
│   │   ├── matchingEngine.ts   # 匹配算法核心
│   │   └── storage.ts       # 存储服务（localStorage封装）
│   ├── types/               # TypeScript 类型定义
│   │   └── index.ts
│   ├── App.tsx              # 根组件（路由配置）
│   ├── main.tsx             # 入口
│   └── index.css            # 全局样式/设计系统
├── public/                  # 静态资源
├── index.html               # HTML模板
├── package.json
├── vite.config.ts
├── tsconfig.json
└── 人才技能量化系统·人才素描模块PRD.md
```

## 📄 页面说明

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 项目介绍、特性展示、"开始测评"入口 |
| `/assessment` | 测评页 | 5步分段问卷，含进度条和表单校验 |
| `/report` | 报告页 | 匹配度环形图、雷达图、柱状图、市场数据、推荐原因 |
| `/selection` | 选择页 | 设置主方向和副方向，含规则校验 |
| `/dashboard` | 面板页 | 职业方向概览、能力画像、趋势图、快捷操作 |

## 🧮 匹配算法说明

### 权重配置

| 维度 | 权重 | 说明 |
|------|------|------|
| 技能匹配 | 40% | 用户技能自评 vs 职业技能要求 |
| 兴趣匹配 | 25% | 兴趣标签重合度 + 工作类型偏好 |
| 性格匹配 | 20% | 大五人格维度与职业性格偏好的距离 |
| 专业背景 | 10% | 专业与职业的相关度 + 学历加成 |
| 市场热度 | 5% | 职业市场需求等级 |

### 算法流程

1. 将用户测评数据按维度归一化
2. 与每个职业标签进行分维度匹配计算
3. 按权重加权求和得到总匹配度（0-100分）
4. 按匹配度降序排列
5. 生成每个职业的推荐原因（最多3条）
6. 输出主推方向和副推方向

### 内置职业样本

| 编码 | 职业 | 核心技能 | 市场需求 |
|-----|------|---------|---------|
| frontend_dev | 前端开发工程师 | React, TypeScript, CSS | 高 |
| backend_dev | 后端开发工程师 | Java, Go, 微服务 | 高 |
| data_analyst | 数据分析师 | SQL, Python, 统计分析 | 高 |
| ai_engineer | AI 工程师 | PyTorch, LLM, NLP | 高 |
| product_manager | 产品经理 | 需求分析, 原型设计 | 中 |

## 📊 Mock 数据说明

当前版本使用以下 mock/本地数据：

- **职业标签库**：内置5个职业方向，含完整技能要求、性格偏好、市场数据
- **市场数据**：手工配置的薪资范围、岗位增长率、热门技能
- **趋势数据**：面板页的趋势图为模拟数据
- **用户数据**：使用 localStorage 持久化，无后端接口

所有数据接口已抽象到 `src/services/` 层，后续替换为真实 API 时只需修改服务层代码。

## 📸 截图说明

截图文件存放在 `docs/screenshots/` 目录。

建议截图命名：
- `01-home.png` — 首页
- `02-assessment.png` — 测评页
- `03-report.png` — 匹配报告页
- `04-career-selection.png` — 方向选择页
- `05-dashboard-card.png` — 个人面板页

后续可使用 Playwright 自动化生成截图。

## 🔄 GitHub 同步说明

### 初始设置

```bash
# 初始化 Git（如果尚未初始化）
git init

# 添加所有文件
git add .

# 首次提交
git commit -m "feat: 完成人才素描模块 MVP 初版"

# 添加 GitHub 远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/YOUR_USERNAME/talent-sketch.git

# 推送到 GitHub
git push -u origin main
```

### 日常更新

```bash
git add .
git commit -m "your commit message"
git push
```

## 🌐 部署说明

项目结构已兼容 Vercel 和 Netlify 部署。

### Vercel 部署

1. 在 [Vercel](https://vercel.com) 导入 GitHub 仓库
2. 框架选择 "Vite"
3. 构建命令：`npm run build`
4. 输出目录：`dist`
5. 点击部署

### Netlify 部署

1. 在 [Netlify](https://netlify.com) 连接 GitHub 仓库
2. 构建命令：`npm run build`
3. 发布目录：`dist`
4. 部署

部署后获取永久链接，作为课程"分享链接"提交。

## 📈 后续迭代计划

### 第二阶段
- [ ] 匹配度趋势图（真实数据）
- [ ] 手动触发"重新计算"
- [ ] 行为变化提醒弹窗
- [ ] 月报/年度报告页面

### 第三阶段
- [ ] 职业标签库管理后台
- [ ] 市场数据实时接入
- [ ] 后台定时更新匹配度
- [ ] 更复杂的推荐算法（向量化、余弦相似度）
- [ ] 用户行为追踪与反馈循环

### 工程优化
- [ ] Playwright 自动化截图
- [ ] 代码分割优化
- [ ] i18n 国际化
- [ ] 单元测试覆盖
- [ ] CI/CD 流水线

## 📝 许可

课程大作业项目，仅供学习使用。
