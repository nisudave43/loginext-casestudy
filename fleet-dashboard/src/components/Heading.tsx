/* ─────────────────────────────────────────────
   Heading Component
   - Displays dashboard title
   - Shows short description + context
───────────────────────────────────────────── */

const Heading = () => {
  return (
    <div className="w-full border-b border-gray-200 pb-2">
      
      {/* ── Title Row ── */}
      <div className="mb-1 flex items-center gap-2">
        <span className="text-lg">🚛</span>

        <h1 className="m-0 !text-xl font-semibold leading-none text-gray-900">
          Fleet Tracking Dashboard
        </h1>
      </div>

      {/* ── Subtitle / Context ── */}
      <p className="flex items-center text-xs text-gray-500">
        <span>Real-time vehicle monitoring</span>

        {/* separator dot */}
        <span className="mx-1">•</span>

        <span>LogiNext Case Study</span>
      </p>
    </div>
  );
};

export default Heading;