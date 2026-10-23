# DSH Tauri 第二期宣传片 · 交接

交接日期：2026-10-23，Asia/Shanghai。仓库：[hairyf/dsh-video](https://github.com/hairyf/dsh-video)，分支 `main`。

## 0. 回家先看这里

**方案已获用户确认；现在停在“素材与计划已归档”，不是“样片已完成”。** 用户本次要求先提交推送全部任务内容（包括 temp），再写交接文档并再次提交推送，回家继续。本次没有开始生成办公成果、录制或制作样片。

- 下一阶段：按本文制作 **26 秒正式片头样片**，先交样片，不擅自一次做完整片。
- 完整片目标约 **110 秒**，用户原要求范围 1:30–2:30。
- 输出规格：**1920×1080，30 fps**；样片 780 帧。正式剪辑点需跟实际音乐校准。
- 主线：**从一句需求，到可以交付的办公文件**。Office Kit 是主角，全屏侧边栏是重点，Ops 只作短促补充。
- 已有 Remotion 工程仍是空模板： [Composition.tsx](<src/Composition.tsx>) 的 `MyComponent` 返回 `null`，`MyComp` 仍为 1280×720 / 30 fps / 60 帧。不要把这个空输出当样片。
- 没有已验证的隔离录制环境；也没有真实安装、五段工作录屏或修改后的办公文件。不要写成“已就绪”。

新机器：

```bash
git clone https://github.com/hairyf/dsh-video.git
cd dsh-video
pnpm install --frozen-lockfile
pnpm run lint
# 需要开始预览时再启动；现在只能看到空模板
pnpm run dev
```

已有克隆先 `git pull --ff-only`。项目 Node 约束为 `^20.19.0 || ^22.13.0 || >=24`，本机验证使用 Node `25.9.0`、pnpm `12.8.1`。依赖版本以 [package.json](<package.json>) 和 [锁文件](<pnpm-lock.yaml>) 为准。新机器还需自行准备浏览器、真实 DSH 桌面端、模型访问凭据和录制工具；这些没有打包入仓库。

## 1. 归档与当前状态

第一笔归档提交：`59438f6503bbd49090195e6600e320a4b7672401`，`chore: archive promo materials, task temp files and local skills`。本交接文档及索引属于随后第二笔提交。

| 内容 | 状态 / 入口 |
|---|---|
| Remotion 工程 | 4.0.538，React 19.2.3，TypeScript 5.9.3；源代码未开始制作宣传片 |
| BGM | [decisive-battle.m4a](<material/bgm/decisive-battle.m4a>)，110.363968 秒，AAC / 44.1 kHz / 双声道 |
| Sticker Pet | [素材目录](<material/dsh-pet-sticker/>)，158 个 WebM + 158 个 MOV、预览、配置、来源说明和转换工具 |
| 项目内原 temp | [第一期抽帧](<.temp/ep1frames/>) 8 张、[文字参考抽帧](<.temp/typo-frames/>) 21 张、[Pet 测试帧](<.temp/pet_test.png>) |
| 系统 temp 的任务文件 | 已复制到项目 [temp 索引](<.temp/README.md>) 所列目录：三份参考视频、四张检查图、三个历史脚本、FFmpeg 原始 ZIP |
| 技能 | [.agents/skills](<.agents/skills/>) 和 [.claude/skills](<.claude/skills/>) 均为普通文件快照；后者不再是指向办公室绝对路径的链接 |
| 实录 / 样片 | **未开始**，没有提交伪造的会话、安装成功页面或成果 |
| 音乐节拍 / 字体 / 最终配色 | 尚未定帧、选定或完成可读性验收 |

素材 Pet 来自 [hairyf/dsh-pet-sticker](https://github.com/hairyf/dsh-pet-sticker)，固定源提交 `6634e0de9cace37ac6b747a960c833209ad015a3`。按普通文件纳入本仓库，不是 submodule，也不依赖嵌套 Git 仓库才能拉到素材。原始说明保留于 [Pet README](<material/dsh-pet-sticker/README.md>)。

**归档边界：**“所有内容”指本项目及本次视频任务的临时产物，不是整台电脑的 Temp。没有提交 `node_modules`、浏览器用户数据、Cookie、模型密钥、DSH 私密配置、带账户标识的媒体签名 URL 原始输出、无关系统日志或嵌套 Git 历史。FFmpeg ZIP 已包含解压后工具，所以不重复提交两份 EXE。此仓库是公开仓库；素材归档不等于拥有公开发行/商业使用授权。

## 2. 参考片与已完成的检查

1. [第一期 BV1VLJQ6XEZi](https://www.bilibili.com/video/BV1VLJQ6XEZi)：延续蓝紫系辨识度、角色讲解、先总览再展开、左标题右实操、局部放大框与连线、结尾界面集合。不重复做一遍安装教程。
2. [黑屏文字 BV1dm4y1n78i](https://www.bilibili.com/video/BV1dm4y1n78i)：黑底、粗宋体、横竖混排、巨大字号差、红黄关键词、逐块累积与突然硬切，而不是普通大字淡入。
3. [BGM BV1R1421v739](https://www.bilibili.com/video/BV1R1421v739)：用户指定 DECISIVE BATTLE（使徒来袭）；围绕音乐组织节奏。EVA 动画画面只用于参考，不放进我们的宣传片。

已做的是**覆盖全时长的定间隔抽帧检查、音频时长和波形检查**，不是带声音连续观看，也不是逐帧审片。已确认方案取代最初不充分的短计划。继续时直接看归档，不要重新做一遍下载与粗抽帧；需要补的是听音、标鼓点、精确剪辑。

[第一期联系表](<.temp/reference-review/episode1.jpg>) 每 5 秒抽帧，[文字参考联系表](<.temp/reference-review/typography.jpg>) 每 2 秒抽帧，[BGM 画面联系表](<.temp/reference-review/bgm-video.jpg>) 每 10 秒抽帧，[波形图](<.temp/reference-review/bgm-waveform.png>) 为整条音轨。联系表无精确时间标签；第一期联系表被缩放为 320×240 单格，**不能据其拉伸比例设计最终画幅**。

## 3. 已确认的 110 秒完整方案

| 时间 | 画面与内容 |
|---|---|
| 0–10 秒 | 黑屏大字开场：`DSH TAURI` → `v0.25.0` → `第三方预设插件` → `DSH Office Kit`；“创建 / 预览 / 标注 / 修改”逐块出现，最后“全屏展开”引出转场。关键词红色强调，不把所有字堆在同屏。 |
| 10–14 秒 | Sticker Pet 居中挥手；两句气泡打字：“我是新角色！”“这期由我继续讲解。”随后角色与气泡一起缩小到左下角。 |
| 14–26 秒 | 功能快览：真实桌面壳勾选 Office Kit、Ops 并点击安装；五段真实录屏窗口由慢到快进入右侧、错位叠放，分别带出文档、PDF、演示文稿、表格、修改后新版。最后文档聚焦并全屏预览，接正文。 |
| 26–46 秒 | 文档展示完整流程：输入 `/`、选 documents、填需求、提交；执行过程加速，拿到结果恢复正常速度；打开文档，停留封面、目录或重点页，让人看清成品。 |
| 46–57 秒 | PDF：保留技能选择与提交，缩短执行过程，展示实际分页、图文排版和预览。 |
| 57–66 秒 | 演示文稿：使用 presentations，节奏加快，展示封面、内容、图表等实际产出的页面，不长时间停在聊天文字。 |
| 66–74 秒 | 表格：使用 spreadsheets，展示结果里真实存在的汇总、公式或图表，不靠剪辑补出未生成的功能。 |
| 74–94 秒 | 标注修改与全屏侧边栏重点段：回到同一文档，标注具体问题 → 提交修改 → 会话结束 → 打开新版 → 同位置前后对照；展示侧边栏进入新窗口的真实操作链。 |
| 94–103 秒 | DSH Ops：保留实际操作证据，再展示核实后的数字。Pet 候选短句：“少折腾，把时间留给结果。”若数字不能证实，改用真实可证明的操作简化，不编数字。 |
| 103–110 秒 | 四类成果及修改后文档组成背景，Pet 庆祝，落版 `DSH Tauri × DSH Office Kit`，辅以 Ops、版本号、项目入口。 |

四类成果统一使用虚构的**新品发布项目**：项目策划书 / 对外 PDF 资料 / 发布会演示文稿 / 预算与进度表。第五段在第一份策划书上做标注修改。避免四个无关任务重复“生成文件”。提示词及输入数据还没写，要保留这条主题连贯性。

用户最初文案候选还包括“新增 Sticker 宠物预设”“v0.25.0 震撼发布”“办公套件”“标注修改”“侧边栏新窗口全屏浏览”“第三方 DSH Ops”“70 步骤降至 3”“任务耗时减少 2 倍”“Token 用量减少 27.7x”。它们不是必须全挤进片头；性能数字需核实，不把候选视作已证实结论。

## 4. 下一步只做的 26 秒样片

这是**正式片头前 26 秒**，不是另做一段预告。

| 时间 | 要交出的实际效果 |
|---|---|
| 0–3 秒 | 黑屏短暂停顿，`DSH TAURI`、版本号在重拍出现，大小字错位。 |
| 3–7 秒 | “第三方预设插件”与 `DSH Office Kit` 切换，文字逐块叠加，红色关键词。 |
| 7–10 秒 | “创建 / 预览 / 标注 / 修改”加速出现，收束到清楚的一次画面切换。 |
| 10–14 秒 | Pet 居中打招呼，两句打字气泡，再缩小移到左下角。 |
| 14–17 秒 | 真实桌面壳两个插件勾选 → 安装；只突出动作，不让安装进度占十几秒。 |
| 17–23 秒 | 五个真实录屏窗口进入间隔逐渐缩短，错位叠放；每个窗口是实际成果而非功能图标。 |
| 23–26 秒 | 聚焦最前面的文档，展示全屏预览操作；其他窗口退场，镜头停稳，承接正文。 |

验收条件：

- [ ] 26 秒 / 1080p / 30 fps，能从头播放到尾，无缺帧黑块、裁切错误或明显音画失配。
- [ ] 文字确实跟音乐重拍有冲击力，不只是居中渐显；不可读的快速闪烁不能代替节奏。
- [ ] Pet 透明边缘正确，居中 → 左下角的缩放移动自然，气泡有足够阅读时间。
- [ ] 安装、成果、修改后的结果来自真实操作，五窗有层次且主画面可读。
- [ ] 侧边栏新窗口预览是实际操作证明，不用 UI 贴图假装成功。
- [ ] 不出现个人账号、API Key、真实客户数据、私密路径或其他会话内容。
- [ ] 提供样片 MP4、关键帧及简短说明，再请用户审片后继续完整版。

## 5. 视觉 / 音频约束

- 用户原“右边 3/2”已按**右侧约 2/3**解释；正文留外边距，左侧留 Pet、标题与气泡。
- 只有短暂蒙太奇同时叠多个窗口。正文一次聚焦一个，不让所有窗口抢注意力。
- 开头硬切和强文字节奏，正文平滑推拉、局部放大；不要全片用同一个缩放动画。
- Pet 根据内容选动作，不只是循环待机。优先复用 [透明 WebM](<material/dsh-pet-sticker/webm/>)，不用重新生成角色。
- 默认 **Pet 气泡 + 字幕**，不额外生成配音；用户后续明确要求再加。
- BGM 约 110.36 秒适合 110 秒完整片，无需为凑两分钟硬循环。样片使用开头相应段落，收尾方式以审片为准。
- 字体需合法可用、中文完整；大字与 UI 的对比、阅读停留时间要实看。当前没有确定或打包字体。
- BGM、EVA 参考及角色素材的许可未核验；发布前确认。不要误称它们是原创或已取得商业授权。

## 6. 实录与产品事实（源码已查，运行未验）

办公室产品仓库：`D:/projects/dsh-tauri-desk/deepseek-harness-desktop`；本次核查时 HEAD `6169d3e81fd6fb51243c9f7d5dc7fddf230b248d`，工作区干净。产品仓库独立于视频仓库，回家需要另行取得 [DSH Tauri](https://github.com/dsh-tauri/deepseek-harness-desktop)。下列链接固定到该源码提交，方便换机器追踪；源码事实不等于当前运行窗口验收。

### 安装镜头（视频零）

- 仓库声明版本 `0.25.0`，推荐内核 `0.2.1-rc.2`，最低 `0.1.7-rc.1`；见 [manifest](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/6169d3e81fd6fb51243c9f7d5dc7fddf230b248d/src-tauri/resources/manifest.jsonc#L2-L5)。录前核对真实运行版本。
- Office 预设名 **DSH Office Kit**，ID/npm spec `dsh-office-kit`，来源 [hairyf/dsh-office-kit](https://github.com/hairyf/dsh-office-kit)。
- Ops 的预设界面名称实际是 **DSH Optimize**，ID/npm spec `dsh-ops`，来源 [T-Auto/dsh-ops](https://github.com/T-Auto/dsh-ops)；产品 README 称 DSH OPS。字幕可介绍 Ops，但别在录屏中伪造界面名称。
- 两者都是 `recommended: true`、`checked: false`、`version: "latest"`；可称推荐的可选第三方预设，不能称默认已安装。实际安装版本须在录制时记录。见 [预设注册](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/6169d3e81fd6fb51243c9f7d5dc7fddf230b248d/src-tauri/resources/manifest.jsonc#L204-L223)。
- 已有用户入口是“配置 → 插件 → 预设”；见 [入口](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/6169d3e81fd6fb51243c9f7d5dc7fddf230b248d/src/ui/config/plugin.tsx#L669-L680)。首次/更新引导也有推荐插件页；勾选并确认后调用真实安装，见 [安装动作](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/6169d3e81fd6fb51243c9f7d5dc7fddf230b248d/src/layout/components/setup-preinstall.tsx#L261-L284)。
- 该镜头是桌面端外壳，不是当前 Harness 网页。要录真实桌面窗口；独立干净配置避免已有安装项影响镜头，不要卸载用户日常环境里的插件来造镜头。

### Office 工作镜头（视频一到五）

- 在**真实隔离 DSH 环境**用浏览器录制真实会话；先建立并验证工作区、会话历史与录制账号/配置的隔离，不复制私人历史。
- 输入 `/` 后选择 UI 实际存在的 documents / pdf / presentations / spreadsheets 入口。用户最初把 presentations 拼作 persentations，制作时以真实入口为准；本次尚未验证入口显示名。
- 保留原速完整录屏和原始输出，再剪出提交、执行、成果；等待可加速，但提交与成果展示不能省略。
- 在第一份文档上标注具体改动，提交后等待真实新版，再做同位置前后对照。
- 模型、网络、插件依赖、预览/转换组件要在隔离环境实际验证；本机日常环境有插件不代表隔离环境可用。

### 全屏侧边栏与 Pet

- “在新窗口全屏打开”已有实现，属于核心 `dsh-tauri` 插件，不宜只归功于 Better Sidebar。按钮在现有右侧栏全屏按钮左边，读取当前 `sessionId`、收起源窗口右栏，再创建 `presentation=full-sidebar` 新窗口。见 [sidebar-fullwindow.ts](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/6169d3e81fd6fb51243c9f7d5dc7fddf230b248d/packages/dsh-tauri/src/client/register/sidebar-fullwindow.ts#L129-L143)、[原生建窗](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/6169d3e81fd6fb51243c9f7d5dc7fddf230b248d/src-tauri/src/desktop/window.rs#L124-L170)。
- 这里“全屏”指右侧栏占满新窗口的布局，不应未经实录承诺系统/F11 全屏。必须真实桌面录屏证明新窗打开、目标会话正确、源窗状态正常；浏览器画面不能冒充原生窗口已验证。见 [截图验收规范](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/6169d3e81fd6fb51243c9f7d5dc7fddf230b248d/docs/specs/screenshot.md#L7-L18)。
- Sticker 预设 `Maid DeepSeek Sticker` / `dsh-chan-sticker-pet`，157 个动作 + 一个透明待机，共 158 段；默认 WebM、macOS MOV。本仓库有本地合成素材，但产品预设是远端播放，不代表完全离线。见 [预设](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/6169d3e81fd6fb51243c9f7d5dc7fddf230b248d/src-tauri/resources/manifest.jsonc#L294-L309)、[素材加载](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/6169d3e81fd6fb51243c9f7d5dc7fddf230b248d/src/pet/hooks/use-pet-source.ts#L9-L14)。

### Ops 宣传数字

`70 → 3`、耗时“减少 2 倍”、`27.7×` 仍是**待核实文案**。本次产品源码/README 只证实有减少 Token 和耗时的泛述，没有查到这些数字的原始 workload、时间基准、同模型条件或实验记录。

下一步找 Ops 原始 benchmark，确认任务、版本、模型、计量口径和前后数字后才能上片。如果原数据确实是用量比，写“Token 用量降至原来的 1/27.7”；如果时间从 T 变 T/2，写“耗时减半”。不要把不同实验数字拼成同一工作流的结果。26 秒样片不需要这些未核实的数字。

## 7. 工具与已知坑

- 复用现有 Remotion，不另建视频引擎，不增加与当前样片无关的框架。先读 [Remotion skill](<.claude/skills/remotion-best-practices/SKILL.md>) 和对应渲染/媒体指南，再选择项目实际已安装的 API。
- [浏览器技能](<.claude/skills/ego-browser/SKILL.md>) 已归档；办公室 ego-lite 版本 `0.6.0.16`，旧参考浏览器 taskSpace `4` 已结束。别在新机器复用旧任务 ID、绝对路径或会话。
- 系统临时目录里的参考已复制，制作不再依赖 `C:/Users/wwu71/AppData/Local/Temp`。旧脚本仅作历史留档，特别是包含清空输出目录的一次性脚本，**不要直接运行**。
- Remotion 附带的是精简 FFmpeg，历史尝试出现 `Pattern type 'glob' was selected but globbing is not supported by this libavformat build`；完整 FFmpeg 才成功生成联系表。Windows `drawtext` 的盘符与冒号转义也失败过。已有联系表无需重做。
- [FFmpeg ZIP](<.temp/tools/ffmpeg-7.1-essentials_build.zip>) 是 GyanD 7.1 essentials 原始下载，92,100,272 字节。可解压到 `.temp/tools/ffmpeg-unpacked/`（已忽略），里面有 ffmpeg / ffprobe 及许可资料；macOS/Linux 不运行 Windows EXE，准备对应平台工具。
- Pet WebM 带 VP9 alpha。读取时不能仅凭 ffprobe 的像素格式断言透明通道不存在；渲染前用正确解码路径实际检查边缘。源素材说明见 [Pet README](<material/dsh-pet-sticker/README.md>)。不要误用普通不透明转码覆盖透明素材。
- 安装检查发现 [pnpm-workspace.yaml](<pnpm-workspace.yaml>) 的 `esbuild` 原来是占位字符串 `set this to true or false`，pnpm 12 报 `ERR_PNPM_IGNORED_BUILDS`。已改为 `false`，与 [package.json](<package.json>) 现有 `allowScripts.esbuild: false` 一致；没有放开任意依赖安装脚本。
- 当前素材都在 material / temp，不是已接入 Composition 的视频路径；制作时需接入 Remotion 可访问的资源位置，不要把仅在本机存在的绝对路径写进成片。

## 8. 已运行检查与下一位清单

本机已验证：

- `pnpm install --frozen-lockfile`：成功（已有依赖环境，不等于跨机器全新安装验收）。
- `pnpm run lint`：成功，包含 ESLint 与 TypeScript；`npm run lint` 也成功。
- 11 个系统 temp → 项目归档复制全部 `cmp` 一致。
- Pet WebM / MOV 各 158 个；嵌套素材与技能以普通文件跟踪，没有 Gitlink 或办公室绝对路径 symlink。
- 归档提交 904 个变更文件；当时全库 916 个跟踪文件；最大文件为上述 FFmpeg ZIP，所有文件低于 100 MiB。
- 对归档的任务文本、技能和 Pet 文本进行了常见密钥/Cookie/签名 URL 模式检索，未命中。不是通用安全审计保证。
- 自写变更的 `git diff --cached --check` 通过；完整检查报告第三方技能原文的 Markdown 行尾空格/混合缩进，**保留原文未批量格式化**。不要将全库 diff-check 记为通过。
- **没有运行样片渲染、实录、Office 输出验收或逐鼓点音画检查。**

接手后按顺序：

1. 拉取本仓库，读本交接和 temp 索引，复核环境与依赖。不要重复已完成的粗调研。
2. 听指定音轨，标注前 26 秒重拍；确定可用中文字体与大字构图。
3. 建立隔离的真实 DSH/桌面端录制环境，核验版本、两个插件实际安装版本和全部入口。凭据留在机器本地。
4. 围绕同一“新品发布项目”写四类需求，完成四份成果和第五段标注修改；录下安装和新窗口操作。先采够样片所需的真实片段。
5. 用当前工程制作 780 帧片头；Pet 转场、右侧五窗叠放、全屏聚焦全部接到真实素材。
6. 跑 lint / 类型检查，渲染关键帧与 MP4，检查透明度、字幕可读性、音画节拍和隐私。
7. 交 26 秒样片供用户确认后再展开完整 110 秒片。未核实数字和版权事项继续保留为发布前门槛。

给下一位代理的启动语：

> 先阅读 HANDOFF.md 和 .temp/README.md。110 秒完整方案和 26 秒样片已获确认，目前只有素材与计划归档，没有录屏或样片。不要重新下载参考、不要把空模板当成果。请从真实隔离录制环境与样片素材采集开始，按交接制作 26 秒正式片头，再请我审片。
