import { Suspense } from "react";
import { Range, RangeSkeleton } from "@/components/Range";

export const dynamic = 'force-dynamic';

export async function rangeLoader() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/range-values`, {
    cache: "no-store"
  });

  const values = await res.json();

  return (
    <Range
      min={values.rangeValues[0]}
      max={values.rangeValues[values.rangeValues.length - 1]}
      values={values.rangeValues}
      initialMin={values.rangeValues[0]}
      initialMax={values.rangeValues[values.rangeValues.length - 1]}
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
