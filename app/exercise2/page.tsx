import { DualRange } from "@/components/Range";


export default function Page() {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <DualRange
          min={0}
          max={100}
          step={1}
          initialMin={30}
          initialMax={70}
        />
      </div>
    )
}