import { DualRange } from "@/components/Range";


export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto p-6">
        <DualRange
          min={1}
          max={10000}
          initialMin={999}
          initialMax={10000}
          unit="€"
        />
      </div>
    </div>
  )
}