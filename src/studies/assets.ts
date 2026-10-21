import {EXPERIMENTAL_STUDIES} from './experimental-catalog.js';
import {staticFile} from 'remotion';
const fonts=[['TypeMotionFlex','100 1000'],['ExpressiveTypeFlex','100 1000'],['SixType','100 1000'],['NineFlex','100 1000'],['NineBlock','400'],['NineSwash','400']];
const pending=new Map<string,Promise<unknown>>();
export function loadStudyFonts(families:string[]){return Promise.all(families.map(family=>{
 const cached=pending.get(family);if(cached)return cached;
 const task=(async()=>{const weight=fonts.find(f=>f[0]===family)?.[1]??'400';const face=new FontFace(family,`url(${staticFile('type-studies/fonts/'+family+'.ttf')})`,{weight});await face.load();document.fonts.add(face);})();
 pending.set(family,task);task.catch(()=>pending.delete(family));return task;
}));}
const images=new Map<string,Promise<HTMLImageElement>>();
export function loadStudyImage(src:string):Promise<HTMLImageElement>{
 const url=src.startsWith('/type-studies/')?staticFile(src.slice(1)):src;
 const cached=images.get(url);if(cached)return cached;
 const task=new Promise<HTMLImageElement>((resolve,reject)=>{const img=new Image();img.crossOrigin='anonymous';img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('素材无法加载：'+(src.startsWith('data:')?'已选择的图片':src)));img.src=url;});
 images.set(url,task);task.catch(()=>images.delete(url));return task;
}
export async function prepareStudyAssets(key:string,props:{portraitSrc?:string;clockSrc?:string}){
 const family=EXPERIMENTAL_STUDIES.some(s=>s.key===key)?['SixType']:key==='variable'?['TypeMotionFlex']:key==='layout'?['ExpressiveTypeFlex']:['mix','ring','logo','mask','stickers','fold'].includes(key)?['SixType']:['NineFlex','NineBlock','NineSwash'];
 const [clock]=await Promise.all([key==='swing'?loadStudyImage(props.clockSrc??'/type-studies/sculptural-clock.webp'):undefined,loadStudyFonts(family)]);
 return {clock};
}
