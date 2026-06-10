export default function StatusBadge({ connected, status }) {
  const map = {
    disconnected: { dot: '#EF5350', bg: '#FFEBEE', text: '#C62828', label: '연결 안됨' },
    measuring:    { dot: '#4CAF50', bg: '#E8F5E9', text: '#2E7D32', label: '측정 중'   },
    done:         { dot: '#2196F3', bg: '#E3F2FD', text: '#1565C0', label: '측정 완료' },
    idle:         { dot: '#4CAF50', bg: '#E8F5E9', text: '#2E7D32', label: '연결 성공' },
  };

  const key = !connected ? 'disconnected' : (status ?? 'idle');
  const s   = map[key] ?? map.idle;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: s.bg, color: s.text,
      padding: '5px 12px', borderRadius: 99,
      fontSize: 13, fontWeight: 600, letterSpacing: '0.1px',
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%',
        background: s.dot,
        animation: key === 'measuring' ? 'pulse 1.6s ease-in-out infinite' : 'none',
      }} />
      {s.label}
    </span>
  );
}
