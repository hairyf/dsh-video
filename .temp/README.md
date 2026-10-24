# 本次宣传片任务的临时素材索引

本目录保留 **2026-10-23 规划素材及 2026-10-24 制作工具**，不是可随手清空的缓存。当前状态与重渲染步骤见 [交接文档](<../HANDOFF.md>)。

当前交付版本为 **v11 4K**：175 秒，145 秒正文＋30 秒更新／署名／贡献者片尾，React 源界面以两倍像素密度导出 3840×2160。安装完成回到主会话；片头标注段显示两处无边框暂存标注、修改摘要与待修改输入框；片尾宠物为 87 帧“跳舞(Helltaker)”循环。完整 7 秒原速安装、1.6 秒转场、原速输入、4–7 秒成果、真实 Office 菜单图标及中文标签保留；从安装起配乐 32%，音效提高 35%；连续用户原曲、稀疏外扩波纹、43 张头像＋4 个匿名署名保留。[v11 成片](<../out/film-simulated-v11-4k.mp4>) 已导出，[v11 检查报告](<../out/simulation-verification-v11-4k.json>) 已生成：九段完整解码、16 个源时间线推导的无音效窗口原曲连续性、混音峰值／淡出、黑色末帧检查均通过；[v11 检查帧](<../out/simulated-keys-v11-4k/>) 已生成。[内置绘图工具生成的封面](<../out/dsh-tauri-cover-v1.png>) 及 [发布标题和中文简介](<../out/dsh-tauri-publication.md>) 已完成，简介包含相关官方项目、文档及下载链接，未发布。[v10](<../out/film-simulated-v10-4k.mp4>)／[v9](<../out/film-simulated-v9-4k.mp4>) 成片与报告保留。八段原片中 revise 随界面重导，已重新打包为 [v11 原片包](<../out/dsh-simulated-originals-v11.zip>)，包内恰含 [原片说明](<../out/simulated-originals/README.md>) 及八段 MP4。模拟画面不是实时模型执行；早期隔离目录可能含私密配置，不要打包。

## 当前可运行工具

- [render-sim.mjs](<render-sim.mjs>)：`node .temp/render-sim.mjs stills|raw|film`，分别导出检查帧、原片或完整片；Film 使用 `scale: 2` 直接绘制 4K，成片 CRF 14／slow，原片维持 1400×900；模式之后可加合成名。
- [check-demo.mjs](<check-demo.mjs>)：八段时间轴、安装回主会话、段落／拖框／点击、中文技能标签、原速安装／输入、1.6 秒转场、4–7 秒成果、连续源时间及 47 个同步音效提示；单一原曲、43＋4 展示过滤、波纹循环及片尾宠物断言保留。
- [verify-sim.mjs](<verify-sim.mjs>)：检查九段视频尺寸、帧数、完整解码、立体声峰值、原曲连续性、淡出和黑色末帧；全部通过后写入 `out/simulation-verification-v11-4k.json`。
- [check-deliverables-v7-4k.mjs](<check-deliverables-v7-4k.mjs>)：传 `v11` 复核 v11 报告及 v11 原片包，逐字节检查说明及八段 MP4，并输出交付文件 SHA-256；`v9`／`v10` 复核历史报告及 v9 原片包。

以下参考与历史工具继续保留，不必重新下载或重复粗抽帧。

## 参考视频

| 文件 | 来源与用途 |
|---|---|
| [第一期](<references/episode1-BV1VLJQ6XEZi.mp4>) | [BV1VLJQ6XEZi](https://www.bilibili.com/video/BV1VLJQ6XEZi)，观察第一期布局、角色讲解、实操放大与收尾方式 |
| [黑屏大字参考](<references/typography-BV1dm4y1n78i.mp4>) | [BV1dm4y1n78i](https://www.bilibili.com/video/BV1dm4y1n78i)，观察黑底、粗宋体、横竖混排、关键词累积与硬切 |
| [BGM 画面参考](<references/bgm-BV1R1421v739.mp4>) | [BV1R1421v739](https://www.bilibili.com/video/BV1R1421v739)，仅用于参考，不把 EVA 动画画面剪入我们的宣传片 |

历史短源 [decisive-battle.m4a](<../material/bgm/decisive-battle.m4a>) 与 B站演奏版候选仅供追溯，不用于成片。v6 起使用用户上传的 [原曲 MP3](<../public/decisive-battle-original.mp3>)，144.979592 秒，从头连续播放、不回接、不循环、不变速；见 [原曲记录](<../material/bgm/user-source.md>)。后接 [次回予告](<../public/next-episode.m4a>) 30 秒片尾。公开发行许可仍未核实，技术检查不等于带声音完整审片。

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

**下表脚本只作过程留档，不是新机器上的可重跑流水线。** 它们包含办公室绝对路径、旧浏览器任务 ID，部分是失败尝试；不要直接运行。上方“当前可运行工具”不在此限制内。

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
- 素材文件已保存不代表获得公开发行或商业使用授权；发布前按 [交接文档](<../HANDOFF.md#素材与署名>)复核。
