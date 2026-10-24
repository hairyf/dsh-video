// 模拟演示脚本，单位为 30fps 帧；界面、光标和录制共用同一时钟。
export type DemoName = "install" | "doc" | "pdf" | "ppt" | "xlsx" | "revise" | "fullwindow" | "ops";
export type OfficeName = "doc" | "pdf" | "ppt" | "xlsx";
export const DEMO_FPS = 30;
export const DEMO_WIDTH = 1400;
export const DEMO_HEIGHT = 900;
export const DEMO_NAV = 44;
export const DEMO_BODY = DEMO_HEIGHT - DEMO_NAV;

export const OFFICE = {
  doc: { label: "文档", command: "documents", description: "创建、读取、编辑和渲染 DOCX 文档", skill: "office-documents", title: "项目策划书", file: "LUMA-Desk-项目策划书.docx", format: "DOCX", send: 192, result: 477, prompt: "为 LUMA Desk 智能桌灯制定新品发布策划书。预算 30 万元，周期 6 周，包含发布目标、渠道计划和执行排期。", response: "策划书已完成，包含发布目标、渠道策略、预算和 6 周执行计划。" },
  pdf: { label: "PDF 文档", command: "pdf", description: "读取、创建、检查、渲染和验证 PDF", skill: "office-pdf", title: "对外产品资料", file: "LUMA-Desk-产品资料.pdf", format: "PDF", send: 150, result: 330, prompt: "把 LUMA Desk 的产品定位与核心卖点整理为一份对外 PDF。采用简洁的蓝白排版，补充产品参数和发布信息。", response: "对外资料已排版完成，包含产品介绍、核心卖点和规格参数。" },
  ppt: { label: "演示文稿", command: "presentations", description: "创建、编辑、渲染和导出 PPTX 演示文稿", skill: "office-presentations", title: "发布会演示文稿", file: "LUMA-Desk-发布会.pptx", format: "PPTX", send: 135, result: 291, prompt: "为 LUMA Desk 新品发布会制作 6 页演示文稿：封面、用户场景、产品亮点、产品参数、发布计划和结束页。", response: "6 页演示文稿已完成，可在右侧直接翻页预览。" },
  xlsx: { label: "电子表格", command: "spreadsheets", description: "创建、编辑、计算和导出 XLSX 电子表格", skill: "office-spreadsheets", title: "预算与进度表", file: "LUMA-Desk-预算与进度.xlsx", format: "XLSX", send: 144, result: 288, prompt: "创建 LUMA Desk 发布预算与进度表。总预算 30 万元，列出渠道、金额、负责人和周次，添加合计公式与预算占比图。", response: "预算与进度表已完成，包含合计公式、预算占比图和 6 周排期。" },
} as const;

// 标注先进入暂存区；只有侧栏“发送”才提交会话。
export const REVISE = { activate: 18, paragraph: 120, addParagraph: 208, hold: 250, drag: 262, release: 306, addRegion: 402, summary: 426, send: 486, result: 648 } as const;
export const ANNOTATION_REGION = { x: 712, y: 568, w: 606, h: 204 } as const;
export const INSTALL_HOME = 174;

export const DEMOS: Record<DemoName, { send: number; result: number; duration: number }> = {
  install: { send: 90, result: 138, duration: 210 },
  doc: { ...OFFICE.doc, duration: OFFICE.doc.result + 600 },
  pdf: { ...OFFICE.pdf, duration: OFFICE.pdf.result + 600 },
  ppt: { ...OFFICE.ppt, duration: OFFICE.ppt.result + 600 },
  xlsx: { ...OFFICE.xlsx, duration: OFFICE.xlsx.result + 600 },
  revise: { send: REVISE.send, result: REVISE.result, duration: REVISE.result + 600 },
  fullwindow: { send: 72, result: 96, duration: 600 },
  ops: { send: 66, result: 96, duration: 480 },
};

export const bounded = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
export const typed = (text: string, frame: number, start: number, end: number) => text.slice(0, Math.floor(text.length * bounded((frame - start) / (end - start), 0, 1)));
export const isOffice = (name: DemoName): name is OfficeName => name === "doc" || name === "pdf" || name === "ppt" || name === "xlsx";

