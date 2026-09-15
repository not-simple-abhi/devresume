import { cn } from '@/lib/utils';

interface ShimmerSkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

export default function ShimmerSkeleton({
  width,
  height,
  className,
}: ShimmerSkeletonProps) {
  return (
    <div
      style={{ width: width ?? '100%', height: height ?? '1rem' }}
      className={cn('animate-shimmer rounded', className)}
    />
  );
}
