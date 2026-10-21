# 166–177 来源与实现范围

2026-10-16。用户要求新增话筒、说话控件和苹果经典交互。语音6项与苹果常见交互6项均独立实现，以不同操作机制补现有缺口；未重复新增普通开关、分段标签页或纯波形。

## 一手参考

- https://support.apple.com/guide/iphone/make-a-recording-iph4d2a39a3b/ios ：开始、暂停、继续、完成录音。官方正文通过搜索/提取读到。
- https://support.apple.com/guide/iphone/send-and-receive-audio-messages-iph2e42d3117/ios ：语音预览、暂停、继续、取消、拖动快进/后退。
- https://support.apple.com/guide/iphone/adjust-the-volume-iphb71f9b54d/ios ：控制中心上下拖动音量。
- https://support.apple.com/en-ca/guide/iphone/iph59095ec58/ios ：控制中心长按展开更多选项。
- https://developer.apple.com/design/human-interface-guidelines/buttons 、context-menus 、pickers 、search-fields 、lists-and-tables 、progress-indicators：组件语义与通用交互。HIG网页需要JavaScript，文本工具对Markdown版本返回类型限制；部分内容通过官方搜索结果及Markdown入口读取。未把浏览器对HIG的访问当作真实原生iOS操作验收。

## 设计与资产

不复制Apple布局资源、SF Symbols或字体文件。沿用已有Noto Sans SC，SVG话筒、播放、暂停、喇叭等图标由本地几何路径绘制。色板为现有浅灰背景、炭黑语音控件、少量蓝色操作与红色录音/挂断指示。无金属材质、无额外图片、无第三方依赖。169语音球于2026-10-21按用户选择改为独立浅蓝柔光球：聆听收放、思考光点绕行、说话声纹起伏，保留待机。它是本项目独立SVG和帧函数实现，不是Siri官方效果。

## 同源与功能边界

- catalog.js：12个固定编号、名称、提示词与参考；motion.js：自动时间轴、音量、阈值与弹性函数；shared.tsx：字形、图标、帧时钟和可中断的当前位置过渡；VoiceControls.tsx / AppleControls.tsx：实际控件。
- 自动状态只由frame/fps计算；网页与Remotion组合共用同一组件，不依赖CSS动画或实时时钟。手动反馈从当前呈现位置开始，滚轮携带释放速度；直接拖动时保留抓取偏移。
- 语音展示使用101已经采用的示例音节包络；此批不请求话筒、不产生录音文件、不识别文本、不播放音频、不发消息、不拨号。手动模式可体验计时、暂停、定位与状态切换。真实音频驱动仍使用原101。
- 苹果交互是网页独立适配，不声称原生系统实现、触感反馈或跨端像素一致。复制/归档/刷新仅改变演示卡片本地状态。
- 默认每项800×500、60fps、8秒，支持速度.5–2倍。减少动态效果时自动停在阅读态；主动语音/刷新仍有必要的示例时间反馈，位置变化不做弹性运动。
- 本次未导出MP4、未接入ChatCut、未公开发布、未开启定时补充。验收范围见../../proof/voice-ui/REVIEW.md。
