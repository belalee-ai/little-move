// Palette changes are opt-in; the approved swatches remain the default.
export function paintContext(context,colors={}){
 return new Proxy(context,{
  get(target,key){
   const value=target[key];
   if(typeof value!=='function')return value;
   if(key==='createLinearGradient'||key==='createRadialGradient')return (...args)=>{
    const gradient=value.apply(target,args),add=gradient.addColorStop.bind(gradient);
    gradient.addColorStop=(offset,color)=>add(offset,colors[color]??color);return gradient;
   };
   return value.bind(target);
  },
  set(target,key,value){target[key]=['fillStyle','strokeStyle','shadowColor'].includes(key)&&typeof value==='string'?(colors[value]??value):value;return true;}
 });
}
