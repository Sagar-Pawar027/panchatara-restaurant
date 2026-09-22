import React from 'react';

/**
 * High-performance, luxury skeleton shimmer loader components for Panjtara Admin Portal.
 */
export function ShimmerBox({ className = '', ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={`relative overflow-hidden bg-white/[0.04] rounded-lg before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/[0.08] before:to-transparent ${className}`}
    />
  );
}

export function DashboardShimmer() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div className="space-y-2">
          <ShimmerBox className="h-8 w-64" />
          <ShimmerBox className="h-4 w-96" />
        </div>
        <div className="flex items-center gap-3">
          <ShimmerBox className="h-9 w-40" />
          <ShimmerBox className="h-9 w-9 rounded-lg" />
        </div>
      </div>

      {/* KPI Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-xl bg-[#181614] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <ShimmerBox className="h-3.5 w-24" />
              <ShimmerBox className="h-8 w-8 rounded-lg" />
            </div>
            <ShimmerBox className="h-8 w-32" />
            <ShimmerBox className="h-3 w-40" />
          </div>
        ))}
      </div>

      {/* Database Connection Pill Skeleton */}
      <div className="p-4 rounded-xl bg-[#181614] border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShimmerBox className="h-9 w-9 rounded-lg" />
          <div className="space-y-1.5">
            <ShimmerBox className="h-4 w-44" />
            <ShimmerBox className="h-3 w-64" />
          </div>
        </div>
        <ShimmerBox className="h-8 w-28 rounded-lg" />
      </div>

      {/* Two-Column Grid: Recent Reservations & Kitchen Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reservations Box Skeleton */}
        <div className="p-5 rounded-xl bg-[#181614] border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <ShimmerBox className="h-5 w-40" />
            <ShimmerBox className="h-4 w-20" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShimmerBox className="w-10 h-10 rounded-full" />
                  <div className="space-y-1.5">
                    <ShimmerBox className="h-4 w-32" />
                    <ShimmerBox className="h-3 w-48" />
                  </div>
                </div>
                <ShimmerBox className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Kitchen Orders Box Skeleton */}
        <div className="p-5 rounded-xl bg-[#181614] border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <ShimmerBox className="h-5 w-40" />
            <ShimmerBox className="h-4 w-20" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <ShimmerBox className="h-4 w-28" />
                  <ShimmerBox className="h-5 w-16 rounded" />
                </div>
                <ShimmerBox className="h-3 w-52" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MenuManagerShimmer() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div className="space-y-2">
          <ShimmerBox className="h-8 w-60" />
          <ShimmerBox className="h-4 w-80" />
        </div>
        <div className="flex items-center gap-3">
          <ShimmerBox className="h-10 w-10 rounded-lg" />
          <ShimmerBox className="h-10 w-36 rounded-lg" />
        </div>
      </div>

      {/* Category Pills Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <ShimmerBox key={i} className="h-8 w-24 rounded-full flex-shrink-0" />
        ))}
      </div>

      {/* Menu Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl bg-[#181614] border border-white/10 overflow-hidden flex flex-col">
            <ShimmerBox className="w-full h-44 rounded-none" />
            <div className="p-4 flex-1 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <ShimmerBox className="h-5 w-36" />
                <ShimmerBox className="h-5 w-16" />
              </div>
              <ShimmerBox className="h-3.5 w-full" />
              <ShimmerBox className="h-3.5 w-4/5" />
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <ShimmerBox className="h-6 w-20 rounded-full" />
                <div className="flex items-center gap-2">
                  <ShimmerBox className="h-8 w-8 rounded-lg" />
                  <ShimmerBox className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReservationsShimmer() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div className="space-y-2">
          <ShimmerBox className="h-8 w-60" />
          <ShimmerBox className="h-4 w-72" />
        </div>
        <div className="flex items-center gap-3">
          <ShimmerBox className="h-10 w-10 rounded-lg" />
          <ShimmerBox className="h-10 w-40 rounded-lg" />
        </div>
      </div>

      {/* Filter Chips & Inputs Skeleton */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <ShimmerBox key={i} className="h-8 w-20 rounded-full flex-shrink-0" />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <ShimmerBox className="h-10 w-48 rounded-lg" />
          <ShimmerBox className="h-10 w-36 rounded-lg" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border border-white/10 bg-[#181614] overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <ShimmerBox className="h-4 w-32" />
          <ShimmerBox className="h-4 w-24" />
        </div>
        <div className="divide-y divide-white/5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-[200px]">
                <ShimmerBox className="w-10 h-10 rounded-full" />
                <div className="space-y-1.5">
                  <ShimmerBox className="h-4 w-32" />
                  <ShimmerBox className="h-3 w-28" />
                </div>
              </div>
              <ShimmerBox className="h-4 w-36 hidden sm:block" />
              <ShimmerBox className="h-4 w-28 hidden md:block" />
              <ShimmerBox className="h-6 w-20 rounded-full" />
              <div className="flex items-center gap-2">
                <ShimmerBox className="h-8 w-24 rounded-lg" />
                <ShimmerBox className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OrdersShimmer() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div className="space-y-2">
          <ShimmerBox className="h-8 w-72" />
          <ShimmerBox className="h-4 w-96" />
        </div>
        <ShimmerBox className="h-10 w-10 rounded-lg" />
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <ShimmerBox key={i} className="h-8 w-24 rounded-full flex-shrink-0" />
        ))}
      </div>

      {/* Orders Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-xl bg-[#181614] border border-white/10 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <ShimmerBox className="h-5 w-40" />
                <ShimmerBox className="h-3.5 w-28" />
              </div>
              <ShimmerBox className="h-6 w-24 rounded-full" />
            </div>

            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
              <ShimmerBox className="h-3 w-full" />
              <ShimmerBox className="h-3 w-4/5" />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <ShimmerBox className="h-5 w-24" />
              <ShimmerBox className="h-8 w-32 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettingsShimmer() {
  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between pb-5 border-b border-white/10">
        <div className="space-y-2">
          <ShimmerBox className="h-8 w-64" />
          <ShimmerBox className="h-4 w-96" />
        </div>
        <ShimmerBox className="h-9 w-28 rounded-lg" />
      </div>

      {/* Database Box Skeleton */}
      <div className="p-5 rounded-xl bg-[#181614] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShimmerBox className="w-10 h-10 rounded-lg" />
            <div className="space-y-1.5">
              <ShimmerBox className="h-4 w-40" />
              <ShimmerBox className="h-3 w-60" />
            </div>
          </div>
          <ShimmerBox className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      {/* Form Fields Skeleton */}
      <div className="p-6 rounded-xl bg-[#181614] border border-white/10 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <ShimmerBox className="h-4 w-32" />
            <ShimmerBox className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <ShimmerBox className="h-4 w-28" />
            <ShimmerBox className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <ShimmerBox className="h-4 w-24" />
            <ShimmerBox className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <ShimmerBox className="h-4 w-36" />
            <ShimmerBox className="h-10 w-full rounded-lg" />
          </div>
        </div>
        <div className="space-y-2">
          <ShimmerBox className="h-4 w-32" />
          <ShimmerBox className="h-20 w-full rounded-lg" />
        </div>
        <div className="flex justify-end">
          <ShimmerBox className="h-10 w-36 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
