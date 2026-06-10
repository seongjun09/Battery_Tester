import { useState, useEffect, useRef, useCallback } from 'react';
import { WS_URL, RECONNECT_MS } from '../constants/config';

export function useWebSocket() {
  const [connected, setConnected] = useState(false);
  const [data, setData] = useState(null);
  const wsRef    = useRef(null);
  const timerRef = useRef(null);
  const alive    = useRef(true);

  const connect = useCallback(() => {
    if (!alive.current) return;
    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;
      ws.onopen    = () => { if (alive.current) { setConnected(true); clearTimeout(timerRef.current); } };
      ws.onmessage = (e) => { if (alive.current) try { setData(JSON.parse(e.data)); } catch {} };
      ws.onclose   = () => { if (alive.current) { setConnected(false); timerRef.current = setTimeout(connect, RECONNECT_MS); } };
      ws.onerror   = () => ws.close();
    } catch {
      timerRef.current = setTimeout(connect, RECONNECT_MS);
    }
  }, []);

  useEffect(() => {
    alive.current = true;
    connect();
    return () => { alive.current = false; clearTimeout(timerRef.current); wsRef.current?.close(); };
  }, [connect]);

  return { connected, data };
}
