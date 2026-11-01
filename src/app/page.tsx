"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import defaultPortfolioData from "../data/portfolio.json";
import {
  Terminal,
  User,
  Cpu,
  Code2,
  Database,
  Smartphone,
  Send,
  Github,
  Mail,
  ExternalLink,
  X,
  Sparkles,
  Monitor,
  BookOpen,
  Layers,
  Layers3,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Layout,
  MessageSquare,
  RefreshCw,
  Zap,
  Network,
  GitBranch,
  Play,
  Menu,
  ChevronRight,
  Activity,
  Globe,
  Star,
  Lock,
} from "lucide-react";

// Types
interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  achievements: string[];
  tech: string[];
  architecture: string;
  category: "AI & Quant" | "Full-Stack" | "Mobile";
  repo: string;
  demo?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CLICommand {
  cmd: string;
  output: React.ReactNode;
}

interface VectorClock {
  A: number;
  B: number;
}

interface TaskItem {
  id: number;
  text: string;
  clock: VectorClock;
  timestamp: number;
}

interface ChartPoint {
  month: string;
  portfolio: number;
  nepse: number;
  regime: string;
  drawdown: number;
}

// ─── Theme Config ─────────────────────────────────────────────────────────────
const THEMES = {
  aurora: {
    label: "Void Aurora",
    primary: "#8b5cf6",
    secondary: "#06b6d4",
    dot: "bg-violet-500",
    text: "text-violet-400",
    textBright: "text-violet-300",
    border: "border-violet-500/20",
    hoverBorder: "hover:border-violet-400/40",
    bgGlow: "bg-violet-500/8",
    badge: "badge-violet",
    btn: "btn-aurora",
    ring: "ring-violet-500/30",
    gradFrom: "from-violet-500",
    gradTo: "to-cyan-400",
    terminalColor: "#8b5cf6",
    chartColor: "#8b5cf6",
    cssBg: "rgba(139,92,246,0.12)",
    cssRing: "rgba(139,92,246,0.08)",
  },
  plasma: {
    label: "Neon Plasma",
    primary: "#ec4899",
    secondary: "#f59e0b",
    dot: "bg-pink-500",
    text: "text-pink-400",
    textBright: "text-pink-300",
    border: "border-pink-500/20",
    hoverBorder: "hover:border-pink-400/40",
    bgGlow: "bg-pink-500/8",
    badge: "badge-pink",
    btn: "btn-plasma",
    ring: "ring-pink-500/30",
    gradFrom: "from-pink-500",
    gradTo: "to-amber-400",
    terminalColor: "#ec4899",
    chartColor: "#ec4899",
    cssBg: "rgba(236,72,153,0.12)",
    cssRing: "rgba(236,72,153,0.08)",
  },
  matrix: {
    label: "Bio Matrix",
    primary: "#10b981",
    secondary: "#06b6d4",
    dot: "bg-emerald-500",
    text: "text-emerald-400",
    textBright: "text-emerald-300",
    border: "border-emerald-500/20",
    hoverBorder: "hover:border-emerald-400/40",
    bgGlow: "bg-emerald-500/8",
    badge: "badge-emerald",
    btn: "btn-matrix",
    ring: "ring-emerald-500/30",
    gradFrom: "from-emerald-500",
    gradTo: "to-cyan-400",
    terminalColor: "#10b981",
    chartColor: "#10b981",
    cssBg: "rgba(16,185,129,0.12)",
    cssRing: "rgba(16,185,129,0.08)",
  },
  solar: {
    label: "Solar Storm",
    primary: "#f59e0b",
    secondary: "#ef4444",
    dot: "bg-amber-500",
    text: "text-amber-400",
    textBright: "text-amber-300",
    border: "border-amber-500/20",
    hoverBorder: "hover:border-amber-400/40",
    bgGlow: "bg-amber-500/8",
    badge: "badge-amber",
    btn: "btn-solar",
    ring: "ring-amber-500/30",
    gradFrom: "from-amber-500",
    gradTo: "to-red-400",
    terminalColor: "#f59e0b",
    chartColor: "#f59e0b",
    cssBg: "rgba(245,158,11,0.12)",
    cssRing: "rgba(245,158,11,0.08)",
  },
} as const;

type ThemeKey = keyof typeof THEMES;

