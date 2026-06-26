import { NextResponse } from "next/server";
import { getChatSessions, clearChatSessions } from "@/lib/redis";

export async function GET(req: Request) {
  try {
    const password = req.headers.get("x-admin-password");
    const expectedPassword = process.env.ADMIN_PASSWORD;

    if (!expectedPassword) {
      return NextResponse.json({ error: "Admin access not configured on server" }, { status: 500 });
    }

    if (password !== expectedPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chats = await getChatSessions();

    return NextResponse.json(chats, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error reading chat logs:", error);
    return NextResponse.json({ error: "Failed to read chat logs" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const password = req.headers.get("x-admin-password");
    const expectedPassword = process.env.ADMIN_PASSWORD;

    if (!expectedPassword) {
      return NextResponse.json({ error: "Admin access not configured on server" }, { status: 500 });
    }

    if (password !== expectedPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Clear the logs via Redis helper
    await clearChatSessions();

    return NextResponse.json({ success: true, message: "Chat logs cleared successfully" });
  } catch (error) {
    console.error("Error clearing chat logs:", error);
    return NextResponse.json({ error: "Failed to clear chat logs" }, { status: 500 });
  }
}

