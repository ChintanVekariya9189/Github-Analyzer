const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 animate-pulse">
      {/* Avatar placeholder */}
      <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 ring-4 ring-gray-100 dark:ring-gray-800" />

      {/* Info placeholder */}
      <div className="flex-1 w-full text-center sm:text-left space-y-3">
        {/* Name */}
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 mx-auto sm:mx-0" />
        {/* Username */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto sm:mx-0" />
        {/* Bio — two lines */}
        <div className="space-y-2 pt-1">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full max-w-sm mx-auto sm:mx-0" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5 max-w-xs mx-auto sm:mx-0" />
        </div>

        {/* Stats row */}
        <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-6 pt-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
