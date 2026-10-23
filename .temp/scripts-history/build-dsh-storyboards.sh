#!/usr/bin/env bash
set -euo pipefail
FF=/tmp/dsh-video-ffmpeg-full/ffmpeg-7.1-essentials_build/bin/ffmpeg.exe
OUT=/c/Users/wwu71/AppData/Local/Temp/dsh-video-reference-review
rm -rf "$OUT"
mkdir -p "$OUT/typography" "$OUT/episode1"
"$FF" -hide_banner -loglevel error -i /c/Users/wwu71/AppData/Local/Temp/dsh-promo-ref.mp4 -vf "fps=1/2,scale=320:240,drawtext=fontfile=C\:/Windows/Fonts/arial.ttf:text='%{pts\:hms}':fontsize=16:fontcolor=yellow:box=1:boxcolor=black@0.8:x=4:y=h-th-4,tile=5x6:padding=4:margin=4" -frames:v 1 -y "$OUT/typography/contact.jpg"
"$FF" -hide_banner -loglevel error -i /tmp/ep1/ep1.mp4 -vf "fps=1/2,scale=320:240,drawtext=fontfile=C\:/Windows/Fonts/arial.ttf:text='%{pts\:hms}':fontsize=16:fontcolor=yellow:box=1:boxcolor=black@0.8:x=4:y=h-th-4,tile=5x6:padding=4:margin=4" -frames:v 1 -y "$OUT/episode1/contact.jpg"
