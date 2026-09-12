import type { RiskCategory } from '../rules/riskRules';

export type ScenarioId = 'acquaintance-urgent-transfer' | 'crypto-support-scam' | 'fake-job-interview';

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
  /** 本场景触发后，按风险类别给出的对应建议（优先于通用文案） */
  adviceByCategory: Partial<Record<RiskCategory, string>>;
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
    id: 'acquaintance-urgent-transfer',
    title: '冒充老板｜财务紧急转账',
    subtitle: '假群冒充 + 紧急转账',
    description: '对方在工作群里自称老板，要求财务先付款、后补手续。',
    callerLabel: '对方 / 来电方',
    themName: '周总',
    meName: '我',
    adviceByCategory: {
      money:
        '先别转账。当前沟通正在催你执行高风险转账，还要求先付款、后补手续。即使头像、昵称、群里看起来都是老板和同事，也请用你平时联系周总的号码单独回拨，或当面/电话问清行程的人；不要只凭这个群确认身份。',
    },
    messages: [
      {
        id: 'acq-1',
        side: 'them',
        speaker: '周总',
        text: '小王，我临时拉了这个群。项目那边在等，财务这边就你跟我对接。',
        delayMs: 1100,
      },
      {
        id: 'acq-2',
        side: 'me',
        speaker: '我',
        text: '周总，这是新群吗？我怎么没在公司群里看到通知。',
        delayMs: 1500,
      },
      {
        id: 'acq-3',
        side: 'them',
        speaker: '周总',
        text: '对外先别声张。李副总和行政小陈我也拉进来了，你看群成员。客户对保密要求很严。',
        delayMs: 2000,
      },
      {
        id: 'acq-4',
        side: 'me',
        speaker: '我',
        text: '看到了。需要走哪一笔？合同和审批单我这边还没收到。',
        delayMs: 1500,
      },
      {
        id: 'acq-5',
        side: 'them',
        speaker: '周总',
        text: '华南那单的项目保证金，今天下午前对方账户要对上，晚了合作黄。',
        delayMs: 1900,
      },
      {
        id: 'acq-6',
        side: 'me',
        speaker: '我',
        text: '按公司流程要先补齐审批。我给您打个电话确认一下？',
        delayMs: 1400,
      },
      {
        id: 'acq-7',
        side: 'them',
        speaker: '周总',
        text: '别打电话，我在见客户。群里这几个人都知道，你办事一直利索，别让我在外面被动。',
        delayMs: 2000,
      },
      // 第 1 次暂停：转账 + 紧迫（先付款、后补手续）
      {
        id: 'acq-8',
        side: 'them',
        speaker: '周总',
        text: '马上转账 86 万到这个账户：招商银行 6225 8801 3366 3188，户名深圳恒启商务。手续我回来补，先把进度保住。',
        delayMs: 2400,
      },
      // —— 返回沟通后 ——
      {
        id: 'acq-9',
        side: 'them',
        speaker: '周总',
        text: '小王？对方财务在催，你动作快点。',
        delayMs: 1600,
      },
      {
        id: 'acq-10',
        side: 'me',
        speaker: '我',
        text: '金额不小，我再核一下户名。',
        delayMs: 1500,
      },
      {
        id: 'acq-11',
        side: 'them',
        speaker: '周总',
        text: '你再磨，下午对接就断了。别让全组看着财务卡壳。',
        delayMs: 1800,
      },
      // 第 2 次暂停
      {
        id: 'acq-12',
        side: 'them',
        speaker: '周总',
        text: '现在就处理，立即转账，截图发群里。其余流程我来解决。',
        delayMs: 2200,
      },
      // —— 再次返回 ——
      {
        id: 'acq-13',
        side: 'them',
        speaker: '周总',
        text: '群里都看着呢，你还在等什么。',
        delayMs: 1600,
      },
      // 第 3 次暂停 → 强制结束
      {
        id: 'acq-14',
        side: 'them',
        speaker: '周总',
        text: '马上打款到刚才那个账户，否则这单今晚就黄了。',
        delayMs: 2200,
      },
    ],
  },
  {
    id: 'crypto-support-scam',
    title: '加密资产客服诈骗',
    subtitle: '假客服 + 验证码 / 远程',
    description: '假客服先自报家门、核对信息建立信任，再逐步要验证码、远程协助和转账。',
    callerLabel: '对方 / 来电方',
    themName: 'Google 支持 · 陈工',
    meName: '我',
    adviceByCategory: {
      credential:
        '不要把验证码或密码发给对方。正规平台不会在电话/聊天里向你索要验证码。请自己打开官方 App 或官网查看是否有异常登录；若刚收到验证码短信，切勿回传。',
      remoteAccess:
        '先别安装 AnyDesk 等远程工具，也别把设备码发给对方。一旦连上，对方往往能直接操作你的电脑和账户。请结束当前要求，自行到官网核验；若已安装，立即断网卸载并改密。',
      money:
        '先别转到对方给的「安全钱包」或地址。假客服常用「临时保全」话术骗你转出资产。请自己打开官方 App 或官网核实账户状态，切勿按聊天里的地址转币。',
    },
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
        text: '系统会按注册邮箱推送。我先核对一下：您的邮箱是不是尾号 6，常用名是不是小武？昨晚新加坡方向有过一次登录尝试。',
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
      // 第 2 次暂停：远程工具（点名软件 + 让受害者自搜官网，更像真骗子）
      {
        id: 'crypto-14',
        side: 'them',
        speaker: '陈工',
        text: '请立即安装 AnyDesk（版本 8），装好后把九位设备码发我，我们远程协助您点完刚才的安全确认。您可自己搜官网，我们不发不明链接。',
        delayMs: 2600,
      },
      // —— 再次返回 ——
      {
        id: 'crypto-15',
        side: 'them',
        speaker: '陈工',
        text: '小武？个案还挂着，您怎么又不说话了？',
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
        text: '临时保全……是要我转多少？转到哪里？',
        delayMs: 1400,
      },
      // 第 3 次暂停 → 强制结束：典型「全部资产转入骗子安全钱包」
      {
        id: 'crypto-19',
        side: 'them',
        speaker: '陈工',
        text: '请立即把账户里的全部资产转账到安全钱包做临时保全，金额以您账户余额为准。收款地址（USDT-TRC20）：TXpause9SafeHold7kQm2nR4sH8wLp3cY6vF，转完把交易哈希发我，备注可填个案号 AC-918274。这是暂存保护，不是扣走，否则账户会被冻结，后面就不好帮您申诉了。',
        delayMs: 3000,
      },
    ],
  },
  {
    id: 'fake-job-interview',
    title: '虚假招聘面试',
    subtitle: '假招聘 + 安装 / 保证金',
    description: '假 HR 先恭喜、核对简历并营造稀缺感，再逐步要安装客户端、远程协助和保证金。',
    callerLabel: '对方 / 招聘方',
    themName: '星启科技 · 林 HR',
    meName: '我',
    adviceByCategory: {
      remoteAccess:
        '先别安装对方发来的客户端，也别允许远程访问。正规面试很少要求你装陌生软件并交出电脑控制权。请回到招聘平台或公司官网核实岗位与面试安排；若已安装，立即断网卸载。',
      money:
        '先别交「岗位保证金」或按对方账户转账。正规招聘几乎不会在入职前让你私下打款。请通过招聘平台官方入口或公司公示联系方式核实，不要按聊天里的个人账户汇款。',
    },
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
        text: '理解。不过考官账号和题库都在内部环境「星启 Meet Pro」里，外网会议进不去题面。前面两位候补已经在准备了，您要是卡在工具上，名额可能会让出去。',
        delayMs: 2300,
      },
      {
        id: 'job-8',
        side: 'me',
        speaker: '我',
        text: '星启 Meet Pro？我怎么拿到？',
        delayMs: 1400,
      },
      // 第 1 次暂停：点名软件 + 模拟发安装包附件
      {
        id: 'job-9',
        side: 'them',
        speaker: '林 HR',
        text: '请立即安装「星启 Meet Pro」。[附件] XingQiMeet_Setup_v3.2.1.exe（12.4 MB）——点开安装后进面试间，否则今天的终面资格会被取消。',
        delayMs: 2600,
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
      // 第 2 次暂停：远程访问（顺带点名工具）
      {
        id: 'job-16',
        side: 'them',
        speaker: '林 HR',
        text: '请立即允许我们的技术人员用 ToDesk 远程访问您的电脑，我们马上帮您打开面试间。设备码出来后发我即可。',
        delayMs: 2500,
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
        text: '原路退回的话……要转到哪里？金额多少？',
        delayMs: 1400,
      },
      // 第 3 次暂停 → 强制结束：虚构但对公细节齐全
      {
        id: 'job-21',
        side: 'them',
        speaker: '林 HR',
        text: '请立即转账 880 元到对公账户完成保证金支付：开户行招商银行上海分行，户名 上海星启网络科技有限公司，账号 1219 0538 6621 889，备注填您的姓名拼音，否则今天的录用名额会取消，后面也不好再帮您争取。',
        delayMs: 2800,
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
