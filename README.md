# Prabesh Shah — Portfolio

> **AI Engineer · Full-Stack Architect · Quant Developer** · Based in Nepal 🇳🇵

A production-grade, interactive portfolio powered by **Next.js 16**, featuring an AI-powered chat assistant (JARVISH), a secure admin dashboard, dynamic portfolio data management, and a multi-theme design system.

---

## ✨ Features

### Portfolio
- **Multi-Theme UI** — 4 switchable themes: Void Aurora, Cybernetic Blue, Quant Green, Ember Gold
- **Animated Hero** — typewriter effect, floating stats grid, gradient typography
- **CRDT Distributed Lab** — live interactive demo of vector clock synchronization
- **Projects Showcase** — filterable cards with architecture diagrams & tech tags
- **CLI Mode** — full terminal emulator built into the page (`help`, `projects`, `whoami`, etc.)
- **Responsive** — mobile hamburger nav, adaptive layouts

### JARVISH AI Chat Assistant
- Powered by **Gemini 2.5 Flash** via Google Generative AI SDK
- Reads portfolio data dynamically — always up to date
- Persistent storage using **Upstash Redis** (serverless-friendly)
- Local development fallback to `chats.json` and `portfolio.json` when Redis is not configured
- Input validation & DoS protection (max 2000 chars, max 30 messages)

### Admin Dashboard (`/admin`)
- **Password-gated** — server-side verification via `/api/admin/verify`
- **General Config** — edit name, role, bio, social links, stats
- **Projects CRUD** — add / edit / delete projects with tags and achievements
- **Skills Manager** — manage tech stack items and categories
- **Chat Logs Viewer** — browse all JARVISH conversation transcripts with session explorer

---

## 🗂 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main portfolio page (GUI + CLI mode)
│   ├── layout.tsx            # Root layout, fonts, metadata
│   ├── globals.css           # Design system, themes, animations
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard (password-gated)
│   └── api/
│       ├── chat/route.ts     # JARVISH AI chat endpoint (Gemini)
│       ├── chat-logs/route.ts# Fetch / clear chat session logs
│       ├── portfolio-data/route.ts  # Read / update portfolio data
│       └── admin/verify/route.ts   # Validate admin credentials
└── data/
    ├── portfolio.json        # Dynamic portfolio content (editable via admin)
    └── chats.json            # Stored JARVISH conversation sessions
public/
└── avatar.jpg                # Profile photo
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env.local` file at the project root:

```env
GEMINI_API_KEY=your_google_gemini_api_key
ADMIN_PASSWORD=your_secure_admin_password

# Upstash Redis (Optional for local dev, required for Vercel deploy)
UPSTASH_REDIS_REST_URL=https://your-db-name.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token_here
```

Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/). Upstash keys can be fetched from the [Upstash Console](https://console.upstash.com/).

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Security Model

| Endpoint | Auth Method | Access |
|---|---|---|
| `GET /api/portfolio-data` | None (public) | Read portfolio JSON |
| `POST /api/portfolio-data` | `x-admin-password` header | Update portfolio content |
| `GET /api/chat-logs` | `x-admin-password` header | Read all chat sessions |
| `DELETE /api/chat-logs` | `x-admin-password` header | Clear all chat logs |
| `POST /api/admin/verify` | JSON body `{ password }` | Verify admin credentials |
| `POST /api/chat` | None (public) | Chat with JARVISH |

- No plaintext fallback passwords — `ADMIN_PASSWORD` **must** be set in environment
- Chat inputs capped at **2,000 characters** and **30 messages per context**
- All writes are transactional and atomic via Upstash Redis REST layer

---

## 🐳 Docker Deployment

```bash
docker build -t prabesh-portfolio .
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your_key \
  -e ADMIN_PASSWORD=your_password \
  prabesh-portfolio
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Styling | Vanilla CSS + Tailwind CSS |
| Database / Cache | Upstash Redis (REST SDK) |
| AI | Google Gemini 2.5 Flash |
| Icons | Lucide React |
| Language | TypeScript |
| Deployment | Docker / Vercel |

---

## 📬 Contact

- **Email:** contact@prabeshshah.dev
- **GitHub:** [github.com/Prabesh1919](https://github.com/Prabesh1919)
- **LinkedIn:** [linkedin.com/in/prabeshshah](https://linkedin.com)
