export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-10 w-40 rounded-md bg-gray-200 dark:bg-gray-800 mb-8" />
          <div className="h-10 w-64 rounded-md bg-gray-200 dark:bg-gray-800 mx-auto mb-4" />
          <div className="h-6 w-96 max-w-full rounded-md bg-gray-200 dark:bg-gray-800 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg bg-gray-200 dark:bg-gray-800 aspect-video"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
