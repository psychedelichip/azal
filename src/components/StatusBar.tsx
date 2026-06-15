import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now.toLocaleTimeString("en-GB", { hour12: false });
}

export function StatusBar() {
  const clock = useClock();

  return (
    <footer className="flex items-center justify-between border-t border-gray-200 bg-white px-4 text-xs text-gray-500 shrink-0" style={{ height: 36 }}>
      <div className="flex items-center gap-4 min-w-0 overflow-hidden">
        <span className="shrink-0">Venue: <span className="text-gray-900 font-medium">Kalshi</span></span>
        <span className="shrink-0">Session: <span className="text-gray-900 font-medium">Open</span></span>
        <span className="shrink-0">Feed latency: <span className="text-gray-900 font-medium">32ms</span></span>
        <span className="flex items-center gap-1 shrink-0"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> WebSocket connected</span>
        <span className="text-gray-400 shrink-0 tabular-nums">{clock}</span>
      </div>
      <button className="flex items-center gap-1.5 border border-gray-200 rounded-md px-2.5 py-1 text-gray-600 hover:bg-gray-50 shrink-0"><MessageSquare className="w-3.5 h-3.5" /> Chat (overlay)</button>
    </footer>
  );
}
