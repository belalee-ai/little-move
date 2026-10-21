# 已确认字体动效整合

2026-10-15。本网站现在是后续修改的唯一执行入口。首批迁入的清单以当时type-motion-lab.html的17项为准，四份独立预览脚本与总预览对应脚本一致（仅移除旧widget state）。来源哈希见SOURCE-MANIFEST.json。

## 清单

| 网站编号 | 来源标记 | 名称 | Remotion组合 | 原画幅 | 原循环长度 |
|---|---|---|---|---|---|
| 031 | 文章 | 可变字重 | Study031 | 800×464 | 6.6s |
| 032 | 9551 | 字母重组 | Study032 | 800×520 | 8s |
| 033 | 2001 | 字体混排 | Study033 | 800×480 | 6s |
| 034 | 1999 | 透视字环 | Study034 | 800×480 | 6s |
| 035 | 2002 | 字标重组 | Study035 | 800×480 | 6s |
| 036 | 2003 | 丝带穿字 | Study036 | 800×480 | 6s |
| 037 | 2004 | 贴字弹入 | Study037 | 800×480 | 6s |
| 038 | 2005 | 空间折叠 | Study038 | 800×480 | 6s |
| 039 | 2006 | 彩色贴纸叠加 | Study039 | 800×560 | 6.4s |
| 040 | 2007 | 快切海报 | Study040 | 500×560 | 3s |
| 041 | 2008 | 像素笔画波动 | Study041 | 800×560 | 4.4s |
| 042 | 2009 | 弧线字组 | Study042 | 800×560 | 6.2s |
| 043 | 2010 | 几何字标拼合 | Study043 | 800×560 | 6s |
| 044 | 2011 | 钟摆字形 | Study044 | 800×560 | 2.2s |
| 045 | 2012 | 首字母带词 | Study045 | 800×560 | 6s |
| 046 | 2013 | 缩写展开与释义 | Study046 | 800×560 | 9s |
| 047 | 2014 | 反向字带 | Study047 | 800×560 | 6s |

原基础文字001–030保留；这17项是带字形、配色与构图的完整编排，因此作为独立分区，而非覆盖相似名称的旧效果。五个动作分类由src/studies/catalog.js维护。

## 维护入口

- src/studies/catalog.js：固定编号、名称、检索别名、原色板、默认文字、画幅、时长和静止代表帧。
- src/studies/variable.js、layout.js：保留SVG逐字可变字体、多布局位置与测量。
- src/studies/six.js：混排、透视字环的WebGL网格与前后层、bloom矢量轮廓、人物三层遮挡、贴字及连续墙地投影。035的logoMode为gather、flip、wave。
- src/studies/nine.js：像素矩阵、相连骨架的连续覆盖、独立几何模块、变宽曲线字杆、词尾对齐、缩写释义及分离字带缓冲。
- src/StudyMotion.tsx：共用帧驱动组件。所有动作仅从frame/fps与speed计算时间；字体和图片完成加载后才放行渲染。无独立RAF或CSS动画计时。
- src/StudySettings.tsx：独立参数、素材替换、配置下载与单项复位。
- public/type-studies/：照片、钟表与六份内嵌字体；加载只读本地文件。

默认参数完整保留已确认的字形、色板、构图、大小和时序。全局基础文字设置不会覆盖这一分区；colors是原色值到新色值的显式映射，空对象保留原色。

## 可调整边界

各项都支持speed、scale与原色板映射。普通字形按各项开放文字字段；固定布局保留其槽位：032为8个字母、033主词4位、042为11位、046缩写4位与4列释义。普通输入中尚未填满的槽位以空格占位，防止编辑时布局报错。替换后仍需查看字宽与裁切。

035的bloom、041的ABCDEF骨架、043的MOTIFS和044的Sway为定制轮廓或模块，不伪装成可随意输入的普通字体；修改它们的字形要编辑相应矢量或模块。041额外提供strokeGain。045保持已确认的T/S/f首笔结构。

036、037、038当前使用无人物图形：丝带、弹球和纸面，由相同帧时间驱动；不加载人物素材，旧portraitSrc/portraitMotion配置被忽略。objectMotion取0–1.2，可在「图形动感」中调整。044仍接受clockSrc并支持本地换图。

## 复用与渲染

在网站中调整某一项后，点击其参数里的“下载配置”。文件根部就是StudyMotion输入参数，_bela仅保存编号、名称、原始标记和组合规格。例如035对应Study035，选用的logoMode、速度与图片一并保留。Remotion可直接使用该JSON作为props：

~~~sh
npx remotion render src/index.ts Study035 /absolute/path/output.mp4 --props=/absolute/path/Bela-035-logo.json
~~~

