import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted/75', className)}
      {...props}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Banner */}
      <Skeleton className="h-32 w-full rounded-2xl" />

      {/* Cards Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <Skeleton key={n} className="h-28 rounded-2xl" />
        ))}
      </div>

      {/* Layout Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-border/40 p-5 rounded-2xl space-y-4 bg-card/40">
          <div className="flex justify-between items-start">
            <Skeleton className="h-5 w-24 rounded-lg" />
            <Skeleton className="h-5 w-12 rounded-lg" />
          </div>
          <Skeleton className="h-6 w-3/4 rounded" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-6 w-20 rounded" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 5 }) {
  return (
    <div className="space-y-3.5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border border-border/40 rounded-xl bg-card/45">
          <div className="flex items-center gap-3 w-2/3">
            <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
            <div className="space-y-1.5 w-full">
              <Skeleton className="h-4 w-1/2 rounded" />
              <Skeleton className="h-3.5 w-3/4 rounded" />
            </div>
          </div>
          <Skeleton className="h-5 w-16 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function TimelineSkeleton({ count = 4 }) {
  return (
    <div className="relative pl-6 py-2 space-y-8">
      <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-muted/60" />
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="relative flex gap-4 w-full">
          <Skeleton className="w-10 h-10 rounded-full border border-muted shrink-0 z-10" />
          <div className="flex-1 border border-border/40 p-5 rounded-2xl space-y-3 bg-card/65">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
            <Skeleton className="h-5 w-2/3 rounded" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
