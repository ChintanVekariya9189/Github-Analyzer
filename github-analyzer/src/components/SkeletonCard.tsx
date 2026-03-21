const SkeletonCard = () => {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 flex flex-col items-center lg:items-start gap-6 animate-pulse">
      {/* Avatar placeholder */}
      <div className="w-48 h-48 lg:w-full lg:h-48 rounded-xl bg-[#0d1117] border border-[#30363d]" />

      {/* Info placeholder */}
      <div className="w-full text-center lg:text-left space-y-4 pt-1">
        {/* Name */}
        <div className="h-6 bg-[#0d1117] border border-[#30363d] rounded-lg w-3/4 mx-auto lg:mx-0" />
        {/* Username */}
        <div className="h-4 bg-[#0d1117] border border-[#30363d] rounded w-1/2 mx-auto lg:mx-0" />
        
        {/* Bio — two lines */}
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-[#0d1117] border border-[#30363d] rounded w-full" />
          <div className="h-3 bg-[#0d1117] border border-[#30363d] rounded w-4/5" />
        </div>

        {/* Stats stack */}
        <div className="pt-4 border-t border-[#30363d] space-y-3">
          <div className="h-4 bg-[#0d1117] border border-[#30363d] rounded w-2/3 mx-auto lg:mx-0" />
          <div className="h-4 bg-[#0d1117] border border-[#30363d] rounded w-2/3 mx-auto lg:mx-0" />
          <div className="h-4 bg-[#0d1117] border border-[#30363d] rounded w-1/2 mx-auto lg:mx-0" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
