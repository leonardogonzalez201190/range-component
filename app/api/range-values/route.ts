import { NextResponse } from "next/server";

// Generate an array of unique random numbers
const generateUniqueRandoms = (count = 7, min = 0, max = 100): number[] => {
  const range = max - min + 1;

  if (count > range) {
    throw new Error("count cannot exceed the range of unique values");
  }

  const pool = Array.from({ length: range }, (_, i) => i + min);

  for (let i = 0; i < count; i++) {
    const randIndex = i + Math.floor(Math.random() * (range - i));
    [pool[i], pool[randIndex]] = [pool[randIndex], pool[i]];
  }

  return pool.slice(0, count).sort((a, b) => a - b);
};

export async function GET() {
  const rangeValues = generateUniqueRandoms();
  return NextResponse.json({ rangeValues });
}
