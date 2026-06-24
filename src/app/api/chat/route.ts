import { NextResponse } from "next/server";
export async function POST(req: Request) {
  return NextResponse.json({ content: "Hello from JARVISH!" });
}

// Resolve Gemini startChat history role error

// Strict alternating role sanitizer implementation
