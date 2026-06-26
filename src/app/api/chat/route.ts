import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getPortfolioData, upsertChatSession } from "@/lib/redis";


// Helper to sanitize chat history for Gemini
function sanitizeHistory(messages: any[]) {
  const result: any[] = [];
  let lastRole: string | null = null;

  // We filter out consecutive same-role messages and format them as Gemini expects
  for (const msg of messages) {
    const rawRole = msg.role === "assistant" ? "model" : "user";
    const content = msg.content || "";

    if (!content.trim()) continue;

    if (rawRole === lastRole && result.length > 0) {
      // Append to the last message of the same role
      result[result.length - 1].parts[0].text += "\n" + content;
    } else {
      result.push({
        role: rawRole,
        parts: [{ text: content }],
      });
      lastRole = rawRole;
    }
  }

  // Gemini's history must start with "user"
  while (result.length > 0 && result[0].role !== "user") {
    result.shift();
  }

  // Gemini's history must end with "model" (the current turn user message is sent via sendMessage, not history)
  // But actually startChat takes all previous turns, so the final message in history should be a model message,
  // and the latest user message is sent via sendMessage. Let's make sure history ends with model.
  while (result.length > 0 && result[result.length - 1].role !== "model") {
    result.pop();
  }

  return result;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { content: "Apologies, I am currently offline. Please configure GEMINI_API_KEY in the environment." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const clientMessages = body.messages || [];

    if (!Array.isArray(clientMessages) || clientMessages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    // Limit chat context length to prevent large payloads (max 30 messages)
    if (clientMessages.length > 30) {
      return NextResponse.json({ error: "Too many messages in history context" }, { status: 400 });
    }

    const latestUserMessage = clientMessages[clientMessages.length - 1];
    if (!latestUserMessage || typeof latestUserMessage.content !== "string") {
      return NextResponse.json({ error: "Invalid message format" }, { status: 400 });
    }

    // DoS Prevention: limit character size of incoming message
    if (latestUserMessage.content.length > 2000) {
      return NextResponse.json({ error: "Message too long (max 2000 characters)" }, { status: 400 });
    }

    // Read latest dynamic portfolio data to construct system instruction
    let portfolioData;
    try {
      portfolioData = await getPortfolioData();
    } catch (err) {
      console.error("Could not read portfolio data for system prompt:", err);
      // Fallback if file read fails
      portfolioData = {
        personalInfo: { name: "Prabesh Shah", bio: "AI & Fullstack Engineer", email: "contact@prabeshshah.dev", github: "https://github.com/Prabesh1919" },
        projects: [],
        techStack: []
      };
    }

    const { personalInfo, projects, techStack } = portfolioData;

    // Build the system prompt using dynamic data
    const systemInstruction = `You are JARVISH, the virtual AI assistant for ${personalInfo.name}.
Your job is to answer questions about ${personalInfo.name}'s portfolio, projects, skills, education, and contact information.

Here is the dynamic, updated information from ${personalInfo.name}'s database:

PERSONAL PROFILE:
- Name: ${personalInfo.name}
- Headline: ${personalInfo.tagline}
- Bio/Intro: ${personalInfo.bio}
- Contact Email: ${personalInfo.email}
- GitHub: ${personalInfo.github}
- LinkedIn: ${personalInfo.linkedin || "Not specified"}
- Titles/Roles: ${personalInfo.titles.join(", ")}

DYNAMIC PROJECTS CURRENTLY DEPLOYED:
${projects.map((p: any) => `
- Project: ${p.title} (${p.subtitle})
  Category: ${p.category}
  Description: ${p.description}
  Key Achievements:
    ${p.achievements.map((ach: string) => `* ${ach}`).join("\n    ")}
  Technologies Used: ${p.tech.join(", ")}
  Architecture Flow: ${p.architecture}
  Repository: ${p.repo}
  ${p.demo ? `Live Demo: ${p.demo}` : ""}
`).join("\n")}

SKILLS & CORE STACK SUMMARY:
${techStack.map((s: any) => `- ${s.name} (${s.category})`).join("\n")}

INSTRUCTIONS FOR YOUR TONE AND RESPONSIBILITIES:
1. Speak in a helpful, polite, technically sophisticated, and slightly futuristic/cybernetic tone (matching the JARVISH interface).
2. Answer questions accurately based on the facts provided above. If someone asks a question about a project or skill that isn't listed, answer politely that it's not currently featured in Prabesh's primary database, but they can reach out to him directly at ${personalInfo.email}.
3. Keep response paragraphs short, structured, and easy to read. Use bullet points or code snippets when helpful.
4. Always prioritize questions about Prabesh's projects, tech stack, and experience. Do not write complex scripts or fulfill unrelated general programming tasks unless they are directly related to explaining Prabesh's work.
`;

    // Instantiate Gemini client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction,
    });

    // Separating history and the latest user message
    // Client sends user messages at the end. The last message is the current user input.
    
    // All previous messages before the last one act as history
    const historyMessages = clientMessages.slice(0, -1);
    const sanitizedHistory = sanitizeHistory(historyMessages);

    // Initialize chat session
    const chat = model.startChat({
      history: sanitizedHistory,
    });

    // Send the latest user turn message
    const result = await chat.sendMessage(latestUserMessage.content);
    const assistantReply = result.response.text();

    // Log the interaction if sessionId is provided
    const sessionId = body.sessionId;
    if (sessionId) {
      try {
        await upsertChatSession(sessionId, latestUserMessage.content, assistantReply);
      } catch (logErr) {
        console.error("Failed to log chat interaction to Redis:", logErr);
      }
    }

    return NextResponse.json({ content: assistantReply });
  } catch (error: any) {
    console.error("Gemini API Chat routing error:", error);
    return NextResponse.json(
      { content: "Connection offline. I encountered an operational challenge communicating with the Gemini core." },
      { status: 500 }
    );
  }
}
