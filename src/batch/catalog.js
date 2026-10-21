// Original frame-driven implementations. No Lieflat template/source/token code is bundled.
const svg='https://developer.mozilla.org/en-US/docs/Web/SVG';
const apg='https://www.w3.org/WAI/ARIA/apg/patterns/';
const charts='https://d3js.org/what-is-d3';
const groups=[
 ['基础文字','文字编排',[
 ['subtitle','字幕滚屏','Caption Scroll','三行短句连续上移，当前句清晰放大，前后句减弱，阅读焦点顺着滚动切换。','字幕','滚屏'],
 ['relay','词语接力','Word Relay','单词从同一个焦点接力出现，上一词沿弧线让位，最后组成完整句子。','接力','单词'],
 ['brackets','括号聚焦','Bracket Focus','一对括号在词组之间连续移动并伸缩，焦点词提亮，其余文字保持原位。','括号','聚焦'],
 ['punctuation','标点变奏','Punctuation Play','圆点拉开成冒号，上半笔画连续弯成问号、伸直为感叹号，再收回圆点。','标点','变形'],
 ['slices','字面切片','Sliced Type','标题被分成水平切片，各片错拍横移，再连续对齐成清晰字面。','切片','错位'],
 ['foldtitle','对折标题','Folded Title','标题上下半面沿中线折起并展开，透视和明暗随折叠变化，最后拼成完整字面。','折叠','标题'],
 ['crossword','交叉排字','Crossword Layout','两组字母从横排旋转为十字交叉排布，共用中心字母，再展开回到横排。','十字','排版'],
 ['weave','字符编织','Woven Type','上下两行字母交错穿过中轴，在前后层间换位，最后回到两条清楚的字行。','编织','穿插'],
 ['drawtype','笔迹显字','Drawn Type','细线沿字母笔画连续描画，笔头带动转折，完成后保留清楚字形。','手写','描画'],
 ['longshadow','长影收拢','Type Extrusion','字后方的阶梯投影沿对角线伸长，逐层追上字面，最后收成干净的平面标题。','长影','收拢'],
 ['infinity','无穷轨道字','Infinity Type','字母沿无穷曲线错拍穿行，越过交叉处形成前后层，再依次回到标题位置。','无穷','轨道'],
 ['countermask','字内流动','Countershape Motion','文字作为固定镂空窗口，圆点、条带和圆弧在字面内连续穿行，字形始终可辨。','镂空','蒙版'],
 ['footnote','脚注展开','Expanding Footnote','标题旁的脚注标记滑开为解释短句，连接线随空间舒展，再收回标记位置。','脚注','释义'],
 ['connector','字词连线','Connected Words','三个关键词依次就位，连接线从词尾生长到下一词，箭头沿连线传递再归位。','连线','关键词'],
 ['rewrite','删改重写','Type And Rewrite','输入一句短语，光标停顿后逐字删除末词，换成新词，字号与基线保持固定。','删除','重写','打字'],
 ]],
 ['图片与图形','图形运动',[
 ['morph','圆方变形','Circle Square Morph','圆形舒展为圆角方形，再旋转成菱形，边角连续变化后回到圆形。','圆方','变形'],
 ['metaball','弹性连体','Elastic Bridge','两颗圆球拉开时连接颈部被拉细，分开后再靠近融合，轮廓连续伸缩。','连体','融合'],
 ['bouncepath','轨迹弹球','Path Bounce','圆球沿弧形轨道起落，着地时挤压、离地时拉长，短轨迹随球回收。','弹球','挤压'],
 ['drawpath','路径接续','Path Draw','线条沿曲线描出，圆点贴着笔头行进，完整路径随后从尾端连续擦除。','路径','描线'],
 ['particles','粒子成形','Particle Assembly','散落点阵沿各自弧线聚成星形轮廓，停留后向外舒展，再回到起始位置。','粒子','聚合'],
 ['ripples','水波扩散','Ripple Rings','圆环从中心依次扩散，间距和透明度随距离衰减，形成连续交叠的水波。','水波','涟漪'],
 ['petals','花瓣开合','Petal Bloom','六片椭圆花瓣绕中心错拍展开，轻微旋转后合拢，层间始终保留间隙。','花瓣','绽放'],
 ['lensgrid','网格透镜','Grid Lens','规则网格围绕移动焦点连续鼓起，邻近节点让位，焦点离开后逐层恢复。','透镜','网格'],
 ['isocubes','立方错层','Isometric Blocks','等距立方块沿竖轴错拍升降，顶面和侧面始终相接，形成流动的立体阶梯。','立方','等距'],
 ['paperflip','纸片翻面','Paper Turn','纸片右下角沿对角线掀起，折面反射到纸面上方，折痕、背面与投影同步变化，再连续铺平。','纸片','翻面'],
 ['orbits','多轨环绕','Nested Orbits','三颗圆点沿不同倾角和速度的轨道绕行，交叉处按深度换层。','轨道','行星'],
 ['unravel','线团解结','Line Unravel','多条弯曲线从缠绕状态连续松开，展开为平行线，再沿原路回拢。','线团','解结'],
 ['hourglass','流沙交换','Hourglass Transfer','上半部颗粒逐渐减少，细流穿过瓶颈落到下半部，完成后整体翻转再流动。','沙漏','流沙'],
 ['contours','等高线流动','Flowing Contours','一组闭合轮廓围绕流动中心起伏，峰谷在轮廓之间传递，始终保持层级。','等高线','轮廓'],
 ['iconmorph','图标变形','Icon Morph','三条菜单线的中线收短，外侧两线旋转交叉成关闭图标，再连续还原。','图标','菜单','关闭'],
 ]],
 ['交互','控件反馈',[
 ['ripplebutton','波纹按钮','Ripple Button','点击位置产生圆形波纹，沿按钮内部扩散并淡出，按钮保持稳定。','波纹','按钮'],
 ['hold','长按确认','Hold To Confirm','持续按住时确认环逐渐填满，达到阈值后显示完成；中途松开则平滑回退。','长按','确认'],
 ['like','收藏迸发','Favorite Burst','星形被选中时填色并轻弹，短线向外错拍迸发，取消后恢复轮廓。','收藏','星星'],
 ['tooltip','悬浮提示','Tooltip Reveal','悬停或聚焦图标后提示框轻抬出现，指向小箭头与提示同步，离开后收回。','提示','Tooltip'],
 ['popover','浮层定位','Popover Anchor','触发按钮旁展开一块锚定浮层，内容错拍出现，关闭后回到触发点。','Popover','浮层'],
 ['dialog','对话框展开','Dialog Expansion','卡片按钮连续扩展为对话框，背景减弱，关闭时沿原路径收回并恢复焦点。','弹窗','Dialog'],
 ['sheet','底部抽屉','Bottom Sheet','底部面板沿竖轴展开，背景内容后退，抓住把手向下拖动可收起。','抽屉','Sheet'],
 ['command','命令面板','Command Palette','搜索面板由中心舒展，输入后结果重新排列，方向键移动选中项，回车确认。','命令','Command'],
 ['otp','验证码输入','OTP Entry','数字逐格输入，焦点边框连续移向下一格，填满后出现完成勾号，删除可回退。','验证码','OTP'],
 ['password','密码显隐','Password Reveal','点击眼睛图标在圆点和文字间连续切换，输入内容与基线保持不动。','密码','显隐'],
 ['inlineedit','行内编辑','Inline Edit','点击文本进入同位置输入框，确认后文字平稳回到阅读态，取消保留旧值。','编辑','Inline'],
 ['dualrange','双端区间','Dual Range','两个滑块分别控制区间上下限，中间轨道同步填充，拖动时数值跟随且不能交叉。','区间','双滑块'],
 ['rating','星级预览','Rating Preview','指针经过时星形依次点亮，点击固定评分，方向键逐级调整。','评分','星级'],
 ['tree','树形展开','Tree Disclosure','箭头旋转后子项沿缩进依次展开，收起时空间连续回收，可逐级展开。','树形','层级'],
 ['sortlist','拖动重排','Sortable Stack','抓住首项拖动，卡片抬起且邻项让位，松手吸附到目标行；方向键也可换位。','排序','拖动'],
 ]],
 ['数据','图表演化',[
 ['dumbbell','哑铃对比','Dumbbell Comparison','每组两个数值沿同一刻度展开，连接线同步伸长，两个端点保留清晰读数。','哑铃','前后对比'],
 ['slope','坡度迁移','Slope Migration','同一组对象从起始列连到目标列，线条沿数值位置生长，交叉处保持对象身份。','坡度','Slope'],
 ['interval','区间展开','Interval Reveal','区间从中值向两端展开，最低、中值和最高三个位置按同一刻度对齐。','区间图','范围'],
 ['boxplot','箱线展开','Box Plot','须线先展开到最小最大值，箱体按四分位数舒展，中位线随后落位。','箱线图','分布'],
 ['histogram','频数分箱','Histogram Build','样本逐颗落入连续区间，入箱后频数和柱高同步累加，保留真实零基线。','直方图','分箱'],
 ['ridgeline','山峦分布','Ridgeline Density','各组样本的密度轮廓沿横轴绘出，错拍叠成山峦，组间保持统一尺度。','密度','山峦'],
 ['beeswarm','蜂群散布','Beeswarm Distribution','样本从中心散开到各自数值位置，相邻圆点避让堆叠，每个点保留一条记录。','蜂群','逐点'],
 ['funnel','漏斗递进','Funnel Stages','各阶段按剩余人数展开为连续收窄的漏斗斜面，人数与宽度同步增长。','漏斗','转化'],
 ['sankey','流量汇聚','Sankey Flow','流带按来源和去向逐条绘出，带宽与流量一致，两侧节点总量守恒。','桑基','流向'],
 ['arcnetwork','弧线关系','Arc Network','节点按横轴排开，关系弧线依次跨接，线宽编码关系强度。','弧线图','网络'],
 ['waffle','百格填充','Waffle Share','一百个等面积单元按占比分组点亮，数字和已点亮格数保持一致。','华夫','百格','占比'],
 ['pictogram','符号计量','Pictogram Units','同尺寸图标按固定单位依次出现，尾项用裁切表示不足一个单位的数值。','象形','符号图'],
 ['bullet','目标标尺','Bullet Target','数值条沿共同零基线推进，背景分区表示阈值，目标刻线保持固定以供比较。','子弹图','目标'],
 ['candles','蜡烛序列','Candlestick Reveal','每期先画最低最高须线，再展开开盘收盘实体，空心上涨与实心下跌分开编码。','蜡烛','OHLC'],
 ['parallel','平行维度','Parallel Coordinates','同一实体的数值沿多条平行坐标逐段连接，节点和线同步到位。','平行坐标','多维'],
 ]],
];
export const BATCH_ROWS=groups.flatMap(([collection,category,items])=>items.map(([key,name,english,prompt,...aliases])=>[key,name,english,collection,category,prompt,collection==='交互'?apg:collection==='数据'?charts:svg,['扩展二期','本轮新增',collection==='基础文字'?'本轮文字':collection==='图片与图形'?'本轮图形':collection==='交互'?'本轮控件':'本轮数据',...aliases]]));
export const BATCH_CODES=Object.fromEntries(BATCH_ROWS.map((r,i)=>[r[0],String(102+i)]));
export const BATCH_KEYS=BATCH_ROWS.map(r=>r[0]);
export const BATCH_TEXT_KEYS=BATCH_ROWS.slice(0,15).map(r=>r[0]);
export const BATCH_GRAPHIC_KEYS=BATCH_ROWS.slice(15,30).map(r=>r[0]);
export const BATCH_CONTROL_KEYS=BATCH_ROWS.slice(30,45).map(r=>r[0]);
export const BATCH_DATA_KEYS=BATCH_ROWS.slice(45).map(r=>r[0]);
export const isBatch=id=>BATCH_KEYS.includes(id.replace('demo-',''));
export const batchDefaults=key=>({background:'#f4f3ef',accent:'#292928',strength:1,motionText:({subtitle:'先看见\n再理解\n让表达流动',relay:'Ideas move forward',brackets:'把 灵感 变成 作品',slices:'MAKE SPACE',foldtitle:'OPEN',crossword:'FLOW',weave:'FORM\nMOVE',drawtype:'hello',longshadow:'ECHO',infinity:'MOMENT',countermask:'FLOW',footnote:'Design',connector:'Think,Make,Share',rewrite:'Make it perfect'})[key]??'Make room',...batchDataDefaults[key]});
/** @type {Record<string,{dataValues:string,dataLabels:string}>} */
export const batchDataDefaults={
 dumbbell:{dataValues:'20,54,32,72,44,86',dataLabels:'A,B,C'},slope:{dataValues:'25,62,72,43,46,84,56,29',dataLabels:'A,B,C,D'},interval:{dataValues:'12,32,58,26,51,78,34,67,92',dataLabels:'A,B,C'},boxplot:{dataValues:'8,24,38,56,82,15,35,48,68,93,4,18,32,47,74',dataLabels:'A,B,C'},histogram:{dataValues:'3,8,15,22,18,11,6,2',dataLabels:'0–10,10–20,20–30,30–40,40–50,50–60,60–70,70–80'},ridgeline:{dataValues:'14,19,22,24,29,35,32,42,46,51,55,61,46,53,61,65,72,82',dataLabels:'A,B,C'},beeswarm:{dataValues:'14,18,20,21,24,25,25,26,31,34,34,35,35,36,44,49,53,55,58,62,65,71,76,84',dataLabels:'Samples'},funnel:{dataValues:'1000,720,480,260',dataLabels:'Visits,Explore,Try,Join'},sankey:{dataValues:'24,12,8,14,18,6,8,10,20',dataLabels:'A,B,C,X,Y,Z'},arcnetwork:{dataValues:'8,4,6,3,9,5',dataLabels:'A,B,C,D,E'},waffle:{dataValues:'42,28,18,12',dataLabels:'A,B,C,D'},pictogram:{dataValues:'7.5,4,2.5',dataLabels:'A,B,C'},bullet:{dataValues:'68,82,54,72,86,92',dataLabels:'A,B,C'},candles:{dataValues:'20,32,15,42,32,27,22,48,27,52,24,60,52,46,38,66,46,68,42,78,68,61,54,84',dataLabels:'Mon,Tue,Wed,Thu,Fri,Sat'},parallel:{dataValues:'22,75,48,62,64,42,86,36,48,58,28,82,82,34,62,54',dataLabels:'Cost,Speed,Quality,Reach'},
};
