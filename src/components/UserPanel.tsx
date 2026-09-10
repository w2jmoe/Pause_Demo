import type { DemoPhase } from '../demoPhase';
import { categoryHint, categoryLabel, detectRisk, type RiskCategory, type RiskDetectionResult } from '../rules/riskRules';
import { HighlightedQuote } from './HighlightedQuote';
import { SafetySpace } from './SafetySpace';

type UserPanelProps = {
  phase: DemoPhase;
  detection: RiskDetectionResult;
  remainingSeconds: number;
  confirmReturn: boolean;
  triggerTexts: string[];
  pauseHistory: string[][];
  forcedEnd: boolean;
  pauseRound: number;
  adviceByCategory?: Partial<Record<RiskCategory, string>>;
  onExtend: () => void;
  onRequestReturn: () => void;
  onContinueCall: () => void;
  onKeepPaused: () => void;
  onEnd: () => void;
  onRestart: () => void;
};

export function UserPanel({
  phase,
  detection,
  remainingSeconds,
  confirmReturn,
  triggerTexts,
  pauseHistory,
  forcedEnd,
  pauseRound,
  adviceByCategory,
  onExtend,
  onRequestReturn,
  onContinueCall,
  onKeepPaused,
  onEnd,
  onRestart,
}: UserPanelProps) {
  if (phase === 'paused') {
    return (
      <SafetySpace
        detection={detection}
        remainingSeconds={remainingSeconds}
        confirmReturn={confirmReturn}
        triggerTexts={triggerTexts}
        pauseRound={pauseRound}
        adviceByCategory={adviceByCategory}
        onExtend={onExtend}
        onRequestReturn={onRequestReturn}
        onContinueCall={onContinueCall}
        onKeepPaused={onKeepPaused}
        onEnd={onEnd}
      />
    );
  }

  if (phase === 'ended') {
    return (
      <section className="panel user-panel is-paused is-focus" aria-label="你的视角">
        <div className="panel-heading">
          <div>
            <p className="view-kicker">你的视角</p>
            <h2>安全空间</h2>
          </div>
          <p>已结束</p>
        </div>
        <div className="safety-scroll">
          <div className="safety-copy">
            <h2 className="safety-title">{forcedEnd ? '已强制结束沟通' : '已安全结束'}</h2>
            <p className="safety-note">
              {forcedEnd
                ? `已连续 ${pauseRound} 次发现高风险要求，系统已结束与对方的沟通。`
                : '你没有按对方要求继续操作。'}
            </p>
            {forcedEnd && pauseHistory.length > 0 ? (
              <div className="trigger-quotes">
                <p className="trigger-quote-label">三次触发原话：</p>
                <ol className="pause-history">
                  {pauseHistory.map((quotes, index) => (
                    <li key={`round-${index}`}>
                      <p className="quiet-note">第 {index + 1} 次</p>
                      <ul>
                        {quotes.map((text) => (
                          <li key={text}>
                            <HighlightedQuote text={text} keywords={detectRisk(text).matchedKeywords} />
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
            {!forcedEnd && triggerTexts.length > 0 ? (
              <p className="quiet-note">
                对方最后说：
                <HighlightedQuote
                  text={triggerTexts[triggerTexts.length - 1]}
                  keywords={detectRisk(triggerTexts[triggerTexts.length - 1]).matchedKeywords}
                />
              </p>
            ) : null}
            {forcedEnd && detection.categories.length > 0 ? (
              <p className="risk-hint">
                最后一次触发：{detection.categories.map((category) => categoryLabel[category]).join('、')}
              </p>
            ) : null}
            <button type="button" onClick={onRestart}>
              返回开始
            </button>
          </div>
        </div>
      </section>
    );
  }

  const status = phase === 'riskDetected' ? '发现风险' : phase === 'monitoring' ? '正在观察' : '正常';
  const hints = detection.categories.map((category) => categoryHint[category]);
  const focusClass = phase === 'riskDetected' ? ' is-focus' : phase === 'monitoring' ? ' is-dimmed' : '';

  return (
    <section className={`panel user-panel${focusClass}`} aria-label="你的视角">
      <div className="panel-heading">
        <div>
          <p className="view-kicker">你的视角</p>
          <h2>安全提示</h2>
          <p className="quiet-note">只有你能看到</p>
        </div>
      </div>
      <div className="safety-scroll">
        <div className="safety-copy">
          <h2 className="safety-title">先停一下</h2>
          <p className="safety-note">危险操作发生前，先给你一点判断时间。</p>
          <p className="status-line">状态：{status}</p>
          {phase === 'riskDetected' ? <p className="risk-hint appear">风险提示：{hints.join('、')}</p> : null}
        </div>
      </div>
    </section>
  );
}
