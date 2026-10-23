#!/usr/bin/env bash
# One-time archive of the 2026-10-23 planning session, not a production/render script.
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT=$(pwd -P)
TEMP_ROOT=/c/Users/wwu71/AppData/Local/Temp
[ "$ROOT" = /d/projects/dsh-tauri-desk/dsh-video ]
mkdir -p .temp/references .temp/reference-review .temp/scripts-history .temp/tools
copy_verified() {
  test -f "$1"
  test ! -e "$2"
  cp "$1" "$2"
  cmp "$1" "$2"
}
copy_verified "$TEMP_ROOT/ep1/ep1.mp4" .temp/references/episode1-BV1VLJQ6XEZi.mp4
copy_verified "$TEMP_ROOT/dsh-promo-ref.mp4" .temp/references/typography-BV1dm4y1n78i.mp4
copy_verified "$TEMP_ROOT/dsh-bgm-reference.mp4" .temp/references/bgm-BV1R1421v739.mp4
for name in episode1.jpg typography.jpg bgm-video.jpg bgm-waveform.png; do
  copy_verified "$TEMP_ROOT/dsh-video-reference-review/$name" ".temp/reference-review/$name"
done
for name in dsh-video-reference-sheets.sh build-dsh-storyboards.sh dsh-reference-round-bgm.mjs; do
  copy_verified "$TEMP_ROOT/$name" ".temp/scripts-history/$name"
done
copy_verified "$TEMP_ROOT/ff.zip" .temp/tools/ffmpeg-7.1-essentials_build.zip
printf 'Verified all 11 archived copies byte-for-byte.\n'
