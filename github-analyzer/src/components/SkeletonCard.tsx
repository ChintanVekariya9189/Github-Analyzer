const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] rounded-xl p-6 flex flex-col items-center lg:items-start gap-6 animate-pulse transition-colors duration-300">
      {/* Avatar placeholder */}
      <div className="w-48 h-48 lg:w-full lg:h-48 rounded-xl bg-gray-100 dark:bg-[#0d1117] border border-gray-200 dark:border-[#30363d] transition-colors duration-300" />

      {/* Info placeholder */}
      <div className="w-full text-center lg:text-left space-y-4 pt-1">
        {/* Name */}
        <div className="h-6 bg-gray-100 dark:bg-[#0d1117] border border-gray-200 dark:border-[#30363d] rounded-lg w-3/4 mx-auto lg:mx-0 transition-colors duration-300" />
        {/* Username */}
        <div className="h-4 bg-gray-100 dark:bg-[#0d1117] border border-gray-100 dark:border-[#30363d] rounded w-1/2 mx-auto lg:mx-0 transition-colors duration-300" />
        
        {/* Bio — two lines */}
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-gray-100 dark:bg-[#0d1117] border border-gray-100 dark:border-[#30363d] rounded w-full transition-colors duration-300" />
          <div className="h-3 bg-gray-100 dark:bg-[#0d1117] border border-gray-100 dark:border-[#30363d] rounded w-4/5 transition-colors duration-300" />
        </div>

        {/* Stats stack */}
        <div className="pt-4 border-t border-gray-200 dark:border-[#30363d] space-y-3 transition-colors duration-300">
          <div className="h-4 bg-gray-100 dark:bg-[#0d1117] border border-gray-100 dark:border-[#30363d] rounded w-2/3 mx-auto lg:mx-0 transition-colors duration-300" />
          <div className="h-4 bg-gray-100 dark:bg-[#0d1117] border border-gray-100 dark:border-[#30363d] rounded w-2/3 mx-auto lg:mx-0 transition-colors duration-300" />
          <div className="h-4 bg-gray-100 dark:bg-[#0d1117] border border-gray-100 dark:border-[#30363d] rounded w-1/2 mx-auto lg:mx-0 transition-colors duration-300" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