export default function Home() {
  const [portfolioData, setPortfolioData] = useState(defaultPortfolioData);
  const sessionIdRef = useRef<string>("");

  useEffect(() => {
    sessionIdRef.current = "session-" + Math.random().toString(36).substring(2, 11);
  }, []);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const res = await fetch("/api/portfolio-data");
        if (res.ok) {
          const data = await res.json();
          setPortfolioData(data);
        }
      } catch (error) {
        console.error("Failed to fetch fresh portfolio data:", error);
      }
    }
    fetchPortfolio();
  }, []);

  // ── State ──────────────────────────────────────────────────────────────────
  const [activeTheme, setActiveTheme] = useState<ThemeKey>("aurora");
  const [cliMode, setCliMode] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Form
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMsg, setFormMsg] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success">("idle");

  // Chat
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: `⚡ JARVISH online — ${portfolioData.personalInfo.name}'s AI assistant. Ask me about projects, quant algorithms, or tech stack.`,
  }]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // CLI
  const [cliInput, setCliInput] = useState("");
  const [cliHistory, setCliHistory] = useState<CLICommand[]>([{
    cmd: "system-init",
    output: `KERNEL BOOT v2.5 ─ ${portfolioData.personalInfo.name} portfolio system. Type 'help' for commands.`,
  }]);
  const cliEndRef = useRef<HTMLDivElement>(null);

  // Typewriter
  const titles = portfolioData.personalInfo.titles;
  const [titleIndex, setTitleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentText, setCurrentText] = useState("");

  // CRDT Lab
  const [clientATask, setClientATask] = useState<TaskItem>({ id: 1, text: "Inverter Review Engine core", clock: { A: 0, B: 0 }, timestamp: Date.now() });
  const [clientBTask, setClientBTask] = useState<TaskItem>({ id: 1, text: "Inverter Review Engine core", clock: { A: 0, B: 0 }, timestamp: Date.now() });
  const [syncStatus, setSyncStatus] = useState<"synced" | "dirty" | "conflict">("synced");
  const [crdtLog, setCrdtLog] = useState<string[]>([
    "System state online. Client A & Client B synchronized.",
    "Initial Vector Clock state: A: {A:0, B:0} | B: {A:0, B:0}",
  ]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Chart
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);

  // LangGraph
  const [dagActiveNode, setDagActiveNode] = useState<string | null>(null);
  const [dagLogs, setDagLogs] = useState<string[]>([]);
  const [dagRunning, setDagRunning] = useState<boolean>(false);

  const t = THEMES[activeTheme];

  // ── Dataset ────────────────────────────────────────────────────────────────
  const chartData: ChartPoint[] = [
    { month: "Jan", portfolio: 5.0, nepse: 1.2, regime: "Sideways", drawdown: 0.0 },
    { month: "Feb", portfolio: 12.4, nepse: -2.1, regime: "Volatile", drawdown: -1.2 },
    { month: "Mar", portfolio: 24.8, nepse: 3.5, regime: "Bullish", drawdown: 0.0 },
    { month: "Apr", portfolio: 35.2, nepse: 1.8, regime: "Bullish", drawdown: -0.5 },
    { month: "May", portfolio: 31.0, nepse: -4.2, regime: "Bearish", drawdown: -5.0 },
    { month: "Jun", portfolio: 48.6, nepse: -1.0, regime: "Sideways", drawdown: -0.8 },
    { month: "Jul", portfolio: 62.4, nepse: 5.0, regime: "Bullish", drawdown: 0.0 },
    { month: "Aug", portfolio: 78.5, nepse: 2.1, regime: "Bullish", drawdown: -0.2 },
    { month: "Sep", portfolio: 72.0, nepse: -6.4, regime: "Bearish", drawdown: -8.2 },
    { month: "Oct", portfolio: 89.4, nepse: -2.0, regime: "Volatile", drawdown: -1.5 },
    { month: "Nov", portfolio: 104.2, nepse: 4.8, regime: "Bullish", drawdown: 0.0 },
    { month: "Dec", portfolio: 124.5, nepse: 3.4, regime: "Bullish", drawdown: -0.1 },
  ];

  // ── Effects ────────────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", activeTheme);
  }, [activeTheme]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping, chatOpen]);
  useEffect(() => { cliEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [cliHistory, cliMode]);

  useEffect(() => {
    const activeWord = titles[titleIndex];
    let timer: NodeJS.Timeout;
    if (isDeleting) {
      timer = setTimeout(() => { setCurrentText(activeWord.substring(0, charIndex - 1)); setCharIndex((p) => p - 1); }, 45);
    } else {
      timer = setTimeout(() => { setCurrentText(activeWord.substring(0, charIndex + 1)); setCharIndex((p) => p + 1); }, 95);
    }
    if (!isDeleting && charIndex === activeWord.length) { timer = setTimeout(() => setIsDeleting(true), 2200); }
    else if (isDeleting && charIndex === 0) { setIsDeleting(false); setTitleIndex((p) => (p + 1) % titles.length); }
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, titleIndex]);

  // ── Data ───────────────────────────────────────────────────────────────────
  const projects: Project[] = portfolioData.projects as Project[];
  const techStack = portfolioData.techStack;
  const categories = portfolioData.categories || ["All", "Languages", "AI & Agents", "Vector DBs & RAG", "Backend & Cloud", "Databases & Cache", "Frontend UI", "Testing & Ops"];
  const filteredTech = activeCategory === "All" ? techStack : techStack.filter((t) => t.category === activeCategory);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMsg) return;
    setFormStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, email: formEmail, message: formMsg }),
      });
      if (res.ok) {
        setFormStatus("success");
        setFormName(""); setFormEmail(""); setFormMsg("");
        setTimeout(() => setFormStatus("idle"), 5000);
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to transmit message. Please try again.");
        setFormStatus("idle");
      }
    } catch (err) {
      console.error("Failed to submit contact form:", err);
      alert("Connection offline or server error. Please try again.");
      setFormStatus("idle");
    }
  };

  const handleChatSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMessage = chatInput;
    setChatInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionIdRef.current, messages: [...messages, { role: "user", content: userMessage }] }),
      });
      const data = await response.json();
      if (data.content) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "Apologies, an operational error occurred. Please retry." }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection offline. Ensure GEMINI_API_KEY is configured." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClientEdit = (client: "A" | "B", text: string) => {
    if (client === "A") {
      const nextClock = { ...clientATask.clock, A: clientATask.clock.A + 1 };
      setClientATask((prev) => ({ ...prev, text, clock: nextClock, timestamp: Date.now() }));
      setSyncStatus("dirty");
      setCrdtLog((prev) => [`[Client A mutated] Clock: A:${nextClock.A}, B:${nextClock.B} | Text: "${text}"`, ...prev]);
    } else {
      const nextClock = { ...clientBTask.clock, B: clientBTask.clock.B + 1 };
      setClientBTask((prev) => ({ ...prev, text, clock: nextClock, timestamp: Date.now() }));
      setSyncStatus(clientATask.text !== text ? "conflict" : "dirty");
      setCrdtLog((prev) => [`[Client B mutated] Clock: A:${nextClock.A}, B:${nextClock.B} | Text: "${text}"`, ...prev]);
    }
  };

  const handleSimulateConflict = () => {
    const aTask = { ...clientATask, text: "[ Alpha edit ] — Compliance Audit pipeline", clock: { A: clientATask.clock.A + 1, B: clientATask.clock.B }, timestamp: Date.now() - 1000 };
    const bTask = { ...clientBTask, text: "[ Beta edit ] — DAG Inverter Analysis run", clock: { A: clientBTask.clock.A, B: clientBTask.clock.B + 1 }, timestamp: Date.now() };
    setClientATask(aTask);
    setClientBTask(bTask);
    setSyncStatus("conflict");
    setCrdtLog((prev) => ["🚨 [CONFLICT] Concurrent writes detected. Vector clocks diverge. Awaiting LWW resolution.", `Client A: {A:${aTask.clock.A}, B:${aTask.clock.B}} | Client B: {A:${bTask.clock.A}, B:${bTask.clock.B}}`, ...prev]);
  };

  const handleSyncCRDT = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setTimeout(() => {
      const a = clientATask, b = clientBTask;
      const aDominates = a.clock.A >= b.clock.A && a.clock.B >= b.clock.B;
      const bDominates = b.clock.A >= a.clock.A && b.clock.B >= a.clock.B;
      const mergedClock = { A: Math.max(a.clock.A, b.clock.A), B: Math.max(a.clock.B, b.clock.B) };
      let resolvedTask: TaskItem;
      let logMsg: string;
      if (aDominates) { resolvedTask = { ...a, clock: mergedClock }; logMsg = `✓ Client A clock dominated. Text: "${a.text}"`; }
      else if (bDominates) { resolvedTask = { ...b, clock: mergedClock }; logMsg = `✓ Client B clock dominated. Text: "${b.text}"`; }
      else if (a.text === b.text) { resolvedTask = { ...a, clock: mergedClock }; logMsg = `✓ States identical. Clocks merged: {A:${mergedClock.A}, B:${mergedClock.B}}`; }
      else {
        logMsg = `⚡ [LWW Resolution] Timestamps: A:${a.timestamp} vs B:${b.timestamp}. `;
        if (a.timestamp >= b.timestamp) { resolvedTask = { ...a, clock: mergedClock }; logMsg += `Client A wins. Text: "${a.text}"`; }
        else { resolvedTask = { ...b, clock: mergedClock }; logMsg += `Client B wins. Text: "${b.text}"`; }
      }
      setClientATask(resolvedTask);
      setClientBTask(resolvedTask);
      setSyncStatus("synced");
      setCrdtLog((prev) => [`✓ Sync complete. Final clock: {A:${mergedClock.A}, B:${mergedClock.B}}`, logMsg, ...prev]);
      setIsSyncing(false);
    }, 1200);
  };

  const handleResetCRDT = () => {
    setClientATask({ id: 1, text: "Inverter Review Engine core", clock: { A: 0, B: 0 }, timestamp: Date.now() });
    setClientBTask({ id: 1, text: "Inverter Review Engine core", clock: { A: 0, B: 0 }, timestamp: Date.now() });
    setSyncStatus("synced");
    setCrdtLog(["System reset. Clients synchronized.", "Vector Clock state: A: {A:0, B:0} | B: {A:0, B:0}"]);
  };

  const handleRunDag = () => {
    if (dagRunning) return;
    setDagRunning(true); setDagLogs([]);
    const steps = [
      { node: "pdf", msg: "📥 [Ingestion] Loading manufacturer PDF spec..." },
      { node: "extractor", msg: "🧠 [Gemini Extractor] Parsing structured schemas from raw text..." },
      { node: "normalizer", msg: "⚖️ [Normalizer] 5kW → 5000W; 230VAC ± 5% validated." },
      { node: "compliance", msg: "🛡️ [NEPQA Auditor] Cross-checking against Clause 4.2 constraints..." },
      { node: "report", msg: "📝 [Report Compiler] Generating markdown audit artifact..." },
    ];
    let cur = 0;
    setDagActiveNode("pdf"); setDagLogs([steps[0].msg]);
    const iv = setInterval(() => {
      cur++;
      if (cur < steps.length) { setDagActiveNode(steps[cur].node); setDagLogs((p) => [...p, steps[cur].msg]); }
      else { clearInterval(iv); setDagActiveNode(null); setDagRunning(false); setDagLogs((p) => [...p, "✓ Pipeline PASSED — confidence: 98.5%"]); }
    }, 1500);
  };

  const handleCLISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = cliInput.trim().toLowerCase();
    setCliInput("");
    if (!cleanCmd) return;
    let output: React.ReactNode = "";
    switch (cleanCmd) {
      case "help":
        output = (
          <div className="space-y-1">
            <p className="text-slate-400 mb-1">Available commands:</p>
            {[["about","Display background details"],["skills","List core technologies"],["projects","Show architectural project list"],["quant-run","Execute NEPSE Quant simulation"],["crdt-trace","Simulate conflict log trace"],["dag-trace","Simulate LangGraph pipeline trace"],["themes","View available themes"],["clear","Purge CLI scrollback"],["exit","Return to GUI mode"]].map(([cmd,desc]) => (
              <p key={cmd}><span style={{ color: t.terminalColor }}>{cmd.padEnd(12)}</span><span className="text-slate-400">─ {desc}</span></p>
            ))}
          </div>
        );
        break;
      case "about":
        output = <div><p className="font-semibold text-white mb-1">{portfolioData.personalInfo.name}</p><p className="text-slate-400">{portfolioData.personalInfo.bio}</p></div>;
        break;
      case "skills":
        output = <div><p className="mb-1 text-slate-400">Core Technologies:</p><p style={{ color: t.terminalColor }}>{techStack.map((t) => t.name).join(" · ")}</p></div>;
        break;
      case "projects":
        output = <div className="space-y-2">{projects.map((p) => (<div key={p.id} className="border-l-2 pl-3" style={{ borderColor: t.terminalColor }}><p className="font-semibold text-white">{p.title}</p><p className="text-slate-400 text-xs">{p.subtitle}</p></div>))}</div>;
        break;
      case "quant-run":
        output = <div className="space-y-1"><p style={{ color: t.terminalColor }}>[SYSTEM] Launching walk-forward optimization...</p><p className="text-slate-400">  Strategy: Ensemble (GoldenCross + MeanReversion)</p><p className="text-emerald-400">✓ Sharpe Ratio: 2.45 | Win Rate: 68%</p><p className="text-emerald-400">✓ Portfolio vs NEPSE: +124.5% vs +3.4%</p></div>;
        break;
      case "crdt-trace":
        output = <div className="space-y-1"><p className="text-rose-400">⚠️ Conflict detected: Client A: {`{A:1, B:0}`} | Client B: {`{A:0, B:1}`}</p><p className="text-yellow-400">  Domination check: Concurrent (FALSE)</p><p className="text-emerald-400">✓ LWW resolved. Merged clock: {`{A:1, B:1}`}</p></div>;
        break;
      case "dag-trace":
        output = <div className="space-y-1"><p style={{ color: t.terminalColor }}>[LangGraph] Pipeline activated...</p><p className="text-slate-400">  Node [PDF] parsed · Node [Compliance] checked.</p><p className="text-emerald-400">✓ PASSED (98.5% confidence)</p></div>;
        break;
      case "themes":
        output = <div className="space-y-1">{Object.entries(THEMES).map(([k,v]) => (<p key={k}><span style={{ color: v.primary }}>{k.padEnd(10)}</span><span className="text-slate-400">─ {v.label}</span></p>))}</div>;
        break;
      case "theme aurora": setActiveTheme("aurora"); output = "Theme → Void Aurora"; break;
      case "theme plasma": setActiveTheme("plasma"); output = "Theme → Neon Plasma"; break;
      case "theme matrix": setActiveTheme("matrix"); output = "Theme → Bio Matrix"; break;
      case "theme solar": setActiveTheme("solar"); output = "Theme → Solar Storm"; break;
      case "clear": setCliHistory([]); return;
      case "exit": setCliMode(false); return;
      default:
        if (cleanCmd.startsWith("theme ")) { output = `Invalid theme. Try: aurora · plasma · matrix · solar`; }
        else { output = <span className="text-rose-400">Unknown command: '{cleanCmd}'. Type 'help' for options.</span>; }
    }
    setCliHistory((prev) => [...prev, { cmd: cleanCmd, output }]);
  };

  // ── Derived Helpers ────────────────────────────────────────────────────────
  const categoryIcons: Record<string, React.ReactNode> = {
    "AI & Quant": <TrendingUp className="w-4 h-4" />,
    "Full-Stack": <Layers className="w-4 h-4" />,
    "Mobile": <Smartphone className="w-4 h-4" />,
  };

  const syncStatusColor = syncStatus === "synced" ? "text-emerald-400" : syncStatus === "conflict" ? "text-rose-400" : "text-amber-400";
  const syncStatusLabel = syncStatus === "synced" ? "● SYNCED" : syncStatus === "conflict" ? "⚠ CONFLICT" : "○ DIRTY";

  // ═══════════════════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <main id="main-content" className="min-h-screen relative text-slate-100 pb-24 select-none overflow-x-hidden" style={{ fontFamily: "var(--font-sans)" }}>

      {/* ── Ambient Aurora Orbs ───────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute animate-aurora"
          style={{
            top: "-10%", left: "5%",
            width: "55vw", height: "55vw",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute animate-aurora"
          style={{
            bottom: "5%", right: "0%",
            width: "45vw", height: "45vw",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(6,182,212,0.06) 0%, transparent 70%)",
            filter: "blur(40px)",
            animationDelay: "-5s",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "40%", left: "50%", transform: "translate(-50%,-50%)",
            width: "70vw", height: "30vw",
            background: "radial-gradient(ellipse, rgba(79,70,229,0.04) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* ── NAVIGATION ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full glass-nav">
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="w-9 h-9 rounded-full overflow-hidden"
                style={{
                  boxShadow: `0 0 0 2px ${t.primary}60, 0 0 16px ${t.primary}30`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/avatar.webp"
                  alt="Prabesh Shah - Autonomous AI Engineer and Quantitative Systems Architect"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" style={{ boxShadow: "0 0 6px rgba(52,211,153,0.8)" }} />
            </div>
            <div>
              <div className="text-sm font-bold tracking-wide text-white" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.02em" }}>
                {portfolioData.personalInfo.name.split(" ")[0]}.dev
              </div>
              <div className="text-[9px] text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>AI ENGINEER · NEPAL</div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-1">
            {[["#about","About"],["#tech","Stack"],["#crdt-lab","Lab"],["#projects","Projects"],["#faq","FAQ"],["#contact","Contact"]].map(([href,label]) => (
              <a
                key={href}
                href={href}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/4 transition-all duration-200"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* CLI Toggle */}
            <button
              onClick={() => setCliMode(!cliMode)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all duration-200"
              style={{
                fontFamily: "var(--font-mono)",
                background: cliMode ? `${t.primary}15` : "rgba(255,255,255,0.03)",
                borderColor: cliMode ? `${t.primary}40` : "rgba(255,255,255,0.07)",
                color: cliMode ? t.primary : "#94a3b8",
              }}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{cliMode ? "GUI" : "CLI"}</span>
            </button>

            {/* Theme Switcher */}
            <div className="flex items-center gap-1.5 px-2 py-2 rounded-lg border border-white/5 bg-white/2">
              {(Object.entries(THEMES) as [ThemeKey, typeof THEMES[ThemeKey]][]).map(([key, th]) => (
                <button
                  key={key}
                  onClick={() => setActiveTheme(key)}
                  title={th.label}
                  className="w-4 h-4 rounded-full transition-all duration-300"
                  style={{
                    background: th.primary,
                    boxShadow: activeTheme === key ? `0 0 10px ${th.primary}80` : "none",
                    transform: activeTheme === key ? "scale(1.3)" : "scale(1)",
                    opacity: activeTheme === key ? 1 : 0.4,
                  }}
                />
              ))}
            </div>

            {/* Mobile menu */}
            <button className="md:hidden p-2 rounded-lg border border-white/5" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
              <Menu className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileNavOpen && (
          <nav aria-label="Mobile Navigation" className="md:hidden border-t border-white/5 px-5 py-4 space-y-1 bg-slate-950/95">
            {[["#about","About"],["#tech","Stack"],["#crdt-lab","Lab"],["#projects","Projects"],["#faq","FAQ"],["#contact","Contact"]].map(([href,label]) => (
              <a key={href} href={href} onClick={() => setMobileNavOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/4 transition-all" style={{ fontFamily: "var(--font-mono)" }}>
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* ── CLI MODE ─────────────────────────────────────────────────────────── */}
      {cliMode ? (
        <section className="max-w-4xl mx-auto px-5 mt-10 z-10 relative">
          <div className="terminal-window animate-fadeIn animate-flicker">
            {/* Window chrome */}
            <div className="bg-slate-950 px-5 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-xs text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>guest@{portfolioData.personalInfo.name.toLowerCase().replace(" ","-")} — zsh</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: t.primary }} />
                <span className="text-[10px] text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>KERNEL v2.5</span>
              </div>
            </div>
            <div className="p-6 h-[60vh] overflow-y-auto space-y-4 bg-slate-950/90">
              {cliHistory.map((item, idx) => (
                <div key={idx} className="space-y-1.5 animate-fadeInUp" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="flex items-center gap-2 text-sm" style={{ fontFamily: "var(--font-mono)" }}>
                    <span style={{ color: t.primary }}>❯</span>
                    <span className="text-slate-500">~</span>
                    <span className="text-white font-medium">{item.cmd}</span>
                  </div>
                  <div className="text-slate-400 text-xs leading-relaxed pl-5" style={{ fontFamily: "var(--font-mono)" }}>{item.output}</div>
                </div>
              ))}
              <div ref={cliEndRef} />
            </div>
            <form onSubmit={handleCLISubmit} className="bg-slate-950 border-t border-white/5 px-5 py-3.5 flex items-center gap-3">
              <span style={{ color: t.primary, fontFamily: "var(--font-mono)" }}>❯</span>
              <span className="text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>~</span>
              <label htmlFor="cli-terminal-input" className="sr-only">Interactive Terminal Command Line</label>
              <input
                id="cli-terminal-input"
                name="cliCommand"
                type="text"
                aria-label="Interactive Terminal Command Line"
                value={cliInput}
                onChange={(e) => setCliInput(e.target.value)}
                placeholder="type 'help' to explore commands..."
                className="bg-transparent border-none outline-none text-slate-100 flex-grow text-sm"
                style={{ fontFamily: "var(--font-mono)" }}
                autoFocus
              />
              <span className="w-2 h-4 rounded-sm animate-blink" style={{ background: t.primary }} />
            </form>
          </div>
        </section>
      ) : (
        /* ── GUI MODE ────────────────────────────────────────────────────── */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-20 md:space-y-36 z-10 relative">

          {/* ══════════════════════════════════════════════════════════════
              HERO
          ══════════════════════════════════════════════════════════════ */}
          <section className="pt-20 md:pt-28 flex flex-col items-center text-center space-y-8 min-h-[88vh] justify-center">
            
            {/* Announcement pill */}
            <div
              className="animate-float inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-xs"
              style={{
                fontFamily: "var(--font-mono)",
                background: `${t.primary}10`,
                borderColor: `${t.primary}30`,
                color: t.primary,
                letterSpacing: "0.06em",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{portfolioData.personalInfo.tagline}</span>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </div>

            {/* Main headline */}
            <div className="space-y-5">
              <h1 id="author-h1" className="text-6xl md:text-8xl font-bold tracking-tight leading-none">
                <span
                  className="inline-block"
                  style={{
                    background: `linear-gradient(135deg, #f1f5f9 0%, #c4b5fd 40%, #818cf8 70%, #67e8f9 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 30px rgba(139,92,246,0.2))",
                  }}
                >
                  {portfolioData.personalInfo.name}
                </span>
              </h1>

              <div className="sr-only" id="hero-bio">
                Prabesh Shah is an AI Engineer and Quantitative Systems Architect based in Nepal, specializing in autonomous multi-agent networks, algorithmic trading systems, and high-throughput distributed backends.
              </div>

              <div className="text-xl md:text-3xl text-slate-400 min-h-[44px] flex items-center justify-center gap-2" style={{ fontFamily: "var(--font-mono)", fontWeight: 300 }}>
                <span>I am {/^[aeiou]/i.test(titles[titleIndex] || "") ? "an" : "a"} </span>
                <span className="relative">
                  <span style={{ color: t.primary, fontWeight: 500, textShadow: `0 0 20px ${t.primary}60` }}>
                    {currentText}
                  </span>
                  <span className="ml-0.5 animate-blink" style={{ color: t.primary }}>_</span>
                </span>
              </div>
            </div>

            {/* Bio */}
            <p id="agent-answer-summary" className="max-w-2xl text-slate-400 leading-relaxed text-base md:text-lg font-light">
              {portfolioData.personalInfo.bio}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:-translate-y-1"
                style={{
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`,
                  boxShadow: `0 4px 20px ${t.primary}40, inset 0 1px 0 rgba(255,255,255,0.15)`,
                }}
              >
                Explore Projects <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white border border-white/8 bg-white/2 hover:bg-white/5 hover:border-white/15 transition-all duration-300 hover:-translate-y-1"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.05em", textTransform: "uppercase" }}
              >
                Get in Touch <Mail className="w-4 h-4" />
              </a>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl pt-12">
              {portfolioData.personalInfo.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="stat-card animate-fadeInUp"
                  style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
                >
                  <div
                    className="text-2xl md:text-3xl font-bold mb-1"
                    style={{
                      fontFamily: "var(--font-mono)",
                      background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {stat.val}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Down Indicator */}
            <div className="pt-8 animate-float">
              <a
                href="#about"
                className="inline-flex flex-col items-center gap-2 text-slate-500 hover:text-white transition-colors"
                style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em" }}
              >
                <span>SCROLL TO DISCOVER</span>
                <span className="w-5 h-8 rounded-full border border-slate-800 flex items-start justify-center p-1">
                  <span className="w-1 h-2 rounded-full animate-bounce" style={{ background: t.primary }} />
                </span>
              </a>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              ABOUT / SPECIALIZATIONS
          ══════════════════════════════════════════════════════════════ */}
          <section id="about" className="scroll-mt-24 space-y-10">
            <div className="flex flex-col md:flex-row gap-6 items-end justify-between pb-8 relative">
              <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(6,182,212,0.3), transparent)" }} />
              <div className="flex items-center gap-6">
                {/* Profile photo */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden"
                    style={{
                      boxShadow: `0 0 0 2px ${t.primary}50, 0 8px 32px ${t.primary}25`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/avatar.webp"
                      alt="Prabesh Shah - Autonomous AI Engineer & Full-Stack Architect"
                      width={96}
                      height={96}
                      loading="lazy"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-950 flex items-center justify-center" style={{ boxShadow: "0 0 10px rgba(52,211,153,0.9)" }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium mb-2" style={{ fontFamily: "var(--font-mono)", color: t.primary, letterSpacing: "0.12em" }}>
                    01 — ENGINEERING FOCUS
                  </p>
                  <h2 id="core-specializations-heading" className="text-3xl md:text-5xl font-bold tracking-tight text-white">Core Specializations</h2>
                </div>
              </div>
              <p className="max-w-md text-slate-400 text-sm leading-relaxed md:text-right">
                Building system architectures for production durability — blending systems engineering with intelligent model orchestration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  icon: Cpu,
                  iconBg: `${t.primary}15`,
                  iconBorder: `${t.primary}30`,
                  iconColor: t.primary,
                  title: "AI & Agentic Systems",
                  desc: "Multi-agent networks via LangGraph DAGs, cost-effective model routing, advanced RAG vector search, and agentic drift guardrails.",
                  tags: ["LangGraph", "RAG", "Gemini API"],
                },
                {
                  icon: Network,
                  iconBg: "rgba(6,182,212,0.12)",
                  iconBorder: "rgba(6,182,212,0.25)",
                  iconColor: "#06b6d4",
                  title: "Distributed Systems",
                  desc: "Event-driven microservices, WebSocket synchronization (CRDT-lite), server-side validation, and custom cache pipeline setups.",
                  tags: ["CRDT", "Redis", "WebSocket"],
                },
                {
                  icon: TrendingUp,
                  iconBg: "rgba(16,185,129,0.12)",
                  iconBorder: "rgba(16,185,129,0.25)",
                  iconColor: "#10b981",
                  title: "Quantitative Finance",
                  desc: "Regime-based trade sizing ensembles, automated settlement hooks, co-integration trackers, and floorsheet volume aggregations.",
                  tags: ["NEPSE", "Kelly Sizer", "Page-Hinkley"],
                },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="aurora-card aurora-card-hover p-6 flex flex-col gap-5 group cursor-default animate-fadeInUp"
                  style={{ animationDelay: `${idx * 0.12}s` }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ background: card.iconBg, border: `1px solid ${card.iconBorder}`, boxShadow: `0 0 16px ${card.iconColor}20` }}
                  >
                    <card.icon className="w-5 h-5" style={{ color: card.iconColor }} />
                  </div>
                  <div className="space-y-2 flex-grow">
                    <h3 className="text-base font-semibold text-white">{card.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {card.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md border text-slate-500" style={{ fontFamily: "var(--font-mono)", background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              TECH STACK
          ══════════════════════════════════════════════════════════════ */}
          <section id="tech" className="scroll-mt-24 space-y-10">
            <div className="flex flex-col md:flex-row gap-6 items-end justify-between pb-8 relative">
              <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(6,182,212,0.3), transparent)" }} />
              <div>
                <p className="text-xs font-medium mb-2" style={{ fontFamily: "var(--font-mono)", color: t.primary, letterSpacing: "0.12em" }}>02 — TECHNICAL ARSENAL</p>
                <h2 id="tech-stack-heading" className="text-3xl md:text-5xl font-bold tracking-tight text-white">The Tech Stack</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="px-3 py-1.5 rounded-lg text-xs border transition-all duration-200"
                    style={{
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.04em",
                      background: activeCategory === cat ? `${t.primary}20` : "rgba(255,255,255,0.02)",
                      borderColor: activeCategory === cat ? `${t.primary}40` : "rgba(255,255,255,0.06)",
                      color: activeCategory === cat ? t.primary : "#64748b",
                      boxShadow: activeCategory === cat ? `0 0 12px ${t.primary}20` : "none",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {filteredTech.map((tech, idx) => (
                <div
                  key={idx}
                  className="group p-4 rounded-xl border text-center transition-all duration-300 hover:-translate-y-1 cursor-default"
                  style={{
                    background: "rgba(8,12,24,0.6)",
                    borderColor: "rgba(255,255,255,0.06)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${t.primary}30`; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px rgba(0,0,0,0.4), 0 0 12px ${t.primary}15`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)"; }}
                >
                  <div className="text-sm font-semibold text-slate-200 mb-1">{tech.name}</div>
                  <div className="text-[9px] text-slate-600 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>{tech.category.split(" ")[0]}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              CRDT DISTRIBUTED LAB
          ══════════════════════════════════════════════════════════════ */}
          <section id="crdt-lab" className="scroll-mt-24 space-y-10">
            <div className="flex flex-col md:flex-row gap-6 items-end justify-between pb-8 relative">
              <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(6,182,212,0.3), transparent)" }} />
              <div>
                <p className="text-xs font-medium mb-2" style={{ fontFamily: "var(--font-mono)", color: t.primary, letterSpacing: "0.12em" }}>03 — DISTRIBUTED LAB</p>
                <h2 id="crdt-simulator-heading" className="text-3xl md:text-5xl font-bold tracking-tight text-white">🔬 Live CRDT Simulator</h2>
              </div>
              <p className="max-w-md text-slate-400 text-sm leading-relaxed md:text-right">
                Interactive Vector Clock semantic resolution. Mutate task parameters and watch LWW conflict resolution fire in real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Client A */}
              <div className="aurora-card p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-violet-400" style={{ boxShadow: "0 0 6px rgba(167,139,250,0.7)" }} />
                    <span className="text-xs font-medium text-slate-300" style={{ fontFamily: "var(--font-mono)" }}>CLIENT ALPHA</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ fontFamily: "var(--font-mono)", background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", color: "#c4b5fd" }}>
                    VClock: &#123;A:{clientATask.clock.A}, B:{clientATask.clock.B}&#125;
                  </span>
                </div>
                <div className="space-y-2">
                  <label htmlFor="client-a-input" className="text-[10px] text-slate-500 uppercase tracking-wider block" style={{ fontFamily: "var(--font-mono)" }}>Mutate Task Content</label>
                  <input
                    id="client-a-input"
                    name="clientAText"
                    type="text"
                    aria-label="Mutate Client Alpha Task Content"
                    value={clientATask.text}
                    onChange={(e) => handleClientEdit("A", e.target.value)}
                    className="input-aurora"
                  />
                </div>
                <p className="text-[10px] text-slate-600 mt-auto" style={{ fontFamily: "var(--font-mono)" }}>Mutation increments A+1 in Vector Clock.</p>
              </div>

              {/* Controls */}
              <div className="aurora-card p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300" style={{ fontFamily: "var(--font-mono)" }}>NETWORK CONTROLS</span>
                  <span className={`text-[10px] font-mono font-bold ${syncStatusColor}`}>{syncStatusLabel}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={handleSyncCRDT}
                    disabled={isSyncing || syncStatus === "synced"}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] font-medium transition-all duration-200"
                    style={{
                      fontFamily: "var(--font-mono)",
                      background: syncStatus !== "synced" ? `${t.primary}15` : "rgba(255,255,255,0.02)",
                      borderColor: syncStatus !== "synced" ? `${t.primary}30` : "rgba(255,255,255,0.05)",
                      color: syncStatus !== "synced" ? t.primary : "#475569",
                      cursor: syncStatus === "synced" ? "not-allowed" : "pointer",
                    }}
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                    SYNC
                  </button>
                  <button
                    onClick={handleSimulateConflict}
                    disabled={syncStatus !== "synced"}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] font-medium transition-all duration-200"
                    style={{
                      fontFamily: "var(--font-mono)",
                      background: "rgba(244,63,94,0.08)",
                      borderColor: "rgba(244,63,94,0.2)",
                      color: "#fb7185",
                      cursor: syncStatus !== "synced" ? "not-allowed" : "pointer",
                    }}
                  >
                    <GitBranch className="w-4 h-4" />
                    FORK
                  </button>
                  <button
                    onClick={handleResetCRDT}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] font-medium border-white/5 bg-white/2 text-slate-500 hover:text-slate-300 hover:border-white/10 transition-all duration-200"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <Activity className="w-4 h-4" />
                    RESET
                  </button>
                </div>

                <div className="flex-grow rounded-xl border border-white/5 bg-slate-950/60 p-3 overflow-y-auto space-y-1.5 max-h-[180px]" style={{ fontFamily: "var(--font-mono)" }}>
                  {crdtLog.map((log, idx) => (
                    <div key={idx} className={`text-[10px] leading-relaxed ${log.includes("🚨") ? "text-rose-400" : log.includes("✓") ? "text-emerald-400" : log.includes("⚡") ? "text-amber-400" : "text-slate-500"}`}>
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              {/* Client B */}
              <div className="aurora-card p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" style={{ boxShadow: "0 0 6px rgba(34,211,238,0.7)" }} />
                    <span className="text-xs font-medium text-slate-300" style={{ fontFamily: "var(--font-mono)" }}>CLIENT BETA</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ fontFamily: "var(--font-mono)", background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.25)", color: "#67e8f9" }}>
                    VClock: &#123;A:{clientBTask.clock.A}, B:{clientBTask.clock.B}&#125;
                  </span>
                </div>
                <div className="space-y-2">
                  <label htmlFor="client-b-input" className="text-[10px] text-slate-500 uppercase tracking-wider block" style={{ fontFamily: "var(--font-mono)" }}>Mutate Task Content</label>
                  <input
                    id="client-b-input"
                    name="clientBText"
                    type="text"
                    aria-label="Mutate Client Beta Task Content"
                    value={clientBTask.text}
                    onChange={(e) => handleClientEdit("B", e.target.value)}
                    className="input-aurora"
                  />
                </div>
                <p className="text-[10px] text-slate-600 mt-auto" style={{ fontFamily: "var(--font-mono)" }}>Mutation increments B+1 in Vector Clock.</p>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              PROJECTS
          ══════════════════════════════════════════════════════════════ */}
          <section id="projects" className="scroll-mt-24 space-y-10">
            <div className="flex flex-col md:flex-row gap-6 items-end justify-between pb-8 relative">
              <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(6,182,212,0.3), transparent)" }} />
              <div>
                <p className="text-xs font-medium mb-2" style={{ fontFamily: "var(--font-mono)", color: t.primary, letterSpacing: "0.12em" }}>04 — ARCHITECTURAL SHOWCASES</p>
                <h2 id="production-codebases-heading" className="text-3xl md:text-5xl font-bold tracking-tight text-white">Production Codebases</h2>
              </div>
              <p className="max-w-md text-slate-400 text-sm leading-relaxed md:text-right">
                High-fidelity projects demonstrating my preferences across AI pipelines, stateful server infra, and mobile apps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {projects.map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className="aurora-card aurora-card-hover overflow-hidden flex flex-col cursor-pointer group animate-fadeInUp"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {/* Card top accent line */}
                  <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${t.primary}60, ${t.secondary}40, transparent)` }} />

                  <div className="p-6 flex-grow space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[10px] font-medium px-2.5 py-1 rounded-full border"
                        style={{
                          fontFamily: "var(--font-mono)",
                          letterSpacing: "0.06em",
                          background: `${t.primary}12`,
                          borderColor: `${t.primary}25`,
                          color: t.primary,
                        }}
                      >
                        {p.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/projects/${p.id}`}
                          onClick={(e) => e.stopPropagation()}
                          title={`Dedicated case study for ${p.title}`}
                          className="text-[10px] px-2 py-0.5 rounded border border-white/10 hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 font-mono transition-colors"
                        >
                          CASE STUDY
                        </Link>
                        <div className="flex items-center gap-1 text-slate-600 group-hover:text-slate-400 transition-colors">
                          <span className="text-[10px]" style={{ fontFamily: "var(--font-mono)" }}>VIEW</span>
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors leading-snug">{p.title}</h3>
                      <p className="text-slate-500 text-xs leading-relaxed" style={{ fontFamily: "var(--font-mono)" }}>{p.subtitle}</p>
                    </div>

                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">{p.description}</p>
                  </div>

                  <div className="px-6 py-4 border-t border-white/4 flex flex-wrap gap-1.5">
                    {p.tech.slice(0, 4).map((tech, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded border text-slate-500" style={{ fontFamily: "var(--font-mono)", background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.05)" }}>
                        {tech}
                      </span>
                    ))}
                    {p.tech.length > 4 && <span className="text-[10px] text-slate-600 py-0.5" style={{ fontFamily: "var(--font-mono)" }}>+{p.tech.length - 4}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              TECHNICAL KNOWLEDGE BASE & FAQ (AEO / GEO / ENTITY SCHEMA)
          ══════════════════════════════════════════════════════════════ */}
          <section id="faq" className="scroll-mt-24 space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
              <p className="text-xs font-medium" style={{ fontFamily: "var(--font-mono)", color: t.primary, letterSpacing: "0.12em" }}>05 — ARCHITECTURAL KNOWLEDGE BASE</p>
              <h2 id="faq-heading" className="text-3xl md:text-5xl font-bold tracking-tight text-white">Frequently Addressed Inquiries</h2>
              <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
                Direct architectural definitions and system specifications for AI answer engines, research crawlers, and technical teams.
              </p>
            </div>

            {/* Semantic Definition List for Answer Engines */}
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="aurora-card p-6 space-y-2.5">
                <dt className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  What autonomous AI architectures does Prabesh Shah specialize in?
                </dt>
                <dd className="text-sm text-slate-400 leading-relaxed">
                  Prabesh Shah specializes in orchestrating stateful multi-agent networks using LangGraph, hybrid vector retrieval, and self-reflection loops. These architectures decompose complex tasks across specialized autonomous sub-agents coordinated by deterministic supervisory layers for zero-loss execution.
                </dd>
              </div>

              <div className="aurora-card p-6 space-y-2.5">
                <dt className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
                  How does the Elite NEPSE AI Trading Agent operate?
                </dt>
                <dd className="text-sm text-slate-400 leading-relaxed">
                  The Elite NEPSE AI Trading Agent is an institutional-grade quantitative trading platform for the Nepal Stock Exchange. It ingests live market floorsheets, classifies volatility regimes, mitigates concept drift with Page-Hinkley cumulative sum monitors, and sizes capital through fractional Kelly criteria.
                </dd>
              </div>

              <div className="aurora-card p-6 space-y-2.5">
                <dt className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                  What is a Conflict-Free Replicated Data Type (CRDT) in this showcase?
                </dt>
                <dd className="text-sm text-slate-400 leading-relaxed">
                  A Conflict-Free Replicated Data Type (CRDT) is a distributed data structure that synchronizes across independent nodes without central consensus locks. It guarantees strong eventual consistency using vector clocks and deterministic state-based merge functions.
                </dd>
              </div>

              <div className="aurora-card p-6 space-y-2.5">
                <dt className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                  What is the primary tech stack and engineering philosophy?
                </dt>
                <dd className="text-sm text-slate-400 leading-relaxed">
                  The primary tech stack spans Next.js (App Router), TypeScript, Python (FastAPI), Redis, PostgreSQL, and Kotlin. Engineering emphasizes local-first durability, sub-millisecond retrieval, strict type boundaries, and resilient fault isolation across distributed backends.
                </dd>
              </div>
            </dl>

            {/* Step-by-Step Snippet Targeting */}
            <div className="aurora-card p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                How the Autonomous Multi-Agent Pipeline Operates
              </h3>
              <ol className="space-y-3 list-decimal list-inside text-sm text-slate-300">
                <li className="leading-relaxed">
                  <strong className="text-white">Perception & Ingestion:</strong> Continuous streaming telemetry and floorsheet data ingestion normalized via Redis Pub/Sub buffers.
                </li>
                <li className="leading-relaxed">
                  <strong className="text-white">Regime Classification & Concept Drift:</strong> Unsupervised regime-switching models detect volatility shifts and freeze allocations under Page-Hinkley drift thresholds.
                </li>
                <li className="leading-relaxed">
                  <strong className="text-white">Deterministic Execution & Risk Sizing:</strong> Fractional Kelly criterion optimizes order sizing, routed through headless broker connectors with automated session renewal.
                </li>
              </ol>
            </div>

            {/* Comparative Benchmarks for Structured Snippets */}
            <div className="aurora-card p-6 space-y-4 overflow-x-auto">
              <h3 className="text-lg font-semibold text-white">System Architecture Comparison & Benchmarks</h3>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-mono">
                    <th className="py-2.5 pr-4">Architecture Metric</th>
                    <th className="py-2.5 px-4 text-emerald-400">Autonomous Multi-Agent</th>
                    <th className="py-2.5 px-4 text-slate-400">Sequential Monolith</th>
                    <th className="py-2.5 pl-4 text-slate-400">Manual Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-slate-300">
                  <tr>
                    <td className="py-2.5 pr-4 font-medium text-white">State Synchronization</td>
                    <td className="py-2.5 px-4 text-emerald-300">CRDT Vector Clocks</td>
                    <td className="py-2.5 px-4 text-slate-400">Pessimistic DB Locks</td>
                    <td className="py-2.5 pl-4 text-slate-500">Manual Reconciliation</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-medium text-white">Execution Latency</td>
                    <td className="py-2.5 px-4 text-emerald-300">&lt; 14ms (Async Worker)</td>
                    <td className="py-2.5 px-4 text-slate-400">320ms (Blocking)</td>
                    <td className="py-2.5 pl-4 text-slate-500">&gt; 5,000ms</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-medium text-white">Concept Drift Protection</td>
                    <td className="py-2.5 px-4 text-emerald-300">Page-Hinkley Monitor</td>
                    <td className="py-2.5 px-4 text-slate-400">Periodic Cron Retrain</td>
                    <td className="py-2.5 pl-4 text-slate-500">None / Reactive</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-medium text-white">Fault Domain Isolation</td>
                    <td className="py-2.5 px-4 text-emerald-300">Autonomous Sub-Agent</td>
                    <td className="py-2.5 px-4 text-slate-400">Shared Process Crash</td>
                    <td className="py-2.5 pl-4 text-slate-500">Single Point Failure</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Embedded FAQPage Schema */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: [
                    {
                      "@type": "Question",
                      name: "What autonomous AI architectures does Prabesh Shah specialize in?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Prabesh Shah specializes in orchestrating stateful multi-agent networks using LangGraph, hybrid vector retrieval, and self-reflection loops. These architectures decompose complex tasks across specialized autonomous sub-agents coordinated by deterministic supervisory layers for zero-loss execution.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "How does the Elite NEPSE AI Trading Agent operate?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "The Elite NEPSE AI Trading Agent is an institutional-grade quantitative trading platform for the Nepal Stock Exchange. It ingests live market floorsheets, classifies volatility regimes, mitigates concept drift with Page-Hinkley cumulative sum monitors, and sizes capital through fractional Kelly criteria.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "What is a Conflict-Free Replicated Data Type (CRDT) in this showcase?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "A Conflict-Free Replicated Data Type (CRDT) is a distributed data structure that synchronizes across independent nodes without central consensus locks. It guarantees strong eventual consistency using vector clocks and deterministic state-based merge functions.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "What is the primary tech stack and engineering philosophy?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "The primary tech stack spans Next.js (App Router), TypeScript, Python (FastAPI), Redis, PostgreSQL, and Kotlin. Engineering emphasizes local-first durability, sub-millisecond retrieval, strict type boundaries, and resilient fault isolation across distributed backends.",
                      },
                    },
                  ],
                }),
              }}
            />
          </section>

          {/* ══════════════════════════════════════════════════════════════
              CONTACT
          ══════════════════════════════════════════════════════════════ */}
          <section id="contact" className="scroll-mt-24 space-y-10 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
              <p className="text-xs font-medium" style={{ fontFamily: "var(--font-mono)", color: t.primary, letterSpacing: "0.12em" }}>06 — LET&apos;S CONNECT</p>
              <h2 id="contact-heading" className="text-3xl md:text-5xl font-bold tracking-tight text-white">Start a Conversation</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">Open to AI/ML collaborations, engineering contracts, and high-signal opportunities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Form */}
              <div className="md:col-span-2 aurora-card p-7">
                {formStatus === "success" ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)" }}>
                      <CheckCircle className="w-7 h-7 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Message Transmitted</h3>
                    <p className="text-slate-400 text-sm">Connection handshake acknowledged. I&apos;ll respond shortly.</p>
                  </div>
                ) : (
                  <form
                    id="contact-form"
                    name="contact-inquiry"
                    onSubmit={handleContactSubmit}
                    className="space-y-5"
                    aria-label="Direct architectural collaboration inquiry form"
                    {...{
                      toolname: "submitContactInquiry",
                      tooldescription: "Sends a direct architectural collaboration or project inquiry to Prabesh Shah",
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact-name"
                          className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          Your Name
                        </label>
                        <input
                          id="contact-name"
                          name="senderName"
                          type="text"
                          required
                          autoComplete="name"
                          disabled={formStatus === "sending"}
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="Dr. Alan Turing"
                          className="input-aurora"
                          aria-required="true"
                          {...{
                            toolparamdescription: "Full name of the inquiring party",
                          }}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label
                          htmlFor="contact-email"
                          className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          Your Email
                        </label>
                        <input
                          id="contact-email"
                          name="senderEmail"
                          type="email"
                          required
                          autoComplete="email"
                          disabled={formStatus === "sending"}
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          placeholder="alan@turing.org"
                          className="input-aurora"
                          aria-required="true"
                          {...{
                            toolparamdescription: "Verified email address for reply handshake",
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-message"
                        className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        Your Message
                      </label>
                      <textarea
                        id="contact-message"
                        name="inquiryMessage"
                        required
                        disabled={formStatus === "sending"}
                        rows={4}
                        value={formMsg}
                        onChange={(e) => setFormMsg(e.target.value)}
                        placeholder="Inquiry regarding multi-agent orchestration, quant modeling, or systems consulting..."
                        className="input-aurora resize-none"
                        aria-required="true"
                        {...{
                          toolparamdescription: "Technical project brief or collaboration proposal",
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={formStatus === "sending"}
                      className="w-full py-3 rounded-xl text-sm font-medium text-white transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5"
                      style={{
                        fontFamily: "var(--font-mono)",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`,
                        boxShadow: `0 4px 20px ${t.primary}35, inset 0 1px 0 rgba(255,255,255,0.15)`,
                        opacity: formStatus === "sending" ? 0.7 : 1,
                      }}
                    >
                      {formStatus === "sending" ? "Transmitting..." : <><span>Send Message</span><Send className="w-4 h-4" /></>}
                    </button>
                  </form>
                )}
              </div>

              {/* Links */}
              <div className="aurora-card p-7 flex flex-col gap-5 justify-center">
                <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-mono)" }}>Direct Channels</div>

                <div className="space-y-4">
                  {portfolioData.personalInfo.github && (
                    <a href={portfolioData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/6 bg-white/3 group-hover:border-white/12 group-hover:bg-white/6 transition-all">
                        <Github className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-300 group-hover:text-white transition-colors font-medium">GitHub</div>
                        <div className="text-[10px] text-slate-600" style={{ fontFamily: "var(--font-mono)" }}>@{portfolioData.personalInfo.github.split("/").pop()}</div>
                      </div>
                    </a>
                  )}
                  {portfolioData.personalInfo.email && (
                    <a href={`mailto:${portfolioData.personalInfo.email}`} className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/6 bg-white/3 group-hover:border-white/12 group-hover:bg-white/6 transition-all">
                        <Mail className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-300 group-hover:text-white transition-colors font-medium">Email</div>
                        <div className="text-[10px] text-slate-600" style={{ fontFamily: "var(--font-mono)" }}>{portfolioData.personalInfo.email}</div>
                      </div>
                    </a>
                  )}

                  {/* Location tag */}
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Globe className="w-4 h-4" />
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>Kathmandu, Nepal 🇳🇵</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-sm text-emerald-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px" }}>Open to remote opportunities</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      )}

      {/* ── PROJECT MODAL ─────────────────────────────────────────────────── */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ background: "rgba(4,5,13,0.85)", backdropFilter: "blur(12px)" }}
          onClick={(e) => e.target === e.currentTarget && setSelectedProject(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col my-8 animate-fadeInUp"
            style={{
              background: "linear-gradient(145deg, rgba(13,18,37,0.97) 0%, rgba(8,12,24,0.99) 100%)",
              border: "1px solid rgba(139,92,246,0.18)",
              borderRadius: "1.5rem",
              boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            {/* Accent line */}
            <div className="h-px rounded-t-3xl" style={{ background: `linear-gradient(90deg, ${t.primary}80, ${t.secondary}60, transparent)` }} />

            {/* Header */}
            <div className="p-7 border-b border-white/5 flex items-start justify-between gap-4">
              <div className="space-y-2">
                <span
                  className="text-[10px] font-medium px-2.5 py-1 rounded-full border"
                  style={{ fontFamily: "var(--font-mono)", background: `${t.primary}12`, borderColor: `${t.primary}25`, color: t.primary }}
                >
                  {selectedProject.category}
                </span>
                <h3 className="text-2xl font-bold text-white mt-2">{selectedProject.title}</h3>
                <p className="text-slate-400 text-xs" style={{ fontFamily: "var(--font-mono)" }}>{selectedProject.subtitle}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-xl border border-white/6 bg-white/3 hover:bg-white/8 hover:border-white/12 transition-all flex-shrink-0"
              >
                <X className="w-4 h-4 text-slate-400 hover:text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-7 space-y-7 flex-grow text-sm text-slate-300 leading-relaxed">
              <div className="space-y-2">
                <h4 className="text-[10px] font-medium uppercase tracking-wider text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>Summary</h4>
                <p className="text-slate-300 leading-relaxed">{selectedProject.description}</p>
              </div>

              {/* Interactive Demo: NEPSE Chart */}
              {selectedProject.id === "stockagent" && (
                <div className="space-y-4 rounded-2xl p-5 border border-white/5 bg-slate-950/60">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-medium uppercase tracking-wider text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>📊 12-Month Backtest Returns</h4>
                    <span className="text-[10px] font-medium" style={{ fontFamily: "var(--font-mono)", color: "#10b981" }}>Sharpe: 2.45 · Win: 68%</span>
                  </div>
                  <div className="relative">
                    <svg viewBox="0 0 600 240" className="w-full h-auto overflow-visible select-none">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={t.primary} />
                          <stop offset="100%" stopColor={t.secondary} />
                        </linearGradient>
                      </defs>
                      {[20, 80, 140, 200].map((y) => (
                        <line key={y} x1="40" y1={y} x2="580" y2={y} stroke="rgba(255,255,255,0.04)" strokeDasharray="4" />
                      ))}
                      {["120%","80%","40%","0%"].map((label, i) => (
                        <text key={label} x="32" y={25 + i * 60} fill="#334155" fontSize="8" textAnchor="end" fontFamily="var(--font-mono)">{label}</text>
                      ))}
                      <polyline fill="none" stroke="rgba(71,85,105,0.5)" strokeWidth="1.5" points={chartData.map((d, i) => `${40 + i * 49},${200 - d.nepse * 1.5}`).join(" ")} />
                      <polyline fill="none" stroke="url(#chartGrad)" strokeWidth="2.5" strokeLinejoin="round" points={chartData.map((d, i) => `${40 + i * 49},${200 - d.portfolio * 1.5}`).join(" ")} style={{ filter: `drop-shadow(0 0 6px ${t.primary}80)` }} />
                      {chartData.map((d, i) => (
                        <circle
                          key={i} cx={40 + i * 49} cy={200 - d.portfolio * 1.5} r="5"
                          fill={t.primary} stroke="#04050d" strokeWidth="2"
                          className="cursor-pointer transition-all"
                          onMouseEnter={() => setHoveredPoint(d)} onMouseLeave={() => setHoveredPoint(null)}
                          style={{ filter: `drop-shadow(0 0 4px ${t.primary}80)` }}
                        />
                      ))}
                      {chartData.map((d, i) => (
                        <text key={i} x={40 + i * 49} y="222" fill="#334155" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">{d.month}</text>
                      ))}
                    </svg>
                    {hoveredPoint ? (
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 p-3 rounded-xl text-xs z-10 w-[200px] space-y-1" style={{ background: "rgba(8,12,24,0.95)", border: "1px solid rgba(139,92,246,0.2)", boxShadow: "0 8px 30px rgba(0,0,0,0.6)", fontFamily: "var(--font-mono)" }}>
                        <div className="font-semibold text-white border-b border-white/5 pb-1.5 mb-1.5">{hoveredPoint.month} Data</div>
                        {[["Agent P&L", `+${hoveredPoint.portfolio}%`, t.primary],["NEPSE Index", `+${hoveredPoint.nepse}%`, "#64748b"],["Regime", hoveredPoint.regime, "#94a3b8"],["Max DD", `${hoveredPoint.drawdown}%`, "#fb7185"]].map(([k,v,c]) => (
                          <div key={k as string} className="flex justify-between"><span className="text-slate-500">{k}</span><span style={{ color: c as string }}>{v}</span></div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-[10px] text-slate-600 mt-1" style={{ fontFamily: "var(--font-mono)" }}>hover nodes to trace strategy metadata</div>
                    )}
                  </div>
                </div>
              )}

              {/* Interactive Demo: LangGraph DAG */}
              {selectedProject.id === "inverter" && (
                <div className="space-y-4 rounded-2xl p-5 border border-white/5 bg-slate-950/60">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-medium uppercase tracking-wider text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>🔌 LangGraph Node Trace</h4>
                    <button
                      onClick={handleRunDag}
                      disabled={dagRunning}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all"
                      style={{
                        fontFamily: "var(--font-mono)",
                        background: dagRunning ? "rgba(255,255,255,0.03)" : `${t.primary}20`,
                        borderColor: dagRunning ? "rgba(255,255,255,0.06)" : `${t.primary}30`,
                        color: dagRunning ? "#475569" : t.primary,
                        border: "1px solid",
                        cursor: dagRunning ? "not-allowed" : "pointer",
                      }}
                    >
                      <Play className="w-3 h-3" />
                      {dagRunning ? "RUNNING..." : "RUN DAG ANALYSIS"}
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-4 rounded-xl border border-white/5 bg-slate-950/40 relative overflow-x-auto">
                    <div className="hidden sm:block absolute top-1/2 left-[10%] right-[10%] h-px" style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.15), rgba(6,182,212,0.15))" }} />
                    {[{ id: "pdf", label: "PDF Source" }, { id: "extractor", label: "Gemini Extractor" }, { id: "normalizer", label: "Normalizer" }, { id: "compliance", label: "NEPQA Audit" }, { id: "report", label: "Report Gen" }].map((step, idx) => (
                      <div
                        key={step.id}
                        className="z-10 px-3 py-2 rounded-xl text-center transition-all duration-400 w-28 flex-shrink-0"
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "9px",
                          border: dagActiveNode === step.id ? `1px solid ${t.primary}50` : "1px solid rgba(255,255,255,0.05)",
                          background: dagActiveNode === step.id ? `${t.primary}15` : "rgba(8,12,24,0.6)",
                          color: dagActiveNode === step.id ? t.primary : "#475569",
                          transform: dagActiveNode === step.id ? "scale(1.08)" : "scale(1)",
                          boxShadow: dagActiveNode === step.id ? `0 0 16px ${t.primary}30` : "none",
                        }}
                      >
                        <div className="font-bold mb-0.5">NODE {idx + 1}</div>
                        <div className="leading-tight">{step.label}</div>
                      </div>
                    ))}
                  </div>
                  {dagLogs.length > 0 && (
                    <div className="rounded-xl p-3 border border-white/5 bg-slate-950/60 font-mono text-[10px] space-y-1 max-h-[90px] overflow-y-auto">
                      {dagLogs.map((log, i) => (
                        <div key={i} className={log.includes("✓") ? "text-emerald-400" : "text-slate-500"}>{log}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Architecture */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-medium uppercase tracking-wider text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>System Architecture</h4>
                <div className="p-4 rounded-xl border border-white/5 bg-slate-950/60 text-[11px] text-slate-400 overflow-x-auto whitespace-pre" style={{ fontFamily: "var(--font-mono)" }}>{selectedProject.architecture}</div>
              </div>

              {/* Achievements */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-medium uppercase tracking-wider text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>Key Implementations</h4>
                <ul className="space-y-2.5">
                  {selectedProject.achievements.map((ach, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-400 text-sm leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: t.primary }} />
                      {ach}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech tags */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-medium uppercase tracking-wider text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>Full Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech.map((tech, i) => (
                    <span key={i} className="text-[11px] px-3 py-1 rounded-lg border text-slate-400" style={{ fontFamily: "var(--font-mono)", background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}>{tech}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-7 border-t border-white/5 bg-white/1 flex flex-wrap items-center justify-between gap-4 rounded-b-3xl">
              <div className="flex items-center gap-3">
                <Link
                  href={`/projects/${selectedProject.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-200 border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" /> Full Case Study
                </Link>
              </div>
              <a
                href={selectedProject.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-white transition-all hover:-translate-y-0.5"
                style={{
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`,
                  boxShadow: `0 4px 16px ${t.primary}30`,
                }}
              >
                <Github className="w-4 h-4" /> View Repository
              </a>
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2.5 rounded-xl text-xs text-slate-500 border border-white/6 bg-white/2 hover:bg-white/5 hover:text-slate-300 transition-all"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.05em", textTransform: "uppercase" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── JARVISH AI CHATBOT ────────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-40" style={{ fontFamily: "var(--font-sans)" }}>
        {chatOpen ? (
          <div
            className="rounded-2xl w-[calc(100vw-2rem)] sm:w-[380px] h-[500px] shadow-2xl flex flex-col overflow-hidden animate-fadeIn"
            style={{
              background: "rgba(8,12,24,0.97)",
              border: `1px solid ${t.primary}25`,
              boxShadow: `0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.02)`,
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Chat header */}
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between" style={{ background: "rgba(13,18,37,0.8)" }}>
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${t.primary}30, ${t.secondary}20)`, border: `1px solid ${t.primary}30` }}>
                  <Sparkles className="w-4 h-4" style={{ color: t.primary }} />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 6px rgba(52,211,153,0.8)" }} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">JARVISH</div>
                  <div className="text-[9px] text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>AI Assistant · Always online</div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="p-1.5 rounded-lg border border-white/5 hover:bg-white/5 transition-all">
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-950/70">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fadeInUp`} style={{ animationDelay: `${idx * 0.03}s` }}>
                  <div
                    className="max-w-[80%] px-4 py-3 text-sm leading-relaxed"
                    style={{
                      borderRadius: msg.role === "user" ? "1.25rem 1.25rem 0.25rem 1.25rem" : "1.25rem 1.25rem 1.25rem 0.25rem",
                      background: msg.role === "user"
                        ? `linear-gradient(135deg, ${t.primary}, ${t.secondary})`
                        : "rgba(13,18,37,0.8)",
                      border: msg.role === "user" ? "none" : "1px solid rgba(255,255,255,0.06)",
                      color: msg.role === "user" ? "#fff" : "#cbd5e1",
                      boxShadow: msg.role === "user" ? `0 4px 15px ${t.primary}30` : "none",
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5" style={{ background: "rgba(13,18,37,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    {[0, 150, 300].map((delay) => (
                      <span key={delay} className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleChatSend} className="p-3.5 border-t border-white/5 flex gap-2.5" style={{ background: "rgba(8,12,24,0.9)" }}>
              <label htmlFor="chat-query-input" className="sr-only">Ask JARVISH AI Assistant</label>
              <input
                id="chat-query-input"
                name="chatQuery"
                type="text"
                aria-label="Ask JARVISH AI Assistant"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about projects, stack, quant..."
                className="flex-grow px-4 py-2 rounded-xl text-sm outline-none placeholder:text-slate-600 text-slate-100"
                style={{ background: "rgba(4,5,13,0.8)", border: "1px solid rgba(255,255,255,0.07)", fontFamily: "var(--font-sans)" }}
              />
              <button
                type="submit"
                disabled={isTyping}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`, boxShadow: `0 4px 12px ${t.primary}40` }}
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setChatOpen(true)}
            className="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group animate-float"
            style={{
              background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`,
              boxShadow: `0 8px 30px ${t.primary}50, 0 0 0 1px rgba(255,255,255,0.1)`,
            }}
            title="Chat with JARVISH"
          >
            {/* Ping ring */}
            <span className="absolute inset-0 rounded-2xl animate-ping-slow" style={{ background: `${t.primary}20` }} />
            <MessageSquare className="w-6 h-6 text-white" />
            <span
              className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl text-[10px] font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap"
              style={{ fontFamily: "var(--font-mono)", background: "rgba(8,12,24,0.95)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
            >
              Chat with JARVISH ✦
            </span>
          </button>
        )}
      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="w-full max-w-7xl mx-auto px-5 pt-16 mt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <span>© {new Date().getFullYear()} {portfolioData.personalInfo.name}. All rights reserved.</span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <time dateTime="2026-11-01" className="text-slate-400">Updated November 2026</time>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="text-emerald-400">Kathmandu, Nepal</span>
        </div>

        {/* Semantic Internal Navigation & Authority Links */}
        <nav aria-label="Footer Quick Links" className="flex flex-wrap justify-center gap-4 text-slate-400">
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#tech" className="hover:text-white transition-colors">Stack</a>
          <a href="#crdt-lab" className="hover:text-white transition-colors">Lab</a>
          <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          <Link href="/privacy" className="hover:text-white transition-colors">Terms &amp; Privacy</Link>
          <a href="https://github.com/Prabesh1919" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-600">VOID AURORA ENGINE v2.5.0</span>
        </div>
      </footer>

    </main>
  );
}
