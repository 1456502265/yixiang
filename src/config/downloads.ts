// 按用户要求开放原官网的下载地址。版本、签名和哈希等信息仅在有真实数据时填写。
import { siteUrl } from './domain.mjs';
export const downloads = [
  { id: 'windows', name: 'Windows版', architecture: 'Windows', system: 'Windows 8 / 10 / 11', requirements: '4GB 内存 · 2GB 硬盘', enabled: true, url: 'https://dl.yixiang.chat/download/YiXiang-win-x64.exe', version: '', size: '', released: '', publisher: '', sha256: '' },
  { id: 'windows7', name: 'Windows 7版', architecture: 'Windows 7', system: 'Windows 7', requirements: '4GB 内存 · 2GB 硬盘', enabled: true, url: 'https://dl.yixiang.chat/download/YiXiang-win7-x64.exe', version: '', size: '', released: '', publisher: '', sha256: '' },
  { id: 'mac-arm', name: 'MacOS-M版', architecture: 'Apple 芯片', system: 'M1 / M2 / M3 芯片的 Mac', requirements: 'MacOS 11 及以上 · 2GB 硬盘', enabled: true, url: 'https://dl.yixiang.chat/download/YiXiang-mac-arm64.dmg', version: '', size: '', released: '', publisher: '', sha256: '' },
  { id: 'mac-intel', name: 'MacOS-Intel版', architecture: 'Intel 芯片', system: 'Intel 芯片的 Mac', requirements: 'MacOS 11 及以上 · 2GB 硬盘', enabled: true, url: 'https://dl.yixiang.chat/download/YiXiang-mac-x64.dmg', version: '', size: '', released: '', publisher: '', sha256: '' },
];
export function isDownloadReady(item: typeof downloads[number]) {
  let url: URL;
  try { url = new URL(item.url); } catch { return false; }
  return item.enabled && url.protocol === 'https:' && [new URL(siteUrl).hostname, 'dl.yixiang.chat'].includes(url.hostname)
    && !url.username && !url.password && !url.port;
}
