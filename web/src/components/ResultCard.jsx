import { FULL_VOLTAGE, MIN_VOLTAGE, THRESHOLD_GOOD, THRESHOLD_OK, FULL_LIFE_MINUTES } from '../constants/config';

function judge(voltage) {
  if (voltage == null)             return { label: '—',         color: '#9E9E9E' };
  if (voltage >= THRESHOLD_GOOD)   return { label: '양호',      color: '#4CAF50' };
  if (voltage >= THRESHOLD_OK)     return { label: '보통',      color: '#FFC107' };
  return                                  { label: '교체 필요', color: '#F44336' };
}

function formatTime(minutes) {
  if (minutes < 1) return '1분 미만';
  if (minutes < 60) return `약 ${Math.round(minutes)}분`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `약 ${h}시간 ${m}분` : `약 ${h}시간`;
}

export default function ResultCard({ voltage, isDone }) {
  const { label, color } = judge(voltage);
  const pct = voltage != null
    ? Math.min(100, Math.max(0, ((voltage - MIN_VOLTAGE) / (FULL_VOLTAGE - MIN_VOLTAGE)) * 100))
    : null;

  const remainMinutes = pct != null ? (pct / 100) * FULL_LIFE_MINUTES : null;

  return (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      {isDone && (
        <span style={{
          fontSize: 12, fontWeight: 700, letterSpacing: '0.5px',
          color: '#1565C0', background: '#E3F2FD',
          padding: '3px 10px', borderRadius: 99,
        }}>
          측정 완료
        </span>
      )}

      <p style={{
        margin: 0,
        fontSize: 72,
        fontWeight: 800,
        letterSpacing: '-2px',
        lineHeight: 1.05,
        color,
        transition: 'color 0.5s ease',
      }}>
        {label}
      </p>

      {pct != null && (
        <p style={{ margin: 0, fontSize: 22, fontWeight: 500, color, opacity: 0.75, transition: 'color 0.5s' }}>
          {voltage.toFixed(2)} V · {Math.round(pct)}%
        </p>
      )}

      {remainMinutes != null && (
        <p style={{
          margin: '4px 0 0',
          fontSize: 17,
          fontWeight: 500,
          color: '#757575',
        }}>
          이대로 사용 시 <span style={{ color, fontWeight: 700, transition: 'color 0.5s' }}>{formatTime(remainMinutes)}</span> 남음
        </p>
      )}
    </div>
  );
}
