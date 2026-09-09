export type ScenarioId = 'crypto-support-scam' | 'fake-job-interview';

export type MessageSide = 'them' | 'me';

export type ScenarioMessage = {
  id: string;
  side: MessageSide;
  speaker: string;
  text: string;
  delayMs: number;
};

export type Scenario = {
  id: ScenarioId;
  title: string;
  subtitle: string;
  description: string;
  callerLabel: string;
  themName: string;
  meName: string;
  messages: ScenarioMessage[];
};

/**
 * 话术参考真实社工 SOP（非照抄）：
 * 自报家门 → 工单/个案号 → 核对碎片信息建信 → 制造「我在帮你」 →
 * 再升级到验证码 / 远程工具 / 转账，并夹带紧迫与轻度 PUA。
 * 三次暂停各自独立触发，中间铺垫句刻意避开风险关键词。
 */
export const scenarios: Scenario[] = [
  {
    id: 'crypto-support-scam',
    title: '加密资产客服诈骗',
    subtitle: 'Fake Support / Crypto Scam',
    description: '假客服先自报家门、核对信息建立信任，再逐步要验证码、远程协助和转账。',
    callerLabel: '对方 / 来电方',
    themName: 'Google 支持 · 陈工',
    meName: '我',
    messages: [
      {
        id: 'crypto-1',
        side: 'them',
        speaker: '陈工',
        text: '您好，我是 Google 账户安全中心的陈工，工号 G-4821。这边有一份关于您账号的安全个案，个案号 AC-918274。',
        delayMs: 1100,
      },
      {
        id: 'crypto-2',
        side: 'me',
        speaker: '我',
        text: '安全个案？你们怎么找到我的？',
        delayMs: 1500,
      },
      {
        id: 'crypto-3',
        side: 'them',
        speaker: '陈工',
        text: '系统会按注册邮箱推送。我先核对一下：您的邮箱是不是尾号 6，常用名是不是小周？昨晚新加坡方向有过一次登录尝试。',
        delayMs: 2200,
      },
      {
        id: 'crypto-4',
        side: 'me',
        speaker: '我',
        text: '邮箱对得上……但我人一直在国内啊。',
        delayMs: 1500,
      },
      {
        id: 'crypto-5',
        side: 'them',
        speaker: '陈工',
        text: '那就对上了。别紧张，我这边会先帮您把这次异常拦下来，您配合做两步确认就行。过程里请先别退出，个案超时会被自动关闭。',
        delayMs: 2200,
      },
      {
        id: 'crypto-6',
        side: 'me',
        speaker: '我',
        text: '好，那我要做什么？',
        delayMs: 1300,
      },
      // 第 1 次暂停：OTP（真实套路：谎称「取消未授权操作」）
      {
        id: 'crypto-7',
        side: 'them',
        speaker: '陈工',
        text: '请立即把刚才发到您手机上的验证码念给我，否则这次未授权登录会继续生效。',
        delayMs: 2200,
      },
      // —— 返回沟通后 ——
      {
        id: 'crypto-8',
        side: 'them',
        speaker: '陈工',
        text: '还在吗？个案还开着，刚才信号好像抖了一下。',
        delayMs: 1600,
      },
      {
        id: 'crypto-9',
        side: 'me',
        speaker: '我',
        text: '在的，我刚刚在想这件事靠不靠谱。',
        delayMs: 1500,
      },
      {
        id: 'crypto-10',
        side: 'them',
        speaker: '陈工',
        text: '理解您谨慎。很多人第一次接到也会犹豫。可您要是拖太久，后台会默认您放弃处理，风险就还在账号上。',
        delayMs: 2200,
      },
      {
        id: 'crypto-11',
        side: 'me',
        speaker: '我',
        text: '那验证这一步卡在哪儿了？',
        delayMs: 1400,
      },
      {
        id: 'crypto-12',
        side: 'them',
        speaker: '陈工',
        text: '手机侧确认过了，电脑侧会话还没对齐。我这边看不到您屏幕上的提示，只能由技术同事临时协助您点完那两下。',
        delayMs: 2200,
      },
      {
        id: 'crypto-13',
        side: 'me',
        speaker: '我',
        text: '协助是指……你们要连我电脑吗？',
        delayMs: 1500,
      },
      // 第 2 次暂停：远程工具（常伪装「官方站下载、不发链接」）
      {
        id: 'crypto-14',
        side: 'them',
        speaker: '陈工',
        text: '请立即安装 AnyDesk，我们远程协助您把刚才的安全确认点完。您可以自己搜官网，我们不发链接。',
        delayMs: 2400,
      },
      // —— 再次返回 ——
      {
        id: 'crypto-15',
        side: 'them',
        speaker: '陈工',
        text: '小周？个案还挂着，您怎么又不说话了？',
        delayMs: 1700,
      },
      {
        id: 'crypto-16',
        side: 'me',
        speaker: '我',
        text: '我还在核实你们是不是官方渠道。',
        delayMs: 1500,
      },
      {
        id: 'crypto-17',
        side: 'them',
        speaker: '陈工',
        text: '您慢慢核实也行，但资产那边已经标黄了。合规要求先做一次临时保全，做完会退回您本人名下，这是保护，不是扣走。',
        delayMs: 2300,
      },
      {
        id: 'crypto-18',
        side: 'me',
        speaker: '我',
        text: '临时保全具体要我做什么？',
        delayMs: 1400,
      },
      // 第 3 次暂停 → 强制结束：转「安全账户」
      {
        id: 'crypto-19',
        side: 'them',
        speaker: '陈工',
        text: '请立即把资产转到安全账户完成支付保护，否则账户会被冻结，后面就不好帮您申诉了。',
        delayMs: 2400,
      },
    ],
  },
  {
    id: 'fake-job-interview',
    title: '虚假招聘面试',
    subtitle: 'Fake Job Interview',
    description: '假 HR 先恭喜、核对简历并营造稀缺感，再逐步要安装客户端、远程协助和保证金。',
    callerLabel: '对方 / 招聘方',
    themName: '星启科技 · 林 HR',
    meName: '我',
    messages: [
      {
        id: 'job-1',
        side: 'them',
        speaker: '林 HR',
        text: '您好，我是星启科技招聘的林静，您在招聘平台投的「远程运营助理」简历我们看过了。',
        delayMs: 1100,
      },
      {
        id: 'job-2',
        side: 'me',
        speaker: '我',
        text: '您好林老师，有下文了吗？',
        delayMs: 1400,
      },
      {
        id: 'job-3',
        side: 'them',
        speaker: '林 HR',
        text: '有的。您本科、有两年客服相关经历对吧？今天有一个终面名额空出来，想先问您方便不方便。',
        delayMs: 2000,
      },
      {
        id: 'job-4',
        side: 'me',
        speaker: '我',
        text: '方便，线上还是线下？',
        delayMs: 1300,
      },
      {
        id: 'job-5',
        side: 'them',
        speaker: '林 HR',
        text: '线上。岗位本身也是居家协作，所以终面会在我们内部协作环境里做一小段实操，大概十五分钟。',
        delayMs: 2000,
      },
      {
        id: 'job-6',
        side: 'me',
        speaker: '我',
        text: '可以用腾讯会议吗？我这边比较熟。',
        delayMs: 1400,
      },
      {
        id: 'job-7',
        side: 'them',
        speaker: '林 HR',
        text: '理解。不过考官账号和题库都在内部环境，外网会议进不去题面。前面两位候补已经在准备了，您要是卡在工具上，名额可能会让出去。',
        delayMs: 2300,
      },
      {
        id: 'job-8',
        side: 'me',
        speaker: '我',
        text: '那我怎么进你们那个环境？',
        delayMs: 1400,
      },
      // 第 1 次暂停：安装客户端
      {
        id: 'job-9',
        side: 'them',
        speaker: '林 HR',
        text: '请立即安装这个客户端进入面试间，否则今天的终面资格会被取消。',
        delayMs: 2200,
      },
      // —— 返回沟通后 ——
      {
        id: 'job-10',
        side: 'them',
        speaker: '林 HR',
        text: '还在吗？考官已经进线了，就差您这边。',
        delayMs: 1600,
      },
      {
        id: 'job-11',
        side: 'me',
        speaker: '我',
        text: '在的，我刚才在想这个软件靠不靠谱。',
        delayMs: 1500,
      },
      {
        id: 'job-12',
        side: 'them',
        speaker: '林 HR',
        text: '您谨慎是好事。不过您要是一直犹豫，考官那边会记「候选人配合度不足」，后面复试就难排了。',
        delayMs: 2100,
      },
      {
        id: 'job-13',
        side: 'me',
        speaker: '我',
        text: '我这边页面好像打不开……',
        delayMs: 1400,
      },
      {
        id: 'job-14',
        side: 'them',
        speaker: '林 HR',
        text: '常见情况。技术同事可以帮您看一眼权限设置，很多人卡在这一步，点两下就好了。',
        delayMs: 2000,
      },
      {
        id: 'job-15',
        side: 'me',
        speaker: '我',
        text: '怎么帮看？',
        delayMs: 1200,
      },
      // 第 2 次暂停：远程访问
      {
        id: 'job-16',
        side: 'them',
        speaker: '林 HR',
        text: '请立即允许我们的技术人员远程访问您的电脑，我们马上帮您打开面试间。',
        delayMs: 2300,
      },
      // —— 再次返回 ——
      {
        id: 'job-17',
        side: 'them',
        speaker: '林 HR',
        text: '您好？考官还在等，今天名额真的只留到这一轮。',
        delayMs: 1700,
      },
      {
        id: 'job-18',
        side: 'me',
        speaker: '我',
        text: '我再确认一下流程，怎么突然还要交钱？',
        delayMs: 1600,
      },
      {
        id: 'job-19',
        side: 'them',
        speaker: '林 HR',
        text: '不是培训费哦。远程岗位要先交一笔岗位保证金，证明您会认真入职；通过试用期会原路退回，合同里也会写。很多候选人这一步都过了。',
        delayMs: 2400,
      },
      {
        id: 'job-20',
        side: 'me',
        speaker: '我',
        text: '原路退回的话……要转到哪里？',
        delayMs: 1400,
      },
      // 第 3 次暂停 → 强制结束：保证金转账
      {
        id: 'job-21',
        side: 'them',
        speaker: '林 HR',
        text: '请立即转账到这个账户完成保证金支付，否则今天的录用名额会取消，后面也不好再帮您争取。',
        delayMs: 2400,
      },
    ],
  },
];

export function getScenario(id: ScenarioId) {
  return scenarios.find((scenario) => scenario.id === id) ?? scenarios[0];
}

export function themText(messages: ScenarioMessage[]) {
  return messages
    .filter((message) => message.side === 'them')
    .map((message) => message.text)
    .join('\n');
}

export function lastThemMessage(messages: ScenarioMessage[]) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index].side === 'them') {
      return messages[index];
    }
  }

  return null;
}
