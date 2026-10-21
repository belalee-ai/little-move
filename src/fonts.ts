import {staticFile} from 'remotion';

export const FONT_OPTIONS=[
 {family:'Noto Sans SC',label:'现代黑体',file:'NotoSansSC.ttf',weight:'100 900'},
 {family:'Noto Serif SC',label:'经典宋体',file:'NotoSerifSC.ttf',weight:'100 900'},
 {family:'Chill Round F',label:'圆体 · 寒蝉全圆',file:'ChillRoundF.ttf',weight:'400'},
 {family:'Xiaolai',label:'手写体 · 小赖',file:'Xiaolai-Regular.ttf',weight:'400'},
 {family:'LXGW WenKai Lite',label:'楷体 · 霞鹜文楷',file:'LXGWWenKai-Regular.ttf',weight:'400'},
 {family:'Smiley Sans Oblique',label:'窄黑体 · 得意黑',file:'SmileySans-Oblique.ttf',weight:'400'},
] as const;

const pending=new Map<string,Promise<void>>();
export const loadPreviewFonts=(family:string='Noto Sans SC'):Promise<void>=>{
 const option=FONT_OPTIONS.find(font=>font.family===family);
 if(!option)return Promise.reject(new Error('未配置字体：'+family));
 const cached=pending.get(family);
 if(cached)return cached;
 const task=(async()=>{
  const face=new FontFace(option.family,`url(${staticFile('fonts/'+option.file)})`,{weight:option.weight});
  await face.load();document.fonts.add(face);
 })().catch(error=>{pending.delete(family);throw error;});
 pending.set(family,task);return task;
};
