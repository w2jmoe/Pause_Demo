import { useEffect, useState } from 'react';
import { CallPanel } from './components/CallPanel';
import { ScenarioPicker } from './components/ScenarioPicker';
import { TopBar } from './components/TopBar';
import { TryPauseBox } from './components/TryPauseBox';
import { UserPanel } from './components/UserPanel';
import { getScenario, scenarios, themText, type ScenarioId } from './data/scenarios';
import { detectPauseTrigger, detectRisk, type RiskDetectionResult } from './rules/riskRules';
import type { DemoPhase } from './demoPhase';

const PAUSE_SECONDS = 5 * 60;
const MAX_PAUSE_ROUNDS = 3;
/** 触发句先在左侧露脸，再进入安全空间（演示观众需要先看清） */
const PAUSE_NOTICE_MS = 2000;

const emptyDetection: RiskDetectionResult = {
  categories: [],
  matchedKeywords: [],
  level: 'none',
};

const guideText: Record<DemoPhase, string> = {
  idle: '先选场景，再点开始演示',
  monitoring: '看左侧「沟通画面」：双方正在对话',
  riskDetected: '看右侧「你的视角」：发现高风险要求',
  paused: '看右侧「你的视角」：沟通已暂停接管，由你决定下一步',
  ended: '演示结束，可换场景重来',
};

type PendingPause = {
  detection: RiskDetectionResult;
  triggerTexts: string[];
  nextRound: number;
};

type TryPreview = {
  text: string;
  detection: RiskDetectionResult;
};

