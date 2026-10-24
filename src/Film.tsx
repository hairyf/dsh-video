import type { CSSProperties, FC, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Html5Audio,
  Img,
  Loop,
  OffthreadVideo,
  Sequence,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { ShellNavbar, SimulatedClip } from "./Simulation";
import { cameraAt, DEMO_BODY, DEMO_HEIGHT, DEMO_NAV, DEMO_WIDTH, REVISE, soundCues } from "./demo-timeline";
import type { DemoName } from "./demo-timeline";
import contributors from "../public/credits/contributors.json";
import updates from "../public/credits/updates-v0.25.0.json";

// 发布内容以核实过的版本快照为准；界面为脚本化演示。
const VERSION = updates.version;
const RED = "#e60012";
const HUB = "#ffa31a";
// 正文亮色主题，延续第一期蓝紫色。
const INK = "#1b1747";
const ACCENT = "#5b4cf0";
const MUTED = "#5d5a86";
const SERIF = "NotoSerifSC";
const SANS = "NotoSansSC";
// 桌面端 light 主题 token（deepseek-harness-desktop src/styles/main.css）。
const DESK = {
  font: `"Segoe UI", "Microsoft YaHei", ${SANS}, sans-serif`,
  panel: "#f9fafb",
  canvas: "#ffffff",
  ink: "#0f1115",
  line: "rgba(0, 0, 0, 0.1)",
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pop = Easing.out(Easing.back(1.6));

// 第一期实测：静止镜头仍有 2–4px 的缓慢漂移。所有窗口/元素按种子错开相位，持续轻微拂动。
const drift = (frame: number, seed: string, amp = 1) => {
  const p = random(seed) * Math.PI * 2;
  return {
    x: Math.sin(frame / 53 + p) * 5 * amp,
    y: Math.sin(frame / 41 + p * 1.7) * 7 * amp,
    r: Math.sin(frame / 67 + p * 0.6) * 0.35 * amp,
  };
};

const MAIN_FRAMES = 4350;
const CREDITS = { from: MAIN_FRAMES, duration: 900, page: 150, roles: 450, people: 630, fade: 870 };
export const FILM_FRAMES = MAIN_FRAMES + CREDITS.duration;
// 仅过滤片尾展示，保留 API 原始快照；web-flow 是合并操作账号。
const CREDIT_PEOPLE = contributors.contributors.filter(c => c.type !== "Bot" && c.login !== "web-flow");
const CREDIT_ANONYMOUS = contributors.anonymous.filter(c => c.name !== "dsh-bot");
const creditRippleMask = (frame: number) => {
  const offset = (frame % 480) * 1000 / 480;
  return `repeating-radial-gradient(ellipse at 64% 30%, rgba(0,0,0,.04) ${offset - 1000}px, rgba(0,0,0,.75) ${offset - 500}px, rgba(0,0,0,.04) ${offset}px)`;
};

// ponytail: 卡点来自 .temp/beats2.mjs / beats-full.mjs 的低频起音检测（30fps 帧号），换音乐或改剪辑点时重跑脚本再改这里。
const B = {
  dsh: 8, tauri: 25, ver: 44,
  added: 79, preset: 103, plugin: 122,
  office: 140, suite: 157, kinds: 176,
  create: 200, preview: 209, mark: 218, edit: 227,
  ops: 235, opsDesc: 248, opsGain: 260,
  newPet: 313, petName: 332,
  open: 350,
  pet: 368, line1: 380, line2: 409, move: 445,
  install: 475, montage: [691, 751, 804, 846, 882], focus: 930, end: 1015,
};
export const OPENING_FRAMES = B.end;

const fontHandle = delayRender("Loading CJK fonts");
Promise.all(
  [
    [SERIF, "NotoSerifSC-VF.ttf"],
    [SANS, "NotoSansSC-VF.ttf"],
  ].map(([family, file]) =>
    new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, { weight: "100 900" }).load(),
  ),
)
  .then((faces) => {
    faces.forEach((face) => document.fonts.add(face));
    continueRender(fontHandle);
  })
  .catch((err) => cancelRender(err));

// ───────────── 片头黑屏文字 ─────────────

// 文字卡：每张只用底色字 + 一种强调色，片段之间硬切。
const Card: FC<{ from: number; to: number; invert?: boolean; children: ReactNode }> = ({ from, to, invert, children }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  return (
    <AbsoluteFill style={{ background: invert ? "#fff" : "#000", color: invert ? "#000" : "#fff" }}>{children}</AbsoluteFill>
  );
};

// 在重拍帧出现的文字块：无淡入，只有 5 帧的冲击回弹。出现前占位隐藏，避免同行文字跳位。
const Hit: FC<{ at: number; style: CSSProperties; children: ReactNode }> = ({ at, style, children }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        fontFamily: SERIF,
        fontWeight: 900,
        lineHeight: 1,
        whiteSpace: "nowrap",
        ...style,
        visibility: frame < at ? "hidden" : "visible",
        scale: interpolate(frame, [at, at + 5], [1.18, 1], { ...clamp, easing: Easing.out(Easing.cubic) }),
      }}
    >
      {children}
    </div>
  );
};

const vertical: CSSProperties = { writingMode: "vertical-rl", letterSpacing: "0.05em" };
const red: CSSProperties = { color: RED };
const inline: CSSProperties = { position: "relative" };

