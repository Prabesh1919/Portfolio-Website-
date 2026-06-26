/**
 * Redis adapter for Vercel/Upstash deployment.
 *
 * - In production (Vercel): reads/writes all data via Upstash Redis REST API.
 * - In local development: falls back to local JSON files when Redis env vars
 *   are not set, so no Redis account is required for local dev.
 */

import { Redis } from "@upstash/redis";
import fs from "fs/promises";
import path from "path";

// ─── Redis Keys ───────────────────────────────────────────────────────────────
const PORTFOLIO_KEY = "portfolio:data";
const CHATS_KEY = "chats:sessions";

// ─── File Paths (local dev fallback) ──────────────────────────────────────────
const PORTFOLIO_FILE = path.join(process.cwd(), "src/data/portfolio.json");
const CHATS_FILE = path.join(process.cwd(), "src/data/chats.json");

// ─── Redis Client (lazy-initialized) ──────────────────────────────────────────
function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

// ─── Portfolio Data ───────────────────────────────────────────────────────────

export async function getPortfolioData(): Promise<any> {
  const redis = getRedisClient();

  if (redis) {
    // Production: read from Redis
    const data = await redis.get<any>(PORTFOLIO_KEY);
    if (data) return data;

    // First run: seed Redis from local JSON file
    try {
      const raw = await fs.readFile(PORTFOLIO_FILE, "utf-8");
      const localData = JSON.parse(raw);
      await redis.set(PORTFOLIO_KEY, localData);
      console.log("[Redis] Seeded portfolio data from local JSON on first run.");
      return localData;
    } catch {
      throw new Error("Could not read portfolio data from Redis or local file.");
    }
  }

  // Local dev fallback: read from JSON file
  const raw = await fs.readFile(PORTFOLIO_FILE, "utf-8");
  return JSON.parse(raw);
}

export async function setPortfolioData(data: any): Promise<void> {
  const redis = getRedisClient();

  if (redis) {
    await redis.set(PORTFOLIO_KEY, data);
    return;
  }

  // Local dev fallback: write to JSON file
  await fs.writeFile(PORTFOLIO_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// ─── Chat Sessions ────────────────────────────────────────────────────────────

export async function getChatSessions(): Promise<any[]> {
  const redis = getRedisClient();

  if (redis) {
    const data = await redis.get<any[]>(CHATS_KEY);
    return data ?? [];
  }

  // Local dev fallback
  try {
    const raw = await fs.readFile(CHATS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function upsertChatSession(
  sessionId: string,
  userContent: string,
  assistantContent: string
): Promise<void> {
  const redis = getRedisClient();
  const now = new Date().toISOString();

  if (redis) {
    // Atomic read-modify-write via Redis
    const sessions: any[] = (await redis.get<any[]>(CHATS_KEY)) ?? [];

    let idx = sessions.findIndex((s: any) => s.id === sessionId);
    if (idx === -1) {
      sessions.push({ id: sessionId, timestamp: now, messages: [] });
      idx = sessions.length - 1;
    }

    sessions[idx].timestamp = now;
    sessions[idx].messages.push(
      { role: "user", content: userContent, timestamp: now },
      { role: "assistant", content: assistantContent, timestamp: now }
    );

    await redis.set(CHATS_KEY, sessions);
    return;
  }

  // Local dev fallback: JSON file with simple write
  let sessions: any[] = [];
  try {
    const raw = await fs.readFile(CHATS_FILE, "utf-8");
    sessions = JSON.parse(raw);
  } catch {
    sessions = [];
  }

  let idx = sessions.findIndex((s: any) => s.id === sessionId);
  if (idx === -1) {
    sessions.push({ id: sessionId, timestamp: now, messages: [] });
    idx = sessions.length - 1;
  }

  sessions[idx].timestamp = now;
  sessions[idx].messages.push(
    { role: "user", content: userContent, timestamp: now },
    { role: "assistant", content: assistantContent, timestamp: now }
  );

  await fs.writeFile(CHATS_FILE, JSON.stringify(sessions, null, 2), "utf-8");
}

export async function clearChatSessions(): Promise<void> {
  const redis = getRedisClient();

  if (redis) {
    await redis.del(CHATS_KEY);
    return;
  }

  // Local dev fallback
  await fs.writeFile(CHATS_FILE, "[]", "utf-8");
}
