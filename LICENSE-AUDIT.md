# Bela动效词典：商用与许可核查

核查日期：2026-10-15。对象：本目录当前的30种文字动效、6款随附字体、网页实际打包依赖及现有来源说明。

## 结论

可以继续把本项目用于商业视频和自有网站，但不能把当前整套工程描述为“全部MIT、无条件免费、全部原创、保证不侵权”。字体均有SIL OFL 1.1商用依据；部分动效有MIT来源；Remotion适用其单独的商业许可。公开分享代码、出售Skill或动效组件库前，仍有许可随包、来源证明和授权说明需要补齐。

本报告是对当前文件及可访问的一手许可的核查，不是法律意见或零侵权保证。没有进行专利、商标注册、全部历史提交或全球相似作品检索，也没有据此判断用户所属组织的具体授权资格。报告中的“未发现直接移植”只描述本次比对结果。

## 实际检查范围

- 读取全部动效模型 `src/motion-core.js`、显示组件 `src/TextVisual.jsx`、字体注册 `src/fonts.ts`、网页样式、`CATALOG.md`、`DESIGN.md` 和 `THIRD-PARTY-NOTICES.md`。
- 读取六个TTF的字体名称、版本、内嵌版权和许可信息，计算SHA-256，检查随附OFL文件。四款新字体的哈希与现有 `public/fonts/FONT-SOURCES.json` 一致；哈希用于识别本地文件，不等于已与每个上游发布文件逐字节比对。
- 读取本地安装的Remotion 4.0.535、React 19.2.0等依赖许可，并核对官方当前条款。
- 在临时目录重新构建带来源映射的网页：实际打包的第三方包只有 `react`、`react-dom`、`scheduler`、`remotion`、`@remotion/player`。没有把React Bits、Motion Primitives、Magic UI、Motion的组件库打进网页。
- 额外比对React Bits的GlitchText、EchoText、TrueFocus全部JS/CSS，Remotion Scenes的三个对应组件，以及Remotion Bits的三个对应示例。未将这些上游源码复制进本报告或发布目录。
- 检查 `public` 的文件：只有字体、字体许可和字体来源清单，没有剪映截图、Awwwards案例图片、第三方视频、音效或模板素材。

## 六款字体

