# 公开版说明（2026-10-21）

当前发布边界见 [docs/LICENSING.md](docs/LICENSING.md)。以下保留分批开发时的来源记录，其中人物、旧风景照和“尚未发布”等表述属于历史状态；历史人物素材不包含在公开仓库。

# 来源和许可

这是一套中文、透明叠层与参数化适配，不声称与上游完整视觉逐像素一致。

- 逐词出现、模糊上推和打字参考 Remotion Bits，https://github.com/av/remotion-bits 。仓库README与package.json标记MIT。参考了WordByWord.tsx、BlurSlideWord.tsx和Typewriter展示的帧驱动机制；本项目不依赖remotion-bits运行包。
- 遮罩、波浪和翻字改写自Remotion Scenes，https://github.com/lifeprompt-team/remotion-scenes 。Copyright (c) 2026 lifeprompt-team，MIT。调整了字体、底色、自然框、编辑属性和阅读停留，删除示例背景装饰；波浪末段归稳。
- 散字归位与停顿打字为本项目原创帧驱动实现。
- Noto Sans SC / Noto Serif SC来自 https://github.com/google/fonts ，SIL Open Font License。字体完整许可保留在public/fonts/*-OFL.txt。

## 2026-10-15扩充来源与实现边界

新增22种均为本库独立编写的Remotion帧驱动实现，参考公开演示和常见运动机制，没有复制或移植下列项目的组件源代码，也不声称与源站或剪映同名特效逐像素一致。

- Motion官方文字动画指南：https://motion.dev/docs/text-animation 。参考分字、滚动揭示、滚动字面与乱码解码等机制；未使用Motion+付费组件。
- Motion Primitives：https://motion-primitives.com/docs/text-effect ，项目https://github.com/ibelick/motion-primitives ，当前LICENCE.md为MIT。仅参考演示与机制，未引入其运行包。
- Magic UI：https://magicui.design/ ，项目https://github.com/magicuidesign/magicui ，当前LICENSE.md为MIT。各效果的对应演示链接保存在EFFECTS[].source。
- React Bits：https://reactbits.dev/c/text-animations ，项目https://github.com/DavidHDev/react-bits 。2026-10-15核对LICENSE.md为MIT + Commons Clause，限制组件本身（含移植版）的再分发。本库只作为视觉机制参考链接，故障切片、描边填充、残影和聚焦均独立实现，不分发上游组件代码。
- 用户提供的剪映截图用于理解通用动作与搜索叫法；截图是静态缩略图，不能证明完整时间过程。未提取剪映资产、模板、字体或专有代码。别名仅表示相近检索方向。
- 原创通用效果：停顿打字、散字归位、霓虹呼吸、放大震动。

Remotion Scenes的MIT许可：

Copyright (c) 2026 lifeprompt-team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 2026-10-15新增预览字体

新增字体原文件保持字形与字符集完整，未安装到系统；由本地网站按选择加载，不依赖运行时外链。文件来源、版本、字节数和SHA-256记录在public/fonts/FONT-SOURCES.json。

- 寒蝉全圆体 3.0：https://github.com/Warren2060/ChillRound；SIL OFL 1.1。许可：public/fonts/ChillRoundF-OFL.txt。
- 小赖手写体 3.126：https://github.com/lxgw/kose-font；SIL OFL 1.1。许可：public/fonts/Xiaolai-OFL.txt。
- 霞鹜文楷 Lite 1.522：https://github.com/lxgw/LxgwWenKai-Lite；SIL OFL 1.1。许可：public/fonts/LXGWWenKai-OFL.txt。
- 得意黑 2.0.1：https://github.com/atelier-anchor/smiley-sans；SIL OFL 1.1。许可：public/fonts/SmileySans-OFL.txt。

霞鹜文楷使用Lite版本，字族为LXGW WenKai Lite，本地文件名为LXGWWenKai-Regular.ttf。小赖复用本工作库已有同版本完整文件。得意黑原生窄斜字形保持原样，不额外模拟倾斜。网页FontFace字族别名与内部字体名可不同，以src/fonts.ts为网站注册入口。

## 2026-10-15 创意字体编排整合

031–047由用户已确认的本地Type Motion Lab迁入，来源文件与SHA-256记录在docs/type-studies/SOURCE-MANIFEST.json。来源标记不代表上游原版或已确认的原作者字体；原始字形复核说明保存在docs/type-studies/type-style-review.md。

