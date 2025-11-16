export function RangeSkeleton() {
    return (
      <div className="relative animate-pulse mx-14 p-2">
        <div className="h-1.5 w-full bg-gray-300 rounded" />
        <div className="w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-between">
          <div className="size-6 bg-gray-300 rounded-full" />
          <div className="size-6 bg-gray-300 rounded-full" />
        </div>
      </div>
    );
}