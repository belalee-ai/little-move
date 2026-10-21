# Little Move 补充工作流

2026-10-21 更新：每 5 天运行一次，每批不设数量上限；通过检查后自动同步至 GitHub 与在线网站。此安排替代此前“只建机制、手动启动”的约定。执行细则与运行条件见 [持续更新安排](UPDATE-POLICY.md)，机器可读策略见 [policy.json](policy.json)。

当前正式目录 **291 项、30 类**，下一编号 **292**。执行时以源码和盘点脚本结果为准，不把这里的数字当成固定限额。本文件只维护本项目，不改全局记忆或个人剪辑 Skill。

## 如何启动

定时任务由维护者的 Codex App 执行；也可以说“按补充机制继续补充 Little Move”，指定类别或原始参考链接。先读取本文件、README、更新安排和当前目录，运行：

```bash
node scripts/catalog-intake.mjs
# 校验字段与策略，不写报告
node scripts/catalog-intake.mjs --check
# 临时合并候选并生成报告，不改网站或候选清单
node scripts/catalog-intake.mjs --file /absolute/path/new-candidates.json
```

支持候选数组或含 `candidates` 数组的 JSON，字段参考同目录 `candidates.json`。脚本只检查字段、显式特征、名称和编号，生成 `report.json`；不会自行联网、制作、升级状态或发布。检查后才将有效候选写入正式候选清单。

## 一次补充的完整流程

1. **盘点缺口**：对比现有全部动效、分类和触发方式。相同动作换颜色、图片或名称，优先作为原词条变体；没有实质机制差异不占新编号。
2. **检索原始来源**：优先原作者、官方示例与原创仓库。记录原始链接、作者、检索日期与动作说明，搜索页和聚合页只作线索。
3. **操作真实 Demo**：看完整开始、运动、停留和结束；交互类实际点击、拖动、滚动或使用指针。打不开或只能读正文时保持 `discovered`，不能声称视觉验证。
4. **核对复用范围**：独立实现借鉴通用机制；引入上游代码、字体、摄影或音频前，分别记录许可原文链接和适用范围。来源链接不等于代码许可。
5. **制作组件**：沿用 `src/` 现有目录与注册入口，保留已确认动效。自动演示状态由 frame/fps 计算，交互与自动演示共享绘制逻辑。图片按需使用，不用图片代替按钮、输入、开关或数据；不引入私人照片。
6. **标识与参数**：追加下一个未使用的编号，旧编号不变。补名称、英文名、别名、一句短提示词、分类、触发、来源和实现方式；网页、Remotion、ChatCut 的验证状态分别记录。
7. **验收后收录**：逐个检查完整真实预览、移动尺寸、减少动态效果、首尾、裁切、遮挡、长文字、参数和交互打断；看对应真实渲染帧。需要证明播放节奏时看实际连续播放，静帧不够。数据图检查零值、总计、比例与排名身份；通过后才计入正式数量。
8. **发布与交付**：更新 README、CATALOG、来源和必要截图/介绍图，按授权自动提交本轮必要改动并推送。等待 Pages 完成、打开线上对应词条回读。未确认上线时不得报告已发布。与个人剪辑工程的接入仍需单独任务。

## 候选状态

| 状态 | 含义 |
| --- | --- |
| discovered | 找到来源，待真实操作与许可判断 |
| verified | 机制已实际确认，素材和实现路径明确，尚未完成组件 |
| implemented | 组件已实现，待完整验收 |
| accepted | 已加入源码目录，网页与帧检查通过；不等于所有浏览器或商业法律鉴定 |
| blocked | 写明阻塞、已有证据与所需材料 |

脚本不会自动提升状态。候选数、实现数、验收通过数和上线数分开报告。

## 检查与发布

基础命令：

```bash
npm run check
node scripts/catalog-intake.mjs --check
node scripts/check-coverage.mjs
DEPLOY_BASE=/little-move/ npm run build
node scripts/check-web-build.mjs --base /little-move/
node scripts/refresh-project-intro.mjs
```

再运行本次改动对应的专项检查。既有检查脚本含历史数量断言时，按本轮真实收录结果维护数量，不得删除质量检查来求通过。新批次必须有相应机制检查与真实预览证据，不能仅复用旧批次的通过日志。

已有入口包括 `check-motion.mjs`、`check-studies.mjs`、`check-data.mjs`、`check-expansion.mjs`、`check-batch.mjs`、`check-verification.mjs`、`check-voice-ui.mjs`、`check-coverage-quality.mjs`、`check-original-quality.mjs`；按变更范围选用。阶段渲染脚本也按对应模块选择，不能把旧脚本的覆盖范围当成新增项已验证。

发布前保留本轮验证记录，提交前检查差异和素材范围。公开文档不包含私人路径或个人素材；`proof/` 为本地检查目录，必要的公开验证摘要另写入 docs。网站发布仍由现有 GitHub Actions → GitHub Pages 执行；Codex 定时任务负责发现、制作、验收和触发这条发布链。
