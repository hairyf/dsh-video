/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(false);
// 本地编辑保留 mtime；使用 bundler 最终缓存开关，webpack override 会被覆盖。
Config.setCachingEnabled(false);
// 清晰度：帧用无损 PNG（jpeg 会糊细字和 UI 边缘），H.264 用 CRF 16 + slow + 标准 yuv420p。
Config.setVideoImageFormat("png");
Config.setCrf(16);
Config.setX264Preset("slow");
Config.setPixelFormat("yuv420p");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);
