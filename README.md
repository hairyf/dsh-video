# DSH Tauri 第二期宣传片

Remotion 工程：以 React 源界面确定性模拟 DSH Tauri v0.25.0 的 Office 套件、标注修改、独立预览与 DSH Ops，输出 3840×2160、30 fps、175 秒（5250 帧）成片。

- 当前状态、分镜、时间轴、验收结果与素材边界见 [交接文档](<HANDOFF.md>)。
- 临时素材、抽帧、历史工具与私密目录边界见 [临时素材索引](<.temp/README.md>)。
- 成片、检查帧、报告与发布文案在 `out/`（被 Git 忽略）；八段模拟原片包见 `out/dsh-simulated-originals-v11.zip`。

## 环境与命令

Node 20.19+／22.13+／24+；依赖版本锁定在 `package-lock.json`，无额外依赖。

```bash
npm ci
npm run dev        # Studio，逻辑画布 1920×1080，端口 3210
npm run lint       # ESLint + tsc
node .temp/check-demo.mjs
node .temp/render-sim.mjs stills Film Demo-doc      # 单帧检查
node .temp/render-sim.mjs film                     # 4K 成片（scale: 2，CRF 14）
node .temp/render-sim.mjs raw                      # 八段 1400×900 原片
node .temp/verify-sim.mjs                          # 解码、原曲连续性、峰值、淡出
node .temp/check-deliverables-v7-4k.mjs v11        # 报告与原片包复核
```

## 真实性边界

界面、工具执行、文件预览均为脚本化模拟，不含实际模型调用、实际 Office 文件生成或实测性能。原片 1400×900 无音轨、不含光标／运镜；影片为帧驱动渲染，无 CSS 动画与随机状态。私密隔离录制目录不打包、不提交。

## 许可

代码未授权分发（`package.json` 中 `UNLICENSED`）。第三方素材的许可与来源见 [交接文档 · 素材与署名](<HANDOFF.md#素材与署名>)：字体 [SIL OFL 1.1](<public/fonts/README.md>)、Office 图标与 Coopanion 音效、贡献者头像；BGM 与宠物公开发行授权未核实。
