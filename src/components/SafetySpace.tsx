import { categoryLabel, detectRisk, resolveCategoryAdvice, type RiskCategory, type RiskDetectionResult } from '../rules/riskRules';
import { HighlightedQuote } from './HighlightedQuote';
import { PauseCountdown } from './PauseCountdown';

type SafetySpaceProps = {
  detection: RiskDetectionResult;
  remainingSeconds: number;
  confirmReturn: boolean;
  triggerTexts: string[];
  pauseRound: number;
  adviceByCategory?: Partial<Record<RiskCategory, string>>;
  onExtend: () => void;
  onRequestReturn: () => void;
  onContinueCall: () => void;
  onKeepPaused: () => void;
  onEnd: () => void;
};

export function SafetySpace({
  detection,
  remainingSeconds,
  confirmReturn,
  triggerTexts,
  pauseRound,
  adviceByCategory,
  onExtend,
  onRequestReturn,
  onContinueCall,
  onKeepPaused,
  onEnd,
}: SafetySpaceProps) {
  const { categories, matchedKeywords } = detection;

  return (
    <section className="panel user-panel is-paused is-focus" aria-label="你的视角">
      <div className="panel-heading">
        <div>
          <p className="view-kicker">你的视角</p>
          <h2>安全空间</h2>
          <p className="quiet-note">只有你能看到 · 第 {pauseRound} 次暂停</p>
        </div>
        <p>已暂停</p>
      </div>

      <div className="safety-scroll">
        <div className="safety-grid">
          <div className="safety-main">
            <h2 className="safety-title">先停一下</h2>
            {triggerTexts.length > 0 ? (
              <div className="trigger-quotes">
                <p className="trigger-quote-label">对方刚说：</p>
                <ul>
                  {triggerTexts.map((text) => (
                    <li key={text}>
                      <HighlightedQuote text={text} keywords={detectRisk(text).matchedKeywords} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <p className="risk-line">本次触发：{categories.map((category) => categoryLabel[category]).join('、')}</p>
            {matchedKeywords.length > 0 ? (
              <p className="quiet-note">命中：{matchedKeywords.slice(0, 4).join('、')}</p>
            ) : null}

            <PauseCountdown seconds={remainingSeconds} />

            <div className="advice-box">
              <p className="pause-subtitle">建议</p>
              <ul>
                {categories.map((category) => (
                  <li key={category}>
                    <strong>{categoryLabel[category]}：</strong>
                    {resolveCategoryAdvice(category, adviceByCategory)}
                  </li>
                ))}
              </ul>
              <p className="principle">PAUSE 不替你做决定，只帮你先停下来。</p>
            </div>
          </div>

          <div className="safety-side">
            {confirmReturn ? (
              <div className="confirm-box">
                <p className="pause-subtitle">确定继续沟通？</p>
                <p>对方刚提出高风险要求，请先自己核实。</p>
                <div className="action-row">
                  <button type="button" onClick={onContinueCall}>
                    继续沟通
                  </button>
                  <button type="button" className="ghost" onClick={onKeepPaused}>
                    继续暂停
                  </button>
                </div>
              </div>
            ) : (
              <div className="action-row">
                <button type="button" onClick={onExtend}>
                  延长 5 分钟
                </button>
                <button type="button" className="ghost" onClick={onRequestReturn}>
                  返回沟通
                </button>
                <button type="button" className="quiet" onClick={onEnd}>
                  安全结束
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
