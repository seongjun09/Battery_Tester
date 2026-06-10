import { useWebSocket }     from './hooks/useWebSocket';
import { useMockWebSocket } from './hooks/useMockWebSocket';
import StatusBadge          from './components/StatusBadge';
import BatteryCompare       from './components/BatteryCompare';
import ResultCard           from './components/ResultCard';

const IS_DEV = import.meta.env.DEV;

function Dashboard({ connected, data }) {
  const voltage = data?.voltage ?? null;
  const status  = data?.status  ?? 'idle';

  const isMeasuring = status === 'measuring' || status === 'done';

  return (
    <div style={{
      minHeight: '100svh',
      background: '#F5F5F5',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
    }}>
      {/* 헤더 */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px',
        background: '#fff',
        borderBottom: '1px solid #E0E0E0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#212121', letterSpacing: '-0.3px' }}>
            Battery Tester
          </span>
          {IS_DEV && (
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
              background: '#FFF8E1', color: '#F57F17', letterSpacing: '0.5px',
            }}>
              MOCK
            </span>
          )}
        </div>
        <StatusBadge connected={connected} status={status} />
      </header>

      {/* 본문 */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 48,
        padding: '48px 32px',
        width: '100%',
      }}>
        {!connected && (
          <p style={{ margin: 0, fontSize: 20, color: '#9E9E9E', fontWeight: 500 }}>
            기기와 연결되지 않았습니다
          </p>
        )}

        {connected && !isMeasuring && (
          <p style={{ margin: 0, fontSize: 20, color: '#616161', fontWeight: 500 }}>
            스위치를 켜면 측정이 시작됩니다
          </p>
        )}

        {connected && isMeasuring && (
          <>
            <BatteryCompare voltage={voltage} />
            <ResultCard voltage={voltage} isDone={status === 'done'} />
          </>
        )}
      </main>
    </div>
  );
}

function RealApp() { return <Dashboard {...useWebSocket()}     />; }
function MockApp() { return <Dashboard {...useMockWebSocket()} />; }

export default function App() {
  return IS_DEV ? <MockApp /> : <RealApp />;
}
