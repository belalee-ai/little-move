# 代码、字体和示例素材

Little Move 的自有代码与文档按根目录 MIT 许可提供。第三方内容不因此改为 MIT。

| 内容 | 适用说明 |
| --- | --- |
| 改写的 Remotion Scenes 示例 | MIT，原版权声明和完整许可保留在 THIRD-PARTY-NOTICES.md |
| 中文预览字体 | SIL OFL 1.1；字体文件和对应许可在 public/fonts/ |
| 创意字体子集 | Roboto Flex、Bungee、Shrikhand；许可与文件清单在 public/type-studies/fonts/ |
| 建筑摄影 | Pexels / Unsplash 各自许可；作品、摄影师、下载地址和文件哈希在 public/demo-photos/manifest.json 的 photos 中 |
| 建筑示意插画、音效 | 本项目生成源分别在 scripts/create-coverage-art.mjs、scripts/create-demo-art.mjs 与 scripts/create-sounds.py |
| 钟表 | AI 生成的示意素材，来源说明见 type-studies/sculptural-clock-source.md；不代表真实产品或品牌授权 |
| React、Vite、Remotion 等依赖 | 各自许可；通过 npm 安装，不将依赖源码重新许可 |

Remotion 使用单独的许可，不能把本仓库称为“所有内容均 MIT、所有场景免费”。使用和商用前请查阅 [Remotion 许可与条款](https://www.remotion.dev/docs/license)及所安装版本的许可文件。

字体随项目分发时保留版权和 OFL 文本，不能把字体本身单独出售，也不能将其再许可为 MIT。见 [OFL 正式条款](https://openfontlicense.org/open-font-license-official-text/)。

摄影用于动效示范，不能拿去原图转售、建立竞争图库或暗示摄影师与品牌背书。详见 [Pexels 许可](https://www.pexels.com/license/)与 [Unsplash 许可](https://unsplash.com/license)。这些照片不是 Little Move 原创作品。

当前 036–038 是丝带、弹球和纸面，不使用人物。公开仓库不包含历史个人照片、生成的人物图片或旧照片素材；旧来源记录中的 legacyPhotos 仅用于识别历史配置，不代表这些文件随仓库提供。

参考网站与同名动作仅用于溯源和理解通用机制，不表示获得其商业字体、付费组件或整套模板的授权。详细历史核查见 THIRD-PARTY-NOTICES.md；LICENSE-AUDIT.md 仅记录 2026-10-15 对最初 30 项的核查，不代表后来全部词条的法律鉴定。

291 的默认素材 `public/pixel-field/quiet-courtyard.svg` 是本项目原创建筑示意插画。该动效参考 Yuri Artiukh 的 [Pixel Distortion Demo](https://tympanus.net/Development/DistortedPixels/index3.html) 的通用机制，独立以 SVG 采样与帧时钟实现；未复制其 Three.js 代码、字体或脑部渲染图。上游 [MIT 许可](https://github.com/akella/DistortedPixels/blob/master/LICENSE) 于 2026-10-21 核验。

292、293 的九幅默认建筑示意插画位于 `public/intake-studies/`，生成源为 `scripts/create-intake-study-art.mjs`，属于本项目自有素材。292 参考 Jan Kohlbach 的[滚动变形示例](https://tympanus.net/Tutorials/ShaderOnScroll/)，[上游 MIT 许可](https://github.com/jankohlbach/codrops-shader-on-scroll/blob/master/LICENSE)已于 2026-10-21 读取；293 参考 Manoela Ilic 的[磁吸网格示例](https://tympanus.net/Development/3DGridContentPreview/)，[上游 MIT 许可](https://github.com/codrops/3DGridContentPreview/blob/main/LICENSE)同日读取。两项均独立实现通用动作机制，未分发上游代码、照片、字体或音频；未增加依赖。
