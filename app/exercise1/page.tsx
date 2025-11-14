import { Range } from "@/components/Range";

export const dynamic = 'force-dynamic';

export default async function Page() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/random-range`);
  const data = await res.json();

  const { min, max } = data;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto p-6">
        <Range
          min={min}
          max={max}
          initialMin={min}
          initialMax={max}
          unit="€"
        />
      </div>
    </div>
  )
}