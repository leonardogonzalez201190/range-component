import { NextResponse } from "next/server";

export async function GET() {
  const min = Math.floor(Math.random() * 100) + 1;
  const max = Math.floor(Math.random() * 100) + 1;

  const [finalMin, finalMax] = min <= max ? [min, max] : [max, min];

  return NextResponse.json({ min: finalMin, max: finalMax });
}
