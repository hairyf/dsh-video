import type { CSSProperties, FC, ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ANNOTATION_REGION, bounded, DEMOS, DEMO_BODY, DEMO_HEIGHT, DEMO_NAV, DEMO_WIDTH, INSTALL_HOME, isOffice, OFFICE, pointerAt, REVISE, typed } from "./demo-timeline";
import type { DemoName, OfficeName } from "./demo-timeline";
import { ComposerFileIcon, OfficeIcon } from "./office-icons";
import "./simulation.css";

const WHALE = "M48.8354 10.0479C48.3232 9.79199 48.1025 10.2798 47.8032 10.5278C47.7007 10.6079 47.6143 10.7119 47.5273 10.8076C46.7793 11.624 45.9048 12.1597 44.7622 12.0957C43.0923 12 41.666 12.5356 40.4058 13.8398C40.1377 12.2319 39.2476 11.272 37.8926 10.6558C37.1836 10.3359 36.4668 10.0156 35.9702 9.31982C35.6235 8.82373 35.5293 8.27197 35.356 7.72754C35.2456 7.3999 35.1353 7.06396 34.7651 7.00781C34.3633 6.94385 34.2056 7.2876 34.0479 7.57568C33.418 8.75195 33.1733 10.0479 33.1973 11.3599C33.2524 14.312 34.4736 16.6641 36.8999 18.3359C37.1758 18.5278 37.2466 18.7197 37.1597 19C36.9946 19.5757 36.7974 20.1357 36.624 20.7119C36.5137 21.0801 36.3486 21.1597 35.9624 21C34.6309 20.4321 33.481 19.5918 32.4644 18.5757C30.7393 16.8721 29.1792 14.9917 27.2334 13.52C26.7764 13.1758 26.3193 12.856 25.8467 12.5518C23.8618 10.584 26.1069 8.96777 26.627 8.77588C27.1704 8.57568 26.8159 7.8877 25.0591 7.896C23.3022 7.90381 21.6953 8.50391 19.647 9.30371C19.3477 9.42383 19.0322 9.51172 18.7095 9.58398C16.8501 9.22363 14.9199 9.14355 12.9033 9.37598C9.10596 9.80762 6.07275 11.6396 3.84326 14.7681C1.16455 18.5278 0.53418 22.7998 1.30664 27.2559C2.11768 31.9521 4.46582 35.8398 8.07373 38.8799C11.8159 42.0322 16.1255 43.5762 21.041 43.2803C24.0269 43.104 27.3516 42.6963 31.1016 39.4561C32.0469 39.936 33.0396 40.1279 34.686 40.272C35.9546 40.3921 37.1758 40.208 38.1211 40.0078C39.6021 39.688 39.4995 38.2881 38.9639 38.0322C34.623 35.9678 35.5762 36.8081 34.71 36.1279C36.9155 33.4639 40.2402 30.6958 41.54 21.728C41.6426 21.0161 41.5557 20.5679 41.54 19.9917C41.5322 19.6396 41.6108 19.5039 42.0049 19.4639C43.0923 19.3359 44.1479 19.0317 45.1167 18.4878C47.9292 16.9199 49.064 14.3438 49.3315 11.2559C49.3711 10.7837 49.3237 10.2959 48.8354 10.0479ZM24.3262 37.8398C20.1196 34.4639 18.0791 33.3521 17.2358 33.3999C16.4482 33.4482 16.5898 34.3682 16.7632 34.9678C16.9443 35.5601 17.1812 35.9683 17.5117 36.4878C17.7402 36.832 17.8979 37.3442 17.2832 37.728C15.9282 38.584 13.5728 37.4399 13.4624 37.3838C10.7207 35.7358 8.42822 33.5601 6.81348 30.584C5.25342 27.7197 4.34766 24.6479 4.19775 21.3677C4.1582 20.5757 4.38672 20.2959 5.15869 20.1519C6.17529 19.96 7.22314 19.9199 8.23926 20.0718C12.5327 20.7119 16.1885 22.6719 19.2529 25.7759C21.002 27.5439 22.3252 29.6558 23.6885 31.7202C25.1377 33.9121 26.6978 36 28.6831 37.7119C29.3843 38.312 29.9434 38.7681 30.479 39.104C28.8643 39.2881 26.1699 39.3281 24.3262 37.8398ZM26.3433 24.6001C26.3433 24.248 26.6191 23.9678 26.9658 23.9678C27.0444 23.9678 27.1152 23.9839 27.1782 24.0078C27.2651 24.04 27.3438 24.0879 27.4067 24.1602C27.5171 24.272 27.5801 24.4321 27.5801 24.6001C27.5801 24.9521 27.3042 25.2319 26.9575 25.2319C26.6108 25.2319 26.3433 24.9521 26.3433 24.6001ZM32.6064 27.8799C32.2046 28.0479 31.8027 28.1919 31.4165 28.208C30.8179 28.2397 30.1641 27.9922 29.8096 27.688C29.2583 27.2158 28.8643 26.9521 28.6987 26.1279C28.6279 25.7759 28.6675 25.2319 28.7305 24.9199C28.8721 24.248 28.7144 23.8159 28.2495 23.4238C27.8716 23.104 27.3911 23.0161 26.8633 23.0161C26.666 23.0161 26.4849 22.9277 26.3511 22.856C26.1304 22.7441 25.9492 22.4639 26.1226 22.1201C26.1777 22.0078 26.4458 21.7358 26.5088 21.688C27.2256 21.272 28.0527 21.4077 28.8169 21.7197C29.5259 22.0161 30.0615 22.5601 30.834 23.3281C31.6216 24.2559 31.7632 24.5117 32.2124 25.208C32.5669 25.752 32.8901 26.312 33.1104 26.9521C33.2446 27.3521 33.0713 27.6802 32.6064 27.8799Z";
const Whale: FC<{ size?: number }> = ({ size = 28 }) => <svg width={size} height={size} viewBox="0 0 50 50"><path fill="currentColor" d={WHALE} /></svg>;

