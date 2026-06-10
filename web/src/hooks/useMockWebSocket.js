import { useState, useEffect, useRef } from 'react';
import { FULL_VOLTAGE, MIN_VOLTAGE } from '../constants/config';

const TOTAL_TICKS   = 100;
const TICK_MS       = 800;  // 실제 5s → dev는 0.8s로 빠르게
const SWITCH_ON_MS  = 2000; // 연결 후 2초 뒤 스위치 ON 시뮬레이션

export function useMockWebSocket() {
  const [connected, setConnected] = useState(false);
  const [data, setData]           = useState(null);
  const tick   = useRef(0);
  const ivRef  = useRef(null);

  useEffect(() => {
    // 600ms 후 연결 성공 → idle
    const tConnect = setTimeout(() => {
      setConnected(true);
      setData({ voltage: FULL_VOLTAGE, status: 'idle' });
    }, 600);

    // 연결 후 SWITCH_ON_MS 뒤 스위치 ON → measuring 시작
    const tSwitch = setTimeout(() => {
      ivRef.current = setInterval(() => {
        const ratio   = tick.current / TOTAL_TICKS;
        const voltage = parseFloat((FULL_VOLTAGE - (FULL_VOLTAGE - MIN_VOLTAGE) * ratio).toFixed(3));
        const status  = tick.current >= TOTAL_TICKS ? 'done' : 'measuring';
        setData({ voltage, status });
        tick.current += 1;
        if (status === 'done') clearInterval(ivRef.current);
      }, TICK_MS);
    }, 600 + SWITCH_ON_MS);

    return () => {
      clearTimeout(tConnect);
      clearTimeout(tSwitch);
      clearInterval(ivRef.current);
    };
  }, []);

  return { connected, data };
}