export default function App() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>('crypto-support-scam');
  const [phase, setPhase] = useState<DemoPhase>('idle');
  /** 左侧实际展示到的消息数 */
  const [displayCount, setDisplayCount] = useState(0);
  /** 剧本推进位置（与 displayCount 同步推进） */
  const [scriptIndex, setScriptIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(PAUSE_SECONDS);
  const [confirmReturn, setConfirmReturn] = useState(false);
  const [resumeFromCount, setResumeFromCount] = useState<number | null>(null);
  const [pauseDetection, setPauseDetection] = useState<RiskDetectionResult>(emptyDetection);
  const [pauseRound, setPauseRound] = useState(0);
  const [forcedEnd, setForcedEnd] = useState(false);
  const [triggerTexts, setTriggerTexts] = useState<string[]>([]);
  /** 每次暂停对应的对方原话（强制结束时回顾） */
  const [pauseHistory, setPauseHistory] = useState<string[][]>([]);
  const [pendingPause, setPendingPause] = useState<PendingPause | null>(null);
  const [tryPreview, setTryPreview] = useState<TryPreview | null>(null);

  const scenario = getScenario(scenarioId);
  const displayMessages = scenario.messages.slice(0, displayCount);
  const liveDetection = detectRisk(themText(displayMessages));

  useEffect(() => {
    if (phase !== 'monitoring' && phase !== 'riskDetected') {
      return;
    }

    if (pendingPause) {
      return;
    }

    if (scriptIndex >= scenario.messages.length) {
      return;
    }

    const nextMessage = scenario.messages[scriptIndex];
    const timer = window.setTimeout(() => {
      const nextMessages = scenario.messages.slice(0, scriptIndex + 1);
      const gateSlice =
        resumeFromCount === null ? nextMessages : nextMessages.slice(resumeFromCount);
      const gateThem = gateSlice
        .filter((message) => message.side === 'them')
        .map((message) => ({ id: message.id, text: message.text }));
      const gateDetection = detectRisk(themText(gateSlice));

      if (gateDetection.level === 'pause_triggered') {
        const explained = detectPauseTrigger(gateThem);
        // 先让左侧出现触发句，观众看清后再进入安全空间
        setScriptIndex((count) => count + 1);
        setDisplayCount((count) => count + 1);
        setConfirmReturn(false);
        setResumeFromCount(null);
        setPendingPause({
          detection: explained.detection,
          triggerTexts: explained.triggerTexts,
          nextRound: pauseRound + 1,
        });
        setPhase('monitoring');
        return;
      }

      setScriptIndex((count) => count + 1);
      setDisplayCount((count) => count + 1);

      if (gateDetection.level === 'risk_detected') {
        setPhase('riskDetected');
      } else {
        setPhase('monitoring');
      }
    }, nextMessage.delayMs);

    return () => window.clearTimeout(timer);
  }, [phase, scriptIndex, scenario, resumeFromCount, pauseRound, pendingPause]);

  useEffect(() => {
    if (!pendingPause) {
      return;
    }

    const timer = window.setTimeout(() => {
      setPauseDetection(pendingPause.detection);
      setTriggerTexts(pendingPause.triggerTexts);
      setPauseRound(pendingPause.nextRound);
      setPauseHistory((history) => [...history, pendingPause.triggerTexts]);
      setPendingPause(null);

      if (pendingPause.nextRound >= MAX_PAUSE_ROUNDS) {
        setForcedEnd(true);
        setPhase('ended');
        return;
      }

      setPhase('paused');
      setRemainingSeconds(PAUSE_SECONDS);
    }, PAUSE_NOTICE_MS);

    return () => window.clearTimeout(timer);
  }, [pendingPause]);

  useEffect(() => {
    if (phase !== 'paused' || remainingSeconds === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setRemainingSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [phase, remainingSeconds]);

  function resetRuntime() {
    setPhase('idle');
    setDisplayCount(0);
    setScriptIndex(0);
    setRemainingSeconds(PAUSE_SECONDS);
    setConfirmReturn(false);
    setResumeFromCount(null);
    setPauseDetection(emptyDetection);
    setPauseRound(0);
    setForcedEnd(false);
    setTriggerTexts([]);
    setPauseHistory([]);
    setPendingPause(null);
    setTryPreview(null);
  }

  function startDemo() {
    resetRuntime();
    setPhase('monitoring');
  }

  function selectScenario(id: ScenarioId) {
    setScenarioId(id);
    resetRuntime();
  }

  function continueCall() {
    setConfirmReturn(false);
    setResumeFromCount(scriptIndex);
    setTriggerTexts([]);
    setPhase('monitoring');
  }

  const displayDetection = phase === 'paused' || (phase === 'ended' && forcedEnd) ? pauseDetection : liveDetection;
  const canChooseScenario = phase === 'idle' || phase === 'ended';
  const footerLabel =
    phase === 'ended' ? '返回开始' : phase === 'paused' ? '安全审查中' : phase === 'idle' ? '开始演示' : '演示进行中';

  const activeGuide = tryPreview && phase === 'idle'
    ? '看右侧「你的视角」：这是即时检测结果'
    : pendingPause
      ? '看左侧「沟通画面」：对方刚提出高风险要求'
      : resumeFromCount !== null && (phase === 'monitoring' || phase === 'riskDetected')
        ? '看左侧「沟通画面」：双方继续对话'
        : forcedEnd && phase === 'ended'
          ? '已 3 次发现高风险，沟通已强制结束'
          : guideText[phase];

  return (
    <main className="app">
      <section className={phase === 'paused' ? 'stage is-paused' : 'stage'} aria-label="PAUSE 演示界面">
        <TopBar phase={phase} onReset={resetRuntime} />
        <ScenarioPicker
          scenarios={scenarios}
          selectedId={scenarioId}
          disabled={!canChooseScenario}
          onSelect={selectScenario}
        />
        <p className="guide-bar" aria-live="polite">
          {activeGuide}
        </p>
        <div className="split">
          <CallPanel
            messages={displayMessages}
            phase={phase}
            scenarioTitle={scenario.title}
            themName={scenario.themName}
            meName={scenario.meName}
            triggerTexts={phase === 'paused' || forcedEnd ? triggerTexts : []}
            tryPreviewActive={Boolean(tryPreview && phase === 'idle')}
          />
          <UserPanel
            phase={phase}
            detection={displayDetection}
            remainingSeconds={remainingSeconds}
            confirmReturn={confirmReturn}
            triggerTexts={triggerTexts}
            pauseHistory={pauseHistory}
            forcedEnd={forcedEnd}
            pauseRound={pauseRound}
            tryPreview={tryPreview}
            onExtend={() => setRemainingSeconds((seconds) => seconds + PAUSE_SECONDS)}
            onRequestReturn={() => setConfirmReturn(true)}
            onContinueCall={continueCall}
            onKeepPaused={() => setConfirmReturn(false)}
            onEnd={() => {
              setConfirmReturn(false);
              setForcedEnd(false);
              setPhase('ended');
            }}
            onRestart={resetRuntime}
          />
        </div>
        <footer className="footer">
          <button type="button" disabled={phase !== 'idle' && phase !== 'ended'} onClick={phase === 'ended' ? resetRuntime : startDemo}>
            {footerLabel}
          </button>
        </footer>
      </section>
      <TryPauseBox
        disabled={phase !== 'idle'}
        onDetect={(payload) => {
          setTryPreview(payload);
        }}
      />
      <p className="site-credit">
        <a href="mailto:w2jmoe@gmail.com">w2jmoe@gmail.com</a>
        <span aria-hidden="true"> · </span>
        <a href="https://w2jmoe.github.io/jay-portfolio" target="_blank" rel="noreferrer">
          作品集
        </a>
      </p>
    </main>
  );
}
