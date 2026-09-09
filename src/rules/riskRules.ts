export type RiskCategory = 'credential' | 'remoteAccess' | 'money';

export type RiskLevel = 'none' | 'risk_detected' | 'pause_triggered';

export type RiskDetectionResult = {
  categories: RiskCategory[];
  matchedKeywords: string[];
  level: RiskLevel;
};

const riskRules: { category: RiskCategory; keywords: string[] }[] = [
  {
    category: 'credential',
    keywords: ['短信验证码', '验证码', '动态码', 'verification code', 'one-time code', 'security code', 'password', '密码', 'OTP'],
  },
  {
    category: 'remoteAccess',
    keywords: ['远程控制', '远程访问', '屏幕共享', '远程桌面', '安装', '下载', 'remote access', 'remote control', 'screen sharing', 'remote desktop', 'install', 'download', 'AnyDesk'],
  },
  {
    category: 'money',
    keywords: ['银行账户', '转账', '打款', '汇款', '付款', '支付', '钱', 'wire transfer', 'bank account', 'transfer', 'payment', 'money', 'pay'],
  },
];

const urgencyKeywords = ['立即', '马上', '现在', '立刻', '紧急', '否则', 'immediately', 'right now', 'urgent', 'otherwise'];

export const categoryLabel: Record<RiskCategory, string> = {
  credential: '验证 / 凭证',
  remoteAccess: '远程控制 / 安装',
  money: '钱款 / 转账',
};

export const categoryHint: Record<RiskCategory, string> = {
  credential: '验证码',
  remoteAccess: '远程控制',
  money: '转账',
};

export const categoryAdvice: Record<RiskCategory, string> = {
  credential:
    '不要把验证码或密码发给对方。正规平台不会在电话/聊天里向你索要验证码；把验证码给人，就等于把账号交给对方。请挂断或暂停后，自己打开官方 App 或官网查看是否有异常登录；若刚收到验证码短信，多半是有人在尝试登录，切勿回传。',
  remoteAccess:
    '先别安装对方发来的软件，也别允许远程控制。一旦连上，对方往往能直接操作你的电脑和账户。请结束当前要求，自行到官网核验；若已经装了，立即断开网络并卸载该软件，再修改相关账号密码。',
  money:
    '先别按对方给的账户或地址转账。「安全账户」「保证金」「临时保全」常是骗子收款话术，转出后很难追回。请通过官方客服或官方 App 重新核实；涉及加密资产时，切勿把币转到陌生人提供的钱包地址。',
};

function includesKeyword(text: string, keyword: string) {
  return text.toLowerCase().includes(keyword.toLowerCase());
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

export function detectRisk(text: string): RiskDetectionResult {
  const matched = riskRules.flatMap((rule) =>
    rule.keywords.filter((keyword) => includesKeyword(text, keyword)).map((keyword) => ({
      category: rule.category,
      keyword,
    })),
  );

  const matchedKeywords = unique(matched.map((item) => item.keyword))
    .sort((left, right) => right.length - left.length)
    .filter((keyword, index, keywords) => {
      return !keywords.slice(0, index).some((longer) => longer.toLowerCase().includes(keyword.toLowerCase()));
    });

  const categories = unique(
    matched.filter((item) => matchedKeywords.includes(item.keyword)).map((item) => item.category),
  );

  const hasUrgency = urgencyKeywords.some((keyword) => includesKeyword(text, keyword));
  const level: RiskLevel =
    categories.length === 0
      ? 'none'
      : categories.length >= 2 || hasUrgency
        ? 'pause_triggered'
        : 'risk_detected';

  return { categories, matchedKeywords, level };
}

/** 用尽量短的对方消息后缀解释“本次为什么触发”，并列出所有贡献原话。 */
export function detectPauseTrigger(themMessages: { id: string; text: string }[]): {
  detection: RiskDetectionResult;
  triggerMessageIds: string[];
  triggerTexts: string[];
} {
  if (themMessages.length === 0) {
    return {
      detection: { categories: [], matchedKeywords: [], level: 'none' },
      triggerMessageIds: [],
      triggerTexts: [],
    };
  }

  for (let start = themMessages.length - 1; start >= 0; start -= 1) {
    const slice = themMessages.slice(start);
    const detection = detectRisk(slice.map((message) => message.text).join('\n'));
    if (detection.level === 'pause_triggered') {
      const contributing = slice.filter((message) => {
        const local = detectRisk(message.text);
        return local.categories.length > 0;
      });
      const quotes = contributing.length > 0 ? contributing : [slice[slice.length - 1]];
      return {
        detection,
        triggerMessageIds: quotes.map((message) => message.id),
        triggerTexts: quotes.map((message) => message.text),
      };
    }
  }

  const fallback = themMessages[themMessages.length - 1];
  return {
    detection: detectRisk(themMessages.map((message) => message.text).join('\n')),
    triggerMessageIds: [fallback.id],
    triggerTexts: [fallback.text],
  };
}
