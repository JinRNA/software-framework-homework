# ⼈才技能量化系统 - ⼈才素描模块 PRD

<table><tr><td>文档版本</td><td>修改日期</td><td>修改人</td><td>修改内容</td></tr><tr><td>V1.0</td><td>2026-03-27</td><td>AI Assistant</td><td>初始版本创建</td></tr></table>

# 1. 模块概述

# 1.1 定位

⼈才素描是整个系统的“指南针”模块，其核⼼使命是帮助⽤户发现⾃身优势区，并指引适合的职业⼤⽅向。它解决的是⽤户在职业发展中“我应该往哪⼉⾛”的根本问题。

# 1.2 价值主张

对⽤户：提供基于多维数据的职业⽅向建议，减少职业选择盲⽬性，让后续学习路径有明确的⽬标导向。

对系统：为学习路线、任务引擎等下游模块提供⽬标职业⽅向的输⼊，确保后续所有成⻓活动与⽤户潜⼒⽅向⼀致。

# 1.3 核⼼功能概要

1. 初⼊系统期：⽤户完成⾸次测评（包含性格、专业、兴趣、能⼒等），结合实时市场数据，⽣成“职业⽅向匹配报告”，给出主/副职业⽅向建议。

2. ⽇常迭代期：持续追踪⽤户的学习⾏为、任务完成情况，动态更新与各职业⽅向的匹配度；当⽤户⾏为偏离原定⽅向时，系统主动提示。

# 2. ⽤户场景

<table><tr><td>场景ID</td><td>场景名称</td><td>用户角色</td><td>场景描述</td></tr><tr><td>S-01</td><td>新用户首次使用</td><td>应届毕业生</td><td>用户注册后进入系统,完成一套约20分钟的测评(性格、专业背景、简易技能自评等)。系统根据测评结果和当前就业市场数据,生成“职业方向匹配报告”,用户查看后选择一个主职业方向(必选)和最多两个副职业方向(可选),确认后进入系统主界面。</td></tr><tr><td>S-02</td><td>老用户日常查看</td><td>职场新人</td><td>用户在个人主页查看“我的职业方向”面板,看到当前各职业方向的匹配度(动态更新)。系统提示:“你最近在AI领域的学习任务完成率很高,你的AI工程师匹配度上升了8%。”</td></tr><tr><td>S-03</td><td>职业方向变更提醒</td><td>转行者</td><td>用户连续两周在“产品经理”相关任务上投入了大量时间,且技能值增长明显。系统弹出提示:“我们发现你的学习行为更偏向产品经理方向,是否需要将此设为主职业方向?当前匹配度为76%。”</td></tr><tr><td>S-04</td><td>年度重新评估</td><td>所有用户</td><td>每年系统会邀请用户重新进行一次轻量级测评,或根据用户过去一年的行为数据,自动更新职业方向匹配度,生成年度职业发展报告。</td></tr></table>

# 3. 功能需求

# 3.1 初⼊系统期：⾸次测评与职业⽅向匹配

# 3.1.1 测评内容设计

<table><tr><td>测评
维度</td><td>描述</td><td>数据采集方
式</td><td>示例</td></tr><tr><td>性格
特质</td><td>使用改良版大五人格/霍兰德职业兴趣量表，通过选择题获取</td><td>问卷</td><td>“你更喜欢独立工作还是团队协作？”</td></tr><tr><td>专业
背景</td><td>学历、专业、学校、学习阶段（在校/
已毕业）</td><td>用户填写</td><td>“计算机科学与技术”</td></tr><tr><td>技能
基础</td><td>对若干通用技能的自评（如编程基础、设计软件、沟通能力等）</td><td>李克特量表
(1-5分)</td><td>“你对自己的编程能力打几分？”</td></tr><tr><td>兴趣
偏好</td><td>喜欢的技术领域、工作类型（研究型、管理型、创意型等）</td><td>多选+排序</td><td>“以下哪些领域你感兴趣？AI/
后端/前端/数据科学...”</td></tr><tr><td>地理
与期
望</td><td>期望工作城市、是否接受异地、期望薪资范围</td><td>用户填写</td><td>“上海、接受异地”</td></tr></table>