本次没有运行视频导出。工程的Studio入口仍是npm run studio；真实剪辑须按目标画布、时间轴与安全区放置。新17项未生成旧ChatCut内联载荷，不把旧生成器当作这些组件的接入入口。

## 验证记录

- 原预览与当前组件在真实浏览器同时间对照：17项中段、34个开头/结尾采样、035三种0.4秒入场。详见proof/studies/source-comparison.json与review-*.png。
- SVG字形属性一致，布局数值差异在0.15源画布像素以内；Canvas中段的平均通道差异最高0.175/255，首尾采样最高1.294/255。已人工查看人物遮挡、字腔、像素阶梯、字母释义列对齐与立体环结。此统计含浏览器Canvas抗锯齿差异，不声称跨平台逐像素相同。
- scripts/render-studies.mjs实际生成57张首/中/尾Remotion检查帧（含035三版本），并查看17项代表帧；没有导出MP4。
- npm run check、npm run build、node scripts/check-studies.mjs及原30项两套动作/布局回归。
- 真实网页实测编号检索、三版本切换、1.3倍调速、配置下载读回、人物图片选择及还原。下载的配置参数与当前速度/版本一致。

Georgia和Courier New沿用源预览的系统字族，未复制系统字体；本地实际浏览器与本地渲染已核对，跨平台部署仍需确认这些字族。已内嵌的字体均原字节复制，哈希与字体名在public/type-studies/fonts/manifest.json。

对照页是开发检查工具，不是网站入口，不进入正式构建。需要重跑原稿对照时，用node scripts/serve-study-reference.mjs --source /absolute/path/type-motion-lab.html启动只读本地参考服务，再打开http://127.0.0.1:3108/scripts/study-review.html。正常网站预览和渲染不读取原来源目录。


## 新增实验字体接入（060–068）

新增九类已直接接入本网站；当前创意字体共26项，网站共68项。原预览目录同步保留可检查版本，后续编辑统一在网站工程进行。

| 编号 | 名称 | 原作参考 | Remotion组合 |
|---|---|---|---|
| 060 | 充气呼吸字 | [Pouf](https://www.futurefonts.com/linda-hintz/pouf) | Study060 |
| 061 | 笔画与留白互换 | [Invert](https://www.futurefonts.com/anna-khorash/invert) | Study061 |
| 062 | 扭曲变形字 | [Tweak Display](https://www.futurefonts.com/katja-schimmel/tweak-display) | Study062 |
| 063 | 细胞切割字 | [Cohere](https://www.nan.xyz/custom/cohere/) | Study063 |
| 064 | 液晶分段字 | [Walkie Talkie](https://www.nan.xyz/custom/walkie-talkie/) | Study064 |
| 065 | 生成纹理字 | [a16z](https://www.nan.xyz/custom/a16z-2/) | Study065 |
| 066 | 空间缠绕与扫描字 | [DIA Tools](https://tools.dia.tv/index.html) | Study066 |
| 067 | 文字雕塑与飘带 | [Space Type Generator](https://spacetypegenerator.com/) | Study067 |
| 068 | 程序生成艺术字 | [Generative Fonts](https://www.generativefonts.xyz/) | Study068 |


066参数experimentalMode：tangle / accordion / scan；067：ribbon / cylinder / flag；068：contour / grain / slice。其他六项为独立字形机制。新项在src/studies/experimental-catalog.js登记，由src/studies/experimental.js绘制，StudyMotion统一按帧传入时间；没有独立动画时钟。字重、字体文件、配色与底纹不继承基础文字分区的全局设置。

样字：PLUSH、VOID、SKEW、GROW、TUNE / ZONE / DAWN、NEXUS、ORBITAL / PLEAT / RIPPLE、UNFURL / ROAM / UNTAMED、GROOVE / GRAIN / SHIFT。自绘固定字形不提供会破坏轮廓结构的任意文字替换。

035的catalog、Remotion默认props、参数表与绘制器回退值均改为wave，保留gather / flip备选。

本批15个样例已生成90张真实Remotion检查帧（起始、动作峰值、落稳、中段、变形、收尾），查看proof/experimental/contact-sheet.jpg与manifest.json。网页已验证新增项搜索、参数切换及实际画面；没有导出视频，也未接入ChatCut。


### 060–068动作增强

时间轴使用连续的分段缓动与明确姿态，穿插快速动作、回弹和可读停留；各字母或分段保留相位差。字内纹理变化同时伴随完整形态或结构变化，不能退化为小幅正弦摆动。压缩 / 展开两端、分裂 / 合拢两端以及循环接回都纳入本轮检查。字母动态包围盒用于062的间距，曲面以双三角形贴图保持折叠和布面边缘连续。

网站绘制器为唯一源；对话中的experimental-type-motion.html直接使用当前网站绘制器生成，保留同样的时间与子模式。
