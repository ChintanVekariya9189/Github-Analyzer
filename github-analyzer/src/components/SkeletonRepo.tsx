const SkeletonRepoCard = () => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4 animate-pulse space-y-3">
      {/* Repo name + icon row */}
      <div className="flex items-start justify-between gap-2">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0" />
      </div>

      {/* Description lines */}
      <div className="space-y-1.5">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
      </div>

      {/* Footer: language badge + stars + forks */}
      <div className="flex items-center gap-3 pt-1">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10" />
      </div>
    </div>
  );
};

/**
 * SkeletonRepo — renders 6 SkeletonRepoCard placeholders in a responsive grid,
 * matching the layout used by RepoList.
 */
const SkeletonRepo = () => {
  return (
    <div>
      {/* Header bar skeleton */}
      <div className="flex items-center justify-between mb-4 gap-3 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-36" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-36" />
      </div>

      {/* 6-card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonRepoCard key={i} />
        ))}
      </div>
    </div>
  );
};

export default SkeletonRepo;
