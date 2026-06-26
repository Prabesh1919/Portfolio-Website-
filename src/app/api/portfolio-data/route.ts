import { NextResponse } from "next/server";
import { getPortfolioData, setPortfolioData } from "@/lib/redis";

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error reading portfolio data:", error);
    return NextResponse.json({ error: "Failed to read portfolio data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const password = req.headers.get("x-admin-password");
    const expectedPassword = process.env.ADMIN_PASSWORD;

    if (!expectedPassword) {
      return NextResponse.json({ error: "Admin access not configured on server" }, { status: 500 });
    }

    if (password !== expectedPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newData = await req.json();

    // Basic structure verification
    if (!newData.personalInfo || !newData.projects || !newData.techStack) {
      return NextResponse.json({ error: "Invalid data structure" }, { status: 400 });
    }

    // Write back via Redis helper
    await setPortfolioData(newData);

    return NextResponse.json({ success: true, message: "Portfolio data updated successfully" });
  } catch (error) {
    console.error("Error updating portfolio data:", error);
    return NextResponse.json({ error: "Failed to update portfolio data" }, { status: 500 });
  }
}

