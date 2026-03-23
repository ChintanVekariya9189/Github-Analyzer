const SkeletonRepoCard = () => {
  return (
    <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] rounded-xl p-5 animate-pulse space-y-4 transition-colors duration-300 shadow-sm dark:shadow-none">
      {/* Repo name + icon row */}
      <div className="flex items-start justify-between gap-2">
        <div className="h-5 bg-gray-100 dark:bg-[#0d1117] border border-gray-200 dark:border-[#30363d] rounded w-2/3 transition-colors duration-300" />
        <div className="w-4 h-4 bg-gray-100 dark:bg-[#0d1117] border border-gray-100 dark:border-[#30363d] rounded flex-shrink-0 transition-colors duration-300" />
      </div>

      {/* Description lines */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 dark:bg-[#0d1117] border border-gray-100 dark:border-[#30363d] rounded w-full transition-colors duration-300" />
        <div className="h-3 bg-gray-100 dark:bg-[#0d1117] border border-gray-100 dark:border-[#30363d] rounded w-5/6 transition-colors duration-300" />
      </div>

      {/* Footer: language badge + stars + forks */}
      <div className="flex items-center gap-4 pt-1">
        <div className="h-4 bg-gray-100 dark:bg-[#0d1117] border border-gray-100 dark:border-[#30363d] rounded w-16 transition-colors duration-300" />
        <div className="h-4 bg-gray-100 dark:bg-[#0d1117] border border-gray-100 dark:border-[#30363d] rounded w-12 transition-colors duration-300" />
        <div className="h-4 bg-gray-100 dark:bg-[#0d1117] border border-gray-100 dark:border-[#30363d] rounded w-12 transition-colors duration-300" />
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