export type PointerMove = { start: number; click: number; x: number; y: number; fromX?: number; fromY?: number; hide?: number; hover?: boolean; drag?: { start: number; end: number; x: number; y: number } };
export const pointerMoves = (name: DemoName): PointerMove[] => {
  const d = DEMOS[name];
  if (name === "install") return [
    { start: 5, click: 30, x: 516, y: 467 },
    { start: 34, click: 60, x: 814, y: 467, fromX: 516, fromY: 467 },
    { start: 64, click: 90, x: 1114, y: 691, fromX: 814, fromY: 467 },
    { start: 150, click: INSTALL_HOME - 4, x: 1114, y: 691, fromX: 1080, fromY: 620 },
  ];
  if (isOffice(name)) return [
    { start: 0, click: 14, x: 401, y: 480 },
    { start: 23, click: 43, x: 460, y: { doc: 310, pdf: 344, ppt: 378, xlsx: 412 }[name], fromX: 401, fromY: 480 },
    { start: d.send - 27, click: d.send, x: 1139, y: 562, fromX: 930, fromY: 530 },
    { start: d.result + 2, click: d.result + 24, x: 420, y: 442, fromX: 500, fromY: 480 },
    ...(name === "ppt" ? [80, 125, 200, 280, 360].map((at) => ({ start: d.result + at - 20, click: d.result + at, x: 1037, y: 841, fromX: 1055, fromY: 730 })) : []),
  ];
  if (name === "revise") return [
    { start: 0, click: REVISE.activate, x: 1305, y: 21 },
    { start: 30, click: 54, x: 930, y: 515, hide: 73, hover: true, fromX: 1305, fromY: 21 },
    { start: 74, click: 94, x: 1000, y: 610, hide: 103, hover: true, fromX: 930, fromY: 515 },
    { start: 104, click: REVISE.paragraph, x: 1023, y: 704, fromX: 1000, fromY: 610 },
    { start: 184, click: REVISE.addParagraph, x: 1237, y: 778, fromX: 1060, fromY: 762 },
    { start: 228, click: REVISE.hold, x: ANNOTATION_REGION.x, y: ANNOTATION_REGION.y, drag: { start: REVISE.drag, end: REVISE.release, x: ANNOTATION_REGION.x + ANNOTATION_REGION.w, y: ANNOTATION_REGION.y + ANNOTATION_REGION.h }, hide: REVISE.release + 5 },
    { start: 378, click: REVISE.addRegion, x: 1237, y: 778, fromX: 1080, fromY: 762 },
    { start: 410, click: REVISE.summary, x: 963, y: 825, hide: 454, hover: true, fromX: 1237, fromY: 778 },
    { start: 460, click: REVISE.send, x: 1110, y: 825, fromX: 963, fromY: 825 },
    { start: d.result + 1, click: d.result + 24, x: 420, y: 472 },
  ];
  if (name === "fullwindow") return [{ start: 20, click: 72, x: 1341, y: 21, fromX: 1080, fromY: 220, hide: 76 }];
  return [{ start: 0, click: 8, x: 360, y: 480 }, { start: 43, click: 66, x: 1139, y: 562, fromX: 360, fromY: 480 }];
};

export function pointerAt(name: DemoName, frame: number) {
  const move = pointerMoves(name).find((m) => frame >= m.start && frame <= (m.hide ?? m.click + 5));
  if (!move) return null;
  const t = bounded((frame - move.start) / Math.max(1, move.click - move.start), 0, 1);
  const ease = t * t * (3 - 2 * t);
  const drag = move.drag ? bounded((frame - move.drag.start) / (move.drag.end - move.drag.start), 0, 1) : 0;
  return {
    x: (move.fromX ?? move.x - 120) + (move.x - (move.fromX ?? move.x - 120)) * ease + ((move.drag?.x ?? move.x) - move.x) * drag,
    y: (move.fromY ?? move.y + 90) + (move.y - (move.fromY ?? move.y + 90)) * ease + ((move.drag?.y ?? move.y) - move.y) * drag,
    opacity: Math.min(1, (frame - move.start) / 4, ((move.hide ?? move.click + 5) - frame) / 4),
    press: !move.hover && frame >= move.click && frame < (move.drag?.end ?? move.click + 3),
  };
}

// 后期音效与操作共用源帧；原片保持静音，不在界面组件里播放。
export const soundCues = (name: DemoName) => {
  const d = DEMOS[name];
  return [
    ...pointerMoves(name).filter(move => !move.hover).map(move => ({
      frame: move.click,
      sound: move.drag ? "grab" : move.click === d.send ? "pop" : move.click >= d.result ? "select" : name === "revise" && move.click === REVISE.paragraph ? "poke" : "tick",
      volume: .75,
    })),
    { frame: d.result, sound: "sparkle", volume: .65 },
    ...(name === "revise" ? [{ frame: REVISE.release, sound: "land", volume: .8 }] : []),
  ].sort((a, b) => a.frame - b.frame);
};

// 仅输入时在固定矩形内聚焦；执行、成果和整个标注保持正常尺寸。原片不调用。
export function cameraAt(name: DemoName, frame: number, speed = 1) {
  const d = DEMOS[name];
  const ease = (n: number) => { const t = bounded(n, 0, 1); return t * t * (3 - 2 * t); };
  const input = isOffice(name) || name === "ops" ? ease((frame - 3 * speed) / (9 * speed)) * (1 - ease((frame - d.send + 7 * speed) / (14 * speed))) : 0;
  return { zoom: 1 + .32 * input, x: -.18 * input, y: -.18 * input };
}
