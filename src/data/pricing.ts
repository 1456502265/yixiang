// 文案、金额、引擎范围与规则均沿用老站 /price/，不要自行概括套餐权益。
export const engineNames = ['百度', '有道', '火山', '谷歌', 'DeepL', 'DeepSeek', 'ChatGPT'];

export const monthlyFeatures = [
  '全部翻译功能', '快捷回复', '未读提醒', '历史翻译',
  '客户档案', '客户跟进', 'AI智能回复', '20+ 社交软件', '不限字符',
];

export const monthlyPlans = [
  { name: '基础版', price: '49', description: '适合中英互译为主、预算有限的用户', engines: ['百度', '有道', '火山'] },
  { name: '专业版', price: '75', description: '性价比最高，适合小语种和商务翻译', engines: ['百度', '有道', '火山', '谷歌', 'DeepL', 'DeepSeek'] },
  { name: '高级版', price: '99', description: '全部 7 种引擎，日常聊天翻译最自然', engines: engineNames },
];

export const pointPlans = [
  ['百度', '75', '中英互译，性价比最高'],
  ['有道', '75', '中英互译，表达更自然'],
  ['火山', '75', '中英互译，响应速度快'],
  ['谷歌', '112', '小语种覆盖广，多语言混合场景'],
  ['DeepL', '112', '商务合同、正式报价，严谨专业'],
  ['DeepSeek', '112', '日常聊天、社交沟通，自然流畅'],
  ['ChatGPT', '150', '日常聊天最自然，像母语者说话'],
];

// 首页沿用原官网的免费版 / 积分版 / 包月版，金额与详细价格页共用。
const homeFeatures = [
  '20+ 社交软件', '7 种翻译引擎',
  ...monthlyFeatures.filter(feature => !['20+ 社交软件', '不限字符'].includes(feature)),
];
export const homePlans = [
  { name: '免费版', price: '0', unit: '', description: '注册送 3万积分，可体验全部功能', features: homeFeatures, href: '/help/#download', action: '免费下载' },
  { name: '积分版', price: pointPlans[0][1], unit: '/ 100 万字符', description: '用多少扣多少，不浪费', features: homeFeatures, href: '/help/#contact', action: '购买咨询' },
  { name: '包月版', price: monthlyPlans[0].price, unit: '起 / 月', description: '每天不到 2 块钱，畅聊全球一整天', features: homeFeatures.map(feature => feature === '7 种翻译引擎' ? `${feature}(因版本而异)` : feature).concat('不限字符'), href: '/help/#contact', action: '购买咨询' },
];

export const pricingFaqs = [
  ['怎么购买套餐？', '下载译想软件，注册登录后，在软件内的“账户中心 → 套餐购买”中直接扫码购买。如需帮助，可联系客服。'],
  ['积分套餐和包月套餐可以同时使用吗？', '可以同时拥有，但使用时系统会优先消耗包月套餐。积分套餐会保留，等包月套餐用完后自动使用。'],
  ['购买后可以退款吗？', '购买后如果使用不满意，可以按套餐剩余价值退款。积分套餐按剩余积分比例退款，包月套餐按剩余时间比例退款。请联系客服处理。'],
];
