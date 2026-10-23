# 本次宣传片任务的临时素材索引

本目录是 **2026-10-23 规划阶段的归档**，不是可随手清空的缓存。完整方案、真实进度和回家继续步骤见 [交接文档](<../HANDOFF.md>)。

当前只有参考片、抽帧、检查图及历史工具；**没有真实 DSH 工作录屏，也没有已制作的样片**。继续制作时复用这些文件，不必重新下载参考或重复粗抽帧。

## 参考视频

| 文件 | 来源与用途 |
|---|---|
| [第一期](<references/episode1-BV1VLJQ6XEZi.mp4>) | [BV1VLJQ6XEZi](https://www.bilibili.com/video/BV1VLJQ6XEZi)，观察第一期布局、角色讲解、实操放大与收尾方式 |
| [黑屏大字参考](<references/typography-BV1dm4y1n78i.mp4>) | [BV1dm4y1n78i](https://www.bilibili.com/video/BV1dm4y1n78i)，观察黑底、粗宋体、横竖混排、关键词累积与硬切 |
| [BGM 画面参考](<references/bgm-BV1R1421v739.mp4>) | [BV1R1421v739](https://www.bilibili.com/video/BV1R1421v739)，仅用于参考，不把 EVA 动画画面剪入我们的宣传片 |

上述 MP4 不作为成片音轨来源。已提取的音乐在 [decisive-battle.m4a](<../material/bgm/decisive-battle.m4a>)，约 110.36 秒。音频时长与波形已检查，逐鼓点定帧仍未完成；版权与公开发行许可仍需确认。

## 抽帧与检查图

| 文件 / 目录 | 内容与限制 |
|---|---|
| [第一期稀疏抽帧](<ep1frames/>) | 8 张；文件名中的数字是取帧时间（秒） |
| [文字参考抽帧](<typo-frames/>) | 21 张；文件名中的数字是取帧时间（秒） |
| [第一期联系表](<reference-review/episode1.jpg>) | 每 5 秒抽帧；单格被缩放为 320×240，不应据其拉伸比例设计成片 |
| [文字参考联系表](<reference-review/typography.jpg>) | 每 2 秒抽帧，观察整段文字变化 |
| [BGM 画面联系表](<reference-review/bgm-video.jpg>) | 每 10 秒抽帧，仅作参考内容检查 |
| [BGM 波形](<reference-review/bgm-waveform.png>) | 整条音轨波形，不是已标注的鼓点表 |
| [Pet 测试帧](<pet_test.png>) | 早期单帧检查，不代表最终合成、透明边缘或动画已验收 |

联系表没有精确时间标签。已完成的是覆盖全时长的定间隔抽帧检查，不能写成带声音连续观看或逐帧审片。

## 历史脚本与工具

**以下脚本只作过程留档，不是新机器上的可重跑流水线。** 它们包含办公室绝对路径、旧浏览器任务 ID，部分是失败尝试；不要直接运行。

| 文件 | 用途 / 风险 |
|---|---|
| [archive-session.sh](<archive-session.sh>) | 一次性将 11 个任务临时文件复制到本项目，并逐一 `cmp` 校验；绑定办公室路径，目标已存在时退出 |
| [dsh-video-reference-sheets.sh](<scripts-history/dsh-video-reference-sheets.sh>) | 使用 Remotion 附带 FFmpeg 抽帧的早期尝试，受精简构建和字体路径转义限制 |
| [build-dsh-storyboards.sh](<scripts-history/build-dsh-storyboards.sh>) | 使用完整 FFmpeg 的早期尝试；含删除固定输出目录的命令，且 `drawtext` 转义失败，不要运行 |
| [dsh-reference-round-bgm.mjs](<scripts-history/dsh-reference-round-bgm.mjs>) | 旧 ego-browser taskSpace `4` 的 BGM 参考下载脚本；旧任务已结束，不是独立 Node.js 程序 |
| [FFmpeg 7.1 essentials ZIP](<tools/ffmpeg-7.1-essentials_build.zip>) | GyanD Windows 原始工具包，92,100,272 字节；包含 ffmpeg、ffprobe 与许可资料；其他系统需对应平台工具 |

需要使用工具时，可把 ZIP 解压到 `.temp/tools/ffmpeg-unpacked/`；[Git 忽略规则](<../.gitignore>)已排除该可重建目录。ZIP 已随第一次提交成功推送；GitHub 对其大于推荐的 50 MB 给出警告，没有拒绝上传。无需为本次交接重新打包或迁移历史。

## 归档边界

- 原系统临时目录中的 3 份视频、4 张检查图、3 个历史脚本与 1 份 ZIP 已逐字节比对复制；项目原有抽帧也已跟踪。
- 没有归档整台电脑的 Temp、浏览器账户数据、Cookie、模型密钥、私密 DSH 配置或带账户标识的媒体签名 URL 原始输出。
- Pet 动画与来源说明位于 [素材目录](<../material/dsh-pet-sticker/>)；技能快照位于 [.claude/skills](<../.claude/skills/>) 与 [.agents/skills](<../.agents/skills/>)。
- 素材文件已保存不代表获得公开发行或商业使用授权；发布前按 [交接文档](<../HANDOFF.md#5-视觉--音频约束>)复核。
