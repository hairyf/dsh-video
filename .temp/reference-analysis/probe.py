"""Targeted measurements on specific moments of a reference video.

modes:
  bg <video> <t...>            exact RGB at corners/edges + centre at given times
  track <video> <t0> <t1>      per-frame bbox of what changed vs frame t0 (entry animations: slide / scale / fade)
  drift <video> <t0> <t1>      sub-pixel global drift of the whole frame (camera float) via phase correlation
  fade <video> <t0> <t1>       mean brightness per frame (fade to black/white timing)
"""
import sys

import cv2
import numpy as np

mode, path = sys.argv[1], sys.argv[2]
cap = cv2.VideoCapture(path)
fps = cap.get(cv2.CAP_PROP_FPS) or 30
W = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
H = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))


def grab(t):
    cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000)
    ok, f = cap.read()
    return f if ok else None


def frames(t0, t1):
    cap.set(cv2.CAP_PROP_POS_MSEC, t0 * 1000)
    t = t0
    while t <= t1:
        ok, f = cap.read()
        if not ok:
            return
        yield t, f
        t += 1 / fps


if mode == "bg":
    for t in map(float, sys.argv[3:]):
        f = grab(t)
        pts = {"TL": (10, 10), "TR": (W - 30, 10), "BL": (10, H - 30), "BR": (W - 30, H - 30), "C": (W // 2 - 10, H // 2 - 10), "T": (W // 2 - 10, 10)}
        out = []
        for k, (x, y) in pts.items():
            b, g, r = f[y:y + 20, x:x + 20].reshape(-1, 3).mean(0)
            out.append(f"{k}#{int(r):02x}{int(g):02x}{int(b):02x}")
        print(f"{t:6.2f}s  " + " ".join(out))

elif mode == "track":
    t0, t1 = float(sys.argv[3]), float(sys.argv[4])
    base = None
    for t, f in frames(t0, t1):
        g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY).astype(np.int16)
        if base is None:
            base = g
            continue
        mask = (np.abs(g - base) > 25).astype(np.uint8)
        ys, xs = np.nonzero(mask)
        if len(xs) < 50:
            print(f"{t:6.2f}s  -")
            continue
        x0, x1 = np.percentile(xs, [2, 98]).astype(int)
        y0, y1 = np.percentile(ys, [2, 98]).astype(int)
        print(f"{t:6.2f}s  box x{x0 / W * 100:5.1f}-{x1 / W * 100:5.1f}% y{y0 / H * 100:5.1f}-{y1 / H * 100:5.1f}%  "
              f"centre ({(x0 + x1) / 2 / W * 100:5.1f},{(y0 + y1) / 2 / H * 100:5.1f})  size {(x1 - x0) / W * 100:5.1f}x{(y1 - y0) / H * 100:5.1f}  px {len(xs)}")

elif mode == "drift":
    t0, t1 = float(sys.argv[3]), float(sys.argv[4])
    prev = None
    acc = np.zeros(2)
    rows = []
    for i, (t, f) in enumerate(frames(t0, t1)):
        g = cv2.cvtColor(cv2.resize(f, (W // 2, H // 2)), cv2.COLOR_BGR2GRAY).astype(np.float32)
        if prev is not None:
            (dx, dy), resp = cv2.phaseCorrelate(prev, g)
            if resp > 0.2:
                acc += (dx * 2, dy * 2)
        prev = g
        if i % 5 == 0:
            rows.append(f"{t:5.1f}:{acc[0]:+.1f},{acc[1]:+.1f}")
    print("cumulative drift (px, full res) every 5 frames:")
    print(" ".join(rows))

elif mode == "fade":
    t0, t1 = float(sys.argv[3]), float(sys.argv[4])
    print(" ".join(f"{t:.2f}:{cv2.cvtColor(f, cv2.COLOR_BGR2GRAY).mean():.0f}" for t, f in frames(t0, t1)))
