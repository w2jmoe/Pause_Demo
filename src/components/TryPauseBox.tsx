import { useState } from 'react';
import { categoryLabel, detectRisk, type RiskDetectionResult } from '../rules/riskRules';

function describeResult(result: RiskDetectionResult) {
  if (result.level === 'none') {
    return '正常，不触发 PAUSE';
  }

  const names = result.categories.map((category) => categoryLabel[category]).join('、');
  return result.level === 'pause_triggered' ? `触发 PAUSE：${names}` : `发现：${names}`;
}

export function TryPauseBox() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<RiskDetectionResult | null>(null);

  function handleDetect() {
    const value = text.trim();
    if (!value) {
      setResult(null);
      return;
    }

    setResult(detectRisk(value));
  }

  return (
    <section className="try-box" aria-label="试试 PAUSE">
      <h2>试试 PAUSE</h2>
      <div className="try-row">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleDetect();
            }
          }}
          placeholder="输入一句话，例如：请把验证码告诉我。"
          aria-label="风险检测输入"
        />
        <button type="button" onClick={handleDetect}>
          检测
        </button>
      </div>
      <p className="try-result">{text.trim() && result ? describeResult(result) : '结果会显示在这里'}</p>
    </section>
  );
}
