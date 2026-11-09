// 全站联系方式、主体及备案信息统一在这里维护。
import { siteUrl } from './domain.mjs';
export const site = {
  name: '译想', url: siteUrl,
  company: '北京国兴新辉科技有限公司',
  phone: '400-888-4829', phoneHref: 'tel:+864008884829', email: 'service@yixiang.chat',
  address: '北京市石景山区古城南街9号院绿地环球文化金融城5号楼1605室',
  hours: '周一至周日 09:00–22:00（北京时间）',
  icp: '京ICP备2024090933号-4', police: '京公网安备11010902001265号',
  channels: [
    { id: 'wechat', name: '微信客服', label: '使用微信扫一扫添加客服', href: '/images/kefuwx.jpg', qr: '/images/kefuwx.jpg', icon: '/images/WeChat.png' },
    { id: 'whatsapp', name: 'WhatsApp', label: '+852 46649528', href: 'https://wa.me/85246649528', qr: '/images/CqWhatsAppQrImg.jpg', icon: '/images/whatsapp.png' },
    { id: 'telegram', name: 'Telegram', label: '@transquickly_kefu', href: 'https://t.me/transquickly_kefu', qr: '/images/CqTelegramQrImg.jpg', icon: '/images/Telegram.png' },
  ],
};
export const navigation = [
  ['/', '首页'], ['/tuanduifangan/', '团队方案'], ['/product/', '产品介绍'],
  ['/price/', '价格方案'], ['/download/', '软件下载'], ['/help/', '帮助中心'],
  ['/about/', '关于我们'], ['/contact/', '联系我们'],
];