# 3.1.2 数据输⼊

⽤户主动填写：上述测评问卷、基础信息。

系统被动采集：设备信息、注册时间等（仅⽤于分析，不直接影响职业推荐）。

# 3.1.3 匹配计算逻辑

1. 职业标签库：系统内置⼀个职业标签库，每个职业标签包含：

核⼼能⼒要求（如“后端开发”要求“Java”、“数据库”、“系统设计”）

性格倾向（如“产品经理”倾向于“外向”、“创造⼒”）

市场需求指数（实时抓取招聘⽹站岗位数量、薪酬中位数）

2. 匹配算法：

将⽤户测评数据（性格、技能、兴趣）向量化。

与职业标签库中的每个职业进⾏相似度计算（余弦相似度、加权评分）。

引⼊市场热度权重（热⻔的职业推荐优先级略⾼，但不会掩盖严重不匹配）。

输出匹配度百分⽐（ $( 0 - 1 0 0 \%$ ），按降序排列。

# 3.1.4 输出：职业⽅向匹配报告

报告包含以下内容：

主推⽅向：匹配度最⾼的1-3个职业，突出显示。

副推⽅向：其他匹配度较⾼但低于主推的职业，作为备选。

匹配度详情：展示每个推荐职业的匹配度百分⽐，并可点击查看与哪些⽤户特质⾼度相关（如“你的编程基础与后端开发匹配度极⾼”）。

市场参考：该职业在当前地区/全国的平均薪资、岗位增⻓率、热⻔技能要求等。

# 3.1.5 ⽤户确认

⽤户选择1个主职业⽅向和最多2个副职业⽅向。此选择将同步⾄系统其他模块（如学习路线、任务引擎），作为后续规划的依据。

# 3.2 ⽇常迭代期：动态匹配度更新与提示

# 3.2.1 更新机制

触发时机：

⽤户完成任⼀学习任务后，系统根据任务所关联的技能点，重新计算⽤户与各职业的匹配度。

⽤户⼿动更新个⼈资料（如新增项⽬经验、技能证书）时。

每周/每⽉进⾏⼀次后台批量更新，计算⽤户近期⾏为与各职业的匹配度变化。

更新内容：所有职业的匹配度百分⽐，尤其是主/副职业⽅向的变化。

# 3.2.2 展示⽅式

个⼈主⻚“职业⽅向”卡⽚：

展示当前主职业⽅向及其匹配度。

展示副职业⽅向列表及其匹配度。

⽤趋势箭头（↑/↓）表示近⼀周匹配度的变化。

详情⻚：可查看所有职业的匹配度列表，⽀持筛选、排序。

# 3.2.3 主动提示

重⼤变化提醒：

当⽤户主职业⽅向的匹配度下降超过 $1 0 \%$ ，或某⼀副职业⽅向匹配度超过主职业⽅向时，系统主动弹窗/推送提醒。

示例⽂案：“你的‘数据分析’⽅向匹配度已上升⾄ $8 5 \%$ ，超过当前主⽅向‘后端开发’的78%。是否需要调整主职业⽅向？”

定期报告：每⽉⽣成⼀份《职业匹配度⽉报》，通过站内信或邮件发送，总结⽤户本⽉在各⽅向上的进步与变化。

# 3.3 与系统其他模块的交互

<table style="min-width: 300px;"><colgroup><col style="min-width: 100px;"><col style="min-width: 100px;"><col style="min-width: 100px;"></colgroup><tbody><tr><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>下游模块</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>输入内容</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>用途</p></td></tr><tr><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>学习路线</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>用户确认的主职业方向</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>作为学习路径规划的最终目标，生成从当前技能到目标职业所需技能的学习路线。</p></td></tr><tr><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>任务引擎</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>主职业方向、匹配度变化趋势</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>任务引擎可根据用户主职业方向，推荐相关的日常任务、挑战任务；匹配度下降时，可生成补救任务。</p></td></tr><tr><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>人才模型</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>用户当前与各职业的匹配度</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>匹配度可作为人才模型的一个参数，用于后续人才模型优化（如某些职业的模型权重调整）。</p></td></tr><tr><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>电子溯源简历</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>职业方向、匹配度变化历史</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>简历中可展示用户职业倾向的演变，证明其规划能力和适应性。</p></td></tr></tbody></table>

# 4. 数据模型

# 4.1 ⽤户测评数据表 user_assessment

<table><tr><td>字段</td><td>类型</td><td>描述</td></tr><tr><td>id</td><td>bigint</td><td>主键</td></tr><tr><td>user_id</td><td>bigint</td><td>用户ID</td></tr><tr><td>assessment_type</td><td>string</td><td>测评类型 (initial / annual / light)</td></tr><tr><td>personality Traits</td><td>json</td><td>性格特质得分（如开放性、尽责性等）</td></tr><tr><td>skills_selfrating</td><td>json</td><td>技能自评（技能名-得分）</td></tr><tr><td>interests</td><td>json</td><td>兴趣领域列表</td></tr><tr><td>work Preference</td><td>json</td><td>工作偏好（如研发型、管理型）</td></tr><tr><td>location Preference</td><td>string</td><td>期望城市</td></tr><tr><td>created_at</td><td>timestamp</td><td>测评时间</td></tr></table>

# 4.2 职业匹配度表 career_match

<table><tr><td>字段</td><td>类型</td><td>描述</td></tr><tr><td>id</td><td>bigint</td><td>主键</td></tr><tr><td>user_id</td><td>bigint</td><td>用户ID</td></tr><tr><td>career_code</td><td>string</td><td>职业编码（如“dashboard_dev”)</td></tr><tr><td>match_score</td><td>decimal(5,2)</td><td>匹配度百分比</td></tr><tr><td>snapshot_time</td><td>timestamp</td><td>计算时间戳</td></tr><tr><td>trend</td><td>string</td><td>变化趋势（up/down/steady）</td></tr></table>

