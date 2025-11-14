import { NextResponse } from "next/server";

// Generate an array of unique random numbers
const generateRandomValues = (count = 7, min = 0, max = 100): number[] => {
  const values: number[] = [];
  while (values.length < count) {
    const rand = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!values.includes(rand)) values.push(rand);
  }
  return values.sort((a, b) => a - b);
};

export async function GET() {
  const rangeValues = generateRandomValues(7, 1, 100);// Generate 7 random values between 1 and 100
  return NextResponse.json({ rangeValues });
}