以下“可商用”包括在商业视频、海报和网站中使用。网页提供TTF给浏览器加载属于字体分发，应保留字体版权及OFL；字体本身不能脱离其他产品单独出售。OFL不要求使用字体制作的视频、图片或网站业务代码也使用OFL。[OFL正式条款](https://openfontlicense.org/open-font-license-official-text/)、[官方FAQ](https://openfontlicense.org/ofl-faq/)。

| 网页名称 | 实际字体和版本 | 许可与商用结论 | 文件核查与待办 |
| --- | --- | --- | --- |
| 现代黑体 | Noto Sans SC，2.004-H2 | OFL 1.1，可商用。[上游许可](https://github.com/google/fonts/blob/main/ofl/notosanssc/OFL.txt) | 随附OFL与内嵌Adobe/Source署名相符；来源清单尚未登记此字体版本和哈希。 |
| 经典宋体 | Noto Serif SC，2.003-H1 | OFL 1.1，可商用。[Google Fonts许可](https://github.com/google/fonts/blob/main/ofl/notoserifsc/OFL.txt)、[上游字体元数据](https://github.com/google/fonts/blob/main/ofl/notoserifsc/METADATA.pb) | 外部OFL署名为Google 2012，TTF和上游元数据则为Adobe 2017–2024。这一不一致上游也存在；现有TTF保留了Adobe署名，不能据此认定无授权。分发前应补充实际字体版权及对应来源说明。 |
| 圆体·寒蝉全圆 | ChillRoundF，3.000 | OFL 1.1，可商用。[上游许可](https://github.com/Warren2060/ChillRound/blob/main/LICENSE) | 本地许可文本与上游一致。字体内还包含其基础字体作者署名，应保留原TTF及完整许可。 |
| 手写体·小赖 | Xiaolai，3.126 | OFL 1.1，可商用。[上游许可](https://github.com/lxgw/kose-font/blob/master/OFL.txt) | 本地许可文本与上游一致，包含LXGW与Nozomi Seto署名。 |
| 楷体·霞鹜文楷 | LXGW WenKai Lite，1.522 | OFL 1.1，可商用。[Lite对应许可](https://github.com/lxgw/LxgwWenKai-Lite/blob/main/OFL.txt) | 本地放的是主版本LxgwWenKai的OFL，实际字体是Lite。授权类型相同、TTF保留Lite版权，但应换成Lite对应文件，避免来源错配。 |
| 窄黑体·得意黑 | Smiley Sans Oblique，2.0.1 | OFL 1.1，可商用。[上游许可](https://github.com/atelier-anchor/smiley-sans/blob/main/LICENSE) | 本地许可文本与上游一致，保留Smiley/得意黑的保留名称声明。 |

这些是具体字体文件的结论，“黑体”“宋体”“手写体”这类风格名称本身不能代表所有同类字体均可商用。当前网页另有系统等宽字体作为界面数字的回退，没有随包分发相应系统字体文件；本结论不授权提取、打包或转售系统字体。

当前六个TTF均带OFL声明，未发现禁止商业使用的条款。未来若改字形、子集化、转换格式或改名，应另核对保留字体名称和对应字体的附加许可；不能直接把字体再许可为本项目的MIT或专有许可。

## 30种动效逐项清单

以下判断均需叠加后文的Remotion和字体条件。网页中的“来源”链接是参考/溯源链接，本身不能证明复制了代码，也不能替代代码许可。

| 编号 | 名称 | 当前来源关系与许可依据 | 商用与分享判断 |
| --- | --- | --- | --- |
| 001 | 逐词出现 | Remotion Bits示例参考；本库用帧模型实现。上游README和package声明MIT。 | 商用有MIT声明依据；分享前补来源留档，见下文上游文件缺口。 |
| 002 | 模糊上推 | 同上，对应BlurSlideWord示例。 | 同001。 |
| 003 | 遮罩揭示 | 本项目既有记录为改写自Remotion Scenes，MIT。 | 可商用、可分发；保留原版权和MIT。 |
| 004 | 光标打字 | Remotion Bits BasicTypewriter示例参考；本库未调用其TypeWriter。 | 同001。 |
| 005 | 波浪文字 | 本项目既有记录为改写自Remotion Scenes，MIT。 | 同003。 |
| 006 | 三维翻字 | 本项目既有记录为改写自Remotion Scenes，MIT。 | 同003。 |
| 007 | 散字归位 | 本库帧模型，无上游组件依赖。 | 未发现第三方代码许可阻止该实现商用；不等于完成原创性司法鉴定。 |
| 008 | 停顿打字 | 本库字符时间表与光标实现。 | 同007。 |
| 009 | 逐字渐显 | Motion Primitives演示参考；其仓库MIT，本库未导入组件。 | 可用于商业项目；若后续采用其代码，随附MIT及原署名。 |
| 010 | 侧滑入场 | 同009。 | 同009。 |
| 011 | 逐字弹跳 | Motion文字动画文档作为机制参考；当前用Remotion spring实现。 | 未发现引入Motion付费组件；按当前实现和依赖条件使用。 |
| 012 | 中心缩放 | Motion Primitives演示参考，MIT；本库帧实现。 | 同009。 |
| 013 | 字距生长 | Magic UI演示参考，其仓库MIT；本库坐标实现。 | 可用于商业项目；实际采用其源码时需保留MIT及署名。 |
| 014 | 旋转入场 | Magic UI演示参考，MIT；本库帧实现。 | 同013。 |
| 015 | 上翻滚入 | Motion文档作为机制参考；本库位移、裁切实现。 | 同011。 |
| 016 | 向上翻转 | Magic UI演示参考，MIT；本库逐字rotateX实现。 | 同013。 |
| 017 | 乱码解码 | Magic UI演示参考，MIT；本库确定性随机字符实现。 | 同013。 |
| 018 | 故障闪动 | React Bits视觉参考；其许可含组件再分发限制。已比对对应源码，未发现直接移植。 | 当前代码与上游机制有明确差异；出售/分享组件库前保留独立实现证据，不能把React Bits原组件或移植版装入库。 |
| 019 | 扫光文字 | Magic UI演示参考，MIT；额外参考React Bits ShinyText和Motion Primitives的配色。 | 当前为本库逐字坐标上的渐变扫光；不能因配色参考就称复制了组件，也不能据此授权未来移植React Bits。 |
| 020 | 流动渐变 | Magic UI演示参考，MIT；本库径向光斑和渐变实现。 | 同013。 |
| 021 | 柔光显影 | 当前为本库实心字羽化遮罩；旧标识outline仍保留兼容。 | 同007；现有来源说明中的旧“描边填充”表述应更新。 |
| 022 | 霓虹呼吸 | 本库周期亮度及柔光实现。 | 同007。 |
| 023 | 多重残影 | React Bits视觉参考；已比对其EchoText源码，未发现直接移植。 | 同018。 |
| 024 | 逐词聚焦 | React Bits视觉参考；已比对其TrueFocus源码，未发现直接移植。 | 同018。 |
| 025 | 横向跑马灯 | Magic UI演示参考，MIT；本库帧位移与重复副本实现。 | 同013。 |
| 026 | 环形旋转 | 当前目录来源为Magic UI SpinningText，MIT；本库三角函数定位。 | 同013。不要误标为React Bits代码移植。 |
| 027 | 循环换词 | 当前目录来源为Magic UI WordRotate，MIT；本库帧切换实现。 | 同013。 |
| 028 | 荧光标记 | Magic UI Highlighter视觉参考，MIT；本库背景渐变实现。 | 同013；没有导入其手绘标记组件或素材。 |
| 029 | 放大震动 | 本库缩放、衰减震动实现。 | 同007。 |
| 030 | 卡拉OK | Motion文档机制参考；本库按字符进度变色。 | 同011。 |

一手来源：[Remotion Scenes MIT](https://github.com/lifeprompt-team/remotion-scenes/blob/main/LICENSE)、[Remotion Bits README](https://github.com/av/remotion-bits/blob/master/README.md)、[其package声明](https://github.com/av/remotion-bits/blob/master/package.json)、[Motion Primitives MIT](https://github.com/ibelick/motion-primitives/blob/main/LICENCE.md)、[Magic UI MIT](https://github.com/magicuidesign/magicui/blob/main/LICENSE.md)。MIT允许商业利用及分发，但实际复制或改编其受保护代码时，原版权和许可必须随副本或实质部分保留。

### React Bits重点比对

[当前上游许可](https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md)标题为“MIT + Commons Clause”，实际条款允许组件用于商业网站/产品，但限制出售、再许可、再分发组件本身，包括打包和移植版。因此不应简称为无限制MIT。单纯添加署名不能解除这些限制。

| 效果 | 上游实现 | 本库实现 | 本次观察 |
| --- | --- | --- | --- |
| 018故障 | CSS伪元素及固定关键帧裁切，整段文字复制层。 | 根据帧号生成确定性抖动和多条裁切层，逐字计算。 | 未发现上游关键帧表、伪元素样式或组件代码被直接移植。 |
| 023残影 | 指针事件、requestAnimationFrame、逐层插值追踪。 | 衰减正弦轨迹，按过去时间采样五层副本，再收拢。 | 没有上游指针跟踪与迭代追踪实现。 |
| 024聚焦 | React状态计时、DOM测量、Motion焦点框及四角边框。 | 根据视频帧计算词组清晰度，无测量框或四角素材。 | 未发现其焦点框和交互组件移植。 |

比对源码：[GlitchText](https://github.com/DavidHDev/react-bits/tree/main/src/content/TextAnimations/GlitchText)、[EchoText](https://github.com/DavidHDev/react-bits/tree/main/src/content/TextAnimations/EchoText)、[TrueFocus](https://github.com/DavidHDev/react-bits/tree/main/src/content/TextAnimations/TrueFocus)。没有安装该包并不足以排除手工复制；这里的判断还参考了实际源码差异。未取得作者额外授权，也未完成历史版本穷尽比对；如果以组件库为主要收费内容，这三项应列为上线前的重点复核项。

### Remotion Bits来源文件缺口

本次确认其默认分支是master。README、package.json均声明MIT，但当前完整仓库树没有独立LICENSE文件，README徽章链接仍指向不存在的main/LICENSE。本库来源说明对此只写“标注MIT”，没有完整的上游版权许可记录。

当前001/002/004与所列三个示例结构不同，也未导入其包；没有证据表明必须停止使用这些通用动作。但不能把不完整的上游许可留档描述成“已核对完整授权”。公开交付源码前，应留存参考版本与声明；如果实际保留了上游实质代码，需取得/补齐其准确版权许可说明，或以独立实现替代相关部分，不能编造作者或年份。

## Remotion本身的使用条件

本地 `remotion`、`@remotion/player` 和 `@remotion/cli` 均为4.0.535，三者随包LICENSE为Remotion自有许可，不是MIT。符合资格的个人、小型组织可以免费商业使用；公司规模及共同运营项目的合作方可能影响资格。不要只按“使用工具的人数”判断。[当前许可正文](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)、[官方许可FAQ](https://www.remotion.dev/docs/license/faq)。

- 如果本项目由个人或符合不超过3人条件的组织使用，官方允许商业使用，也允许符合条件的自动化/SaaS。
- 超出免费条件时需购买相应Company License；当前网页用了Player，需要结合具体网站运营方式核对适用方案。
- 使用自己的模板开发产品、出售自有组件有官方支持路径；这与重包装、转售Remotion引擎或帮助规避其许可不同。[官方组件库发布说明](https://www.remotion.dev/docs/authoring-packages)。

本报告不将用户的团队规模、合作方关系或已有付费许可作既定事实。未来向客户交付可运行工程或让客户继续运营时，也要核对对方的使用资格；不能把我们的资格自动转授给所有用户。

## 网页、Skill与“自己写的样式”

自行实现通用机制、重新设计页面和提供服务，一般可以作为商业产品的一部分。“打字、淡入、位移、波浪、变色”属于常见机制，并不是看到类似效果就必然侵权。中国《计算机软件保护条例》第六条区分软件表达与思想、处理过程、操作方法、数学概念；这不表示具体代码、素材或独创视觉表达不受保护。[商务部知识产权法律法规库](https://ipr.mofcom.gov.cn/law/detail.shtml?id=1980)。

应分别判断：

1. **自己实现的代码和设计**：可据实际权利商业利用；使用AI辅助不等于自动取得“绝对原创、排他版权”的证明。
2. **改写第三方代码**：换变量名、转成Remotion或调整参数不自动消除原许可。003/005/006按既有改编记录继续保留MIT，不改口称全部原创。
3. **网站参考**：现有设计记录只采用Awwwards案例的纸白/近黑配色，未复刻具体结构和交互；公开目录没有第三方案例素材。配色和通用网格参考不能替代对精确复刻、品牌混淆的单独判断。Awwwards收录也不授予案例图片或源码复用许可。
4. **剪映参考**：现有文件未包含提取的剪映模板、效果资产、字体或代码；名称和动作别名用于检索。不应对外称为“剪映官方特效包”或保证一比一复刻。

当前项目没有根级LICENSE，`private: true`只是包发布配置，不是对用户的开源授权。自有代码采用MIT、保留商业授权或双重授权是后续发布决策；无论选择什么，都不能覆盖第三方MIT/OFL/Remotion条款。一个允许商用的产品可以保留闭源，并不必须把整站开源。

## 已发现的发布缺口

| 优先级 | 当前证据 | 影响 | 建议处理 |
| --- | --- | --- | --- |
| 分享前处理 | `dist`仅有页面、JS/CSS和字体许可；没有第三方代码许可文件，JS也没有完整MIT文本。React/React DOM/Scheduler确实被打包。 | 分发网页时应补齐随包版权和MIT许可；根目录有说明不代表已进入网站发布包。 | 加入可随构建产物交付的第三方许可说明，包含实际运行依赖及保留的改编代码声明；不要求在每张卡片上堆说明。 |
| 分享前处理 | Lite字体随附的是主版本OFL；宋体外部署名与TTF不同。 | 不是发现禁止商用，但许可来源清晰度不足。 | 使用Lite对应OFL；宋体补记实际Adobe署名与上游来源，保留其原OFL和TTF内嵌信息。 |
| 组件库收费前复核 | React Bits三项是有限制许可的视觉参考，目前只完成对应源码比对。 | 不能把其原组件或移植版再打包分享/出售。 | 保留当前实现及来源差异说明；若后续采用上游受保护代码，先取得覆盖该分发方式的授权。 |
| 公开源码前处理 | Remotion Bits仅查到MIT声明，无独立许可证；全部上游参考尚未固定提交版本；项目没有自有授权文件。 | 他人拿到工程后，不清楚能否修改、再分发及第三方适用范围。 | 固定引用版本、补充来源留档，并明确自有部分的授权范围；不自动替用户选择许可证。 |

本地安装依赖的元数据还包含MPL-2.0、Apache-2.0、ISC、BSD、Python-2.0和CC-BY-4.0等类型。来源映射确认Mediabunny及其编码器没有进入当前网页包；不能因为它们存在于开发环境，就称它们已在网页分发，也不能忽略未来分发整个渲染工具包时的义务。本次未完成渲染二进制、编解码专利和全部开发工具的分发审计；若交付完整离线运行环境，应单独审核，而非直接把node_modules打包给用户。

## 文件指纹

下面记录本次检查的字体身份，供之后查证和替换时使用，不构成新的许可授权。

```text
ChillRoundF.ttf          7dae804b344f7bc1a1c8426b9515e9b54d7baac3e123263d0bae94d0a305a732
LXGWWenKai-Regular.ttf   140c99ba4e28e817cec49bf82a0c5fcdc4fe633fb9dfda16d0ee8d59a8545f15
NotoSansSC.ttf          a3041811a78c361b1de50f953c805e0244951c21c5bd412f7232ef0d899af0da
NotoSerifSC.ttf         050080d9255a86808f2945bffac582b31ef32bc36411ce29563b4961670c66f9
SmileySans-Oblique.ttf  b447d7e781f08bc95c4c9f23ba71ed2b8ebb639aa7184485c71c4ca5afcd25c4
Xiaolai-Regular.ttf     e2f68daf0e72777a8cf58bc83de1b98634b251e537ddbfca24b0ae50d1802da2
```

本次仅新增本核查报告，没有修改网站、字体文件、既有许可说明或工程授权，也没有发布网站或代码。
