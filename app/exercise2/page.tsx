import { Range } from "@/components/Range";


export default async function Page() {

  const res = await fetch("http://localhost:3000/api/range-values")
  const values = await res.json()

  return (
    <div className="min-h-screen flex items-center justify-center">
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
    </div>
  )
}