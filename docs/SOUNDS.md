# 卡片音效

290项共用一个轻量菜单：关闭、推荐、七种音色、音量、试听。默认关闭，不使用背景音乐，不读取麦克风；浏览器刷新后重新静音。预览同时只开启一张卡片，音量默认35%。连续呼吸、环绕、原声波形等推荐保持安静，仍可手动挑选。

`src/sound-cues.js`保存推荐和帧位置。基础停顿打字复用`typingSchedule`与真实字形布局，合并中英重合的敲击时刻；按钮按压与最新语音控件使用自动演示的状态边界。其余以进入或落位的稀疏提示为主，不等于逐字逐事件人工拟音。调整速度会移动音效触发帧，短音色本身保留自然长度。未改动已有视觉时间轴。

`MotionSound`直接用于`TextMotion`、`StudyMotion`和`DemoMotion`，由Remotion的Sequence与Audio挂载。暂停和定位走同一播放器；手动模式通过`useLiveSound`改由真实交互事件触发，不播放自动预排音轨。短音在暂停、定位、静音、改音色/音量、卸载或页面隐藏时停止；空闲、单纯悬停不持续鸣响。手动点击提示只是控件反馈，并不代替业务成功/错误语义；语音示例仍不产生真实说话内容。

音色由`scripts/create-sounds.py`生成，48kHz单声道16位PCM，带起止包络、保留峰值余量。没有使用外部采样。原始WAV和生成清单位于`public/sounds/`。声音不通过第三方服务。

Remotion输入属性示例：

```json
{"demo":"demo-press","soundPreset":"auto","soundVolume":0.35}
```

创意字体与Demo下载配置携带这两个字段。渲染使用本项目公共目录，不能只把JSON移交给不认识该音效层的第三方生成平台。ChatCut内联载荷仍只包含既有视觉代码。

验证：`node scripts/check-sounds.mjs`覆盖全部290项、各选项、0.5/1/2倍速、默认静音、手动音轨隔离；`node scripts/render-sound-proof.mjs`输出三类真实Remotion音轨与关闭音效的对照到`proof/sounds/`。`render-analysis.json`检查音轨实际时段、峰值及静音对照。这些是输出和时序验证，不替代用户对音色听感的选择。
