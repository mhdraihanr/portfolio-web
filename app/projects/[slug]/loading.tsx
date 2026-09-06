export default function ProjectDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-10 w-40 rounded-md bg-gray-200 dark:bg-gray-800 mb-8" />
          <div className="h-12 w-3/4 rounded-md bg-gray-200 dark:bg-gray-800 mb-4" />
          <div className="h-6 w-full rounded-md bg-gray-200 dark:bg-gray-800 mb-6" />
          <div className="flex gap-4 mb-8">
            <div className="h-10 w-32 rounded-md bg-gray-200 dark:bg-gray-800" />
            <div className="h-10 w-32 rounded-md bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-8 bg-gray-200 dark:bg-gray-800" />
          <div className="h-40 rounded-lg bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
}
