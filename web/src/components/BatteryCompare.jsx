import { FULL_VOLTAGE, MIN_VOLTAGE, THRESHOLD_GOOD, THRESHOLD_OK } from '../constants/config';

const RANGE = FULL_VOLTAGE - MIN_VOLTAGE;

function voltageToPercent(v) {
  return Math.min(100, Math.max(0, ((v - MIN_VOLTAGE) / RANGE) * 100));
}

function colorFor(voltage) {
  if (voltage == null)           return '#BDBDBD';
  if (voltage >= THRESHOLD_GOOD) return '#4CAF50';
  if (voltage >= THRESHOLD_OK)   return '#FFC107';
  return '#F44336';
}

// 배터리 모형 SVG
// 본체: W×H, 오른쪽에 돌출 단자(+극) 붙음
function BatteryShape({ percent, color, animated }) {
  const W = 320, H = 52;
  const TW = 10, TH = 22; // 단자 크기
  const R = 8;             // 모서리 반경
  const PAD = 5;           // 내부 여백
  const innerW = W - PAD * 2;
  const innerH = H - PAD * 2;
  const fillW = (innerW * percent) / 100;

  const clipId = `clip-${color.replace('#', '')}-${animated ? 'a' : 'b'}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      {/* 본체 — 가로로 늘어남 */}
      <svg
        style={{ flex: 1, display: 'block' }}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
      >
        <rect x={0} y={0} width={W} height={H} rx={R} ry={R} fill="#E0E0E0" />
        <rect x={PAD} y={PAD} width={innerW} height={innerH} rx={R - 2} ry={R - 2} fill="#F5F5F5" />
        {percent > 0 && (
          <>
            <clipPath id={clipId}>
              <rect x={PAD} y={PAD} width={innerW} height={innerH} rx={R - 2} ry={R - 2} />
            </clipPath>
            <rect
              x={PAD} y={PAD}
              width={fillW} height={innerH}
              rx={R - 2} ry={R - 2}
              fill={color}
              clipPath={`url(#${clipId})`}
              style={{ transition: animated ? 'width 0.5s ease, fill 0.5s ease' : 'none' }}
            />
          </>
        )}
        <rect x={0} y={0} width={W} height={H} rx={R} ry={R} fill="none" stroke="#BDBDBD" strokeWidth={1.5} />
      </svg>
      {/* +극 단자 — 고정 크기 */}
      <svg width={TW} height={H} viewBox={`0 0 ${TW} ${H}`} style={{ display: 'block', flexShrink: 0 }}>
        <rect x={0} y={(H - TH) / 2} width={TW} height={TH} rx={2} ry={2} fill="#BDBDBD" />
      </svg>
    </div>
  );
}

export default function BatteryCompare({ voltage }) {
  const currentPercent = voltage != null ? voltageToPercent(voltage) : null;
  const color          = colorFor(voltage);
  const noData         = voltage == null;

  return (
    <div style={{ width: '100%', maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* 완충 기준선 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 16, fontWeight: 500, color: '#9E9E9E' }}>완충 시</span>
          <span style={{ fontSize: 18, fontWeight: 600, color: '#9E9E9E' }}>
            {FULL_VOLTAGE.toFixed(2)} V
          </span>
        </div>
        <BatteryShape percent={100} color="#BDBDBD" animated={false} />
      </div>

      {/* 현재 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 16, fontWeight: 500, color: '#424242' }}>현재</span>
          <span style={{ fontSize: 18, fontWeight: 600, color: noData ? '#BDBDBD' : color, transition: 'color 0.5s' }}>
            {noData ? '— V' : `${voltage.toFixed(2)} V`}
          </span>
        </div>
        <BatteryShape
          percent={noData ? 0 : currentPercent}
          color={noData ? '#EEEEEE' : color}
          animated
        />
        {!noData && (
          <div style={{ textAlign: 'right', fontSize: 14, color: '#9E9E9E', marginTop: -4 }}>
            {Math.round(currentPercent)}%
          </div>
        )}
      </div>
    </div>
  );
}
