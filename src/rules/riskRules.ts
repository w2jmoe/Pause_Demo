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
  credential: '不要把验证码发给对方，自己打开官方 App 或网站核对。',
  remoteAccess: '先别安装，也别允许对方控制你的电脑。',
  money: '先别转账，换一个官方渠道重新核实。',
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
