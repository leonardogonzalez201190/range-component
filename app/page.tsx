import Link from "next/link";


export default function Page() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Link href="/exercise1" className="hover:underline">Exercise 1</Link>
        <Link href="/exercise2" className="hover:underline">Exercise 2</Link>
      </div>
    )
}