# 4.3 ⽤户职业选择表 user_career_choice

<table><tr><td>字段</td><td>类型</td><td>描述</td></tr><tr><td>id</td><td>bigint</td><td>主键</td></tr><tr><td>user_id</td><td>bigint</td><td>用户ID</td></tr><tr><td>career_code</td><td>string</td><td>职业编码</td></tr><tr><td>type</td><td>enum</td><td>primary / secondary</td></tr><tr><td>selected_at</td><td>timestamp</td><td>选择时间</td></tr><tr><td>is.Active</td><td>boolean</td><td>是否当前生效</td></tr></table>

# 4.4 职业标签库 career_tags

<table><tr><td>字段</td><td>类型</td><td>描述</td></tr><tr><td>career_code</td><td>string</td><td>职业唯一标识</td></tr><tr><td>name</td><td>string</td><td>职业名称</td></tr><tr><td>requiredSkills</td><td>json</td><td>所需技能列表及权重</td></tr><tr><td>personality_factors</td><td>json</td><td>性格偏好向量</td></tr><tr><td>market_demand</td><td>json</td><td>市场需求指数、薪酬范围等</td></tr></table>

# 5. 接⼝定义

# 5.1 内部微服务接⼝（供前端调⽤）

<table><tr><td>接口路径</td><td>方法</td><td>描述</td><td>输入</td><td>输出</td></tr><tr><td>/api/sketch/assessment/submit</td><td>POST</td><td>提交测评问卷</td><td>assessment_data</td><td>{match_report}</td></tr><tr><td>/api/sketch/match/current</td><td>GET</td><td>获取用户当前所有职业匹配度</td><td>user_id</td><td>{matches: [...]}</td></tr><tr><td>/api/sketch/career/select</td><td>POST</td><td>用户选择主/副职业方向</td><td>{career_codes, types}</td><td>success</td></tr><tr><td>/api/sketch/match/trend</td><td>GET</td><td>获取匹配度变化趋势(用于图表)</td><td>user_id, career_codes[], start_time</td><td>{trend_data}</td></tr></table>

# 5.2 与下游模块的RPC接⼝

