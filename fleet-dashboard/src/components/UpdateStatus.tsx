import { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";

/* ─────────────────────────────────────────────
   Update Status Component
   - Shows "last updated" relative time
   - Shows countdown to next update (assumed 3 min cycle)
   - Updates every second
───────────────────────────────────────────── */
const UpdateStatus = ({ lastUpdated }: { lastUpdated: string }) => {
  const [now, setNow] = useState(Date.now());

  /* ── Tick every second to refresh relative time ── */
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* ─────────────────────────────────────────────
     Time Difference (seconds)
     - Difference between now and lastUpdated
  ───────────────────────────────────────────── */
  const diffSeconds = useMemo(() => {
    const last = new Date(lastUpdated).getTime();

    // guard against invalid date
    if (isNaN(last)) return 0;

    return Math.floor((now - last) / 1000);
  }, [now, lastUpdated]);

  /* ── Format "time ago" helper ── */
  const formatAgo = (s: number) => {
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    return `${Math.floor(s / 3600)}h ago`;
  };

  /* ─────────────────────────────────────────────
     Next update countdown (assumed 3 min = 180s)
  ───────────────────────────────────────────── */
  const NEXT_UPDATE_INTERVAL = 180;
  const nextUpdateIn = Math.max(0, NEXT_UPDATE_INTERVAL - diffSeconds);

  /* ── Format countdown helper ── */
  const formatNext = (s: number) => {
    if (s <= 0) return "now";
    if (s < 60) return `~${s}s`;
    return `~${Math.floor(s / 60)}m`;
  };

  return (
    <div className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-gray-600">
      
      {/* Clock icon */}
      <Clock size={14} className="text-gray-500" />

      {/* Status text */}
      <span>
        Updated {formatAgo(diffSeconds)}

        <span className="mx-1 opacity-40">•</span>

        Next update in {formatNext(nextUpdateIn)}
      </span>
    </div>
  );
};

export default UpdateStatus;