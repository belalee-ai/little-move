import {COVERAGE_ROWS,COVERAGE_CODES,coverageById,coverageDefaults,isCoverageAudio} from '../coverage/catalog.js';
import {VOICE_UI_ROWS,VOICE_UI_CODES,VOICE_UI_KEYS,voiceUIDefaults} from '../voice-ui/catalog.js';
import {VERIFICATION_ROWS,VERIFICATION_CODES,VERIFICATION_KEYS,verificationDefaults} from '../verification/catalog.js';
import {BATCH_ROWS,BATCH_CODES,BATCH_KEYS,BATCH_CONTROL_KEYS,batchDefaults} from '../batch/catalog.js';
import {voiceDuration} from './voice-motion.js';
import {EXPANSION_ROWS,EXPANSION_CODES,FEEDBACK_KEYS} from './expansion-catalog.js';
import {DATA_DEFAULTS,isDataDemo,dataKind} from './data-motion.js';
const codrops='https://tympanus.net/codrops/2024/03/13/grid-item-reveal-animation-on-hover/';
const layout='https://motion.dev/docs/react-layout-animations';
const hover='https://tympanus.net/codrops/2020/06/10/how-to-create-a-motion-hover-effect-for-a-background-image-grid/';
/** @type {Array<[string,string,string,string,string,string,string,string[]]>} */
const rows=[
 ['reveal','图片开窗','Image Mask Reveal','图片与图形','图片揭示','窄窗舒展为完整画面，图片缓慢推移；收窄时平滑切换下一张，再连续展开。',codrops,['遮罩','开幕']],
 ['carousel','叠片轮播','Stacked Image Carousel','图片与图形','图片切换','卡片按节拍向前接替，前景落稳、后景让位，以透视、旋转和阴影形成叠片轮播。',codrops,['轮播','相册']],
 ['parallax','分层视差','Layered Parallax','图片与图形','空间层次','天空缓慢错向移动，前景建筑以更大幅度跟随指针，画框轻微转向，移开后平稳归正。',hover,['视差','景深']],
 ['compare','拖动对比','Before After Slider','图片与图形','图片对比','拖动分割线，在同一位置对比两张图片；两侧保持统一比例与构图。','https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events',['前后对比','滑杆']],
 ['grid','网格重排','Animated Grid Reorder','布局','布局重组','六张卡片错拍抬起、沿弧线换位，三列双行变为两列三行，再交换排序并依次归位。',layout,['FLIP','重排']],
 ['bento','便当格展开','Expanding Bento Grid','布局','布局重组','主内容格展开，折线沿数据逐点生长，数字累加、百分比与进度同步变化，再收回网格。',layout,['Bento','便当盒']],
 ['expand','共享元素展开','Shared Element Expansion','布局','场景切换','同一张卡片展开为详情，标题与几何图形连续换位，正文线条错拍展开，再收回原卡片。','https://tympanus.net/codrops/2024/05/29/hover-motion-intro-animation/',['共享元素','详情展开']],
 ['accordion','横向手风琴','Horizontal Content Accordion','布局','布局重组','面板依次展开、其余收窄，标题连续转向，内容块错拍跟进；可切换为点击体验。',layout,['Accordion','折叠面板']],
 ['tilt','弹性 Dock','Elastic Dock','交互','指针反馈','指针经过 Dock 时图标依次放大抬起，邻近图标柔和让位，离开后连续回落。','https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events',['Dock','鱼眼','悬停放大','交互换新']],
 ['magnet','滑动确认','Slide to Confirm','交互','拖动反馈','拖动圆形滑块，轨道逐渐填满；接近末端后确认并显示勾号，未到阈值则平滑回退。','https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range',['滑动解锁','确认','Slide','交互换新']],
 ['follow','径向菜单','Radial Menu','交互','控件反馈','点击中心按钮，功能图标沿圆弧错拍展开；选择后或再次点击，沿原路径收回。','https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button',['圆形菜单','径向','Radial','交互换新']],
 ['drag','拖动吸附','Drag And Snap','交互','拖动反馈','拖动时主卡轻微抬起，边界产生阻力；松手依据速度滑向目标，带轻微回弹吸附到位。','https://motion.dev/docs/react-drag',['拖拽','Snap']],
];
rows.push(
 ['press','按钮按压','Button Press Feedback','交互','控件反馈','点击按钮，按钮短暂下沉压缩，随后回弹并显示已保存状态；再次点击重置。','https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button',['按钮','按压','保存']],
 ['input','输入聚焦','Floating Label Input','交互','控件反馈','点击真实输入框，标签向上让位，焦点光圈舒展；输入文字后标签保持浮起，失焦时收回光圈。','https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input',['输入框','表单','焦点','浮动标签']],
 ['switch','弹性开关','Animated Switch','交互','控件反馈','点击开关，圆形滑块横向滑移，轨道同步变色；文字随开关状态更新，支持键盘切换。','https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/switch_role',['Toggle','开关','切换']],
 ['tabs','滑块标签页','Sliding Tabs','交互','控件反馈','点击标签页，选中底块滑向目标，内容顺势错位切换；支持左右方向键操作。','https://www.w3.org/WAI/ARIA/apg/patterns/tabs/',['Tabs','选项卡','标签页']],
);
rows.push(
 ["count","数字滚动","Rolling Counter","数据","数字变化","数字各列从零连续滚动，轻微错拍启动，再逐列减速落到目标数字；固定栏宽保持整组居中。","https://developer.mozilla.org/en-US/docs/Web/SVG",["计数器","Count Up","数字增长"]],
 ["bars","柱状生长","Staggered Bar Chart","数据","图表生长","柱条从统一零基线错拍生长，数值跟随高度累加，最后同时停留供比较。","https://developer.mozilla.org/en-US/docs/Web/SVG",["柱状图","Bar Chart","比较"]],
 ["line","折线追踪","Line Chart Draw","数据","图表生长","折线沿时间顺序逐段绘出，游标与当前数值沿真实数据路径同步前进。","https://developer.mozilla.org/en-US/docs/Web/SVG",["折线图","趋势","Line Chart"]],
 ["donut","环图展开","Donut Chart Reveal","数据","比例与进度","环形分段按各自占比连续展开，中心总进度与旁侧百分比同步增长。","https://developer.mozilla.org/en-US/docs/Web/SVG",["环形图","饼图","占比","Donut"]],
 ["ranking","排名竞速","Bar Chart Race","数据","数据重排","各系列数值持续变化，条形长度随数值伸缩，排名跨越时沿纵向连续换位。","https://developer.mozilla.org/en-US/docs/Web/SVG",["排行榜","Bar Race","排名"]],
 ["milestone","进度里程碑","Milestone Progress","数据","比例与进度","进度条向目标推进，经过的阶段节点依次点亮，百分比和完成状态同步更新。","https://developer.mozilla.org/en-US/docs/Web/SVG",["进度条","流程","Progress"]],
 ["waterfall","瀑布拆解","Waterfall Chart Build","数据","图表生长","起始值与每项增减依次构建浮动柱，连接线标明累计关系，最后自动汇总总计。","https://developer.mozilla.org/en-US/docs/Web/SVG",["瀑布图","增减","Waterfall"]],
 ["heatmap","热力图点亮","Heatmap Reveal","数据","矩阵显现","数据格从左上向右下依次点亮，用同一色阶表达强弱，累计数字同步显现。","https://developer.mozilla.org/en-US/docs/Web/SVG",["热力图","日历","矩阵","Heatmap"]]
);
rows.push(...EXPANSION_ROWS);
rows.push(['voice','语音波形','Speaking Waveform','数据','声音与进度','声波随说话音量连续起伏，停顿时收回低幅度；播放进度从左向右推进，也可切换为整段波形逐步点亮。','https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData',['声音波浪','音频波形','说话进度','声纹','语音','Waveform','Audio']]);
rows.push(...BATCH_ROWS,...VERIFICATION_ROWS,...VOICE_UI_ROWS,...COVERAGE_ROWS);
rows.push(['pixel-field','图片像素扰动','Pointer Pixel Displacement','图片与图形','图片揭示','指针划过图片，局部方块沿运动方向错位采样，留下短暂拖尾；停下或移开后连续复原。','https://tympanus.net/Development/DistortedPixels/index3.html',['像素扰动','方块错位','像素拖尾','Pixel distortion']]);
rows.push(['scroll-grain','滚动弧面与颗粒','Scroll Bend and Grain','图片与图形','空间层次','滚动图片长廊，图片随速度弯成弧面，方向反转时曲率翻转；细颗粒随动增强，停下后恢复平整清晰。','https://tympanus.net/Tutorials/ShaderOnScroll/',['滚动扭曲','滚轮','惯性','颗粒','Scroll distortion']]);
rows.push(['magnetic-grid','磁吸网格聚焦','Magnetic Grid Focus','布局','场景切换','多张缩略图随指针产生独立磁吸和纵深，点击后其余图片错拍撤离，所选图片连续展开；返回时原路归位。','https://tympanus.net/Development/3DGridContentPreview/',['磁吸网格','立体网格','图片详情','Grid preview']]);
const codes={'scroll-grain':'292','magnetic-grid':'293','pixel-field':'291',...COVERAGE_CODES,...VOICE_UI_CODES,...BATCH_CODES,...VERIFICATION_CODES,voice:'101',...EXPANSION_CODES,reveal:'048',carousel:'049',parallax:'050',compare:'051',grid:'052',bento:'053',expand:'054',accordion:'055',tilt:'056',magnet:'057',follow:'058',drag:'059',press:'069',input:'070',switch:'071',tabs:'072',count:'073',bars:'074',line:'075',donut:'076',ranking:'077',milestone:'078',waterfall:'079',heatmap:'080'};
export const DEMOS=rows.map(([key,name,english,collection,category,prompt,source,aliases],i)=>({id:'demo-'+key,key,code:codes[key],name,english,collection,category,prompt,source,aliases:['reveal','carousel','parallax','compare','drag'].includes(key)?[...aliases,'建筑','空间','摄影','照片']:aliases,width:800,height:500,seconds:8,trigger:coverageById(key)?coverageById(key).trigger:VOICE_UI_KEYS.includes(key)?(['ios-swipe','ios-wheel','ios-volume','ios-refresh','push-talk'].includes(key)?'拖动':'点击'):VERIFICATION_KEYS.includes(key)?(key==='captcha-order'?'点击':'拖动'):BATCH_CONTROL_KEYS.includes(key)?(['tooltip','rating'].includes(key)?'指针':['dualrange','sortlist','sheet'].includes(key)?'拖动':'点击'):FEEDBACK_KEYS.includes(key)?(key==='range'?'拖动':'点击'):['compare','drag','magnet'].includes(key)?'拖动':['grid','bento','expand','accordion','press','input','switch','tabs','follow'].includes(key)?'点击':key==='scroll-grain'?'滚动':key==='magnetic-grid'?'点击':['parallax','tilt','pixel-field'].includes(key)?'指针':'自动',signature:({'scroll-grain':'image-scroll-velocity-grain-distortion','magnetic-grid':'grid-pointer-3d-magnetic-shared-preview','pixel-field':'image-pixel-displacement-pointer',tilt:'dock-fisheye-v1',magnet:'slide-confirm-v1',follow:'radial-menu-v1'})[key]??key+'-v1',implementation:'独立实现',web:true,remotion:true,chatcut:false}));
export const demoById=id=>DEMOS.find(d=>d.id===id);
export const demoUsesImages=id=>['demo-pixel-field','demo-scroll-grain','demo-magnetic-grid'].includes(id)||coverageById(id)?.role==='image'||['reveal','carousel','parallax','compare','drag'].includes(demoById(id)?.key);
// Each demo has its own subject set, shared by website preview and rendering.
const photoSets={
 'demo-reveal':['arch-clouds','stair-light','wall-shadow'],
 'demo-carousel':['curve','stone','light'],
 'demo-parallax':['golden-arch'],
 'demo-compare':['glass-facets','sunlit-columns'],
 
 'demo-drag':['concrete-stairs','white-facade','graphic-shadows'],
};
/** @returns {import("../DemoMotion").DemoProps & {speed:number,strength:number,background:string,accent:string,title:string,fit:'contain'|'cover',images:string[]}} */
export const demoDefaults=id=>({demo:id,speed:1,strength:1,background:['grid','bento','expand','accordion','tilt','magnet','follow','drag','press','input','switch','tabs'].some(key=>id==='demo-'+key)?'#f3f3f1':'#f3f0e9',accent:id==='demo-tabs'?'#ffffff':['grid','bento','expand','accordion','tilt','magnet','follow','press','input','switch'].some(key=>id==='demo-'+key)?'#292928':'#c9e879',title:id==='demo-expand'?'Details':'Light, in motion',fit:'cover',images:id==='demo-scroll-grain'?['arch','stair','fold'].map(name=>'/intake-studies/scroll-'+name+'.svg'):id==='demo-magnetic-grid'?Array.from({length:6},(_,i)=>'/intake-studies/grid-'+(i+1)+'.svg'):id==='demo-pixel-field'?['/pixel-field/quiet-courtyard.svg']:(photoSets[id]??[]).map(name=>'/demo-photos/architecture-'+name+'.jpg'),...(FEEDBACK_KEYS.includes(id.replace('demo-',''))?{background:'#f3f3f1',accent:'#292928'}:{}),...(isDataDemo(id)?DATA_DEFAULTS[dataKind(id)]:{}),...(id==='demo-voice'?{background:'#f3f3f1',accent:'#292928',voiceStyle:'live'}:{}),...(BATCH_KEYS.includes(id.replace('demo-',''))?batchDefaults(id.replace('demo-','')):{}),...(VERIFICATION_KEYS.includes(id.replace('demo-',''))?verificationDefaults():{}),...(VOICE_UI_KEYS.includes(id.replace('demo-',''))?voiceUIDefaults(id.replace('demo-','')):{}),...(coverageById(id)?coverageDefaults(id):{})});
export const demoFrames=(p,fps=60)=>Math.ceil((p.demo==='demo-voice'||isCoverageAudio(p.demo)?voiceDuration(p):8)*fps/Math.max(.5,Math.min(2,p.speed??1)));
export {clamp,smooth,mix,resolveDemoState as demoState} from './motion.js';
export const demoStillFrame=(p,fps=60)=>Math.min(demoFrames(p,fps)-1,Math.round((VOICE_UI_KEYS.includes(p.demo.replace('demo-',''))?4.7:VERIFICATION_KEYS.includes(p.demo.replace('demo-',''))?4.9:BATCH_KEYS.includes(p.demo.replace('demo-',''))?4.6:p.demo==='demo-voice'?voiceDuration(p)*.55:p.demo==='demo-reveal'?1.3:isDataDemo(p.demo)?5.2:2.75)*fps/Math.max(.5,Math.min(2,p.speed??1))));