<table style="min-width: 500px;"><colgroup><col style="min-width: 100px;"><col style="min-width: 100px;"><col style="min-width: 100px;"><col style="min-width: 100px;"><col style="min-width: 100px;"></colgroup><tbody><tr><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>接口</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>方向</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>描述</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>调用方</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>输出</p></td></tr><tr><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>get_user_career_choices</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>提供</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>获取用户当前主/副职业方向</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>学习路线、任务引擎</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>{ primary,secondary[] }</p></td></tr><tr><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>notify_career_change</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>接收</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>当用户职业方向发生变更时，通知下游模块更新</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>人才素描</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>success</p></td></tr></tbody></table>

# 6. ⾮功能性需求

# 6.1 性能要求

测评提交后，匹配报告⽣成时间 $< 5$ 秒（异步处理，前端显示loading）。

⽇常匹配度更新接⼝响应时间 $< \mathit { 1 }$ 秒。

# 6.2 数据准确性

匹配度计算结果需经过测试集验证，与⼈⼯专家判断的吻合度不低于 $8 0 \%$ 。

市场数据需每⽇更新，确保推荐的时效性。

# 6.3 安全性

测评数据属于敏感个⼈信息，传输过程必须加密（TLS）。

数据库存储时对敏感字段（如测评原始答案）进⾏脱敏或加密。

# 6.4 可扩展性

职业标签库需⽀持管理员动态增删改查，⽆需发版。

匹配算法应设计为可插拔，便于后期引⼊更复杂的AI模型（如⼤模型微调）。

# 6.5 ⽤户体验

测评题⽬需设计为⼀次性完成，避免⽤户中途退出。

匹配报告应提供可视化的雷达图、匹配度条形图，增强可读性。

所有提醒⽂案应友好、⿎励性，避免给⽤户造成压⼒。

# 7. 依赖与关联

# 7.1 依赖模块

⽤户中⼼：提供⽤户基本信息、登录态。

数据采集：提供市场职业需求数据（可由⼈才素描模块⾃⾏爬取，也可依赖外部数据服务）。

⼈才模型：⼈才素描产⽣的匹配度可以作为⼈才模型的参数之⼀，但⾮强依赖（⼈才素描可独⽴先⾏开发）。

# 7.2 对外输出

职业⽅向数据将作为学习路线和任务引擎的输⼊，因此需在开发学习路线之前完成⼈才素描的接⼝稳定性。

# 7.3 开发建议

优先实现测评问卷收集和基础匹配算法，可采⽤简单规则引擎（如加权求和）快速上线验证。

后期逐步引⼊机器学习模型，通过⽤户⾏为反馈（如⽤户是否采纳推荐、后续任务完成情况）不断优化匹配准确率。

# 8. 附录

# 8.1 术语表

<table style="min-width: 200px;"><colgroup><col style="min-width: 100px;"><col style="min-width: 100px;"></colgroup><tbody><tr><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>术语</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>解释</p></td></tr><tr><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>匹配度</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>用户与某个职业之间的契合程度，以0-100%表示，越高表示越适合。</p></td></tr><tr><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>主职业方向</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>用户当前重点发展的职业方向，系统据此推送主要学习内容。</p></td></tr><tr><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>副职业方向</p></td><td colspan="1" rowspan="1" data-border-top="true" data-border-right="true" data-border-bottom="true" data-border-left="true" text-align="left" style="text-align: left;"><p>用户作为备选或兴趣发展的职业方向，系统会适度推荐相关内容。</p></td></tr></tbody></table>

# 8.2 测评问卷参考样本（节选）

# 性格题：

1. 你更喜欢独⽴⼯作还是团队协作？（1-5分：⾮常喜欢独⽴ ⾮常喜欢团队）

2. 当遇到复杂问题时，你通常会更关注细节还是整体？（1-5分：细节 整体）

# 兴趣题：

1. 以下技术领域，你最感兴趣的是哪些？（多选：⼈⼯智能/后端开发/前端开发/数据科学/产品设计/运营/营销/管理）

# 技能⾃评：

1. 编程能⼒（1-5分）

2. 数据分析能⼒（1-5分）

3. 沟通表达能⼒（1-5分）

4. 项⽬管理能⼒（1-5分）