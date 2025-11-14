import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Interactive Range Component</h1>
      <p className="text-gray-700 mb-8 text-center">
        Use the links below to navigate to exercises.
      </p>

      <div className="flex flex-col gap-2">
        <Link href="/exercise1" className="text-blue-600 hover:underline">
          Exercise 1
        </Link>
        <Link href="/exercise2" className="text-blue-600 hover:underline">
          Exercise 2
        </Link>
      </div>
    </main>
  );
}
