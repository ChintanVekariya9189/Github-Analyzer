const SkeletonRepoCard = () => {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 animate-pulse space-y-4">
      {/* Repo name + icon row */}
      <div className="flex items-start justify-between gap-2">
        <div className="h-5 bg-[#0d1117] border border-[#30363d] rounded w-2/3" />
        <div className="w-4 h-4 bg-[#0d1117] border border-[#30363d] rounded flex-shrink-0" />
      </div>

      {/* Description lines */}
      <div className="space-y-2">
        <div className="h-3 bg-[#0d1117] border border-[#30363d] rounded w-full" />
        <div className="h-3 bg-[#0d1117] border border-[#30363d] rounded w-5/6" />
      </div>

      {/* Footer: language badge + stars + forks */}
      <div className="flex items-center gap-4 pt-1">
        <div className="h-4 bg-[#0d1117] border border-[#30363d] rounded w-16" />
        <div className="h-4 bg-[#0d1117] border border-[#30363d] rounded w-12" />
        <div className="h-4 bg-[#0d1117] border border-[#30363d] rounded w-12" />
      </div>
    </div>
  );
};

const SkeletonRepo = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonRepoCard key={i} />
        ))}
      </div>
    </div>
  );
};

export default SkeletonRepo;
