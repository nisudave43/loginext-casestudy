import { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";

const UpdateStatus = ({ lastUpdated }: { lastUpdated: string }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const diffSeconds = useMemo(() => {
    return Math.floor((now - new Date(lastUpdated).getTime()) / 1000);
  }, [now, lastUpdated]);

  const formatAgo = (s: number) => {
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    return `${Math.floor(s / 3600)}h ago`;
  };

  const nextUpdateIn = Math.max(0, 180 - diffSeconds);

  const formatNext = (s: number) => {
    if (s <= 0) return "now";
    if (s < 60) return `~${s}s`;
    return `~${Math.floor(s / 60)}m`;
  };

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-gray-200 bg-gray-50 text-xs text-gray-600 w-full">
  <Clock size={14} className="text-gray-500" />
  <span>
    Updated {formatAgo(diffSeconds)}
    <span className="mx-1 opacity-40">•</span>
    Next update in {formatNext(nextUpdateIn)}
  </span>
</div>
  );
};

export default UpdateStatus;