内嵌字体原字节保留：TypeMotionFlex、ExpressiveTypeFlex、SixType、NineFlex为Roboto Flex的不同原有子集；NineBlock为Bungee、NineSwash为Shrikhand。字体名、哈希、字节数见public/type-studies/fonts/manifest.json；对应OFL文本为同目录RobotoFlex-OFL.txt、Bungee-OFL.txt、Shrikhand-OFL.txt，取自google/fonts的ofl目录。原预览中的Georgia、Courier New和monospace继续使用浏览器系统字族，未复制或重新分发系统字体；当前机器保持相同字形，跨平台使用前需核对这些系统字族。

钟表来源说明保存在docs/type-studies/sculptural-clock-source.md；历史人物素材和其私人来源说明不随公开仓库分发。此处仅记录本次整合的资产来源，不把参考作品、照片、动效机制与所有相关权利混为一项许可。

## 048–059 图片、布局与交互（2026-10-15）

本批代码为本地独立实现的通用机制，没有复制Codrops、Motion或MDN页面的示例代码、照片、字体、品牌内容。源站链接用于解释机制，不声称复刻原Demo或获得原素材的授权。具体来源见src/demos/catalog.js。

public/demo-art/art-0.svg至art-5.svg和depth-0.svg至depth-2.svg为本项目独立绘制的空间、物体、植物和分层场景插画，生成源为scripts/create-demo-art.mjs；不含下载照片、人物或品牌标识。用户替换的图片仍需具备相应使用权限。Remotion、React等运行依赖沿用工程已有许可边界；本次没有重新认定Remotion整体可在所有商业场景免费使用。

本批支持网站预览和独立Remotion组合，尚未在ChatCut母版验证。参考正文已读取，源站动态Demo尚未全部进行现场操作；本地实现已单独检查，不把来源正文读取当作原版视觉验收。


## 060–068 实验字体（2026-10-15）

来源链接逐项登记在src/studies/experimental-catalog.js与CATALOG.md，涵盖Pouf、Invert、Tweak Display、NaN的Cohere / Walkie Talkie / a16z、DIA Tools、Space Type Generator与Generative Fonts。本批参考视觉机制后独立编写Canvas绘制与参数逻辑；不是原版字体、原作者项目或工具的直接移植。

本批复用项目已登记的SixType / Roboto Flex子集及从该字体采样的轮廓；PLUSH现采用项目已内嵌的Shrikhand字形轮廓（NineSwash.ttf，Copyright (c) 2015 Jonny Pinhorn，SIL OFL 1.1），轮廓数据位于src/studies/plush-outlines.js，许可保留在public/type-studies/fonts/Shrikhand-OFL.txt，充气与回弹为本地帧驱动变形，分段字使用自绘线段。未下载或嵌入Pouf、Invert、Tweak Display商业字体，也未使用DIA工具的代码、界面、素材或导出图像。实验示例保留不同英文文本与独立配色。

DIA原站对其工具及输出规定个人探索和教学用途。本批仅链接原作作参考，网站显示的是本地独立实现。没有以原作名称宣称获得商业素材或字体授权。

## 069–072 原生控件（2026-10-15）

按钮按压、输入聚焦、弹性开关与滑块标签页为本项目独立实现的通用界面机制，参考链接指向HTML及ARIA机制说明。没有复制上游演示代码或视觉素材，不新增图片或字体依赖。052–056也已改为HTML内容、数据块和SVG曲线，不再借图片展示一般布局。

## 073–080 数据动效（2026-10-15）

本批为独立实现的计数、柱状、折线、环图、排名、进度、瀑布和热力图通用机制。数字、曲线、环段与色块使用SVG绘制，不加载图片、不新增字体或图表依赖。参考链接为SVG机制说明，不声称这些是上游作者的原版Demo；示例数据在画面中明确标记。Remotion等既有运行依赖仍沿用本工程原有许可记录。

## 风景照片替换（2026-10-15）

048–051、058–059此前默认使用public/demo-photos/mountains.jpg、forest.jpg、coast.jpg（现仅保留兼容历史配置），直接来源URL、Unsplash源ID、字节数与SHA-256见同目录manifest.json。它们是外部摄影作品，不是本项目原创插画或AI生成照片；目前未核实摄影师姓名，不补造署名。

