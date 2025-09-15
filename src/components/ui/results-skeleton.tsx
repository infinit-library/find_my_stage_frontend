import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ResultsSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Loading Message */}
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Loading results...</h2>
          <p className="text-sm text-gray-500">Preparing your speaking opportunities</p>
        </div>

        {/* Header Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-80" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Top 20 Results Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="overflow-hidden shadow-lg">
              {/* Header Skeleton - Image placeholder */}
              <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              {/* Content Skeleton */}
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 100+ More Opportunities Section Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-64" />
          <div className="relative border rounded-lg overflow-hidden">
            <div className="divide-y">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <div className="hidden sm:block ml-4">
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ResultsSkeleton };
