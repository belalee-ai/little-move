import {EXPERIMENTAL_STUDIES} from './experimental-catalog.js';
/** @type {Array<[string,string,string,string,string,number,number,number,string,string[],Record<string,any>]>} */
const entries=[
 ['variable','可变字重','Variable Type','字形与笔画','文章',6.6,800,464,'字重、倾斜与笔画比例沿字母传递，三组英文依次呼吸换词。',['#000000','#ffffff'],{words:['Breathe','Lean','Play']}],
 ['layout','字母重组','Expressive Layout','排版与重组','9551',8,800,520,'字母沿弧线错拍移动，在横排、竖排、两行和大小混排之间重组。',['#11271f','#edff16'],{text:'STAYWILD'}],
 ['mix','字体混排','Mixed Type','排版与重组','2001',6,800,480,'衬线、无衬线与描边字错拍落位，遮罩逐字换形后分组退出。',['#191c1e','#eeeade'],{headline:'Just',subline:'one more',featureWord:'IDEA'}],
 ['ring','透视字环','Perspective Orbit','空间与遮挡','1999',6,800,480,'文字沿倾斜圆环连续绕行，与翻转的立体金属环结形成前后遮挡。',['#17191e','#f4f0e7'],{text:'KEEP MOVING · KEEP MAKING · '}],
 ['logo','字标重组','Rounded Wordmark','排版与重组','2002',6,800,480,'完整圆角字标以弹性聚拢、翻转落位或波浪展开归位，保留开放字腔。',['#969fe0','#fff9ea'],{logoMode:'wave'}],
 ['mask','丝带穿字','Ribbon Weave','空间与遮挡','2003',6,800,480,'哑光缎带在蓝色字母间前后穿插，被遮住的字形半透明透出，字母轻微错拍浮动。',['#eee9de','#315ac8','#fffdf5'],{text:'SUMMER',objectMotion:1}],
 ['stickers','贴字弹入','Bouncing Stickers','贴纸与海报','2004',6,800,480,'几何弹球沿弧线跳跃，碰到四个位置依次触发贴字弹出，落位回弹后收回。',['#f0e9dd','#ef7256','#243653','#fffdf7'],{phrases:['HEY!','WAIT','YES',"LET'S GO"],objectMotion:1}],
 ['fold','空间折叠','Spatial Fold','空间与遮挡','2005',6,800,480,'文字连续印在上下两个纸面上，下半张沿折痕抬起，透视与投影随折叠变化，再平稳展开。',['#eee9de','#c03f32','#faf6ed'],{text:'WANDER',objectMotion:1}],
 ['stack','彩色贴纸叠加','Layered Stickers','贴纸与海报','2006',6.4,800,560,'像素、圆角和卷曲字标分批贴入，多层错位叠加停留，再成组撤回。',['#eeece5','#98df54','#7cb7db','#eff566','#4f43a2','#d787da'],{phrases:['ODDLY GOOD','FRESH EYES','TINY GIANTS','OFF SCRIPT','MIDNIGHT INK']}],
 ['posters','快切海报','Pixel Poster Cuts','贴纸与海报','2007',3,500,560,'阶梯像素字、黑白横线与棋盘格组成海报，每0.2秒整版快切。',['#202226','#eeeee4','#272d2a'],{}],
 ['pixels','像素笔画波动','Connected Pixel Strokes','字形与笔画','2008',4.4,800,560,'相连字母骨架在固定细网格中连续改变笔画粗细与字腔，波动沿字母传递。',['#16191e','#f1f0df','#282d32','#a87246'],{strokeGain:1}],
 ['paths','弧线字组','Arc Letter Paths','排版与重组','2009',6.2,800,560,'浅色独立字块沿弧线错拍分散、合流、离场并回归，转向带轻微惯性。',['#2555df','#f7f8f2','#222527'],{text:'TypeFlowLab'}],
 ['geometry','几何字标拼合','Geometric Motifs','字形与笔画','2010',6,800,560,'多色几何模块、圆孔与点纹组成字标，逐字错拍旋转拼合，再分解回收。',['#e7e0c8','#6968c6','#ebed58'],{}],
 ['swing','钟摆字形','Sculptural Sway','节奏与字带','2011',2.2,800,560,'木质钟体与金属摆锤连续往返，定制细长字杆随摆动弯曲，底部稳定。',['#eee9df','#dcd3c4','#bfb19b','#33271f'],{clockSrc:'/type-studies/sculptural-clock.webp'}],
 ['baton','首字母带词','Letter Gestures','节奏与字带','2012',6,800,560,'首字母的独立笔画先摆动，词尾和次级信息延迟跟随，再分组退出。',['#eae7df','#6973df','#cc77cf','#202226'],{}],
 ['monogram','缩写展开与释义','Monogram Expansion','排版与重组','2013',9,800,560,'大小写缩写逐字放大重排，再收回原位；解释单词沿对应字母中心逐字显现。',['#ece9e0','#f0f0cb','#181e1c','#293126'],{text:'ForM',words:['Fold.','Observe.','Rotate.','Mix.']}],
 ['bands','反向字带','Opposing Type Bands','节奏与字带','2014',6,800,560,'上下字带反向滚动，依次切换点阵、衬线、细线断笔和圆润切割字形。',['#eeeae2','#dfe6b2','#e9ef45','#e3e3c3','#bedc8e','#d9e1de'],{topText:'VECTOR',bottomText:'RHYTHM'}],
];
// Readability presets retain original palette keys so existing custom swatches still work.
const clearLooks={
 variable:{'#000000':'#f3f1eb','#ffffff':'#303a35'},
 layout:{'#11271f':'#eaf0eb','#edff16':'#354e43'},
 mix:{'#191c1e':'#f2f0e9','#eeeade':'#343b38'},
 logo:{'#969fe0':'#e6e9f4','#fff9ea':'#465484'},
 pixels:{'#16191e':'#f1f0e9','#f1f0df':'#35423c','#282d32':'#dcded6','#a87246':'#9c8062'},
 baton:{'#6973df':'#dfe3f2','#cc77cf':'#eee1ed'},
 paths:{'#2555df':'#e6ebf1','#f7f8f2':'#fffef9','#222527':'#35414c'}
};
export const STUDIES=[...entries.map(([key,name,english,category,reference,seconds,width,height,prompt,palette,defaults],i)=>({
 id:'study-'+key,key,code:String(31+i).padStart(3,'0'),name,english,category,reference,seconds,width,height,prompt,note:prompt,palette,defaults:{...defaults,...(clearLooks[key]?{colors:clearLooks[key]}:{}),...(key==='pixels'?{strokeGain:.82}:{})},collection:'创意字体',source:null,aliases:[reference,'IMG_'+reference,english,key,...(['mask','stickers','fold'].includes(key)?['无人物','图形互动']:[]),...(key==='mask'?['人物穿字','Portrait Weave']:[])]
})),...EXPERIMENTAL_STUDIES];
export const studyById=id=>STUDIES.find(s=>s.id===id);
export const studyDefaults=id=>({study:id,speed:1,scale:1,colors:{},...structuredClone(studyById(id).defaults)});
export const studySpeed=props=>Number.isFinite(props.speed)?Math.max(.5,Math.min(2,props.speed)):1;
export const studyFrames=(props,fps=60)=>Math.max(1,Math.round(studyById(props.study).seconds/studySpeed(props)*fps));
export const studyTime=(props,frame,fps)=>Math.min(studyById(props.study).seconds-1e-6,Math.max(0,frame/fps*studySpeed(props)));
export const studyStillFrame=(props,fps=60)=>Math.min(studyFrames(props,fps)-1,Math.round(({variable:1.1,layout:5.7,mix:2.8,ring:2.4,logo:2.4,mask:1.95,stickers:4.1,fold:2.7,stack:3,posters:.65,pixels:1.6,paths:2.4,geometry:2.2,swing:.55,baton:3.8,monogram:7.6,bands:2.7,inflate:1.35,counter:1.55,distort:2.35,cells:1.05,segments:1.75,network:1.35,spatial:1.3,sculpture:1.8,procedural:['grain','slice'].includes(props.experimentalMode)?1.3:1.85}[studyById(props.study).key]??1.8)/studySpeed(props)*fps));
