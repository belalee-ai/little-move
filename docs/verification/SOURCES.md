# 人机验证交互来源与实现

2026-10-16，用户明确选择滑块、拼图、旋转、点选等人机验证。新增162–165，本地独立实现。

## 公开参考

- GoCaptcha原作者项目：https://github.com/wenlng/go-captcha 。README明确列出Click、Slide、Drag-Drop、Rotate四类，并说明横向拼图、二维拖动、顺序点选与旋转对齐机制。原文已读；LICENSE：https://raw.githubusercontent.com/wenlng/go-captcha/master/LICENSE ，核对为Apache-2.0。未复制其实现、图片、字体或资产，未安装SDK。
- 官方在线示例：https://gocaptcha.wencodes.com/demo/ 。搜索提取到示例标题，网页与浏览器直接访问失败；未实际操作，不记录为上游动态验收。
- GeeTest：https://www.geetest.com/adaptive-captcha ，搜索/正文可读；浏览器导航超时。只作为类别旁证，不复制品牌、素材、产品文案或源码，不宣称其服务已经接入。
- 搜索还发现Neal.fun的I'm Not a Robot小游戏；用户明确选择常见人机验证后未纳入本批，也未自动操作真实CAPTCHA。

无可靠流行度统计，不能据此称为最火的四种。自动预览的动作节奏、建筑构图和形状都是本项目独立设计。

## 工程与复用

src/verification/catalog.js维护编号、别名和提示词；motion.js计算自动过程与本地演示的容差/顺序；VerificationScene.tsx共用帧、字体和矢量图。按frame/fps驱动，速度.5–2倍。网页手动状态由显式输入改变，落位和错误回退使用同一帧时钟；尊重减少动态效果，手动操作仍能立即反馈。

162固定横向拼图、163固定内外圆对齐、164固定图形顺序、165二维拖放。错误和成功都有反馈，完成后锁定并允许重置。落位容差仅用于演示，配置不包含安全秘密，不能作为真实防机器人判定。真实业务需另外接入服务端认证；本任务没有此授权或需求。

自动循环会展示一次失败/错误，再回退并展示完成；末尾淡出后重新开始，不瞬间闪回。网页预览与Demo162–Demo165导出组合共用场景；本次只渲染阶段PNG，未输出MP4。