已读取[Unsplash官方许可FAQ索引](https://help.unsplash.com/en/collections/1463188-unsplash-license)，快照在docs/demo-photos/license-index.md。主许可页返回验证页，详细商业使用 / 署名文章的抓取遇网络错误，本次没有完成这些照片的完整商业授权复核，不能据此声称新照片已逐张获商用清权。后续对外分享或商业交付时按[Unsplash许可](https://unsplash.com/license)及作品相关权利再核对。现有真人 / 钟表与其来源记录保留。

此前登记的原创demo-art插画文件仍保留，当前默认图片词条已不引用它们。050默认以真实照片和前景文字形成层次；原有三层透明图片配置仍兼容。

## 默认演示人物更新（2026-10-15）

036–038当前使用public/type-studies/portrait-demo.png，为内置imagegen生成的虚构成年白人女性，未输入用户照片或其他真人身份参考。该图片及其历史来源说明不随公开仓库分发。此前用户本人照片的抠图文件保留为历史素材，默认配置已不引用；不能把当前人物称为真实模特照片或已签署模特授权的第三方摄影作品。

## 当前建筑摄影默认素材（2026-10-15）

048–051、058–059当前使用15张建筑照片，6个Demo各有独立素材组。原有三张由Mika Ruusunen（Unsplash）、Tiffany Christie Freeman（Pexels）、yanping ma（Pexels）拍摄，保留在049轮播。新增12张来自Pexels，逐项登记如下。作品页、下载URL、来源ID和SHA-256见public/demo-photos/manifest.json的photos；旧风景照记录移至legacyPhotos，旧文件保留以兼容已有配置。图片没有生成或重绘，网页按原比例裁切显示。

本次已读取三张作品页及[Unsplash许可](https://unsplash.com/license)、[Pexels许可](https://www.pexels.com/license/)。两站允许免费用于网站等用途并允许修改；不要求署名，仍保留摄影师记录。不得将原图转售或包装成竞争图库，也不能暗示摄影师、人物或品牌背书；照片版权许可不等于商标或建筑物其他权利的额外授权。此项目仅将照片用于动效示范，未公开发布。

### 人物示例撤下（2026-10-15，当前状态）

036–038当前已改为丝带、弹球与折纸图形，不加载人物图片；上文人物照片及生成来源均为历史记录。现行三项由项目内Canvas路径、渐变和帧函数绘制，未引入其他图形素材。

### 各Demo独立图片组（2026-10-15）

048开窗用白色拱门、室内阶梯、黑白墙面；049轮播保留银白曲面、暖灰石墙、混凝土玻璃；050视差用金色拱线；051对比用玻璃切面与金色立柱；058跟图用天空建筑、石质门洞、镜面立面；059拖动用混凝土阶梯、白色窗格、几何投影。051左右两侧也使用不同照片，所有默认图片位置均不重复。

| 用途 | 文件 | 摄影师 | 原作品 |
| --- | --- | --- | --- |
| 048 | architecture-arch-clouds.jpg | Jill Qin | [Pexels 10909711](https://www.pexels.com/photo/white-concrete-arch-entrance-10909711/) |
| 048 | architecture-stair-light.jpg | Nur Yilmaz | [Pexels 9712396](https://www.pexels.com/photo/modern-architecture-interior-with-steps-9712396/) |
| 048 | architecture-wall-shadow.jpg | kadir yeşilbudak | [Pexels 28298291](https://www.pexels.com/photo/a-black-and-white-photo-of-stairs-and-a-wall-28298291/) |
| 050 | architecture-golden-arch.jpg | Laura Cleffmann | [Pexels 30050991](https://www.pexels.com/photo/modern-abstract-arch-against-blue-sky-30050991/) |
| 051 | architecture-glass-facets.jpg | Mathias Reding | [Pexels 12884318](https://www.pexels.com/photo/a-glass-building-with-geometric-design-12884318/) |
| 051 | architecture-sunlit-columns.jpg | Jan van der Wolf | [Pexels 29601980](https://www.pexels.com/photo/modern-architectural-facade-against-clear-blue-sky-29601980/) |
| 058 | architecture-sky-concrete.jpg | July Nguyen | [Pexels 32699697](https://www.pexels.com/photo/modern-minimalist-architecture-against-blue-sky-32699697/) |
| 058 | architecture-stone-portal.jpg | Francesco Ungaro | [Pexels 12529744](https://www.pexels.com/photo/a-concrete-wall-with-arched-door-12529744/) |
| 058 | architecture-mirror-facade.jpg | Shivansh Sharma | [Pexels 20475618](https://www.pexels.com/photo/building-with-a-geometric-reflective-facade-20475618/) |
| 059 | architecture-concrete-stairs.jpg | Mantas Sinkevičius | [Pexels 39031396](https://www.pexels.com/photo/minimalist-concrete-staircase-with-shadows-39031396/) |
| 059 | architecture-white-facade.jpg | Reinis Brūzītis | [Pexels 33317366](https://www.pexels.com/photo/modern-minimalist-architecture-with-geometric-lines-33317366/) |
| 059 | architecture-graphic-shadows.jpg | Mukhtar Shuaib Mukhtar | [Pexels 30380818](https://www.pexels.com/photo/abstract-architectural-shadows-and-light-patterns-30380818/) |

本次读取新增12张原作品页及[Pexels官方许可](https://www.pexels.com/license/)，允许用于网站并修改。保留摄影师、原作品地址、许可地址和文件哈希；照片不是项目原创，图片许可不改变本工程代码与Remotion依赖的许可边界。

## 081–100 控件与数据扩充（2026-10-16）

20项由本项目独立编写：10项原生控件反馈、10项SVG数据变化。参考链接仅指向MDN的HTML、ARIA与SVG机制说明，不是复制现成Demo。未加入新的第三方代码、图片、字体或依赖；继续使用现有Arial等系统字族，不分发系统字体文件。上传反馈是本地演示，不提供真实网络上传服务。既有Remotion运行依赖的许可范围沿用本工程原有记录。

## 056–058 整项替换（2026-10-16）

当前内容是弹性Dock、滑动确认、径向菜单，分别为本项目独立实现的悬停放大、范围输入阈值确认、圆形菜单展开机制。路径图标为本地SVG基本几何绘制，不新增第三方图标包、图片或字体。参考链接仅对应Pointer Events、HTML range和button基础机制；不是原Codrops倾斜、磁吸或跟图Demo的复制。058原照片不再用于此词条，许可登记继续保留以便审计；原文件未删除。此条替代此前对056–058当前样式的描述。


## 101 语音波形（2026-10-16）

波形绘制、示例节奏和音量包络分析代码为本库独立实现；仅使用已有React/Remotion及浏览器Web Audio接口，无新增外部字体、音频、图片或依赖。默认节奏为数学构造的无声示例，proof/voice/analysis-test.wav为本地生成的静音/测试正弦信号，不是真人口播。用户替换的音频由用户自行提供；音频版权不因本库开源或代码独立实现而改变。

## 102–161 独立扩充（2026-10-16）

60项由本项目独立编写帧驱动SVG / React组件，未引入第三方动效源码、图标包、摄影、字体或运行依赖。沿用项目已有字体与Remotion运行环境，各自许可仍适用。网页参考链接只帮助说明通用机制，不表示直接移植上游成品。

本机Lieflat Charts Skill的64种图表目录用于缺口盘点；其LICENSE为PolyForm Noncommercial 1.0.0，不是MIT。未复制其模板、tokens、源码、字体、素材或第三方依赖，也未把其模板作为本项目商用授权依据。新图表为基础数据结构的独立实现；目录与本次使用范围见docs/batch/INTEGRATION.md。该记录不改变Remotion本身的使用条款。

## 162–165 人机验证（2026-10-16）

仅参考GoCaptcha原作者项目公开的Click / Slide / Drag-Drop / Rotate机制及GeeTest的公开产品说明。GoCaptcha当前LICENSE核对为Apache-2.0；没有复制其源码、图片、字体、样式或SDK，不新增第三方依赖。展示建筑、拼图与图形均由本项目独立SVG绘制；沿用项目原有字体与Remotion，各自条款继续适用。没有采用Google/reCAPTCHA、Cloudflare、GeeTest等商标或品牌外观，也不连接其认证服务。实际来源访问情况与页面链接见docs/verification/SOURCES.md。

## 166–177 语音与苹果交互（2026-10-16）

参考Apple官方HIG的上下文菜单、列表、选择器、进度反馈、搜索，以及iPhone手册中的语音备忘录、语音消息、音量机制。全部为本项目独立React/SVG与帧函数实现，没有复制Apple系统UI包、SF Symbols、SF Pro字体、商标或媒体素材；已有字体与Remotion许可继续适用。语音球为独立中性色轮廓，不使用Siri品牌图案或资产；未集成录音、语音识别、生成语音、实际通话或发送API。来源、手动与视频边界见docs/voice-ui/SOURCES.md。

## 卡片可选音效（2026-10-16）

`public/sounds/`的8个短WAV由`scripts/create-sounds.py`使用正弦振荡、固定种子的噪声、滤波与音量包络独立合成，不包含第三方采样、音乐、真人声音或Apple系统提示音。7种可手选音色及验证自动演示的错误反馈均来自该脚本；`manifest.json`记录生成文件、长度与峰值。没有新增音频服务、运行依赖或外部素材。既有字体、照片及Remotion许可不因添加本地合成音效而改变。

## 178–290分类补齐（2026-10-21）

新增113个词条为项目内独立绘制，技术参考MDN SVG、Pointer Events与WAI-ARIA APG，不复制第三方Demo代码或品牌素材。84个默认建筑插画为本项目生成的SVG，清单在public/coverage-art/manifest.json，可替换图片。字体沿用本文件已有许可范围和本地字体文件；本次没有新增商业字体、外部照片或音源。语音频带/声像为视觉示意，验证码为本地交互原型。独立实现不等于对现有第三方依赖、原有照片或字体重新授权，沿用原许可要求。
