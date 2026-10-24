# DSH v0.25.0 片尾研究来源

抓取日期：2026-10-24（Asia/Shanghai）；GitHub 抓取区间为 03:58:24–03:58:40 UTC（11:58:24–11:58:40 UTC+8）。研究仅读取公开仓库；没有改 src、依赖或浏览器，没有提交、推送、发布。

## 可直接使用

- [Contributors 数据与本地头像清单](<../../public/credits/contributors.json>)：45 个账号，字段为 login、id、avatar_url、html_url、contributions、type、local_file，以及 MIME、尺寸、字节数、SHA-256。
- [三组 12 条更新短文案](<../../public/credits/updates-v0.25.0.json>)：每条附 detail 和 sources；不重复正片已经演示的“右栏新窗全屏”“DSH OPS”。
- [头像目录](<../../public/credits/avatars/>)：45 张 GitHub 公开原头像；不重绘、不以生成头像替代。
- [可重复执行的本地校验](<verify-credits.mjs>)：`node material/credits/verify-credits.mjs --decode`；省略 `--decode` 可仅用 Node 标准库查人数、唯一 ID、尺寸记录、魔数、字节数与 SHA-256。完整解码复用已装 ffmpeg，无新增依赖。

## 版本边界

| 证据 | 结论 | 来源 |
|---|---|---|
| 正式 Release | v0.25.0 发布于 2026-10-22T09:39:56Z；draft=false、prerelease=false，不是仅 main 上未发布的变更 | [Release](<https://github.com/dsh-tauri/deepseek-harness-desktop/releases/tag/v0.25.0>) / [API](<https://api.github.com/repos/dsh-tauri/deepseek-harness-desktop/releases/tags/v0.25.0>) |
| 标签 | v0.25.0 = 915a21f67279ec360d9b0fe4a78d279e7e712964 | [tag ref API](<https://api.github.com/repos/dsh-tauri/deepseek-harness-desktop/git/ref/tags/v0.25.0>) |
| 基线 | v0.24.5 = e73c747b2a0bf3a0739212900c8b890149e442dc | [基线 ref API](<https://api.github.com/repos/dsh-tauri/deepseek-harness-desktop/git/ref/tags/v0.24.5>) |
| 比较 | ahead，39 commits；官方 Release 的 32 条 commit 链接全部属于此区间 | [比较](<https://github.com/dsh-tauri/deepseek-harness-desktop/compare/v0.24.5...v0.25.0>) |
| 排除旧版 | v0.24.5 说明只列 Restore main window hide；不冒充为 0.25.0 新功能 | [v0.24.5](<https://github.com/dsh-tauri/deepseek-harness-desktop/releases/tag/v0.24.5>) |

以下是适合片尾的 12 条精选“其他更新”，不是完整 changelog；平台兼容性结论来自官方 Release/提交，未在此 Windows 主机重测 Linux/iOS/Android 运行时。

## 分组文案及逐项来源

| 组 | 短文案 | 对应变更 | 来源 |
|---|---|---|---|
| 桌面与会话 | 聊天跟随滚动更流畅 | WKWebView 跟随滚动卡顿修复，按滚动容器聚合状态 | [41863d87](<https://github.com/dsh-tauri/deepseek-harness-desktop/commit/41863d87>)、[b595dc4f](<https://github.com/dsh-tauri/deepseek-harness-desktop/commit/b595dc4f>) |
| 桌面与会话 | 子窗口标识更清楚 | 帮助右侧显示“子窗口”Chip | [7ddf7920](<https://github.com/dsh-tauri/deepseek-harness-desktop/commit/7ddf7920>) |
| 桌面与会话 | 多窗口档案互不顶替 | 额外窗口切换不覆盖主窗口的启动档案 | [4f356ddc](<https://github.com/dsh-tauri/deepseek-harness-desktop/commit/4f356ddc>) |
| 桌面与会话 | 归档清理通知与桌宠 | 归档时清理通知与对应 Pet 状态，不是删除桌宠素材 | [e049a59b](<https://github.com/dsh-tauri/deepseek-harness-desktop/commit/e049a59b>) |
| 移动与远程 | Android 平板支持旋转 | 平板可旋转，手机仍保持竖屏 | [0a3236ad](<https://github.com/dsh-tauri/deepseek-harness-desktop/commit/0a3236ad>) |
| 移动与远程 | 扫码页可手填地址 | 原生端扫描页增加手动输入 | [7180e70a](<https://github.com/dsh-tauri/deepseek-harness-desktop/commit/7180e70a>) |
| 移动与远程 | iOS 键盘不再挡输入 | 修复 iOS 输入框被挡、iPad 退格后下沉 | [28097c37](<https://github.com/dsh-tauri/deepseek-harness-desktop/commit/28097c37>)、[573cbfda](<https://github.com/dsh-tauri/deepseek-harness-desktop/commit/573cbfda>) |
| 移动与远程 | 配对页兼容无参链接 | 没有 ?auth= 的链接也能使用配对表单；不代表移除认证 | [e7fbb242](<https://github.com/dsh-tauri/deepseek-harness-desktop/commit/e7fbb242>) |
| 生态与兼容 | 插件改写保留表达式 | 桌面改写配置时保留 !!js | [fa12e97c](<https://github.com/dsh-tauri/deepseek-harness-desktop/commit/fa12e97c>) |
| 生态与兼容 | MCP 编辑保留配置 | 编辑/复制 MCP 服务时保留 !!js 和隐藏字段 | [bbeba1c5](<https://github.com/dsh-tauri/deepseek-harness-desktop/commit/bbeba1c5>) |
| 生态与兼容 | Linux 支持粘贴文件 | 增加文件粘贴，兼容 deepin/DFM 的 CRLF uri-list | [249a6df7](<https://github.com/dsh-tauri/deepseek-harness-desktop/commit/249a6df7>)、[16aaa70a](<https://github.com/dsh-tauri/deepseek-harness-desktop/commit/16aaa70a>) |
| 生态与兼容 | Linux 语音输入修复 | 权限、GStreamer、录音编码修复；PR 记有 Linux 验证记录 | [eef482cc](<https://github.com/dsh-tauri/deepseek-harness-desktop/commit/eef482cc>)、[PR 1171](<https://github.com/dsh-tauri/deepseek-harness-desktop/pull/1171>) |

## Contributors 全量口径

- 官方 API：`gh api 'repos/dsh-tauri/deepseek-harness-desktop/contributors?per_page=100' --paginate --slurp`，1 页 / 45 条；包括 44 条 type=User、1 条 type=Bot（dosubot[bot]），不丢机器人。
- 另查 `anon=1` 并同样 `--paginate --slurp`，1 页 / 50 条：同一组 45 个账号，加 5 条 Anonymous。两者 header 无 Link next；再显式查 page=2，均为 `[]`。两次取数的同贡献次数账号顺序可能不同，按 ID 集合核对完全相等。
- [默认 API](<https://api.github.com/repos/dsh-tauri/deepseek-harness-desktop/contributors?per_page=100>) / [含 anonymous API](<https://api.github.com/repos/dsh-tauri/deepseek-harness-desktop/contributors?per_page=100&anon=1>)。
- API 是整个仓库截至抓取时刻的贡献者快照，不是仅 v0.25.0 的作者；contributions 是 API 的提交计数，不代表自然人数/工作量，也不覆盖未记为该仓库提交的评审、issue、设计等贡献。API 可能有缓存，未来名单可能变化。
- **片尾使用 45 张公开头像 + 5 个匿名提交署名。总记录 50，不写成“50 张头像”或“50 位真人”。** 不将匿名记录强行归并到某个账号，不把提交署名当作已验证法定姓名。
- 5 个 Anonymous 提交署名与次数：chenlong（5）、王治凱（2）、walker（2）、yangling（1）、dsh-bot（1）。API 未提供 login/id/avatar_url/html_url，最终清单明确存 null。公开展示不需要邮件，故未把邮箱复制到 public。
- type=Bot 计数 1，严格按 API type；web-flow 为 API User，dsh-bot 为 API Anonymous，没有凭名字重分类。

### README 交叉检查

读取 [v0.25.0 README Contributors](<https://github.com/dsh-tauri/deepseek-harness-desktop/blob/v0.25.0/README.md#contributors>) 与 [main README](<https://github.com/dsh-tauri/deepseek-harness-desktop#contributors>)；两者原区只引用同一张 [contrib.rocks 动态图片](<https://contrib.rocks/image?repo=dsh-tauri/deepseek-harness-desktop>)，不是固定作者文本列表。实际下载 SVG 解析出 44 个 title，全部命中 44 个 API User；唯一 API 额外头像为 dosubot[bot]。**README 图中没有漏人，API 也未截取“前几名”。** 动态图不应当作 tag 发布当日的历史名单。

### 完整 45 账号（API 顺序）

hairyf、yingtianlan、Menghuan1918、coderstory、SkanderBog、iuuuuuuuu、idealclover、Jstn-1g、WyattJHayes、YunYouJun、zuyan9、Diez111、izumkineno、wylovecat、Fainabi、cloga、KKKenChow、Asheblog、exoticknight、PerryLink、bxwl5、ruanimal、mysteve、miaooo0000OOOO、ccch1mneyyy、grapefruit0205、qoder、Wanming08、X-SCI-TECH、dosubot[bot]、hiuyt、w6242652、vbin-dev、r3fuse、liang-zhenxiang、knightxiaoxi、dunzic、davidxy123、XunYang818、XXXINuo、mvanhorn、KKKKeybird、FairyBand、Bssn520、web-flow。

### 头像校验状态

2026-10-24T04:04:55.887Z 完成 45/45 下载：HTTP 成功、body 非空、Content-Type 为 image/jpeg 或 image/png、ffprobe 解码器识别且宽高 > 0；总计 782,350 字节。请求 s=256，实际边长 100–420 像素（GitHub 原图/identicon 行为），未假称全部 256。最终本地校验脚本另提供逐张完整 ffmpeg 解码。

## 研发署名：事实与确认分开

- 公开候选：[@hairyf](<https://github.com/hairyf>) 的 [公开 API](<https://api.github.com/users/hairyf>) name=Hairy；[README:38](<https://github.com/dsh-tauri/deepseek-harness-desktop/blob/v0.25.0/README.md#L38>) 开发者徽章 alt 为 hairyf；该账号在此次贡献者 API 中贡献次数最多（2104）。
- 仓库正式集体署名是 **deepseek-harness-desktop contributors**，见 [Cargo:5](<https://github.com/dsh-tauri/deepseek-harness-desktop/blob/v0.25.0/src-tauri/Cargo.toml#L5>) 与 [LICENSE:3](<https://github.com/dsh-tauri/deepseek-harness-desktop/blob/v0.25.0/LICENSE#L3>)，因此不宣称 Hairy 是唯一作者。
- 原先待确认的是当前用户与候选署名的关系。主代理随后传达用户明确确认：**产品研发 Hairy；视频制作 AI**。片尾可按此显示；依据是用户确认，而不是 gh 登录账号、Windows 用户名或路径推断。音乐署名由主代理另行核实，不在本研究中补造。

## v8 片尾展示调整（用户审片要求）

- 原始 API 快照及 45 张头像全部保留，以上抓取计数不变；下列规则只作用于片尾展示，不重写 API 类型。
- 不展示 type=Bot 的 dosubot[bot]、合并操作账号 web-flow，以及匿名自动化署名 dsh-bot。
- v8 最终显示 **43 张非机器人公开账号头像 + 4 个匿名署名**；保留原顺序。匿名署名仍不等同于经过身份核验的真人。

## 原始输出（仅 TEMP）

[研究原始目录](<C:/Users/hairy/AppData/Local/Temp/dsh-credits-research-20261024/>) 保存 Release JSON、两个 tag ref、39 commits compare、默认/anon 分页 JSON、header、空 page2、两个 README、README 动态 SVG、公开 profile、包版本、Cargo、LICENSE、PR 1171 与 avatar-validation.jsonl；工作区只保存已核实数据与头像。原始匿名 API 含公开提交邮箱，不复制到 public。

[抓取脚本](<C:/Users/hairy/AppData/Local/Temp/dsh-credits-fetch-20261024.sh>) / [比较与计数校验](<C:/Users/hairy/AppData/Local/Temp/dsh-credits-summarize-20261024.mjs>) / [头像下载校验](<C:/Users/hairy/AppData/Local/Temp/dsh-credits-avatars-20261024.mjs>)。后两者使用 Node 标准库，头像检测复用 ffprobe。

Agent Reach 版本检查：本机 v1.5.0，发现 v1.6.0；本任务未更新。若需要：帮我更新 Agent Reach：https://raw.githubusercontent.com/Panniantong/agent-reach/main/docs/update.md