const Typography: FC = () => (
  <>
    <Card from={0} to={B.added}>
      <Hit at={B.dsh} style={{ left: 180, top: 170, fontSize: 340 }}>DSH</Hit>
      <Hit at={B.tauri} style={{ left: 360, top: 520, fontSize: 340 }}>TAURI</Hit>
      <Hit at={B.ver} style={{ left: 1180, top: 250, fontSize: 130, fontFamily: SANS, ...red }}>{VERSION}</Hit>
    </Card>
    <Card from={B.added} to={B.office} invert>
      <Hit at={B.added} style={{ left: 240, top: 140, fontSize: 220, ...vertical }}>新增</Hit>
      <Hit at={B.preset} style={{ left: 620, top: 140, fontSize: 110, fontFamily: SANS }}>2 个</Hit>
      <Hit at={B.preset} style={{ left: 600, top: 300, fontSize: 280 }}>预设</Hit>
      <Hit at={B.plugin} style={{ left: 1040, top: 560, fontSize: 280, ...red }}>插件</Hit>
    </Card>
    <Card from={B.office} to={B.create}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
          <Hit at={B.office} style={{ ...inline, fontSize: 90, fontFamily: SANS }}>DSH</Hit>
          <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <Hit at={B.office} style={{ ...inline, fontSize: 170 }}>Office Kit</Hit>
            <Hit
              at={B.suite}
              style={{
                ...inline,
                fontSize: 150,
                fontFamily: SANS,
                color: "#000",
                background: HUB,
                padding: "12px 28px 20px",
                borderRadius: 8,
              }}
            >
              办公套件
            </Hit>
          </div>
          <Hit at={B.kinds} style={{ ...inline, fontSize: 52, fontFamily: SANS }}>文档 · PDF · 演示文稿 · 表格</Hit>
        </div>
      </AbsoluteFill>
    </Card>
    <Card from={B.create} to={B.ops}>
      <Hit at={B.create} style={{ left: 220, top: 110, fontSize: 300 }}>创建</Hit>
      <Hit at={B.preview} style={{ left: 1100, top: 170, fontSize: 220 }}>预览</Hit>
      <Hit at={B.mark} style={{ left: 300, top: 560, fontSize: 300, ...red }}>标注</Hit>
      <Hit at={B.edit} style={{ left: 1180, top: 620, fontSize: 220 }}>修改</Hit>
    </Card>
    <Card from={B.ops} to={B.newPet}>
      <Hit at={B.ops} style={{ left: 200, top: 170, fontSize: 280 }}>DSH Ops</Hit>
      <Hit at={B.opsDesc} style={{ left: 220, top: 510, fontSize: 90, fontFamily: SANS }}>底层操作工具插件</Hit>
      <Hit at={B.opsGain} style={{ left: 220, top: 675, fontSize: 160, ...red }}>省 Token · 省时间</Hit>
      <Hit at={B.opsDesc} style={{ left: 220, top: 900, fontSize: 52, fontFamily: SANS }}>安装页名称：DSH Optimize</Hit>
    </Card>
    <Card from={B.newPet} to={B.open + 16}>
      <Hit at={B.newPet} style={{ left: 170, top: 150, fontSize: 300 }}>新宠物</Hit>
      <Hit at={B.petName} style={{ left: 190, top: 560, fontSize: 76, fontFamily: SANS, ...red }}>Maid DeepSeek Sticker</Hit>
      <Hit at={B.petName} style={{ left: 190, top: 690, fontSize: 52, fontFamily: SANS }}>157 个贴纸动作</Hit>
      <Hit at={B.newPet} style={{ left: 1140, top: 230, width: 680, height: 680 }}>
        <Img src={staticFile("pet/still.png")} style={{ width: "100%", height: "100%" }} />
      </Hit>
    </Card>
  </>
);

