type PauseCountdownProps = {
  seconds: number;
};

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

export function PauseCountdown({ seconds }: PauseCountdownProps) {
  return (
    <div className="countdown-block">
      <p className="countdown" aria-live="polite">
        {formatTime(seconds)}
      </p>
      {seconds === 0 ? <p className="pause-subtitle">暂停结束</p> : null}
    </div>
  );
}
