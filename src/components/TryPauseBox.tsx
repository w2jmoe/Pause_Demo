import { useState } from 'react';
import { detectRisk, type RiskDetectionResult } from '../rules/riskRules';

type TryPauseBoxProps = {
  disabled?: boolean;
  onDetect: (payload: { text: string; detection: RiskDetectionResult } | null) => void;
};

export function TryPauseBox({ disabled = false, onDetect }: TryPauseBoxProps) {
  const [text, setText] = useState('');

  function handleDetect() {
    if (disabled) {
      return;
    }

    const value = text.trim();
    if (!value) {
      onDetect(null);
      return;
    }

    onDetect({ text: value, detection: detectRisk(value) });
  }

  return (
    <section className="try-box" aria-label="试试 PAUSE">
      <div className="try-heading">
        <h2>试试 PAUSE</h2>
        <p className="try-lead">输入一句话点检测，结果会显示在右侧「你的视角」。单一风险只提示；多类风险或带紧迫措辞才会触发 PAUSE。</p>
      </div>
      <div className="try-row">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleDetect();
            }
          }}
          placeholder="例如：请把验证码告诉我 / 请立即转账否则冻结"
          aria-label="风险检测输入"
          disabled={disabled}
        />
        <button type="button" onClick={handleDetect} disabled={disabled}>
          检测
        </button>
      </div>
      <p className="try-hint">
        {disabled ? '演示进行中，请先点「重置」后再检测' : '检测后请看右侧高亮区域'}
      </p>
    </section>
  );
}
