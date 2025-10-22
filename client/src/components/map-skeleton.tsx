import { Skeleton } from "@/components/ui/skeleton";

export function MapSkeleton() {
  return (
    <div className="h-full w-full flex flex-col bg-card p-4 lg:p-6 gap-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-32" />
      </div>
      
      {/* Map area skeleton */}
      <div className="flex-1 relative rounded-lg overflow-hidden">
        <Skeleton className="absolute inset-0" />
        
        {/* Simulated marker positions */}
        <div className="absolute top-1/4 left-1/4">
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <div className="absolute top-1/3 right-1/3">
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <div className="absolute bottom-1/3 left-2/3">
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <div className="absolute top-2/3 right-1/4">
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        
        {/* Loading text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </div>
      </div>
      
      {/* Legend skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}
