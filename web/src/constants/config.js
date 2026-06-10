export const WS_URL        = 'ws://192.168.1.1/ws';
export const RECONNECT_MS  = 3000;

export const FULL_VOLTAGE  = 1.52;   // AA 완충 기준
export const MIN_VOLTAGE   = 0.90;   // 방전 완료 (0%)

// 판정 기준
export const THRESHOLD_GOOD = 1.3;   // 이상 → 양호
export const THRESHOLD_OK   = 1.1;   // 이상 → 보통 / 미만 → 교체 필요

// 완충 상태(100%)에서 일반 부하 기준 총 사용 가능 시간 (분)
// AA 알카라인 기준 약 3시간 (중간 부하 ~200mA 기준)
export const FULL_LIFE_MINUTES = 180;
