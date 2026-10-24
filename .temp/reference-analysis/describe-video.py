"""Turn a reference video into a readable shot log (the only way I can "watch" it).

Per 0.5 s: OCR'd on-screen text (deduplicated), which screen regions move,
dominant colours, global pan/zoom, and cut/transition events with their length.
Usage: python describe-video.py <video> > log.txt
"""
import sys

import cv2
import numpy as np
from rapidocr_onnxruntime import RapidOCR

path = sys.argv[1]
cap = cv2.VideoCapture(path)
fps = cap.get(cv2.CAP_PROP_FPS) or 30
total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
W = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
H = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
ocr = RapidOCR()
print(f"# {path}  {W}x{H}  {total / fps:.1f}s")

GRID = 3  # 3x3 motion grid
NAMES = [["TL", "T", "TR"], ["L", "C", "R"], ["BL", "B", "BR"]]


def colour_name(bgr):
    b, g, r = [int(v) for v in bgr]
    hsv = cv2.cvtColor(np.uint8([[[b, g, r]]]), cv2.COLOR_BGR2HSV)[0][0]
    h, s, v = int(hsv[0]) * 2, int(hsv[1]), int(hsv[2])
    if v < 45:
        return "black"
    if s < 35:
        return "white" if v > 200 else "grey"
    for lim, name in [(15, "red"), (40, "orange"), (65, "yellow"), (160, "green"), (200, "cyan"), (255, "blue"), (290, "purple"), (335, "pink"), (361, "red")]:
        if h < lim:
            return name
    return "?"


def palette(frame):
    small = cv2.resize(frame, (64, 36)).reshape(-1, 3).astype(np.float32)
    k = 4
    _, labels, centers = cv2.kmeans(small, k, None, (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0), 2, cv2.KMEANS_PP_CENTERS)
    counts = np.bincount(labels.flatten(), minlength=k)
    order = np.argsort(-counts)
    return " ".join(f"{colour_name(centers[i])}{int(100 * counts[i] / len(labels))}%" for i in order if counts[i] / len(labels) > 0.08)


def global_motion(a, b):
    """Return (dx, dy, scale) of b relative to a using phase correlation + log-polar for zoom."""
    ga = cv2.resize(cv2.cvtColor(a, cv2.COLOR_BGR2GRAY), (320, 180)).astype(np.float32)
    gb = cv2.resize(cv2.cvtColor(b, cv2.COLOR_BGR2GRAY), (320, 180)).astype(np.float32)
    (dx, dy), resp = cv2.phaseCorrelate(ga, gb)
    return dx * W / 320, dy * H / 180, resp


prev = None
prev_small = None
last_text = set()
step = max(1, int(round(fps / 6)))  # analyse 6 fps for motion
ocr_every = int(round(fps / 2))  # OCR at 2 fps
events = []
rows = []
motion_acc = np.zeros((GRID, GRID))
f = 0
burst_start = None
while True:
    ok, frame = cap.read()
    if not ok:
        break
    if f % step == 0:
        small = cv2.resize(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY), (192, 108)).astype(np.int16)
        if prev_small is not None:
            d = np.abs(small - prev_small)
            m = float(d.mean())
            for gy in range(GRID):
                for gx in range(GRID):
                    motion_acc[gy, gx] += d[gy * 36:(gy + 1) * 36, gx * 64:(gx + 1) * 64].mean()
            if m > 25:
                events.append(f"{f / fps:6.2f}s CUT (diff {m:.0f})")
            if m > 3 and burst_start is None:
                burst_start = f
            if m <= 3 and burst_start is not None:
                length = (f - burst_start) / fps
                if length >= 0.3:
                    dx, dy, _ = global_motion(prev, frame)
                    events.append(f"{burst_start / fps:6.2f}s ANIM {length:.2f}s")
                burst_start = None
        prev_small = small
        prev = frame
    if f % ocr_every == 0:
        t = f / fps
        res, _ = ocr(cv2.resize(frame, (W // 2, H // 2)) if W > 1300 else frame)
        hits = [r for r in (res or []) if float(r[2]) > 0.6 and len(r[1].strip()) >= 2]
        texts = [r[1].strip() for r in hits]
        boxes = [r[0] for r in hits]
        cur = set(texts)
        new = [x for x in texts if x not in last_text]
        gone = len(last_text - cur)
        busy = motion_acc / max(1, ocr_every // step)
        moving = [NAMES[gy][gx] for gy in range(GRID) for gx in range(GRID) if busy[gy, gx] > 2.5]
        level = float(busy.mean())
        # text size → biggest box height as % of frame height
        big = max((abs(b[2][1] - b[0][1]) for b in boxes), default=0) * (2 if W > 1300 else 1) / H * 100
        rows.append(
            f"{t:6.1f}s | motion {level:4.1f} {'/'.join(moving) or '-':14} | {palette(frame):34} | "
            f"text{'+' if new else ' '} {len(cur):2d} (max {big:3.0f}%h, -{gone}) {' ¦ '.join(new)[:150]}"
        )
        last_text = cur
        motion_acc[:] = 0
    f += 1

print("\n## timeline (every 0.5s): motion level / moving regions | palette | new on-screen text")
print("\n".join(rows))
print("\n## cuts and animation bursts")
print("\n".join(events))
