const Heading = () => {
  return (
    <div className="w-full  border-b border-gray-200 pb-2">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-lg">🚛</span>

        <h1 className="!m-0 !text-2xl !font-semibold !leading-none text-gray-900">
          Fleet Tracking Dashboard
        </h1>
      </div>

      <p className="flex items-center text-xs text-gray-500">
        <span>Real-time vehicle monitoring</span>
        <span className="mx-1">•</span>
        <span>LogiNext Case Study</span>
      </p>
    </div>
  );
};

export default Heading;