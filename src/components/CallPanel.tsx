import { useEffect, useRef, type RefObject } from 'react';
import type { ScenarioMessage } from '../data/scenarios';
import type { DemoPhase } from '../demoPhase';

type CallPanelProps = {
  scenarioTitle: string;
  themName: string;
  meName: string;
  messages: ScenarioMessage[];
  phase: DemoPhase;
  triggerTexts?: string[];
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

function MessageList({
  messages,
  themName,
  meName,
  listRef,
  frozen = false,
}: {
  messages: ScenarioMessage[];
  themName: string;
  meName: string;
  listRef?: RefObject<HTMLDivElement | null>;
  frozen?: boolean;
}) {
  return (
    <div className={`chat-list${frozen ? ' is-frozen' : ''}`} ref={listRef} aria-hidden={frozen || undefined}>
      {messages.map((message) => {
        const mine = message.side === 'me';
        const name = mine ? meName : themName;

        return (
          <article className={`chat-row ${mine ? 'is-me' : 'is-them'}${frozen ? '' : ' appear'}`} key={message.id}>
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
  );
}

export function CallPanel({
  scenarioTitle,
  themName,
  meName,
  messages,
  phase,
  triggerTexts = [],
}: CallPanelProps) {
  const holding = phase === 'paused';
  const ended = phase === 'ended';
  const focusClass = phase === 'monitoring' || phase === 'riskDetected' ? ' is-focus' : '';
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

      {holding || ended ? (
        <div className="takeover-stage">
          {messages.length > 0 ? (
            <MessageList messages={messages} themName={themName} meName={meName} frozen />
          ) : (
            <div className="hold-copy">
              <p className="safety-note">沟通画面已冻结。</p>
            </div>
          )}
          <div className={`takeover-mask${ended ? ' is-ended' : ''}`} tabIndex={0}>
            <div className="takeover-core">
              <p className="takeover-kicker">
                <span className="takeover-mark" aria-hidden="true" />
                {ended ? 'PAUSE 结束' : 'PAUSE 介入'}
              </p>
              <div className="pause-glyph" aria-hidden="true">
                <span />
                <span />
              </div>
              <h3 className="takeover-title">{ended ? '沟通已结束' : '沟通暂停'}</h3>
              <p className="takeover-sub">
                {ended ? '没有继续执行对方要求。' : '对方新消息已拦截，不再继续显示。'}
              </p>
              {holding ? (
                <p className="takeover-reply">对方看到：请稍候，我正在确认这件事。</p>
              ) : null}
              {latestTrigger ? <p className="takeover-intercept">已拦截：{latestTrigger}</p> : null}
            </div>
          </div>
        </div>
      ) : messages.length === 0 ? (
        <div className="hold-copy">
          <p className="safety-note">点「开始演示」后，双方消息会左右来回出现。</p>
        </div>
      ) : (
        <MessageList messages={messages} themName={themName} meName={meName} listRef={listRef} />
      )}
    </section>
  );
}
