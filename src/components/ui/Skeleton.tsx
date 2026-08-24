type SkeletonProps = {
    className?: string;
  };
  
  export default function Skeleton({
    className = "",
  }: SkeletonProps) {
    return (
      <div
        aria-hidden="true"
        className={`animate-pulse rounded-lg bg-slate-200 ${className}`}
      />
    );
  }
  
  export function SkeletonText({
    lines = 3,
  }: {
    lines?: number;
  }) {
    return (
      <div
        className="space-y-2"
        aria-label="Loading"
      >
        {Array.from({ length: lines }).map(
          (_, index) => (
            <Skeleton
              key={index}
              className={`h-4 ${
                index === lines - 1
                  ? "w-2/3"
                  : "w-full"
              }`}
            />
          ),
        )}
      </div>
    );
  }