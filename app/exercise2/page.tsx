import { Range } from "@/components/Range";

export const dynamic = 'force-dynamic';

export default async function Page() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/range-values`);
  const values = await res.json();

  return (
      <div className="w-full max-w-md mx-auto p-6">
        <Range
          min={values.rangeValues[0]}
          max={values.rangeValues[values.rangeValues.length - 1]}
          values={values.rangeValues}
          initialMin={values.rangeValues[0]}
          initialMax={values.rangeValues[values.rangeValues.length - 1]}
          unit="€"
        />
      </div>
  )
}