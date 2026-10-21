const memos='https://support.apple.com/guide/iphone/make-a-recording-iph4d2a39a3b/ios';
const messages='https://support.apple.com/guide/iphone/send-and-receive-audio-messages-iph2e42d3117/ios';
const hig='https://developer.apple.com/design/human-interface-guidelines/';
export const VOICE_UI_ROWS=[
 ['mic-capsule','话筒展开','Microphone Capsule','交互','语音控件','点击话筒，圆形按钮舒展为聆听胶囊，音柱随示例语音起伏；再次点击沿原路收回。',memos,['话筒','麦克风','聆听','语音交互']],
 ['push-talk','按住说话','Push To Talk','交互','语音控件','按住话筒开始说话，声波与计时同步推进；松手生成语音，上滑取消并回到待机。',messages,['话筒','麦克风','聊天录音','语音交互']],
 ['memo-panel','录音面板','Voice Memo Panel','交互','语音控件','录音按钮由圆点变为暂停符号，波形沿时间滚动；暂停冻结时长，继续累积，完成后收起。',memos,['语音备忘录','录音','暂停继续','语音交互']],
 ['voice-orb','语音对话球','Voice Conversation Orb','交互','语音控件','柔光球在待机、聆听、思考与说话之间连续切换；聆听轻微收放，思考光点绕行，说话声纹随节奏起伏。',hig+'feedback',['语音助手','光球','说话','语音交互']],
 ['voice-message','语音消息','Audio Message Playback','交互','语音控件','点击播放语音，波形逐段点亮、游标与时间同步前进；暂停保留进度，拖动可定位。',messages,['语音气泡','播放暂停','语音交互']],
 ['call-mute','通话静音','Call Mute Feedback','交互','语音控件','点击话筒切换静音，斜线连续划过图标、声波回落；取消静音后恢复起伏，挂断后收尾。',hig+'buttons',['话筒','通话','静音','语音交互']],
 ['ios-context','长按快捷菜单','Press Context Menu','交互','苹果交互','按住内容卡片，卡片轻微抬起、背景减弱，快捷菜单从卡片旁展开；选择或取消后原路收回。',hig+'context-menus',['Apple','iOS','苹果经典','长按菜单']],
 ['ios-swipe','左滑操作','Swipe Actions','交互','苹果交互','列表行跟随手指左滑，归档与标记操作从后方露出；松手吸附，选择后行内容反馈并允许还原。',hig+'lists-and-tables',['Apple','iOS','苹果经典','滑动操作']],
 ['ios-wheel','滚轮选择器','Wheel Picker','交互','苹果交互','日期式滚轮随拖动连续滚动，中心项清晰、边缘项按透视收窄；松手携带惯性吸附到整数项。',hig+'pickers',['Apple','iOS','苹果经典','Picker']],
 ['ios-volume','竖向音量条','Vertical Volume Control','交互','苹果交互','拖动竖向音量条，填充和喇叭声纹同步变化；按下轻微舒展，松手柔和复位，支持键盘调节。','https://support.apple.com/guide/iphone/adjust-the-volume-iphb71f9b54d/ios',['Apple','iOS','苹果经典','控制中心']],
 ['ios-refresh','下拉刷新','Pull To Refresh','交互','苹果交互','下拉列表带动箭头转向，超过阈值松手开始旋转加载，内容更新后列表连续回到原位。',hig+'progress-indicators',['Apple','iOS','苹果经典','刷新']],
 ['ios-search','搜索栏展开','Search Field Expansion','交互','苹果交互','点进搜索栏，取消按钮顺势让出空间，结果按输入更新；取消清空内容并收回为原始搜索栏。',hig+'search-fields',['Apple','iOS','苹果经典','搜索取消']],
];
export const VOICE_CONTROL_KEYS=VOICE_UI_ROWS.slice(0,6).map(r=>r[0]);
export const APPLE_CONTROL_KEYS=VOICE_UI_ROWS.slice(6).map(r=>r[0]);
export const VOICE_UI_KEYS=VOICE_UI_ROWS.map(r=>r[0]);
export const VOICE_UI_CODES=Object.fromEntries(VOICE_UI_ROWS.map((r,i)=>[r[0],String(166+i)]));
export const isVoiceUI=id=>VOICE_UI_KEYS.includes(id.replace('demo-',''));
export const voiceUIDefaults=key=>({background:'#f4f4f2',accent:key==='voice-orb'?'#567dbe':VOICE_CONTROL_KEYS.includes(key)?'#363e40':'#356db3',strength:1});
