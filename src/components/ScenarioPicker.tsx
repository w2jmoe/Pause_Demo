import type { Scenario, ScenarioId } from '../data/scenarios';

type ScenarioPickerProps = {
  scenarios: Scenario[];
  selectedId: ScenarioId;
  disabled: boolean;
  onSelect: (id: ScenarioId) => void;
};

export function ScenarioPicker({ scenarios, selectedId, disabled, onSelect }: ScenarioPickerProps) {
  return (
    <section className="scenario-picker" aria-label="选择演示场景">
      <h2>选择场景</h2>
      <div className="scenario-list">
        {scenarios.map((scenario) => {
          const selected = scenario.id === selectedId;

          return (
            <button
              key={scenario.id}
              type="button"
              className={selected ? 'scenario-card is-selected' : 'scenario-card'}
              disabled={disabled}
              onClick={() => onSelect(scenario.id)}
            >
              <span className="scenario-title">{scenario.title}</span>
              <span className="scenario-subtitle">{scenario.subtitle}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
