import { Suspense } from "react";
import { Range, RangeSkeleton } from "@/components/Range";

export const dynamic = 'force-dynamic';

export async function rangeLoader() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/random-range`, {
    cache: "no-store"
  });

  const data = await res.json();
  const { min, max } = data;

  return (
    <Range
      min={min}
      max={max}
      initialMin={min}
      initialMax={max}
      unit="€"
    />
  );
}

export default function Page() {
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <Suspense fallback={<RangeSkeleton />}>
        {rangeLoader()}
      </Suspense>
    </div>
  );
}
