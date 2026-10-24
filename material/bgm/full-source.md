# DECISIVE BATTLE 完整音源来源

- 交付音源：[bgm-full.m4a](../../public/bgm-full.m4a)
- 来源平台：哔哩哔哩
- 真实标题：`【EVA】E-1 Decisive Battle`
- BV：`BV1TN411d7GT`
- 来源链接：<https://www.bilibili.com/video/BV1TN411d7GT>
- 上传者：`Volkskunstler`，UID `396526247`
- 采集日期：`2026-10-24`（Asia/Shanghai）
- 核实方式：agent-reach doctor 的 B站 `active_backend=bili-cli`；经 `bili search "DECISIVE BATTLE EVA" --type video -n 12` 找到，再以 `bili video BV1TN411d7GT` 核实标题、作者与页面时长 `145` 秒。
- 下载方式：`bili audio BV1TN411d7GT --no-split`，临时输出位于系统 Temp；以 `ops_copy` 原样复制到新音源，无转码、裁剪、补长、拼接或回接循环。

## 本地文件验证

| 项目 | 实测结果 |
| --- | --- |
| ffprobe 容器时长 | `144.490333` 秒（`02:24.490333`） |
| 音轨时长 | `144.490333` 秒 |
| 音轨数量 | `1`，无视频轨 |
| 编码 | AAC LC（来源平台有损音轨，不宣称无损） |
| 采样率 / 声道 | `48000` Hz / 双声道 stereo |
| 起始时间 | `0.000000` 秒 |
| 音轨比特率 | `66631` bit/s |
| 文件大小 | `1217033` 字节 |
| SHA-256 | `7c107a72d98d8c31d929a0acf253922d34f0145a218f463261bdda809fe56d62` |
| FFmpeg 完整解码 | `-xerror` 全段解码至 null，退出码 `0`，无错误输出；临时下载与最终文件均通过 |

可从项目根目录复查：

```bash
ffprobe -v error -show_entries format=duration,size:stream=index,codec_type,codec_name,sample_rate,channels,start_time,duration -of json public/bgm-full.m4a
ffmpeg -hide_banner -nostdin -v error -xerror -i public/bgm-full.m4a -map 0:a:0 -f null -
sha256sum public/bgm-full.m4a
```

## 旧音源与使用边界

原参考 <https://www.bilibili.com/video/BV1R1421v739> 的标题为 `“使徒、袭来！:《EVAの进行曲》！”`，上传者 `非常の肥肠`，页面时长 `111` 秒；它不是本次完整音源。

旧 [bgm.m4a](../../public/bgm.m4a) 与 [decisive-battle.m4a](./decisive-battle.m4a) 保持不变：实测均为 `110.363968` 秒，SHA-256 均为 `73dadf51c1f51bd6f923675363d525e3c821516f15cb1383f3c36a93badd5e32`。

新音源保留来源的完整连续音轨，从 `0` 秒开始使用；未制作或采用 `1:10` 回接循环。本次只新增音源与来源记录，没有修改宣传片代码、脚本或导出。

用户已说明授权用于本地 Remotion 宣传片。本记录仅用于来源与完整性追溯，不证明上传者拥有版权，不作免版权、公共领域或可自由传播的声称；公开传播与商用仍须遵守实际授权范围。
