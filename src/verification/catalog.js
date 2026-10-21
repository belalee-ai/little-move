const source='https://github.com/wenlng/go-captcha';
export const VERIFICATION_ROWS=[
 ['captcha-slide','滑块拼图','Slider Puzzle','交互','人机验证','拖动滑块带动拼图块沿水平方向移动，对准缺口后吸附完成；错位则提示并平滑退回。',source,['验证码','滑块验证码','拼图验证','CAPTCHA','人机验证']],
 ['captcha-rotate','旋转归正','Rotation Alignment','交互','人机验证','拖动滑杆旋转内圆，使图案与外环连续对齐；松手后判断角度，成功锁定或回退重试。',source,['验证码','旋转验证码','圆盘','CAPTCHA','人机验证']],
 ['captcha-order','顺序点选','Ordered Selection','交互','人机验证','按提示顺序点击图形，已选位置依次标出序号；选错可重试，全部正确后显示完成。',source,['验证码','点选验证码','图形点选','顺序点击','CAPTCHA','人机验证']],
 ['captcha-drag','拖拽归位','Drag And Match','交互','人机验证','抓住独立图块在平面内自由拖动，接近轮廓时出现落位提示；松手吸附，错位则沿原路回退。',source,['验证码','拖拽验证码','拖放','形状匹配','CAPTCHA','人机验证']],
];
export const VERIFICATION_KEYS=VERIFICATION_ROWS.map(r=>r[0]);
export const VERIFICATION_CODES=Object.fromEntries(VERIFICATION_ROWS.map((r,i)=>[r[0],String(162+i)]));
export const isVerification=id=>VERIFICATION_KEYS.includes(id.replace('demo-',''));
export const verificationDefaults=()=>({background:'#f4f3ef',accent:'#303934',verifyTolerance:1});
