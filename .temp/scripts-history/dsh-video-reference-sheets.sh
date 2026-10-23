#!/usr/bin/env bash
set -euo pipefail
ROOT=/d/projects/dsh-tauri-desk/dsh-video
FF="$ROOT/node_modules/.pnpm/@remotion+compositor-win32-x64-msvc@4.0.538/node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe"
OUT=C:/Users/wwu71/AppData/Local/Temp/dsh-video-reference-review
mkdir -p "$OUT"
"$FF" -hide_banner -loglevel error -i C:/Users/wwu71/AppData/Local/Temp/dsh-promo-ref.mp4 -vf "fps=2,scale=320:-1,drawtext=fontfile='C\:/Windows/Fonts/arial.ttf':text='%{pts\:hms}':fontsize=16:fontcolor=yellow:box=1:boxcolor=black@0.8:x=4:y=h-th-4,tile=5x6:padding=4:margin=4" -fps_mode vfr -y "$OUT/typography-%02d.jpg"
"$FF" -hide_banner -loglevel error -i /tmp/ep1/ep1.mp4 -vf "fps=1/2,scale=384:-1,drawtext=fontfile='C\:/Windows/Fonts/arial.ttf':text='%{pts\:hms}':fontsize=17:fontcolor=yellow:box=1:boxcolor=black@0.8:x=4:y=h-th-4,tile=4x5:padding=4:margin=4" -fps_mode vfr -y "$OUT/episode1-%02d.jpg"
printf 'Saved full-length reference storyboards to %s\n' "$OUT"
