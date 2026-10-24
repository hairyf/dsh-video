# Office UI icon sources

Copied from local installed sources on 2026-10-24. No network fetch or dependency installation was used.

## Menu and transcript format icons

`src/office-icons.tsx` retains the path data from these original SVG files, unmodified, using a 16 × 16 viewBox and a 14px rendered size:

| Demo | Chinese label | Local source | Original icon |
| --- | --- | --- | --- |
| doc | 文档 | E:/projects/dsh-office-kit/assets/icons/file-text.svg:1 | Gravity UI Icons file-text |
| pdf | PDF 文档 | E:/projects/dsh-office-kit/assets/icons/file-letter-p.svg:1 | Gravity UI Icons file-letter-p |
| ppt | 演示文稿 | E:/projects/dsh-office-kit/assets/icons/display.svg:1 | Gravity UI Icons display |
| xlsx | 电子表格 | E:/projects/dsh-office-kit/assets/icons/layout-cells.svg:1 | Gravity UI Icons layout-cells |

The local source declaration `E:/projects/dsh-office-kit/assets/icons/README.md:1-9` identifies Gravity UI Icons, its upstream `svgs` directory, and MIT licensing. Its existing license is retained verbatim in `LICENSE-Gravity-UI.txt` (Copyright (c) 2022 YANDEX LLC).

## Composer file icon

`ComposerFileIcon` retains the three paths of the installed DSH `BrowseOutlineArtwork`, with a 16 × 16 viewBox, a 14px size, and a one-pixel stroke. `ReferenceIconRegular(kind="file")` selects this artwork.

Local source: `E:/projects/dsh-office-kit/node_modules/.pnpm/@deepseek-ai+dsh-client-ui-_8bc234552e5d162db1ecbb4a65cf5d0a/node_modules/@deepseek-ai/dsh-client-ui-primitives/lib/index.js:197-220,5594-5622`.

Installed package: `@deepseek-ai/dsh-client-ui-primitives` version `0.2.1-rc.2`; its package metadata declares MIT. The package's existing license is retained verbatim in `LICENSE-DeepSeek.txt` (Copyright (c) 2026 DeepSeek). No separate icon-specific license was observed.

## UI mapping

Labels and descriptions follow `E:/projects/dsh-office-kit/src/client/index.ts:35-44,236-244`; command aliases follow `src/features.ts:21-58`. The input chip uses the localized label plus the generic file icon (`src/client/index.ts:270-281`). The sent transcript chip uses the localized label plus the corresponding format icon (`src/client/office-reference.tsx:15-20`).

Only existing local licensing declarations are recorded here; no additional permission is inferred.
