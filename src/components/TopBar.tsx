import type { DemoPhase } from '../demoPhase';

type TopBarProps = {
  phase: DemoPhase;
  onReset: () => void;
};

const stateLabel: Record<DemoPhase, string> = {
  idle: '准备开始',
  monitoring: '演示进行中',
  riskDetected: '发现风险',
  paused: 'PAUSE 已启动',
  ended: '已结束',
};

export function TopBar({ phase, onReset }: TopBarProps) {
  return (
    <header className="topbar">
      <div>
        <p className="brand">PAUSE</p>
        <h1>先停一下</h1>
        <p className="product-line">AI 防诈护盾</p>
      </div>
      <div className="topbar-actions">
        <p className={phase === 'paused' || phase === 'ended' ? 'state-pill is-active' : 'state-pill'}>{stateLabel[phase]}</p>
        <button type="button" className="ghost reset-btn" onClick={onReset}>
          重置
        </button>
      </div>
    </header>
  );
}