const ICONS = {
  sidebar: "M9 4v16M4 4h16v16H4z", plus: "M12 5v14M5 12h14", chat: "M21 11.5a8.5 8.5 0 0 1-9 8.5l-5 2v-4a8.5 8.5 0 1 1 14-6.5Z",
  puzzle: "M9 3h6v4c5-3 7 4 2 5h4v8h-7c3-5-4-7-5-2v2H3v-6c5 2 7-4 2-5H3V7h6Z", clock: "M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0",
  folder: "M3 7h7l2 3h9l-2 10H3V5h6l2 2", search: "M16 16l5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0", file: "M5 3h9l5 5v13H5zM14 3v6h5M8 13h8M8 17h6",
  arrow: "M12 20V4m-7 7 7-7 7 7", chevron: "m8 10 4 4 4-4", open: "M14 3h7v7M21 3l-9 9M10 4H4v16h16v-6", check: "m5 12 4 4L19 6", close: "m6 6 12 12M6 18 18 6",
  square: "M5 5h14v14H5z", minus: "M5 12h14", shield: "M12 3 4 6v7c0 5 8 8 8 8s8-3 8-8V6zM8 12l3 3 5-6", branch: "M7 5v14M17 5v4c0 4-10 1-10 6M9 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0M9 19a2 2 0 1 1-4 0 2 2 0 0 1 4 0M19 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0",
  gear: "M9 3h6l1 4 4 1v7l-4 1-1 5H9l-1-5-5-1V8l5-1zM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0", pen: "m4 16 12-12 4 4L8 20H4zM13 7l4 4", phone: "M7 2h10v20H7zM10 18h4", back: "m10 5-7 7 7 7M3 12h11a7 7 0 0 1 7 7", download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
} as const;
type IconName = keyof typeof ICONS;
const Icon: FC<{ name: IconName; size?: number }> = ({ name, size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={ICONS[name]} /></svg>;
const Small: FC<{ children: ReactNode }> = ({ children }) => <span className="sim-muted">{children}</span>;

// 与桌面端 @gravity-ui/icons 的 16px 字形一致，不引入额外运行依赖。
const SHELL_ICONS = {
  sidebar: "M6 3.5h6A1.5 1.5 0 0 1 13.5 5v6a1.5 1.5 0 0 1-1.5 1.5H6zm-1.5 0H4A1.5 1.5 0 0 0 2.5 5v6A1.5 1.5 0 0 0 4 12.5h.5zM1 5a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3z",
  header: "M4 3.5h8A1.5 1.5 0 0 1 13.5 5v.5h-11V5A1.5 1.5 0 0 1 4 3.5M2.5 7v4A1.5 1.5 0 0 0 4 12.5h8a1.5 1.5 0 0 0 1.5-1.5V7zM1 5a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3z",
  phone: "M12 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 12.5v-9A1.5 1.5 0 0 1 5.5 2h5A1.5 1.5 0 0 1 12 3.5m-1.5-3a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3zM6.25 11a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5z",
  minus: "M1.75 8a.75.75 0 0 1 .75-.75h11a.75.75 0 0 1 0 1.5h-11A.75.75 0 0 1 1.75 8",
  square: "M11.5 3h-7A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 11.5 3m-7-1.5a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3z",
  close: "M3.47 3.47a.75.75 0 0 1 1.06 0L8 6.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L9.06 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L8 9.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L6.94 8 3.47 4.53a.75.75 0 0 1 0-1.06",
} as const;
const ShellIcon: FC<{ name: keyof typeof SHELL_ICONS; size?: number }> = ({ name, size = 16 }) => <svg width={size} height={size} viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d={SHELL_ICONS[name]} /></svg>;
export const ShellNavbar: FC<{ h: number; w: number; fullSidebar?: boolean }> = ({ h, w, fullSidebar }) => {
  const z = h / DEMO_NAV;
  return <div style={{ height: h, background: "#f9fafb", overflow: "hidden" }}><div className="sim-shell" style={{ width: w / z, height: DEMO_NAV, scale: String(z), transformOrigin: "0 0" }}>
    <span className={`sim-shell-control ${fullSidebar ? "sim-shell-mark" : ""}`}><ShellIcon name={fullSidebar ? "header" : "sidebar"} /></span>
    {!fullSidebar && <div className="sim-menus">{["文件", "视图", "运行", "帮助"].map((s) => <span key={s}>{s}</span>)}</div>}
    <span style={{ flex: 1 }} />{!fullSidebar && <span className="sim-remote"><ShellIcon name="phone" />远程</span>}
    <span className="sim-shell-control"><ShellIcon name="minus" /></span><span className="sim-shell-control"><ShellIcon name="square" size={14} /></span><span className="sim-shell-control"><ShellIcon name="close" /></span>
  </div></div>;
};

const Rail: FC = () => <aside className="sim-rail"><Whale size={29} />{(["chat", "puzzle", "clock", "puzzle", "folder", "search"] as const).map((s, i) => <span key={i}><Icon name={s} size={21} /></span>)}<span className="sim-rail-more">···</span></aside>;

const PRESETS: { title: string; icon: IconName; description: string; recommended?: boolean }[] = [
  { title: "DSH Better Sidebar", icon: "sidebar", description: "开放的侧边栏底座，支持三方拓展注册新侧边栏页面。内置文件渲染、编辑、终端与侧边对话。", recommended: true },
  { title: "DSH Rewind", icon: "back", description: "便捷无感的同窗口内对话回退，从小新整分支；自带轻量工作区备份，可一并还原文件。", recommended: true },
  { title: "Billion Context", icon: "puzzle", description: "基本稳定可用。上下文压缩插件，兼顾小窗口、节省 Token，适合长任务与持续协作。", recommended: true },
  { title: "DSH Office Kit", icon: "file", description: "Office documents, PDF, presentations, and spreadsheets for DeepSeek Harness", recommended: true },
  { title: "DSH Optimize", icon: "gear", description: "dsh-ops 底层操作工具插件，旨在减少 Token 消耗与任务耗时。A toolkit for low-level operations.", recommended: true },
  { title: "DSH Market", icon: "folder", description: "The plugin market inside DeepSeek Harness — browse, search, one-click install." },
  { title: "DSH IM", icon: "chat", description: "通过扫码或机器人凭据把 IM 机器人接入 DeepSeek Harness，支持多种即时通信平台。" },
  { title: "DSH GenUI", icon: "plus", description: "交互式界面插件，通过 dsh-ui 代码块直接呈现布局、图表、绘图与表单。" },
  { title: "DSH Context", icon: "puzzle", description: "一站式 DeepSeek Harness 上下文可视化插件。透视上下文，理解每一轮对话。" },
];
const Install: FC<{ frame: number }> = ({ frame }) => <div className="sim-install">
  <h1>安装推荐插件</h1><p>选择要在启动前安装的插件，之后也可以在设置中的插件市场里管理。</p>
  <div className="sim-preset-grid">{PRESETS.map((p, i) => {
    const selected = i === 1 || i === 2 || (i === 3 && frame >= 30) || (i === 4 && frame >= 60);
    const done = frame >= 138;
    return <div className="sim-preset" key={p.title}><div className="sim-preset-title"><Icon name={p.icon} size={19} /><b>{p.title}</b>{p.recommended && <span className="sim-recommended">推荐</span>}</div><p>{p.description}</p><div className="sim-preset-bottom"><Icon name="open" size={16} />{frame >= 90 && selected ? <span className={done ? "sim-done" : "sim-muted"}>{done ? "✓ 已安装" : "安装中…"}</span> : <span className={`sim-toggle ${selected ? "on" : ""}`} />}</div></div>;
  })}</div>
  <p className="sim-install-hint">{frame >= 138 ? "已安装 4 个插件，开始使用 DeepSeek Harness。" : "你可以取消勾选不需要的插件，取消后不会安装。"}</p>
  <div className="sim-install-buttons"><span>跳过</span><b>{frame >= 138 ? "完成" : frame >= 90 ? "安装中…" : "确定"}</b></div>
</div>;

const Lamp: FC<{ dark?: boolean }> = ({ dark }) => <svg className="sim-lamp" viewBox="0 0 300 290" fill="none"><ellipse cx="155" cy="256" rx="100" ry="14" fill={dark ? "#0c172f" : "#dde6f3"} /><path d="M139 208 161 109l-25-22" stroke={dark ? "#dfe7f1" : "#34465e"} strokeWidth="12" strokeLinecap="round" /><path d="m128 74 48 21c9 4 9 15-1 18l-80 15c-8 2-13-7-8-13l29-37c3-4 7-6 12-4Z" fill={dark ? "#f4f6fc" : "#1c2e48"} /><path d="m93 128 79-16" stroke="#fbd489" strokeWidth="5" strokeLinecap="round" /><ellipse cx="138" cy="232" rx="61" ry="12" fill={dark ? "#cad8eb" : "#657a96"} /><path d="M77 231v7c0 8 122 8 122 0v-7" fill={dark ? "#92a9c4" : "#334963"} /><path d="m96 132-33 89h142l-35-104" fill={dark ? "#ffd584" : "#f3dba6"} opacity=".09" /></svg>;

const DocumentPage: FC<{ revised?: boolean; highlight?: number; selected?: boolean; saved?: boolean }> = ({ revised, highlight, selected, saved }) => <article className={`sim-paper sim-document ${revised ? "restyled" : ""} ${selected ? "has-selection" : ""}`}>
  <header><span>LUMA / BRAND STUDIO</span><span>产品发布 · 策划案</span></header>
  <div className="sim-doc-label">PRODUCT LAUNCH / 2026</div><h1>LUMA Desk<br /><em>新品发布策划书</em></h1><p className="sim-doc-deck">为每一次专注，点亮恰好的光。</p>
  <div className="sim-doc-metrics"><div><small>发布周期</small><b>{revised ? "4" : "6"}<i> 周</i></b></div><div><small>项目预算</small><b>30<i> 万元</i></b></div><div><small>核心目标</small><b>品牌认知<i> + 转化</i></b></div></div>
  <h2>01 · 项目定位</h2><p className={highlight === 1 ? "sim-paragraph-highlight" : ""}>LUMA Desk 是为居家办公与专注学习设计的智能桌灯。以简洁外观、灵活调光与桌面友好设计，让光线自然融入日常。</p>
  <h2>02 · 发布目标</h2><p className={highlight === 2 ? "sim-paragraph-highlight" : ""}>建立清晰的产品认知，围绕「专注工作」「阅读学习」「夜间陪伴」三个场景，完成从内容触达到预约转化的完整链路。</p>
  <section className={`sim-doc-channel ${highlight === 3 ? "sim-paragraph-highlight" : ""} ${saved ? "sim-saved-annotation" : ""} ${revised ? "revised" : ""}`}><h2>03 · 渠道策略与排期</h2><p>{revised ? "优先投入内容平台与品牌自播，搜索渠道承接高意向用户；按周复盘素材与转化表现，目标 ROI ≥ 2.0。" : "围绕内容种草、品牌传播和活动曝光同步推进，覆盖目标人群；结合上线反馈持续优化渠道组合。"}</p><div className="sim-doc-weeks">{(revised ? ["W1 预热", "W2 发布", "W3 转化", "W4 复盘"] : ["W1–2 预热", "W3–4 发布", "W5–6 转化"]).map((w) => <span key={w}>{w}</span>)}</div></section>
  <footer><span>LUMA Desk · 产品市场部</span><span>01 / 04</span></footer>
</article>;
const PdfPage: FC = () => <article className="sim-paper sim-pdf"><header><b>LUMA</b><span>DESK / 01</span></header><div className="sim-pdf-hero"><div><small>LIGHT FOR YOUR FOCUS</small><h1>恰好的光，<br />刚好的专注。</h1><p>LUMA Desk 智能桌灯</p></div><Lamp /></div><div className="sim-pdf-features">{[["01", "随心调光", "从晨间工作到深夜阅读"], ["02", "简洁桌面", "轻盈设计，释放桌面空间"], ["03", "一触即亮", "让每一次专注更从容"]].map(([n, t, s]) => <div key={n}><small>{n}</small><b>{t}</b><p>{s}</p></div>)}</div><h2>为你的日常，留一盏好光</h2><p className="sim-pdf-copy">以克制的线条与细腻的光感，陪伴工作、阅读与生活。<br />一盏灯，让每一张桌面成为自己的专注空间。</p><div className="sim-pdf-spec"><div>灯光调节 <b>连续调光</b></div><div>交互方式 <b>触控操作</b></div><div>产品配色 <b>雾白 / 岩灰</b></div></div><footer><b>LUMA Desk</b><span>点亮你的专注时刻。</span></footer></article>;

const Slide: FC<{ page: number }> = ({ page }) => <div className={`sim-slide slide-${page}`}>
  <div className="sim-slide-top"><b>LUMA</b><small>PRODUCT LAUNCH / 2026</small></div>
  {page === 1 || page === 6 ? <><div className="sim-slide-title"><span>{page === 6 ? "谢谢，每一份专注。" : "专注，自有光。"}</span><h1>LUMA Desk</h1><p>{page === 6 ? "为你的下一次灵感，点亮恰好的光。" : "让每张桌面，都有恰好的光。"}</p></div><Lamp dark /></> : page === 2 ? <><h1>从日常出发，<br />让专注自然发生。</h1><div className="sim-slide-scenarios">{[["工作", "恰好照亮，不打扰灵感。"], ["阅读", "把注意力，交还给书页。"], ["陪伴", "夜深了，留一盏温柔的光。"]].map(([t, p], i) => <div key={t}><small>0{i + 1}</small><h2>{t}</h2><p>{p}</p></div>)}</div></> : <><h1>{page === 3 ? <>好光线，<br />也是好设计。</> : page === 4 ? <>细节简单，<br />使用更从容。</> : <>六周，让好光<br />走进更多桌面。</>}</h1><div className="sim-slide-points">{(page === 3 ? ["灵活调光", "轻盈桌面", "一触即亮"] : page === 4 ? ["连续调光", "触控操作", "雾白 / 岩灰"] : ["W1–2　内容预热", "W3–4　新品发布", "W5–6　预约转化"]).map(t => <span key={t}>{t}</span>)}</div><Lamp /></>}
  <div className="sim-slide-bottom"><span>LUMA DESK</span><span>0{page} / 06</span></div>
</div>;
const Spreadsheet: FC = () => {
  const rows = [["内容平台投放", "90,000", "30%", "林可", "W1–W6", "进行中"], ["内容制作", "60,000", "20%", "陈悦", "W1–W3", "进行中"], ["发布活动", "75,000", "25%", "周乔", "W3–W4", "待开始"], ["公关传播", "45,000", "15%", "林可", "W2–W5", "待开始"], ["预备金", "30,000", "10%", "陈悦", "W1–W6", "未使用"]];
  return <div className="sim-workbook"><div className="sim-formula"><span>B9</span><b>ƒx</b><code>=SUM(B4:B8)</code></div><table className="sim-sheet"><colgroup><col style={{ width: 38 }} /><col style={{ width: 168 }} /><col style={{ width: 114 }} /><col style={{ width: 88 }} /><col style={{ width: 86 }} /><col style={{ width: 108 }} /><col style={{ width: 105 }} /></colgroup><thead><tr>{["", "A", "B", "C", "D", "E", "F"].map((s) => <th key={s}>{s}</th>)}</tr></thead><tbody><tr><th>1</th><td colSpan={6} className="sim-sheet-title">LUMA Desk / 发布预算与进度</td></tr><tr><th>2</th><td colSpan={6} className="sim-sheet-sub">总预算 ¥300,000 · 发布周期 6 周 · 币种 CNY</td></tr><tr><th>3</th>{["项目 / 渠道", "预算（元）", "占比", "负责人", "执行周次", "状态"].map((s) => <td className="sim-sheet-head" key={s}>{s}</td>)}</tr>{rows.map((r, i) => <tr key={r[0]}><th>{i + 4}</th>{r.map((s, j) => <td key={j} className={j === 1 ? "numeric" : j === 5 ? "status" : ""}>{s}</td>)}</tr>)}<tr className="sim-sheet-total"><th>9</th><td>合计</td><td className="selected">300,000</td><td>100%</td><td colSpan={3}>预算校验通过 ✓</td></tr></tbody></table><div className="sim-sheet-charts"><div><h3>预算分配</h3><div className="sim-budget-bars">{rows.map((r, i) => <div key={r[0]}><span>{r[0]}</span><i style={{ width: `${[84, 56, 70, 42, 28][i]}%`, background: ["#336ae8", "#6c94f3", "#4f80ee", "#96b1f4", "#b9cef9"][i] }} /><b>{r[2]}</b></div>)}</div></div><div><h3>6 周执行排期</h3><div className="sim-gantt-head">W1 W2 W3 W4 W5 W6</div>{["内容投放", "素材制作", "发布活动", "公关传播"].map((s, i) => <div className="sim-gantt" key={s}><span>{s}</span><i style={{ marginLeft: [0, 0, 64, 32][i], width: [192, 96, 64, 128][i] }} /></div>)}</div></div><div className="sim-sheet-tabs"><b>预算总览</b><span>周度排期</span><span>+</span></div></div>;
};

const Preview: FC<{ name: OfficeName; frame: number; revised?: boolean; marked?: boolean; annotationFrame?: number; full?: boolean }> = ({ name, frame, revised, marked, annotationFrame = -1, full }) => {
  const highlight = annotationFrame >= 46 && annotationFrame < 78 ? 1 : annotationFrame >= 78 && annotationFrame < 108 ? 2 : annotationFrame >= 108 && annotationFrame < REVISE.addParagraph ? 3 : undefined;
  const page = name === "ppt" ? 1 + [80, 125, 200, 280, 360].filter(at => frame >= at).length : 1;
  const file = revised ? "LUMA-Desk-项目策划书-v2.docx" : OFFICE[name].file;
  return <div className={`sim-preview ${full ? "full" : ""}`}><div className="sim-preview-title"><Icon name={name === "xlsx" ? "square" : "file"} size={17} /><b>{file}</b><span className="sim-preview-actions"><span className={marked ? "sim-annotate-active" : ""}><Icon name="pen" size={18} /></span><Icon name="open" size={17} /><Icon name="close" size={18} /></span></div><div className="sim-preview-toolbar"><span>{OFFICE[name].format} 预览</span><span className="sim-preview-tools"><Icon name="minus" size={15} />{name === "ppt" ? "适合窗口" : "100%"}<Icon name="plus" size={15} /><Icon name="download" size={16} /></span></div><div className={`sim-preview-content ${name}`}>
    {name === "doc" ? <DocumentPage revised={revised} highlight={highlight} selected={annotationFrame >= REVISE.paragraph} saved={annotationFrame >= REVISE.addParagraph} /> : name === "pdf" ? <PdfPage /> : name === "ppt" ? <Slide page={page} /> : <Spreadsheet />}
  </div><div className="sim-preview-footer"><span>{name === "xlsx" ? "工作表 1 / 2" : name === "ppt" ? `${page} / 6` : "1 / 4"}</span>{name === "ppt" && <span className="sim-slide-next">‹ {page} / 6 ›</span>}<Small>{marked ? "标注模式 · 选择内容添加批注" : "已加载"}</Small></div></div>;
};

// 复用 DSH 原生输入栏的 SVG 字形，避免文本箭头受字体基线影响。
const COMPOSER_GLYPHS = {
  permission: <><path fill="currentColor" d="M6.4209 1.68067C7.43922 1.299 8.56177 1.29898 9.58008 1.68067L14.0996 3.375C14.2946 3.44811 14.4236 3.63455 14.4238 3.84278V6.89063C14.1115 6.71853 13.7761 6.58312 13.4238 6.48926V4.18946L9.22852 2.61621C8.43657 2.31947 7.56341 2.31939 6.77148 2.61621L2.5752 4.18946V7.11914C2.5752 11.1796 5.52369 13.056 8 14.0391C8.27653 13.9293 8.55827 13.8067 8.8418 13.6729C9.07101 13.9468 9.33228 14.1929 9.62012 14.4053C9.12409 14.6579 8.63578 14.8696 8.17871 15.0449C8.0637 15.0889 7.93628 15.0889 7.82129 15.0449C5.22011 14.0472 1.5752 11.9381 1.5752 7.11914V3.84278C1.57541 3.63469 1.70463 3.44821 1.89941 3.375L6.4209 1.68067ZM10.0317 13.2229L10.7256 13.733L14.7826 8.64495L13.6777 7.83268ZM12.6516 12.6696V13.4359L15.2651 13.5527V12.5527Z" /><path d="M5.26392 6.60339H10.7361M5.26392 9.86902H8.32833" stroke="currentColor" /></>,
  branch: <path fill="currentColor" fillRule="evenodd" d="M2.327.504A.75.75 0 0 1 3 1.25V2a1.5 1.5 0 0 0 1.5 1.5h2.588A3.25 3.25 0 0 1 10.25 1l.167.004A3.25 3.25 0 0 1 13.5 4.25l-.004.167A3.25 3.25 0 0 1 10.25 7.5l-.167-.004A3.25 3.25 0 0 1 7.088 5H4.5c-.547 0-1.058-.15-1.5-.405V10a1.5 1.5 0 0 0 1.5 1.5h2.588a3.25 3.25 0 1 1 0 1.5H4.5a3 3 0 0 1-3-3V1.25A.75.75 0 0 1 2.25.5zM10.25 10.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5m0-8a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5" />,
  chevron: <path d="M4 6L7.29289 9.29289C7.68342 9.68342 8.31658 9.68342 8.70711 9.29289L12 6" stroke="currentColor" />,
  localChevron: <path fill="currentColor" fillRule="evenodd" d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06" />,
};
const ComposerGlyph: FC<{ name: keyof typeof COMPOSER_GLYPHS }> = ({ name }) => <svg width={name === "localChevron" ? 11 : 14} height={name === "localChevron" ? 11 : 14} viewBox="0 0 16 16" fill="none" aria-hidden="true">{COMPOSER_GLYPHS[name]}</svg>;
const Composer: FC<{ text?: string; label?: string; compact?: boolean; generating?: boolean }> = ({ text, label, compact, generating }) => <div className={`sim-composer ${compact ? "compact" : ""}`}><div className="sim-input">{label && <span className="sim-skill-chip" title={label}><ComposerFileIcon />{label}</span>}{text || (!label && <span className="sim-placeholder">描述你想要构建的内容，/ 调用指令，@ 文件或对话</span>)}</div><div className="sim-composer-bottom"><span className="sim-add">+</span><span className="sim-composer-select"><ComposerGlyph name="permission" /><span>工作区内修改</span><ComposerGlyph name="chevron" /></span><span className="sim-composer-select"><ComposerGlyph name="branch" /><span>本地</span><ComposerGlyph name="localChevron" /></span><span className="sim-model">DeepSeek-V4.1-Flash <i>1017</i><Small>High<ComposerGlyph name="chevron" /></Small></span><span className={`sim-send ${text ? "ready" : ""}`}>{generating ? <i /> : <Icon name="arrow" size={21} />}</span></div></div>;
const SkillMenu: FC<{ name: OfficeName }> = ({ name }) => <div className="sim-skill-menu"><Small>办公</Small>{(Object.keys(OFFICE) as OfficeName[]).map((k) => <div key={k} className={k === name ? "selected" : ""}><OfficeIcon name={k} /><b>{OFFICE[k].label}</b><span className="sim-office-alias">{OFFICE[k].command}</span><small>{OFFICE[k].description}</small></div>)}</div>;
const ToolRows: FC<{ frame: number; send: number; result: number; name: DemoName }> = ({ frame, send, result, name }) => {
  const steps = name === "ops" ? ["查找项目文件", "批量读取文件", "完成内容整理"] : name === "revise" ? ["读取两条标注", "更新内容与版式", "渲染并检查新版"] : ["读取技能说明", "生成与排版", "渲染并检查预览"];
  return <div className="sim-tools">{steps.map((s, i) => {
    const span = (result - send) / 3;
    const start = send + i * span;
    if (frame < start) return null;
    const done = frame >= start + span;
    return <div key={s}><span className={done ? "sim-tool-check" : "sim-tool-running"} style={done ? undefined : { rotate: `${frame * 12}deg` }}>{done ? "✓" : "◌"}</span><span>{s}</span><code>{name === "ops" ? ["ops.glob", "ops.read_files", "完成"][i] : ["skill", "ops_bash", "预览检查"][i]}</code></div>;
  })}</div>;
};
const FileCard: FC<{ name: OfficeName; revised?: boolean }> = ({ name, revised }) => <div className={`sim-file-card ${name}`}><span className="sim-file-icon"><Icon name="file" size={25} /></span><div><b>{revised ? "LUMA-Desk-项目策划书-v2.docx" : OFFICE[name].file}</b><small>{OFFICE[name].format} · 点击预览</small></div><Icon name="open" size={18} /></div>;

const REVISION_NOTES = ["周期改为 4 周；优先内容与自播，ROI ≥ 2.0。", "整体替换为暖色极简风格：米白底、橙色标题。"];
const Annotation: FC<{ frame: number }> = ({ frame }) => {
  if (frame < REVISE.activate || frame >= REVISE.send) return null;
  const count = Number(frame >= REVISE.addParagraph) + Number(frame >= REVISE.addRegion);
  const paragraph = frame >= REVISE.paragraph && frame < REVISE.addParagraph;
  const region = frame >= REVISE.release && frame < REVISE.addRegion;
  const drag = bounded((frame - REVISE.drag) / (REVISE.release - REVISE.drag), 0, 1);
  return <>
    {frame >= REVISE.drag && <div className={`sim-selection-region ${frame >= REVISE.addRegion ? "saved" : ""}`} style={{ left: ANNOTATION_REGION.x - 56, top: ANNOTATION_REGION.y, width: ANNOTATION_REGION.w * drag, height: ANNOTATION_REGION.h * drag }} />}
    {(paragraph || region) && <div className="sim-annotation"><span>{typed(REVISION_NOTES[region ? 1 : 0], frame, (region ? REVISE.release : REVISE.paragraph) + 8, (region ? REVISE.addRegion : REVISE.addParagraph) - 24)}</span><b><Icon name="check" size={18} /></b></div>}
    <div className="sim-annotation-rail"><span className="sim-annotation-count">暂存区 · {count}</span><span>取消</span><b className={count ? "ready" : ""}>发送</b>
      {frame >= REVISE.summary && frame < 456 && <div className="sim-annotation-summary"><header>已暂存 {count} 条标注</header>{REVISION_NOTES.map((note, i) => <div key={note}><small>{i + 1} · {i ? "区域截图" : "段落内容"} · 第 1 页</small><p>{note}</p></div>)}</div>}
    </div>
  </>;
};
const OfficeFlow: FC<{ name: OfficeName; frame: number; revised?: boolean }> = ({ name, frame, revised }) => {
  const spec = OFFICE[name];
  const send = revised ? DEMOS.revise.send : spec.send;
  const result = revised ? DEMOS.revise.result : spec.result;
  const ready = frame >= result;
  const opened = frame >= result + 24;
  const isRevise = Boolean(revised);
  const sent = frame >= send;
  const text = isRevise ? REVISION_NOTES.join("\n") : typed(spec.prompt, frame, 51, send - 20);
  if (!sent && !isRevise) return <><div className="sim-home"><div className="sim-welcome"><Whale size={38} /><span>探索未至之境</span><i>预览版</i></div><div className="sim-workspace"><Icon name="folder" size={19} /><b>LUMA-Desk</b><Icon name="chevron" size={13} /><span>♧ 标准模式<ComposerGlyph name="chevron" /></span></div><Composer text={frame < 43 ? (frame >= 14 ? "/" : "") : text} label={frame >= 43 ? spec.label : undefined} />{frame >= 14 && frame < 43 && <SkillMenu name={name} />}</div></>;
  const marked = isRevise && frame >= REVISE.activate && frame < send;
  const showInitial = isRevise && !opened;
  return <><div className={`sim-chat ${opened || showInitial ? "with-preview" : ""}`}><div className="sim-chat-heading"><span>{isRevise ? "优化新品发布策划书" : spec.title}</span><Small>LUMA-Desk</Small></div><div className="sim-chat-thread"><div className={`sim-user-message ${isRevise && sent ? "sim-annotation-message" : ""}`}>{isRevise ? sent ? <><small>来自策划书 · 2 条标注</small>{REVISION_NOTES.map((note, n) => <p key={note}><b>{n + 1}</b>{note}</p>)}</> : "请在策划书上标注需要调整的内容。" : <><span className="sim-office-chip" title={`/${spec.command}`}><OfficeIcon name={name} />{spec.label}</span>{" "}{text}</>}</div>{sent && <><div className="sim-assistant-label"><Whale size={23} /><b>DeepSeek</b><Small>V4.1 Flash</Small></div><ToolRows frame={frame} send={send} result={result} name={isRevise ? "revise" : name} />{ready && <><div className="sim-response">{isRevise ? "已按两条标注更新：4 周排期、ROI 目标，以及整篇暖色极简版式。" : spec.response}</div><FileCard name={name} revised={isRevise} /></>}</>}</div><Composer compact generating={sent && !ready} text={isRevise && !sent && frame >= REVISE.summary ? "按这 2 条标注修改，保留原结构与页数。" : undefined} /></div>{(opened || showInitial) && <Preview name={name} frame={frame - result} revised={isRevise && opened} marked={marked} annotationFrame={marked ? frame : undefined} />}
    {isRevise && <Annotation frame={frame} />}
  </>;
};
const OpsFlow: FC<{ frame: number }> = ({ frame }) => {
  const d = DEMOS.ops;
  const prompt = "检查 LUMA Desk 发布项目，读取项目说明和预算数据，汇总需要交付的文件。";
  if (frame < d.send) return <div className="sim-home"><div className="sim-welcome"><Whale size={38} /><span>探索未至之境</span><i>预览版</i></div><div className="sim-workspace"><Icon name="folder" size={19} /><b>LUMA-Desk</b><Icon name="chevron" size={13} /><span>♧ 标准模式<ComposerGlyph name="chevron" /></span></div><Composer text={typed(prompt, frame, 8, 44)} /></div>;
  return <div className="sim-chat ops"><div className="sim-chat-heading">整理新品发布项目<Small>LUMA-Desk</Small></div><div className="sim-chat-thread"><div className="sim-user-message">{prompt}</div><div className="sim-assistant-label"><Whale size={23} /><b>DeepSeek</b></div><ToolRows frame={frame} send={d.send} result={d.result} name="ops" />{frame >= d.result && <><div className="sim-ops-call"><header><Icon name="file" size={17} /><b>ops.read_files</b><span>完成</span></header><code>项目说明.md · 预算数据.csv</code><div>2 个文件范围 · 独立结果 · 一次读取</div></div><p className="sim-response">项目资料已整理，发布所需的四类文件齐全。</p><div className="sim-deliverables">{(Object.keys(OFFICE) as OfficeName[]).map((name) => <div key={name}><span>✓</span><b>{OFFICE[name].title}</b><Small>{OFFICE[name].format}</Small></div>)}</div></>}</div><Composer compact /></div>;
};
const FullWindow: FC<{ frame: number }> = ({ frame }) => {
  const opened = frame >= DEMOS.fullwindow.send;
  return <><div className={`sim-chat ${opened ? "" : "with-preview"}`}><div className="sim-chat-heading">优化新品发布策划书<Small>LUMA-Desk</Small></div><div className="sim-chat-thread"><div className="sim-assistant-label"><Whale size={23} /><b>DeepSeek</b></div><p>策划书已更新，点击打开新版预览。</p><FileCard name="doc" revised /></div><Composer compact /></div>{!opened && <Preview name="doc" frame={frame} revised />}</>;
};

// 每一帧由 frame 唯一确定；同一组件用于 Studio、原速录制和影片。
export const SimulationBody: FC<{ name: DemoName; frame: number }> = ({ name, frame }) => <div className="sim-body">
  {name === "install" && frame < INSTALL_HOME ? <Install frame={frame} /> : <><Rail /><main className="sim-main">{name === "install" ? <OfficeFlow name="doc" frame={0} /> : isOffice(name) ? <OfficeFlow name={name} frame={frame} /> : name === "revise" ? <OfficeFlow name="doc" frame={frame} revised /> : name === "fullwindow" ? <FullWindow frame={frame} /> : <OpsFlow frame={frame} />}</main></>}
</div>;
export const DemoPointer: FC<{ name: DemoName; frame: number; offsetY?: number }> = ({ name, frame, offsetY = 0 }) => {
  const p = pointerAt(name, frame);
  if (!p) return null;
  return <svg className="demo-pointer" width={66} height={79} viewBox="0 0 40 48" style={{ position: "absolute", left: p.x - 8.25, top: p.y + offsetY - 6.6, opacity: p.opacity, scale: p.press ? ".84" : "1", transformOrigin: "8.25px 6.6px", overflow: "visible", pointerEvents: "none", filter: "drop-shadow(0 3px 3px #0003)" }}>{name === "revise" && frame >= REVISE.hold && frame < REVISE.drag && <circle cx="5" cy="4" r="14" fill="none" stroke="#426fea" strokeWidth="2.5" pathLength="1" strokeDasharray={`${(frame - REVISE.hold) / (REVISE.drag - REVISE.hold)} 1`} />}<path d="M5 4 6 35l8-8 7 15 7-4-8-14 12-1Z" fill="white" stroke="#111" strokeWidth="3.7" strokeLinejoin="round" /></svg>;
};

export const SimulationViewport: FC<{ name: DemoName; frame: number; chrome?: boolean; pointer?: boolean }> = ({ name, frame, chrome = false, pointer = false }) => {
  const stacked = name === "fullwindow";
  const opened = stacked && frame >= DEMOS.fullwindow.send;
  const pop = 1 - (1 - bounded((frame - DEMOS.fullwindow.send) / 18, 0, 1)) ** 3;
  return <svg viewBox={`0 0 ${DEMO_WIDTH} ${chrome ? DEMO_HEIGHT : DEMO_BODY}`} width="100%" height="100%" style={{ display: "block" }}><foreignObject width={DEMO_WIDTH} height={chrome ? DEMO_HEIGHT : DEMO_BODY}><div className={`sim-surface ${stacked ? "sim-window-stack" : ""}`} style={{ width: DEMO_WIDTH, height: chrome ? DEMO_HEIGHT : DEMO_BODY }}>
    <div className={stacked ? "sim-original-window" : undefined} style={stacked ? { scale: String(1 - pop * .1) } : undefined}>
      {chrome && <ShellNavbar w={DEMO_WIDTH} h={DEMO_NAV} />}
      <SimulationBody name={name} frame={frame} />{pointer && <DemoPointer name={name} frame={frame} offsetY={chrome ? DEMO_NAV : 0} />}
    </div>
    {opened && <div className="sim-detached-window" style={{ opacity: Math.min(1, (frame - DEMOS.fullwindow.send) / 6), translate: `0 ${(1 - pop) * 40}px`, scale: String(.94 + pop * .06) }}>
      <div className="sim-detached-surface"><ShellNavbar w={DEMO_WIDTH} h={DEMO_NAV} fullSidebar /><div style={{ position: "relative", height: DEMO_BODY }}><Preview name="doc" frame={frame} revised full /></div></div>
    </div>}
  </div></foreignObject></svg>;
};

export type DemoProps = { name: DemoName; pointer?: boolean };
export const Demo: FC<DemoProps> = ({ name, pointer = false }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={name === "fullwindow" ? { background: "#e8e9f1" } : undefined}><SimulationViewport name={name} frame={frame} chrome pointer={pointer} /></AbsoluteFill>;
};

export const SimulatedClip: FC<{ name: DemoName; src?: number; speed?: number; from?: number; chrome?: boolean; pointer?: boolean }> = ({ name, src = 0, speed = 1, from = 0, chrome, pointer = true }) => {
  const frame = useCurrentFrame();
  return <SimulationViewport name={name} frame={bounded(Math.round(src * 30 + (frame - from) * speed), 0, DEMOS[name].duration - 1)} chrome={chrome} pointer={pointer} />;
};

// 导出供肉眼比对的全流程视图，无随机状态、真实网络或模型调用。
export const simulationStyle: CSSProperties = { background: "#fff", fontFamily: '"Segoe UI", "Microsoft YaHei", NotoSansSC, sans-serif' };
