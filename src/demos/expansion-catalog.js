// Original, asset-free studies. Links describe public platform mechanisms.
const html='https://developer.mozilla.org/en-US/docs/Web/HTML/Element/';
const svg='https://developer.mozilla.org/en-US/docs/Web/SVG';
export const FEEDBACK_KEYS=['check','radio','range','stepper','menu','search','validation','toast','upload','pagination'];
/** @type {Array<[string,string,string,string,string,string,string,string[]]>} */
export const EXPANSION_ROWS=[
 ['check','勾选描画','Checkbox Draw','交互','控件反馈','方框轻压后填色，勾线按笔画描出，关联计数同步更新；取消时连续收回。',html+'input/checkbox',['复选框','Checkbox']],
 ['radio','单选滑移','Radio Selection','交互','控件反馈','选中底板沿选项滑移，圆点缩放落位，选项内容同步切换。',html+'input/radio',['单选框','Radio']],
 ['range','滑杆气泡','Range Bubble','交互','控件反馈','滑块沿轨道移动，填充长度和悬浮数值同步跟随，滑块轻微伸缩。',html+'input/range',['Slider','范围','音量']],
 ['stepper','数字步进','Quantity Stepper','交互','控件反馈','加减按钮触发数字上下滚动，数值逐级增减，边界自动禁用。',html+'button',['加减','数量','Stepper']],
 ['menu','下拉舒展','Dropdown Unfold','交互','控件反馈','菜单从触发按钮下方舒展，选项错拍跟进，选中条目后更新按钮。',html+'select',['下拉框','Dropdown','菜单']],
 ['search','搜索展开','Expanding Search','交互','控件反馈','搜索图标展开为输入框，文字逐步输入，匹配结果连续展开，再收回。',html+'input/search',['搜索框','Search']],
 ['validation','输入校验','Input Validation','交互','控件反馈','输入由不完整变为有效，辅助提示连续换位，完成后描出确认勾。',html+'input/email',['校验','表单','验证']],
 ['toast','消息浮层','Toast Feedback','交互','控件反馈','按钮触发消息卡片上浮，确认勾描出、倒计时线收短，关闭后归位。','https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role',['Toast','通知','消息']],
 ['upload','上传反馈','Upload Progress','交互','控件反馈','文件卡片展开，进度从零连续推进，百分比同步增长，完成后切换确认状态。',html+'progress',['上传','进度','Upload']],
 ['pagination','分页接续','Pagination Transition','交互','控件反馈','分页底块滑向目标，列表按方向错拍移入，页码和内容保持一致。',html+'button',['翻页','Pagination']],
 ['area','堆叠面积','Stacked Area Growth','数据','图表生长','三层数据面积沿横轴逐段展开，游标与累计数值沿数据路径同步前进。',svg,['面积图','Area','堆叠']],
 ['gauge','仪表指针','Gauge Sweep','数据','比例与进度','仪表弧从零展开，指针连续扫向目标，中心百分比跟随角度增长。',svg,['仪表盘','Gauge','指针']],
 ['radar','雷达舒展','Radar Expansion','数据','图表生长','各维度沿刻度向外生长，节点错拍到位，连成与数值一致的雷达面。',svg,['雷达图','Radar']],
 ['scatter','散点迁移','Scatter Migration','数据','数据重排','散点从初始快照沿弧线迁往目标值，短轨迹标记迁移方向，数值随位置更新。',svg,['散点图','Scatter','轨迹']],
 ['bubble','气泡生长','Bubble Scaling','数据','图表生长','气泡错拍舒展，面积与数据成比例，标签和数值跟随气泡落位。',svg,['气泡图','Bubble']],
 ['lollipop','棒棒糖图','Lollipop Extension','数据','图表生长','细线从零基线延伸，末端圆点带动数值滑向目标，保留清楚的比较刻度。',svg,['棒棒糖','Lollipop','点线']],
 ['treemap','矩形分配','Treemap Partition','数据','矩阵显现','矩形区块按数据权重连续分配面积，分界和数值同步改变，最终稳定停留。',svg,['树图','矩形树图','Treemap']],
 ['diverging','正负展开','Diverging Bars','数据','图表生长','条形由中心零轴向两侧伸展，正负号与长度同步变化，明确展示增减。',svg,['正负','发散条形','Diverging']],
 ['flipcount','翻牌计数','Split Flap Counter','数据','数字变化','数字牌上下半片依次翻转进位，最后逐位停止在目标整数。',svg,['翻牌','计数','Split Flap']],
 ['multiring','多环进度','Concentric Progress','数据','比例与进度','多条同心环独立推进，各环弧长与旁侧百分比严格对应，错拍完成后停留。',svg,['多环','环形进度','Rings']],
];
for(const row of EXPANSION_ROWS)row[7].push('新增',row[3]==='数据'?'新增数据':'新增控件');
export const EXPANSION_CODES=Object.fromEntries(EXPANSION_ROWS.map((r,i)=>[r[0],String(81+i).padStart(3,'0')]));
const neutral={background:'#f3f3f1',accent:'#292928'};
export const EXTRA_DATA_DEFAULTS={
 area:{...neutral,title:'Layer by layer',dataValues:'24,42,36,68,58,84',dataLabels:'Mon,Tue,Wed,Thu,Fri,Sat',unit:''},
 gauge:{...neutral,title:'Capacity',dataValues:'76',dataLabels:'Capacity',unit:'%'},
 radar:{...neutral,title:'A wider perspective',dataValues:'82,64,92,55,74',dataLabels:'Clarity,Speed,Craft,Reach,Focus',unit:'%'},
 scatter:{...neutral,title:'From here to there',dataValues:'78,42,86,58,66',dataLabels:'A,B,C,D,E',unit:''},
 bubble:{...neutral,title:'Room to grow',dataValues:'64,36,81,25,49',dataLabels:'A,B,C,D,E',unit:''},
 lollipop:{...neutral,title:'Small differences',dataValues:'32,72,48,89,61',dataLabels:'North,East,South,West,Central',unit:''},
 treemap:{...neutral,title:'A share of the whole',dataValues:'40,28,20,12',dataLabels:'Studio,Product,Research,Other',unit:'%'},
 diverging:{...neutral,title:'Give and take',dataValues:'48,-32,76,-54,28',dataLabels:'A,B,C,D,E',unit:''},
 flipcount:{...neutral,title:'Every step adds up',dataValues:'8642',dataLabels:'Total',unit:''},
 multiring:{...neutral,title:'Moving together',dataValues:'88,64,42',dataLabels:'Build,Review,Ship',unit:'%'},
};
