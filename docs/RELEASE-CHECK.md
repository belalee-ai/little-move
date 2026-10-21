# 首次公开发布检查

日期：2026-10-21。项目：Little Move。

## 本次重新执行

- npm run check：通过。
- npm run build：通过；存在主脚本体积提示，以及 Remotion 的 use client 指令被 Vite 忽略的提示，构建正常结束。
- 从 Git 暂存文件独立提取到干净目录，再进行类型检查和构建：通过。该目录复用同版本已安装依赖，没有复制私人照片或旧预览。
- check-coverage：290 个固定编号、30 类均不少于 8 项，113 项新增机制和 84 张独立插画资源完整。
- check-original-quality、check-coverage-quality：路径跟踪、沙粒转移、统计质量守恒、连续反向、减少动态效果与几何端点检查通过。
- check-sounds：290 张卡片音效配置、静音默认、单卡音频隔离及 WAV 格式检查通过。
- check-studies、check-data、check-native-motion：创意字形资产、组合、数据输入与不同帧率/速度下的关键逻辑检查通过。
- 在实际浏览器检查 Little Move 名称、布局卡片和可见数据变化；首页使用真实网站截图。
- 暂存文件未发现私人绝对路径、私有剪辑工程链接、常见密钥模式；个人/生成的人物图片、历史风景照、依赖、构建目录与旧预览均未纳入提交。此项是针对发布文件的检查，不等于所有可能敏感信息的形式化证明。

## 沿用的视觉检查

原有 177 项和新增 113 项此前已分批检查默认配置阶段帧、关键视频与手动操作，摘要见 ORIGINAL-QUALITY.md 与 COVERAGE-QUALITY.md。完整 proof/ 是本地过程证据，未随公开版分发；这些文档中的 proof/ 路径仅供本地维护者使用。

本次发布没有重新渲染全部 290 条完整视频，也没有逐项实测所有自定义参数、所有浏览器或操作系统。

## GitHub 回读与重新安装

- 公开仓库：https://github.com/belalee-ai/little-move ，main 分支。未登录访问返回 HTTP 200。
- GitHub 页面上实际打开 README，确认文字与截图正常渲染。
- 从上述 GitHub 地址重新浅克隆到独立目录，运行 npm ci、npm run check 和 npm run build：均通过。没有复用该目录之外的 node_modules。
- 首次源码发布时未部署在线演示；此状态已由下方的在线部署记录替代。

## 在线演示与产品说明（2026-10-21）

- 在线地址：https://belalee-ai.github.io/little-move/ 。GitHub Pages 已启用，main 代码更新经 GitHub Actions 检查和构建后部署。
- 已完成部署：af0b182e20b6d4a508a0ab8b823a6dcfb5c295c5；对应运行 https://github.com/belalee-ai/little-move/actions/runs/39572588397 成功。后续仅文档更新不会重复部署网页。
- 本次类型检查、构建、音效检查和部署路径检查通过。HTML、CSS、字体、图片和音效统一使用 /little-move/；本地开发默认 /，Remotion 渲染保持自身基路径。
- 默认预览 initiallyMuted，用户开启音效时由原音效入口解除静音，避免首次访问等待音频许可停在第 0 帧。
- 在线浏览器已检查图片分类资源加载、创意字形、布局、图表、语音光球、参数面板，以及 069 按钮真实点击后的 Saved 反馈。
- 新增 8 张真实线上截图：creative、images、layout、controls、data、voice、text、settings；位于 docs/images/，主图复用本次 layout 画面。截图保留界面上下文，不将截图当作运动流畅性的证明。
- README 以在线体验、使用场景、三步查用、分类效果和复用方式组织；本地环境、开发与部署细节放在 GETTING-STARTED.md。
- 在新部署页面刷新后没有进行页面点击，观察到 001 预览自动推进到 0:02，字体加载成功，确认首次访问静音自动播放修复生效。