// 转场：黑屏中央打开一扇亮色窗口，撑满画面后露出正文，呼应“新窗口预览”。
const OpenWindow: FC<{ children: ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  if (frame < B.open) return null;
  const t = interpolate(frame, [B.open, B.open + 16], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const insetX = 50 * (1 - t);
  const insetY = 50 * (1 - t) ** 1.6;
  return (
    <AbsoluteFill style={{ clipPath: `inset(${insetY}% ${insetX}% round ${24 * (1 - t)}px)` }}>{children}</AbsoluteFill>
  );
};

// ───────────── 正文分段 ─────────────

type Chrome = "main" | "full" | "none";
// 一个功能 = 一段完整录屏（clip）。步骤只是这段录屏里的时间点：src 是该步骤在录屏里的起始秒数，
// speed 只改变这一段的播放速度。窗口里始终是同一段视频，不在窗口内部换画面、做动画。
type Step = {
  at: number;
  name: string;
  pet: string;
  speed?: number;
  src?: number;
};
type Section = {
  id: string;
  tag: string;
  title: string;
  sub: string;
  line: string;
  from: number;
  to: number;
  clip: DemoName;
  label: string;
  chrome?: Chrome;
  steps: Step[];
};

// 四类成果围绕同一个虚构项目；连续模拟原片与成片共用帧时钟，speed 只压缩播放时间。
const SECTIONS: Section[] = [
  {
    id: "doc", tag: "01 · documents", title: "项目策划书", sub: "从一句需求开始：输入 / 选择 documents", line: "先来一份项目策划书。",
    from: B.end, to: 1482, clip: "doc", label: "项目策划书完整流程：/ → documents → 填需求提交 → 执行 → 打开策划书",
    steps: [
      { at: B.end + 30, name: "写需求", pet: "typing" },
      { at: 1237, name: "执行", pet: "work", speed: 3 },
      { at: 1332, name: "成果", pet: "like" },
    ],
  },
  {
    id: "pdf", tag: "02 · pdf", title: "对外资料", sub: "同一个新品项目，导出对外 PDF", line: "再导出对外 PDF 资料。",
    from: 1482, to: 1842, clip: "pdf", label: "对外资料完整流程：/ → pdf → 填需求提交 → 执行 → PDF 预览",
    steps: [
      { at: 1512, name: "写需求", pet: "typing" },
      { at: 1662, name: "执行", pet: "work", speed: 3 },
      { at: 1722, name: "成果", pet: "nod" },
    ],
  },
  {
    id: "ppt", tag: "03 · presentations", title: "演示文稿", sub: "发布会要用的演示文稿", line: "发布会演示文稿，也交给它。",
    from: 1842, to: 2269, clip: "ppt", label: "演示文稿完整流程：/ → presentations → 填需求提交 → 执行 → 翻页预览",
    steps: [
      { at: 1872, name: "写需求", pet: "typing" },
      { at: 2007, name: "执行", pet: "work", speed: 3 },
      { at: 2059, name: "成果", pet: "like", speed: 2 },
    ],
  },
  {
    id: "xlsx", tag: "04 · spreadsheets", title: "预算与进度表", sub: "预算汇总 · 公式 · 进度", line: "预算和进度，一张表搞定。",
    from: 2269, to: 2611, clip: "xlsx", label: "预算与进度表完整流程：/ → spreadsheets → 填需求提交 → 执行 → 打开表格",
    steps: [
      { at: 2299, name: "写需求", pet: "typing" },
      { at: 2443, name: "执行", pet: "work", speed: 3 },
      { at: 2491, name: "成果", pet: "nod" },
    ],
  },
  {
    id: "revise", tag: "05 · 标注修改", title: "标注修改", sub: "回到第一份策划书，直接标出要改的地方", line: "哪里不对，直接标注。",
    from: 2611, to: 3331, clip: "revise", label: "标注修改完整流程：段落吸附 → 长按框选 → 暂存区直接发送 → 执行 → 打开新版",
    steps: [
      { at: 2641, name: "段落 · 区域标注", pet: "notes" },
      { at: 3127, name: "暂存区直接发送", pet: "work", speed: 3 },
      { at: 3181, name: "查看新版风格", pet: "nod" },
    ],
  },
  {
    id: "fullwindow", tag: "核心功能 · dsh-tauri", title: "新窗口全屏", sub: "保留原窗口 → 新窗叠加预览", line: "保留原窗口，新窗看得更清楚。",
    from: 3481, to: 3727, clip: "fullwindow", chrome: "none",
    label: "模拟演示：打开独立预览窗口叠加展示 → 原窗口侧栏收起，聊天铺满",
    steps: [
      { at: 3511, name: "点击按钮", pet: "notes" },
      { at: 3607, name: "新窗预览", pet: "like" },
    ],
  },
  {
    id: "ops", tag: "新增预设 · dsh-ops", title: "DSH Ops", sub: "底层操作工具：减少 Token 与任务耗时", line: "少折腾，把时间留给结果。",
    from: 3727, to: 3973, clip: "ops", label: "模拟演示：批量读取项目文件并整理交付清单",
    steps: [
      { at: 3757, name: "批量读取", pet: "work" },
      { at: 3853, name: "整理交付", pet: "like" },
    ],
  },
];

const FPS = 30;
// ponytail: 未填 src 时按“上一步在片中的时长 × 倍速”推算录屏里的位置，录完后把每步实际起点秒数填进 src 即可对准。
const srcTimes = (s: Section) =>
  s.steps.reduce<number[]>((acc, st, k) => {
    if (k === 0) return [st.src ?? 0];
    const prev = s.steps[k - 1];
    return [...acc, st.src ?? acc[k - 1] + ((st.at - prev.at) * (prev.speed ?? 1)) / FPS];
  }, []);
const sectionOf = (id: string) => SECTIONS.find((s) => s.id === id) as Section;
// 某功能录屏里“成果”那一步的位置：片头蒙太奇、前后对照、结尾拼贴都从这里开始播同一段录屏。
const resultOf = (id: string) => {
  const s = sectionOf(id);
  const src = srcTimes(s);
  return { name: s.clip, label: s.label, src: src[src.length - 1], chrome: s.chrome ?? "main" };
};

const COMPARE = { from: 3331, to: 3481 };
// 把成果停留时间让给原速输入、安装和转场；原曲仍连续播放至 145 秒。
const ENDING = { from: 3973, logo: 4080, sub: 4092, link: 4113, credit: 4147, fade: 4310 };

// 连续模拟片段：只改变源时间，界面与后期光标保持同步；原片导出关闭光标。
const Clip: FC<{ name: DemoName; from: number; to?: number; label: string; speed?: number; src?: number; pointer?: boolean }> = ({ name, from, to, label, speed, src, pointer = true }) => (
  <Sequence from={from} durationInFrames={to === undefined ? undefined : to - from} layout="none" name={label}>
    <SimulatedClip name={name} src={src} speed={speed} chrome={name === "fullwindow"} pointer={pointer} />
  </Sequence>
);

// 导航栏与内容按桌面端 1400×900 / 44px 的同一比例缩放。
const navHeight = (w: number) => Math.round(w * DEMO_NAV / DEMO_WIDTH);
const FOCUS = { x: 620, y: 150, w: 1240 };

type Box = { x: number; y: number; w: number };

// chrome="none" 用于真实桌面整屏录屏（自带原生窗口），不再叠复刻导航栏。
// 入场：从下方弹起 + 0.9→1 回弹（参考片标题/窗口入场约 0.3–0.6 秒、带过冲）；停留时持续轻微拂动。
const Window: FC<{
  at: number;
  box: Box;
  chrome: Chrome;
  z?: number;
  exitAt?: number;
  focusAt?: number;
  slide?: boolean;
  rotate?: number;
  seed?: string;
  zoom?: number;
  panX?: number;
  panY?: number;
  origin?: string;
  children: ReactNode;
}> = ({ at, box, chrome, z = 1, exitAt, focusAt, slide = true, rotate = 0, seed = "w", zoom = 1, panX = 0, panY = 0, origin = "60% 50%", children }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const enter = slide ? interpolate(frame, [at, at + 24], [0, 1], { ...clamp, easing: pop }) : 1;
  const fadeIn = slide ? interpolate(frame, [at, at + 12], [0, 1], clamp) : 1;
  const out =
    exitAt === undefined ? 0 : interpolate(frame, [exitAt, exitAt + 24], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const grow =
    focusAt === undefined ? 0 : interpolate(frame, [focusAt, focusAt + 42], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const w = box.w + (FOCUS.w - box.w) * grow;
  const nav = chrome === "none" ? 0 : navHeight(w);
  const body = w * (chrome === "none" ? DEMO_HEIGHT : DEMO_BODY) / DEMO_WIDTH;
  const d = drift(frame, seed);
  return (
    <div
      className="film-window"
      style={{
        position: "absolute",
        left: box.x + (FOCUS.x - box.x) * grow,
        top: box.y + (FOCUS.y - box.y) * grow,
        width: w,
        height: nav + body,
        zIndex: grow > 0 ? 10 : z,
        opacity: fadeIn * (1 - out),
        translate: `${d.x + out * 900}px ${d.y + (1 - enter) * 120}px`,
        scale: String(0.9 + 0.1 * enter),
        rotate: `${rotate + d.r + (1 - enter) * 3}deg`,
        borderRadius: chrome === "none" ? 0 : 10,
        overflow: "hidden",
        background: chrome === "none" ? "transparent" : DESK.canvas,
        border: chrome === "none" ? "none" : `1px solid ${DESK.line}`,
        outline: "none",
        boxShadow: chrome === "none" ? "none" : "0 24px 60px rgba(15,23,42,.18)",
      }}
    >
      {/* 导航、内容与光标一起推近，但始终裁切在固定窗口矩形内。 */}
      <div className="film-window-camera" style={{ width: "100%", height: "100%", transformOrigin: origin, translate: `${panX}px ${panY}px`, scale: String(zoom) }}>
        {chrome === "none" ? null : <ShellNavbar h={nav} w={w} fullSidebar={chrome === "full"} />}
        <div style={{ position: "relative", height: body, fontSize: w / 30, overflow: "hidden" }}>{children}</div>
      </div>
    </div>
  );
};

// 片头复用各功能界面；标注停在两条批注与待修改内容可见的状态。
const RESULTS = ["doc", "pdf", "ppt", "xlsx", "revise"].map(resultOf);

const OpeningWindows: FC = () => {
  const frame = useCurrentFrame();
  if (frame >= B.end) return null;
  return (
    <>
      <Window at={B.install} box={{ x: 700, y: 200, w: 1100 }} exitAt={B.montage[0] - 6} chrome="main">
        <Clip name="install" from={B.install} label="配置 → 插件 → 打开预设：勾选 Office Kit 与 DSH Optimize 并安装" />
      </Window>
      {RESULTS.map((r, i) => (
        <Window
          key={r.name}
          seed={r.name}
          at={B.montage[i]}
          box={{ x: 660 + i * 90, y: 110 + i * 75, w: 840 }}
          z={i + 2}
          focusAt={i === 0 ? B.focus : undefined}
          exitAt={i === 0 ? undefined : B.focus + (4 - i) * 3}
          chrome="main"
        >
          {r.name === "revise" || (i === 0 && frame >= B.focus) ? <div className="opening-annotation-overview" style={{ height: "100%" }}><SimulatedClip name="revise" src={REVISE.summary / FPS} speed={0} pointer={false} /></div> : <Clip name={r.name} from={B.montage[i]} src={r.src + 0.8} label={r.label} pointer={false} />}
        </Window>
      ))}
    </>
  );
};

// 片头正文的左侧标题：每段替换上一段。
const OpeningCaptions: FC = () => {
  const frame = useCurrentFrame();
  if (frame >= B.end) return null;
  const items = [
    { at: B.install, title: "勾选 · 安装", sub: "DSH Office Kit + DSH Optimize" },
    { at: B.montage[0], title: "一句需求", sub: "到可以交付的办公文件" },
    { at: B.focus, title: "标注修改", sub: "段落吸附 · 区域框选 · 直接发送" },
  ];
  const current = [...items].reverse().find((item) => frame >= item.at);
  if (!current) return null;
  return (
    <div style={{ position: "absolute", left: 70, top: 250, width: 520 }}>
      <Hit at={current.at} style={{ ...inline, fontSize: 84, color: INK }}>{current.title}</Hit>
      <div style={{ width: 90, height: 8, marginTop: 30, background: ACCENT, borderRadius: 4 }} />
      <div style={{ marginTop: 22, fontFamily: SANS, fontSize: 30, fontWeight: 500, color: MUTED }}>{current.sub}</div>
    </div>
  );
};

// 正文左侧：段落标签 + 标题 + 步骤清单逐行错开滑入（参考片的文字都是分批进场，不整块出现），当前步骤高亮。
const SectionCaption: FC<{ s: Section; active: number }> = ({ s, active }) => {
  const frame = useCurrentFrame();
  const rise = (delay: number): CSSProperties => {
    const t = interpolate(frame, [s.from + delay, s.from + delay + 18], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
    return { opacity: t, translate: `${(1 - t) * -40}px 0` };
  };
  const bar = interpolate(frame, [s.from + 6, s.from + 20], [0, 90], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div className="film-section-caption" style={{ position: "absolute", left: 70, top: 190, width: 430, fontFamily: SANS }}>
      <div style={{ fontSize: 26, fontWeight: 700, color: ACCENT, letterSpacing: "0.08em", ...rise(0) }}>{s.tag}</div>
      <Hit at={s.from + 3} style={{ ...inline, marginTop: 18, fontSize: s.title.length > 5 ? 72 : 84, color: INK }}>{s.title}</Hit>
      <div style={{ width: bar, height: 8, marginTop: 30, background: ACCENT, borderRadius: 4 }} />
      <div style={{ marginTop: 22, fontSize: 30, fontWeight: 500, color: MUTED, lineHeight: 1.4, ...rise(10) }}>{s.sub}</div>
      <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 18 }}>
        {s.steps.map((st, k) => {
          const on = k === active;
          // 当前步骤切换时圆点弹一下，提示“进入下一步”。
          const bump = on ? interpolate(frame, [st.at, st.at + 5, st.at + 12], [1, 1.25, 1], clamp) : 1;
          return (
            <div
              key={st.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontSize: 32,
                fontWeight: on ? 800 : 500,
                color: on ? INK : "#a8a6c8",
                ...rise(16 + k * 5),
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  scale: String(bump),
                  color: on ? "#fff" : "#a8a6c8",
                  background: on ? ACCENT : "transparent",
                  border: `2px solid ${on ? ACCENT : "#cfcde6"}`,
                }}
              >
                {k + 1}
              </span>
              {st.name}
              {on && st.speed ? <span style={{ fontSize: 26, color: ACCENT }}>×{st.speed}</span> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 一个功能 = 一扇窗口 + 一段连续录屏。按步骤分段播放同一个文件（只是各段起点和倍速不同），
// 画面连续，推近只发生在右侧固定矩形内部；左侧说明不随镜头隐藏。
const SectionScene: FC<{ s: Section; first?: boolean }> = ({ s, first }) => {
  const frame = useCurrentFrame();
  if (frame < s.from || frame >= s.to) return null;
  const i = Math.max(0, s.steps.filter(st => frame >= st.at).length - 1);
  const step = s.steps[i];
  const src = srcTimes(s);
  const speed = step.speed ?? 1;
  const camera = cameraAt(s.clip, src[i] * FPS + (frame - step.at) * speed, speed);
  return (
    <>
      <Window at={s.from} box={FOCUS} slide={!first} chrome={s.chrome ?? "main"} seed={s.tag} zoom={camera.zoom} panX={camera.x * FOCUS.w} panY={camera.y * FOCUS.w} origin="0 0">
        <Sequence from={s.from} durationInFrames={s.steps[0].at - s.from} layout="none"><SimulatedClip name={s.clip} speed={0} chrome={s.clip === "fullwindow"} pointer={false} /></Sequence>
        {s.steps.map((st, k) => (
          <Sequence key={st.name} from={st.at} durationInFrames={(s.steps[k + 1]?.at ?? s.to) - st.at} layout="none">
            <Clip name={s.clip} from={0} src={src[k]} speed={st.speed} label={s.label} />
          </Sequence>
        ))}
      </Window>
      <SectionCaption s={s} active={i} />
    </>
  );
};

// 1.6 秒过场，中间完整覆盖并停留 0.4 秒；下一段操作等窗口落稳后再开始。
const WIPE_LEN = 48;
const SectionWipe: FC<{ at: number; label: string }> = ({ at, label }) => {
  const frame = useCurrentFrame();
  if (frame < at - WIPE_LEN / 2 || frame > at + WIPE_LEN / 2) return null;
  const x = interpolate(frame, [at - WIPE_LEN / 2, at - 6, at + 6, at + WIPE_LEN / 2], [-140, -12.5, -12.5, 115], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ zIndex: 40, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: -200,
          bottom: -200,
          left: `${x}%`,
          width: "125%",
          rotate: "12deg",
          background: `linear-gradient(90deg, #8f84ff 0%, ${ACCENT} 18%, ${ACCENT} 82%, #8f84ff 100%)`,
          boxShadow: "0 0 80px rgba(91,76,240,.45)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${x + 56}%`,
          top: "42%",
          fontFamily: SERIF,
          fontWeight: 900,
          fontSize: 120,
          color: "#fff",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </AbsoluteFill>
  );
};

// 背景轻量元素：缓慢漂浮的圆角卡片、圆点与“文件”小图标，透明度很低，只给画面一点呼吸感。
const FLOATERS = Array.from({ length: 16 }, (_, i) => ({
  x: random(`fx${i}`) * 1920,
  y: random(`fy${i}`) * 1080,
  size: 14 + random(`fs${i}`) * 46,
  kind: ["dot", "ring", "doc", "spark"][i % 4],
  speed: 0.15 + random(`fv${i}`) * 0.35,
}));

const Floaters: FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {FLOATERS.map((f, i) => {
        const y = (((f.y - frame * f.speed) % 1180) + 1180) % 1180 - 50;
        const d = drift(frame, `fl${i}`, 2);
        const common: CSSProperties = {
          position: "absolute",
          left: f.x + d.x * 3,
          top: y,
          width: f.size,
          height: f.size,
          rotate: `${frame * f.speed * 0.6 + i * 30}deg`,
          opacity: 0.18 + (i % 3) * 0.06,
        };
        if (f.kind === "dot") return <div key={i} style={{ ...common, borderRadius: "50%", background: ACCENT }} />;
        if (f.kind === "ring") return <div key={i} style={{ ...common, borderRadius: "50%", border: `4px solid ${ACCENT}` }} />;
        if (f.kind === "doc")
          return (
            <div key={i} style={{ ...common, height: f.size * 1.25, borderRadius: 6, background: "#fff", border: `3px solid ${ACCENT}` }}>
              <div style={{ margin: "22% 18% 0", height: 3, background: ACCENT, borderRadius: 2 }} />
              <div style={{ margin: "14% 18% 0", height: 3, background: ACCENT, borderRadius: 2, width: "40%" }} />
            </div>
          );
        return (
          <svg key={i} viewBox="0 0 20 20" style={common}>
            <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill={ACCENT} />
          </svg>
        );
      })}
    </AbsoluteFill>
  );
};

// 标注修改的同位置前后对照：旧策划书（documents 录屏的成果段）和新版（标注修改录屏的成果段）两扇窗口并排，
// 成果与整个标注流程均保持正常尺寸。
const CompareScene: FC = () => {
  const frame = useCurrentFrame();
  if (frame < COMPARE.from || frame >= COMPARE.to) return null;
  const sides = [
    { key: "before", tag: "修改前", x: 90, at: COMPARE.from, clip: resultOf("doc") },
    { key: "after", tag: "修改后", x: 1010, at: COMPARE.from + 12, clip: resultOf("revise") },
  ];
  return (
    <>
      <Hit at={COMPARE.from} style={{ left: 0, right: 0, top: 96, textAlign: "center", fontSize: 72, color: INK }}>
        同一位置 · 前后对照
      </Hit>
      {sides.map((sd) => (
        <div key={sd.key}>
          <Hit
            at={sd.at}
            style={{
              left: sd.x,
              top: 198,
              padding: "8px 20px",
              borderRadius: 999,
              fontFamily: SANS,
              fontSize: 30,
              fontWeight: 700,
              color: sd.key === "after" ? "#fff" : INK,
              background: sd.key === "after" ? ACCENT : "#fff",
            }}
          >
            {sd.tag}
          </Hit>
          <Window at={sd.at} box={{ x: sd.x, y: 260, w: 820 }} chrome="main" seed={sd.key}>
            <Clip name={sd.clip.name} from={COMPARE.from} to={COMPARE.to} src={sd.clip.src + 0.8} label={sd.clip.label} pointer={false} />
          </Window>
        </div>
      ))}
    </>
  );
};

// 结尾：五份成果从四周弹入铺成背景并持续漂浮，随后缓慢后退变淡，落版逐行出现，最后画面与音乐一起淡出。
const COLLAGE = [
  { id: "doc", x: 70, y: 70, r: -5 },
  { id: "pdf", x: 690, y: 40, r: 2 },
  { id: "ppt", x: 1300, y: 90, r: 4 },
  { id: "xlsx", x: 1290, y: 640, r: -3 },
  { id: "revise", x: 560, y: 690, r: 3 },
].map((c) => ({ ...c, clip: resultOf(c.id) }));

const EndingScene: FC = () => {
  const frame = useCurrentFrame();
  if (frame < ENDING.from) return null;
  // 落版出现后，背景拼贴整体后退、变淡，让位给标题。
  const recede = interpolate(frame, [ENDING.logo - 10, ENDING.logo + 30], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const card = interpolate(frame, [ENDING.logo, ENDING.logo + 16], [0, 1], { ...clamp, easing: pop });
  const line = (at: number): CSSProperties => {
    const t = interpolate(frame, [at, at + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
    return { opacity: t, translate: `0 ${(1 - t) * 24}px` };
  };
  return (
    <>
      <AbsoluteFill
        style={{
          scale: String(1 - 0.08 * recede),
          opacity: 1 - 0.45 * recede,
          filter: `blur(${recede * 3}px)`,
        }}
      >
        {COLLAGE.map((c, i) => (
          <Window
            key={c.id}
            seed={`end-${c.id}`}
            at={ENDING.from + i * 10}
            box={{ x: c.x, y: c.y, w: 560 }}
            z={i + 1}
            rotate={c.r}
            chrome="main"
          >
            <Clip name={c.clip.name} from={ENDING.from} src={c.clip.src + 0.8} label={c.clip.label} pointer={false} />
          </Window>
        ))}
      </AbsoluteFill>
      {frame >= ENDING.logo ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", zIndex: 20 }}>
          <div
            style={{
              padding: "56px 84px",
              borderRadius: 32,
              background: "rgba(255,255,255,.96)",
              boxShadow: "0 30px 90px rgba(30,25,90,.25)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 26,
              opacity: card,
              scale: String(0.85 + 0.15 * card),
              translate: `0 ${drift(frame, "logo", 0.6).y}px`,
            }}
          >
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 88, color: INK, whiteSpace: "nowrap" }}>
              DSH Tauri <span style={{ color: ACCENT }}>×</span> DSH Office Kit
            </div>
            <div style={{ fontFamily: SANS, fontSize: 40, fontWeight: 700, color: ACCENT, ...line(ENDING.sub) }}>
              DSH Ops · 新宠物 · {VERSION}
            </div>
            <div style={{ fontFamily: SANS, fontSize: 30, fontWeight: 500, color: MUTED, ...line(ENDING.link) }}>
              github.com/dsh-tauri/deepseek-harness-desktop
            </div>
            <div style={{ fontFamily: SANS, fontSize: 22, fontWeight: 500, color: "#9a98b8", ...line(ENDING.credit) }}>
              界面为脚本化模拟演示 · 非实时模型执行 · 桌宠：Maid DeepSeek Sticker
            </div>
          </div>
        </AbsoluteFill>
      ) : null}
    </>
  );
};

// 正文落版淡到黑，随后另起 30 秒更新与鸣谢，不拉长原来的淡出。
const FadeOut: FC = () => {
  const frame = useCurrentFrame();
  if (frame < ENDING.fade) return null;
  return <AbsoluteFill style={{ zIndex: 60, background: "#000", opacity: interpolate(frame, [ENDING.fade, MAIN_FRAMES - 1], [0, 1], clamp) }} />;
};

// ───────────── Pet ─────────────

// 动作素材时长（帧），来自 ffprobe；循环用。
const PET_LOOP: Record<string, number> = { wave: 70, typing: 87, notes: 79, work: 57, like: 87, nod: 69, celebrate: 40 };
const PET_CUES = [
  { at: B.pet, act: "wave" },
  { at: B.pet + 70, act: "typing" },
  { at: B.montage[0], act: "notes" },
  ...SECTIONS.reduce<{ at: number; act: string }[]>((all, s) => all.concat(s.steps.map((st) => ({ at: st.at, act: st.pet }))), []),
  { at: COMPARE.from, act: "nod" },
  { at: ENDING.from, act: "celebrate" },
].sort((a, b) => a.at - b.at);

type Bubble = { at: number; until: number; side?: boolean; lines: { t: string; at: number }[] };
const BUBBLES: Bubble[] = [
  { at: B.line1, until: B.install + 55, side: true, lines: [{ t: "我是新角色！", at: B.line1 }, { t: "这期由我继续讲解。", at: B.line2 }] },
  // 对照段两扇窗口占满下半屏，不放气泡以免盖住“修改前”。
  ...SECTIONS.map((s) => ({ at: s.from + 10, until: s.to - 2, lines: [{ t: s.line, at: s.from + 10 }] })),
];

const Pet: FC = () => {
  const frame = useCurrentFrame();
  if (frame < B.pet) return null;
  const move = interpolate(frame, [B.move, B.move + 32], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const typed = (text: string, at: number) =>
    text.slice(0, Math.floor(interpolate(frame, [at, at + text.length * 3], [0, text.length], clamp)));
  const bubble = BUBBLES.find((b) => frame >= b.at && frame < b.until);
  // 宠物不只站着播动作：持续轻微上下浮动；每次换动作时小跳一下，像在“接话”。
  const lastCue = [...PET_CUES].reverse().find((c) => frame >= c.at);
  const hop = lastCue ? interpolate(frame, [lastCue.at, lastCue.at + 6, lastCue.at + 14], [0, -26, 0], clamp) : 0;
  const bob = Math.sin(frame / 22) * 6;
  // 宠物整体缩放从 1 收至 0.54；气泡用 1 / s 反向缩放，屏幕上的字号和宽度始终与开头一致。
  const s = (1 - 0.46 * move) * interpolate(frame, [B.pet, B.pet + 8], [0.6, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  return (
    <div
      style={{
        position: "absolute",
        width: 560,
        height: 560,
        left: 0,
        top: 0,
        zIndex: 30,
        transformOrigin: "0 0",
        translate: `${680 + (40 - 680) * move}px ${230 + (770 - 230) * move + bob + hop}px`,
        scale: s,
      }}
    >
      {PET_CUES.map((cue, i) => (
        <Sequence
          key={`${cue.at}-${cue.act}`}
          from={cue.at}
          durationInFrames={(PET_CUES[i + 1]?.at ?? MAIN_FRAMES) - cue.at}
          layout="none"
        >
          <Loop durationInFrames={PET_LOOP[cue.act]} layout="none">
            <OffthreadVideo
              transparent
              muted
              src={staticFile(`pet/${cue.act}.webm`)}
              style={{ position: "absolute", width: 560, height: 560 }}
            />
          </Loop>
        </Sequence>
      ))}
      {bubble ? (
        <div style={{ position: "absolute", left: 470, top: 40, scale: String(1 / s), transformOrigin: "0 0" }}>
          <div
            className="film-pet-bubble"
            style={{
              // 与大宠物开头同一位置、同一字号；正文里收窄宽度，避免压到右侧窗口。
              padding: "22px 30px",
              borderRadius: 28,
              border: "none",
              outline: "none",
              background: "#fff",
              color: INK,
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 46,
              lineHeight: 1.45,
              maxWidth: 460 - 160 * move,
              whiteSpace: "normal",
              boxShadow: "0 18px 50px rgba(15,23,42,.14)",
              opacity: interpolate(frame, [bubble.until - 15, bubble.until], [1, 0], clamp),
            }}
          >
            {bubble.lines.map((l) => (
              <div key={l.t}>{typed(l.t, l.at)}</div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

// ───────────── 合成 ─────────────

const WIPES = [
  { at: SECTIONS[0].from, label: "01 · 文档" },
  { at: SECTIONS[1].from, label: "02 · PDF" },
  { at: SECTIONS[2].from, label: "03 · 演示文稿" },
  { at: SECTIONS[3].from, label: "04 · 电子表格" },
  { at: SECTIONS[4].from, label: "05 · 标注修改" },
  { at: SECTIONS[5].from, label: "06 · 新窗口" },
  { at: SECTIONS[6].from, label: "07 · DSH Ops" },
];

const Main: FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(circle, rgba(91,76,240,.10) 1.5px, transparent 1.6px) 0 0 / 34px 34px, linear-gradient(135deg, #f7f6ff 0%, #e6e3ff 55%, #d9ddff 100%)",
    }}
  >
    <Floaters />
    <OpeningWindows />
    <OpeningCaptions />
    {SECTIONS.map((s, i) => (
      <SectionScene key={s.tag} s={s} first={i === 0} />
    ))}
    <CompareScene />
    <EndingScene />
    <Pet />
    {WIPES.map((w) => (
      <SectionWipe key={w.label} at={w.at} label={w.label} />
    ))}
    <FadeOut />
  </AbsoluteFill>
);

// 用户提供的原曲从头连续播放；只做音量包络，不裁接、不循环、不变速。
const musicVolume = (f: number) =>
  interpolate(f, [B.open, B.pet + 30, B.install, B.install + 18, ENDING.logo - 30, ENDING.logo + 30, ENDING.fade, MAIN_FRAMES - 12], [1, 0.4, 0.4, 0.32, 0.32, 0.4, 0.4, 0], clamp);

const Music: FC = () => {
  const frame = useCurrentFrame();
  return <Html5Audio src={staticFile("decisive-battle-original.mp3")} volume={musicVolume(frame)} />;
};

// 音效按源帧映射到成片帧，独立于画面切段，保留自然音高和跨切点的尾音。
const SFX_CUES = [
  ...soundCues("install").map(cue => ({ ...cue, frame: B.install + cue.frame })).filter(cue => cue.frame < B.montage[0] - 6),
  ...SECTIONS.reduce<ReturnType<typeof soundCues>>((all, s) => {
    const starts = srcTimes(s).map(time => Math.round(time * FPS));
    return all.concat(soundCues(s.clip).map(cue => {
      const i = starts.length - 1 - [...starts].reverse().findIndex(start => cue.frame >= start);
      return { ...cue, frame: s.steps[i].at + Math.round((cue.frame - starts[i]) / (s.steps[i].speed ?? 1)) };
    }).filter(cue => cue.frame < s.to));
  }, []),
  { frame: B.pet, sound: "jump", volume: .7 },
  { frame: B.line2, sound: "squeak", volume: .55 },
  { frame: ENDING.from, sound: "happy", volume: .65 },
];
// 原始合成音很轻；按实测峰值分档放大，保留不同动作的力度，不改源文件。
const SFX_GAIN: Record<string, number> = { tick: 18, pop: 9, select: 10, grab: 8, squeak: 14, poke: 8, jump: 6, land: 5, sparkle: 4, happy: 3 };
const SFX_BOOST = 1.35;
const SoundEffects: FC = () => <>{SFX_CUES.map((cue, i) => <Sequence key={i} from={cue.frame} durationInFrames={30} layout="none" name={`SFX · ${cue.sound}`}><Html5Audio src={staticFile(`sfx/coopanion-${cue.sound}.wav`)} volume={cue.volume * SFX_GAIN[cue.sound] * (cue.frame >= B.install ? SFX_BOOST : 1)} useWebAudioApi /></Sequence>)}</>;

// 3 页更新各 5 秒 → 署名 6 秒 → 贡献者头像 9 秒；机器人仅从展示中排除。
const Credits: FC = () => {
  const frame = useCurrentFrame();
  const page = Math.min(2, Math.floor(frame / CREDITS.page));
  const group = updates.groups[page];
  const people = frame >= CREDITS.people;
  const at = people ? CREDITS.people : frame >= CREDITS.roles ? CREDITS.roles : page * CREDITS.page;
  const enter = interpolate(frame, [at, at + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <AbsoluteFill className="film-credits" style={{ background: "#000", color: "#f4f0e9", fontFamily: SANS }}>
    <AbsoluteFill style={{ background: "#101018", opacity: interpolate(frame, [CREDITS.fade, CREDITS.duration - 1], [1, 0], clamp) }}>
      <AbsoluteFill className="credit-dot-ripples" aria-hidden style={{ pointerEvents: "none", background: "radial-gradient(circle, rgba(218,216,230,.36) 1.1px, transparent 1.5px) 0 0 / 10px 10px", maskImage: creditRippleMask(frame) }} />
      <div style={{ position: "absolute", left: 110, top: 75, fontSize: 24, color: HUB, letterSpacing: "0.2em" }}>DSH TAURI / {VERSION} / {people ? "CONTRIBUTORS" : frame >= CREDITS.roles ? "CREDITS" : "RELEASE NOTES"}</div>
      <div style={{ position: "absolute", inset: 0, opacity: enter, translate: `0 ${(1 - enter) * 24}px` }}>
        {frame < CREDITS.roles ? <>
          <div style={{ position: "absolute", left: 110, top: 135, fontFamily: SERIF, fontWeight: 900, fontSize: 96 }}>还有这些更新</div>
          <div style={{ position: "absolute", left: 118, top: 295, fontSize: 34, color: HUB }}>{`0${page + 1}`} / {group.title}</div>
          <div style={{ position: "absolute", left: 118, top: 390, display: "flex", flexDirection: "column", gap: 34 }}>
            {group.items.map((item, i) => <div key={item.text} className="credit-update" style={{ fontSize: 48, fontWeight: 600, display: "flex", gap: 32, alignItems: "center" }}><span style={{ color: "#898793", fontSize: 26, width: 40 }}>{`0${page * 4 + i + 1}`.slice(-2)}</span>{item.text}</div>)}
          </div>
          <div style={{ position: "absolute", left: 118, top: 950, color: "#96939e", fontSize: 22 }}>v0.25.0 其他更新节选 · 详见官方 Release</div>
        </> : !people ? <>
          <div style={{ position: "absolute", left: 110, top: 135, fontFamily: SERIF, fontWeight: 900, fontSize: 96 }}>这一期，由大家完成</div>
          <div style={{ position: "absolute", left: 118, top: 330, display: "grid", gridTemplateColumns: "250px 1fr", gap: "35px 55px", alignItems: "center" }}>
            {[["视频制作", "AI"], ["产品研发", "Hairy"], ["宠物素材", "赤风RED"], ["共同贡献", "全体 Contributors"]].map(([role, name]) => <div key={role} style={{ display: "contents" }}><span style={{ color: "#96939e", fontSize: 32 }}>{role}</span><strong style={{ fontSize: 52 }}>{name}</strong></div>)}
          </div>
          <div style={{ position: "absolute", left: 118, top: 865, color: "#96939e", fontSize: 22, lineHeight: 1.8 }}>
            <div>宠物素材作者 · Bilibili UID 356746604</div>
            <div>片尾音乐 ·《次回予告》30 秒版 · BV1hV9aBGE5J</div>
            <div>互动音效 · Coopanion / Cortico · Pal AI Lab</div>
          </div>
        </> : <>
          <div style={{ position: "absolute", left: 110, top: 130, fontFamily: SERIF, fontWeight: 900, fontSize: 72 }}>谢谢每一位贡献者</div>
          <div style={{ position: "absolute", left: 118, top: 238, color: "#96939e", fontSize: 23 }}>github.com/dsh-tauri/deepseek-harness-desktop</div>
          <div className="credit-avatars" style={{ position: "absolute", left: 110, top: 300, width: 1340, display: "grid", gridTemplateColumns: "repeat(9, 1fr)", gap: "16px 12px" }}>
            {CREDIT_PEOPLE.map((c, i) => <div key={c.id} className="credit-person" style={{ textAlign: "center", opacity: interpolate(frame, [CREDITS.people + Math.floor(i / 9) * 3, CREDITS.people + Math.floor(i / 9) * 3 + 9], [0, 1], clamp) }}>
              <Img src={staticFile(c.local_file)} alt={c.login} style={{ width: 78, height: 78, borderRadius: 18, objectFit: "cover" }} />
              <div style={{ fontSize: 15, marginTop: 6, whiteSpace: "nowrap" }}>{c.login}</div>
            </div>)}
          </div>
          <div style={{ position: "absolute", left: 118, top: 946, color: "#b5b1bd", fontSize: 21 }}>另谢匿名提交者：{CREDIT_ANONYMOUS.map(c => c.name).join(" · ")}</div>
          <div style={{ position: "absolute", left: 118, top: 995, color: "#777482", fontSize: 18 }}>仓库贡献者快照 · 2026-10-24 · {CREDIT_PEOPLE.length} 个公开账号，{CREDIT_ANONYMOUS.length} 个匿名署名</div>
        </>}
      </div>
      <div style={{ position: "absolute", right: 55, top: people ? 545 : 355, width: people ? 360 : 460, height: people ? 360 : 460 }}>
        <Loop durationInFrames={87} layout="none"><OffthreadVideo transparent muted src={staticFile("pet/helltaker.webm")} style={{ width: "100%", height: "100%" }} /></Loop>
      </div>
      {!people && <div style={{ position: "absolute", right: 130, bottom: 130, fontSize: 23, color: "#96939e" }}>下回见！</div>}
    </AbsoluteFill>
    <Html5Audio src={staticFile("next-episode.m4a")} volume={interpolate(frame, [0, 3, CREDITS.fade, CREDITS.duration - 1], [0, .45, .45, 0], clamp)} />
  </AbsoluteFill>;
};

export const Film: FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Sequence durationInFrames={MAIN_FRAMES} layout="none" name="正文与落版">
      <Typography />
      <OpenWindow><Main /></OpenWindow>
      <Music />
      <SoundEffects />
    </Sequence>
    <Sequence from={CREDITS.from} durationInFrames={CREDITS.duration} layout="none" name="更新与鸣谢 · 30秒"><Credits /></Sequence>
  </AbsoluteFill>
);
