import { useEffect, useRef } from 'react';
import type { ScenarioMessage } from '../data/scenarios';
import type { DemoPhase } from '../demoPhase';

type CallPanelProps = {
  scenarioTitle: string;
  themName: string;
  meName: string;
  messages: ScenarioMessage[];
  phase: DemoPhase;
  triggerTexts?: string[];
  tryPreviewActive?: boolean;
};

function Avatar({ name, tone }: { name: string; tone: 'them' | 'me' }) {
  return (
    <span className={`avatar avatar-${tone}`} aria-hidden="true">
      {name.slice(0, 1)}
    </span>
  );
}

function scrollToLatest(list: HTMLDivElement | null) {
  if (!list) {
    return;
  }

  const run = () => {
    list.scrollTop = list.scrollHeight;
    const last = list.querySelector('.chat-row:last-child');
    if (last instanceof HTMLElement) {
      last.scrollIntoView({ block: 'end', inline: 'nearest' });
    }
  };

  run();
  window.requestAnimationFrame(() => {
    run();
    window.requestAnimationFrame(run);
  });
}

export function CallPanel({
  scenarioTitle,
  themName,
  meName,
  messages,
  phase,
  triggerTexts = [],
  tryPreviewActive = false,
}: CallPanelProps) {
  const holding = phase === 'paused';
  const ended = phase === 'ended';
  const focusClass =
    tryPreviewActive && phase === 'idle'
      ? ' is-dimmed'
      : phase === 'monitoring' || phase === 'riskDetected'
        ? ' is-focus'
        : '';
  const listRef = useRef<HTMLDivElement>(null);
  const latestTrigger = triggerTexts[triggerTexts.length - 1] ?? '';

  useEffect(() => {
    if (holding || ended) {
      return;
    }

    scrollToLatest(listRef.current);
  }, [messages, phase, holding, ended]);

  return (
    <section className={`panel call-panel${holding || ended ? ' is-hold' : ''}${focusClass}`} aria-label="沟通画面">
      <div className="panel-heading">
        <div>
          <p className="view-kicker">沟通画面</p>
          <h2>双方对话</h2>
          <p className="quiet-note">{scenarioTitle}</p>
        </div>
        <p>{ended ? '已结束' : holding ? '已暂停接管' : '沟通中'}</p>
      </div>

      {holding ? (
        <div className="takeover-panel">
          <p className="pause-subtitle">沟通已被暂停接管</p>
          <p>对方新消息已拦截，不再继续显示。</p>
          <p className="message">对方看到：请稍候，我正在确认这件事。</p>
          {latestTrigger ? <p className="quiet-note">已拦截：{latestTrigger}</p> : null}
        </div>
      ) : ended ? (
        <div className="takeover-panel">
          <p className="pause-subtitle">沟通已结束</p>
          <p>没有继续执行对方要求。</p>
          {latestTrigger ? <p className="quiet-note">最后拦截：{latestTrigger}</p> : null}
        </div>
      ) : messages.length === 0 ? (
        <div className="hold-copy">
          <p className="safety-note">点「开始演示」后，双方消息会左右来回出现。</p>
        </div>
      ) : (
        <div className="chat-list" ref={listRef}>
          {messages.map((message) => {
            const mine = message.side === 'me';
            const name = mine ? meName : themName;

            return (
              <article className={`chat-row ${mine ? 'is-me' : 'is-them'} appear`} key={message.id}>
                {!mine ? <Avatar name={name} tone="them" /> : null}
                <div className={`bubble ${mine ? 'bubble-me' : 'bubble-them'}`}>
                  <p className="speaker">{message.speaker}</p>
                  <p>{message.text}</p>
                </div>
                {mine ? <Avatar name={name} tone="me" /> : null}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
