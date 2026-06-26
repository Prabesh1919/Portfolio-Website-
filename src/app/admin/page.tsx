"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Lock,
  Save,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  HelpCircle,
  X,
  PlusCircle,
  Terminal,
  ShieldCheck,
  User,
  Layers,
  Code,
  MessageSquare
} from "lucide-react";

interface StatItem {
  label: string;
  val: string;
}

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  achievements: string[];
  tech: string[];
  architecture: string;
  category: string;
  repo: string;
  demo?: string;
}

interface TechItem {
  name: string;
  category: string;
}

interface PortfolioData {
  personalInfo: {
    name: string;
    tagline: string;
    bio: string;
    email: string;
    github: string;
    linkedin: string;
    titles: string[];
    stats: StatItem[];
  };
  projects: Project[];
  techStack: TechItem[];
  categories: string[];
}

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  // Loaded Portfolio Data
  const [data, setData] = useState<PortfolioData | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "projects" | "skills" | "chats">("general");

  // Chat Logs State
  const [chats, setChats] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<any | null>(null);

  // Project Editor Sub-State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newAchievement, setNewAchievement] = useState<string>("");
  const [newTechTag, setNewTechTag] = useState<string>("");

  // Status State
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState<string>("");

  // Check session storage on mount
  useEffect(() => {
    const savedPass = sessionStorage.getItem("admin_password");
    if (savedPass) {
      loadData(savedPass);
    }
  }, []);

  async function loadData(pass: string) {
    try {
      const verifyRes = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass }),
      });

      if (!verifyRes.ok) {
        const errData = await verifyRes.json();
        setAuthError(errData.error || "Invalid credentials.");
        setIsAuthenticated(false);
        sessionStorage.removeItem("admin_password");
        return;
      }

      const res = await fetch("/api/portfolio-data");
      if (res.ok) {
        const portfolioData = await res.json();
        setData(portfolioData);
        setIsAuthenticated(true);
        sessionStorage.setItem("admin_password", pass);
        setAuthError("");
      } else {
        setAuthError("Failed to fetch current portfolio structure.");
      }
    } catch (err) {
      console.error(err);
      setAuthError("Could not connect to data repository.");
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    loadData(password);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_password");
    setIsAuthenticated(false);
    setPassword("");
    setData(null);
  };

  const handleSaveAll = async () => {
    if (!data) return;
    setSaveStatus("saving");
    const pass = sessionStorage.getItem("admin_password") || password;

    try {
      const res = await fetch("/api/portfolio-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": pass,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSaveStatus("success");
        setSaveMessage("Portfolio content updated globally!");
        setTimeout(() => setSaveStatus("idle"), 4000);
      } else {
        const errData = await res.json();
        setSaveStatus("error");
        setSaveMessage(errData.error || "Failed to update configurations.");
      }
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
      setSaveMessage("Network operational challenge.");
    }
  };

  // General Fields Change
  const updateGeneralField = (field: string, value: any) => {
    if (!data) return;
    setData({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value,
      },
    });
  };

  const handleTitlesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.value.split(",").map((s) => s.trim());
    updateGeneralField("titles", list);
  };

  // Stats Grid Editor
  const updateStatItem = (index: number, key: "label" | "val", value: string) => {
    if (!data) return;
    const newStats = [...data.personalInfo.stats];
    newStats[index] = { ...newStats[index], [key]: value };
    updateGeneralField("stats", newStats);
  };

  // Projects Actions
  const handleEditProject = (project: Project) => {
    setEditingProject({ ...project });
  };

  const handleCreateNewProject = () => {
    const randomId = "proj-" + Math.random().toString(36).substring(2, 9);
    setEditingProject({
      id: randomId,
      title: "New Architectural Node",
      subtitle: "Autonomous project description",
      description: "A detailed breakdown of systems operations.",
      achievements: [],
      tech: [],
      architecture: "[Input Data] -> [Process Queue] -> [Output State]",
      category: "Full-Stack",
      repo: "https://github.com/Prabesh1919",
      demo: "",
    });
  };

  const handleSaveProjectForm = () => {
    if (!data || !editingProject) return;
    const index = data.projects.findIndex((p) => p.id === editingProject.id);
    let newProjects = [...data.projects];

    if (index > -1) {
      newProjects[index] = editingProject;
    } else {
      newProjects.push(editingProject);
    }

    setData({
      ...data,
      projects: newProjects,
    });
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
    if (!data || !confirm("Are you sure you want to delete this project node?")) return;
    setData({
      ...data,
      projects: data.projects.filter((p) => p.id !== id),
    });
  };

  // Project Achievements Editor
  const addAchievement = () => {
    if (!editingProject || !newAchievement.trim()) return;
    setEditingProject({
      ...editingProject,
      achievements: [...editingProject.achievements, newAchievement.trim()],
    });
    setNewAchievement("");
  };

  const removeAchievement = (idx: number) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      achievements: editingProject.achievements.filter((_, i) => i !== idx),
    });
  };

  // Project Tech Tags Editor
  const addTechTag = () => {
    if (!editingProject || !newTechTag.trim()) return;
    if (editingProject.tech.includes(newTechTag.trim())) return;
    setEditingProject({
      ...editingProject,
      tech: [...editingProject.tech, newTechTag.trim()],
    });
    setNewTechTag("");
  };

  const removeTechTag = (tag: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      tech: editingProject.tech.filter((t) => t !== tag),
    });
  };

  // Skills Editor Sub-Actions
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCat, setNewSkillCat] = useState("Languages");

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !newSkillName.trim()) return;

    // Check duplicate
    if (data.techStack.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      alert("Skill tag already exists in stack.");
      return;
    }

    setData({
      ...data,
      techStack: [...data.techStack, { name: newSkillName.trim(), category: newSkillCat }],
    });
    setNewSkillName("");
  };

  const handleDeleteSkill = (name: string) => {
    if (!data) return;
    setData({
      ...data,
      techStack: data.techStack.filter((s) => s.name !== name),
    });
  };

  // Neumorphic Theme Styling
  const nmCard = "bg-[#0f121d] rounded-2xl p-6 border border-white/[0.02] shadow-[6px_6px_14px_rgba(0,0,0,0.75),-6px_-6px_14px_rgba(168,85,247,0.08)]";
  const nmInput = "w-full bg-[#0f121d] rounded-xl px-4 py-3 text-sm text-slate-200 border border-black/40 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.75),inset_-4px_-4px_8px_rgba(168,85,247,0.05)] focus:outline-none focus:border-purple-500/50 transition-colors";
  const nmButtonFlat = "px-5 py-2.5 bg-[#0f121d] text-sm font-mono text-purple-400 border border-white/[0.02] rounded-xl shadow-[4px_4px_10px_rgba(0,0,0,0.75),-4px_-4px_10px_rgba(168,85,247,0.06)] hover:shadow-[2px_2px_5px_rgba(0,0,0,0.75),-2px_-2px_5px_rgba(168,85,247,0.06)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.75)] transition-all font-semibold cursor-pointer flex items-center gap-2";
  const nmButtonAction = "px-5 py-2.5 bg-purple-600 text-sm font-mono text-slate-950 rounded-xl shadow-[4px_4px_10px_rgba(0,0,0,0.75)] hover:bg-purple-500 transition-colors font-bold cursor-pointer flex items-center gap-2";

  // Login Screen
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0f121d] text-slate-100 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold tracking-wider font-mono text-purple-400">ADMIN PATHWAY</h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Portfolio Central Kernel</p>
          </div>

          <div className={`${nmCard} space-y-4`}>
            <div className="flex justify-center text-purple-500 mb-2">
              <Lock className="w-12 h-12" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-mono">AUTHORIZED KEY CODE</label>
                <input
                  type="password"
                  placeholder="Enter credential key..."
                  className={nmInput}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
              </div>

              {authError && <p className="text-xs text-pink-500 font-mono text-center">{authError}</p>}

              <button type="submit" className="w-full justify-center mt-2 py-3 bg-purple-600 hover:bg-purple-500 text-slate-950 rounded-xl font-mono font-bold tracking-wider transition-colors shadow-lg cursor-pointer">
                ACCESS SYSTEM KERNEL
              </button>
            </form>
          </div>

          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 font-mono transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> BACK TO VISUAL PATHWAY
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!data) return null;

  return (
    <main className="min-h-screen bg-[#0f121d] text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold tracking-wider">
              <ShieldCheck className="w-4 h-4" /> KERNEL LEVEL: SECURE READ-WRITE
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Portfolio Administration Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleSaveAll} className={nmButtonAction} disabled={saveStatus === "saving"}>
              <Save className="w-4 h-4" />
              {saveStatus === "saving" ? "SYNCHRONIZING..." : "SAVE CONFIGURATION"}
            </button>
            <button onClick={handleLogout} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-xs text-slate-400 font-mono border border-slate-800 rounded-lg cursor-pointer transition-colors">
              DISCONNECT
            </button>
            <Link href="/" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-xs text-slate-400 font-mono border border-slate-800 rounded-lg cursor-pointer transition-colors">
              VIEW PAGE
            </Link>
          </div>
        </div>

        {/* Save Status Notification Banner */}
        {saveStatus !== "idle" && (
          <div className={`p-4 rounded-xl border font-mono text-sm flex items-center gap-3 animate-pulse ${
            saveStatus === "saving" ? "bg-slate-900/60 border-purple-500/20 text-purple-400" :
            saveStatus === "success" ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-400" :
            "bg-pink-950/20 border-pink-500/20 text-pink-400"
          }`}>
            {saveStatus === "success" && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
            <div>{saveMessage || "Executing database save operation..."}</div>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex border-b border-slate-900 pb-px">
          {(["general", "projects", "skills", "chats"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setEditingProject(null);
              }}
              className={`px-6 py-3 font-mono text-sm uppercase font-semibold transition-all border-b-2 cursor-pointer ${
                activeTab === tab
                  ? "border-purple-500 text-purple-400 font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab} config
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div className="space-y-6">
          
          {/* 1. GENERAL TAB */}
          {activeTab === "general" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Personal Meta */}
              <div className={`${nmCard} lg:col-span-2 space-y-5`}>
                <h3 className="text-lg font-bold text-purple-400 font-mono flex items-center gap-2 border-b border-slate-900 pb-3">
                  <User className="w-5 h-5" /> General Personal Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-mono uppercase">Full Name</label>
                    <input
                      type="text"
                      className={nmInput}
                      value={data.personalInfo.name}
                      onChange={(e) => updateGeneralField("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-mono uppercase">Headline Tagline</label>
                    <input
                      type="text"
                      className={nmInput}
                      value={data.personalInfo.tagline}
                      onChange={(e) => updateGeneralField("tagline", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-mono uppercase">Professional Bio</label>
                  <textarea
                    rows={3}
                    className={`${nmInput} resize-none`}
                    value={data.personalInfo.bio}
                    onChange={(e) => updateGeneralField("bio", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-mono uppercase">Email Address</label>
                    <input
                      type="email"
                      className={nmInput}
                      value={data.personalInfo.email}
                      onChange={(e) => updateGeneralField("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-mono uppercase">GitHub Profile URL</label>
                    <input
                      type="url"
                      className={nmInput}
                      value={data.personalInfo.github}
                      onChange={(e) => updateGeneralField("github", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-mono uppercase">LinkedIn URL</label>
                    <input
                      type="url"
                      className={nmInput}
                      value={data.personalInfo.linkedin}
                      onChange={(e) => updateGeneralField("linkedin", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-mono uppercase">
                    Typewriter titles (comma-separated list)
                  </label>
                  <input
                    type="text"
                    className={nmInput}
                    value={data.personalInfo.titles.join(", ")}
                    onChange={handleTitlesChange}
                  />
                  <p className="text-[10px] text-slate-600 font-mono mt-1">Changes are parsed immediately to animate on visual landing page</p>
                </div>
              </div>

              {/* Right Column: Floating Stats */}
              <div className={`${nmCard} space-y-5`}>
                <h3 className="text-lg font-bold text-purple-400 font-mono flex items-center gap-2 border-b border-slate-900 pb-3">
                  <Terminal className="w-5 h-5" /> Floating Quick Stats
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed font-mono">
                  Display values in the main landing segment grid layout. Add precise data.
                </p>

                <div className="space-y-4">
                  {data.personalInfo.stats.map((stat, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/40 rounded-xl border border-slate-900 space-y-2">
                      <div className="text-xs text-slate-600 font-mono uppercase">Stat node #{idx + 1}</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <input
                            type="text"
                            placeholder="Value (e.g. 6+)"
                            className={nmInput}
                            value={stat.val}
                            onChange={(e) => updateStatItem(idx, "val", e.target.value)}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Label (e.g. active repos)"
                            className={nmInput}
                            value={stat.label}
                            onChange={(e) => updateStatItem(idx, "label", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. PROJECTS TAB */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              
              {/* Project list selection or Form */}
              {!editingProject ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-purple-400 font-mono flex items-center gap-2">
                      <Layers className="w-5 h-5" /> Active Projects Directory
                    </h3>
                    <button onClick={handleCreateNewProject} className={nmButtonFlat}>
                      <Plus className="w-4 h-4" /> Add Project Node
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.projects.map((proj) => (
                      <div key={proj.id} className={`${nmCard} flex flex-col justify-between space-y-4`}>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider bg-slate-900 text-slate-400 border border-slate-800">
                              {proj.category}
                            </span>
                            <span className="text-xs text-slate-600 font-mono">{proj.id}</span>
                          </div>
                          <h4 className="text-lg font-bold text-slate-100">{proj.title}</h4>
                          <p className="text-xs text-slate-400 font-mono tracking-wide">{proj.subtitle}</p>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{proj.description}</p>
                        </div>

                        <div className="flex gap-2 justify-end border-t border-slate-900 pt-3">
                          <button onClick={() => handleEditProject(proj)} className="p-2 text-purple-400 hover:text-purple-300 hover:bg-slate-900 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 text-xs font-mono">
                            <Edit3 className="w-4 h-4" /> Edit Details
                          </button>
                          <button onClick={() => handleDeleteProject(proj.id)} className="p-2 text-pink-500 hover:text-pink-400 hover:bg-slate-900 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 text-xs font-mono">
                            <Trash2 className="w-4 h-4" /> Delete Node
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Edit/Create Form Container */
                <div className={`${nmCard} space-y-6`}>
                  <div className="flex justify-between items-center border-b border-slate-900 pb-4">
                    <div>
                      <h4 className="text-lg font-bold text-purple-400 font-mono flex items-center gap-2">
                        <Edit3 className="w-5 h-5" /> Project Configurator
                      </h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">Editing node: {editingProject.id}</p>
                    </div>
                    <button onClick={() => setEditingProject(null)} className="p-1 rounded hover:bg-slate-900 transition-colors">
                      <X className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500 font-mono uppercase">Title (with icon)</label>
                      <input
                        type="text"
                        className={nmInput}
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500 font-mono uppercase">Subtitle</label>
                      <input
                        type="text"
                        className={nmInput}
                        value={editingProject.subtitle}
                        onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-mono uppercase">Project Description</label>
                    <textarea
                      rows={3}
                      className={`${nmInput} resize-none`}
                      value={editingProject.description}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500 font-mono uppercase">Category</label>
                      <select
                        className={`${nmInput} appearance-none bg-slate-950 cursor-pointer`}
                        value={editingProject.category}
                        onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      >
                        <option value="AI & Quant">AI & Quant</option>
                        <option value="Full-Stack">Full-Stack</option>
                        <option value="Mobile">Mobile</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500 font-mono uppercase">GitHub Repository URL</label>
                      <input
                        type="url"
                        className={nmInput}
                        value={editingProject.repo}
                        onChange={(e) => setEditingProject({ ...editingProject, repo: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500 font-mono uppercase">Demo URL (optional)</label>
                      <input
                        type="url"
                        className={nmInput}
                        value={editingProject.demo || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, demo: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-mono uppercase">Architecture Dataflow Pipeline diagram</label>
                    <input
                      type="text"
                      className={`${nmInput} font-mono`}
                      value={editingProject.architecture}
                      onChange={(e) => setEditingProject({ ...editingProject, architecture: e.target.value })}
                    />
                    <p className="text-[10px] text-slate-600 font-mono mt-1">E.g. [Input] -&gt; [Process] -&gt; [Output]</p>
                  </div>

                  {/* Achievements List Sub-Editor */}
                  <div className="space-y-3 bg-slate-950/30 p-4 rounded-xl border border-slate-900">
                    <label className="text-xs text-slate-400 font-mono uppercase">Technical Achievements Checklist</label>
                    <div className="space-y-2">
                      {editingProject.achievements.map((ach, idx) => (
                        <div key={idx} className="flex gap-2 items-center text-xs text-slate-300">
                          <button onClick={() => removeAchievement(idx)} className="p-1 text-pink-500 hover:bg-slate-900 rounded cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-slate-500">#{idx + 1}</span>
                          <span className="leading-relaxed">{ach}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Add dynamic achievement description..."
                        className={nmInput}
                        value={newAchievement}
                        onChange={(e) => setNewAchievement(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addAchievement()}
                      />
                      <button onClick={addAchievement} className="px-3 bg-slate-900 hover:bg-slate-800 text-xs text-purple-400 rounded-xl border border-slate-800 cursor-pointer">
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Tech Tags Sub-Editor */}
                  <div className="space-y-3 bg-slate-950/30 p-4 rounded-xl border border-slate-900">
                    <label className="text-xs text-slate-400 font-mono uppercase">Technologies Stack Chips</label>
                    <div className="flex flex-wrap gap-2">
                      {editingProject.tech.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-950/40 text-purple-400 text-xs border border-purple-500/20 rounded-full font-mono">
                          {tag}
                          <button onClick={() => removeTechTag(tag)} className="text-slate-500 hover:text-white cursor-pointer">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Add technology chip (e.g. Redis)..."
                        className={nmInput}
                        value={newTechTag}
                        onChange={(e) => setNewTechTag(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addTechTag()}
                      />
                      <button onClick={addTechTag} className="px-3 bg-slate-900 hover:bg-slate-800 text-xs text-purple-400 rounded-xl border border-slate-800 cursor-pointer">
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-900">
                    <button onClick={handleSaveProjectForm} className={nmButtonFlat}>
                      Save Project Node changes
                    </button>
                    <button onClick={() => setEditingProject(null)} className="px-4 py-2 text-slate-400 hover:text-slate-200 text-sm font-mono cursor-pointer">
                      Discard Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. SKILLS TAB */}
          {activeTab === "skills" && (
            <div className={`${nmCard} space-y-6`}>
              <h3 className="text-lg font-bold text-purple-400 font-mono flex items-center gap-2 border-b border-slate-900 pb-3">
                <Code className="w-5 h-5" /> Tech Stack Skills Ledger
              </h3>

              {/* Add skill tag form */}
              <form onSubmit={handleAddSkill} className="p-4 bg-slate-950/40 rounded-xl border border-slate-900 space-y-4">
                <div className="text-xs text-slate-400 font-mono uppercase">Add custom tech skill node</div>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-grow">
                    <input
                      type="text"
                      placeholder="Tech name (e.g. Next.js, TensorFlow)..."
                      className={nmInput}
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-[200px]">
                    <select
                      className={`${nmInput} appearance-none bg-slate-950 cursor-pointer`}
                      value={newSkillCat}
                      onChange={(e) => setNewSkillCat(e.target.value)}
                    >
                      {data.categories.filter((c) => c !== "All").map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="px-6 bg-purple-600 text-slate-950 font-mono font-bold rounded-xl cursor-pointer hover:bg-purple-500 transition-colors flex items-center gap-1.5 justify-center">
                    <PlusCircle className="w-4 h-4" /> ADD SKILL
                  </button>
                </div>
              </form>

              {/* Grid of skills categories */}
              <div className="space-y-6">
                {data.categories.filter((c) => c !== "All").map((cat) => {
                  const skills = data.techStack.filter((s) => s.category === cat);
                  return (
                    <div key={cat} className="space-y-2.5">
                      <div className="text-xs font-mono text-slate-500 uppercase tracking-widest border-l-2 border-purple-500 pl-2">{cat}</div>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((s) => (
                          <span key={s.name} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0f121d] text-slate-200 text-xs border border-slate-800 rounded-lg shadow-sm font-mono">
                            {s.name}
                            <button onClick={() => handleDeleteSkill(s.name)} className="text-slate-600 hover:text-pink-500 cursor-pointer transition-colors">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                        {skills.length === 0 && (
                          <span className="text-xs text-slate-600 font-mono italic">No skill tags listed</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. CHAT LOGS TAB */}
          {activeTab === "chats" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-purple-400 font-mono flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" /> JARVISH Conversation Logs
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      const pass = sessionStorage.getItem("admin_password") || password;
                      try {
                        const res = await fetch("/api/chat-logs", {
                          headers: { "x-admin-password": pass },
                        });
                        if (res.ok) {
                          const logsData = await res.json();
                          setChats(logsData.reverse());
                        }
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className={nmButtonFlat}
                  >
                    Refresh Logs
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm("Purge all conversation transcripts?")) return;
                      const pass = sessionStorage.getItem("admin_password") || password;
                      try {
                        await fetch("/api/chat-logs", {
                          method: "DELETE",
                          headers: { "x-admin-password": pass },
                        });
                        setChats([]);
                        setActiveSession(null);
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="px-4 py-2 bg-pink-950/30 text-pink-400 text-xs font-mono rounded-xl border border-pink-500/20 hover:bg-pink-950/50 cursor-pointer transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Clear All Logs
                  </button>
                </div>
              </div>

              {chats.length === 0 ? (
                <div className={`${nmCard} flex flex-col items-center justify-center py-16 text-center space-y-4`}>
                  <MessageSquare className="w-12 h-12 text-slate-700" />
                  <p className="text-sm text-slate-500 font-mono">No conversation transcripts recorded.</p>
                  <p className="text-xs text-slate-600">Chat sessions from JARVISH will appear here automatically.</p>
                  <button
                    onClick={async () => {
                      const pass = sessionStorage.getItem("admin_password") || password;
                      try {
                        const res = await fetch("/api/chat-logs", {
                          headers: { "x-admin-password": pass },
                        });
                        if (res.ok) {
                          const logsData = await res.json();
                          setChats(logsData.reverse());
                        }
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className={nmButtonFlat}
                  >
                    Load Transcripts
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Session List */}
                  <div className={`${nmCard} lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto`}>
                    <div className="text-xs font-mono text-slate-500 uppercase tracking-wider border-b border-slate-900 pb-2">Sessions ({chats.length})</div>
                    {chats.map((session: any) => (
                      <button
                        key={session.id}
                        onClick={() => setActiveSession(session)}
                        className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                          activeSession?.id === session.id
                            ? "border-purple-500/30 bg-purple-950/20"
                            : "border-slate-900 hover:border-slate-700 bg-slate-950/30"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-mono text-purple-400 truncate max-w-[140px]">{session.id}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 font-mono">{session.messages?.length || 0} msgs</span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono">
                          {new Date(session.timestamp).toLocaleString()}
                        </div>
                        {session.messages?.length > 0 && (
                          <p className="text-[10px] text-slate-600 mt-1 truncate">
                            {session.messages[session.messages.length - 1].content.substring(0, 60)}...
                          </p>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Right: Conversation Viewer */}
                  <div className={`${nmCard} lg:col-span-2 flex flex-col max-h-[600px]`}>
                    {activeSession ? (
                      <>
                        <div className="border-b border-slate-900 pb-3 mb-4">
                          <div className="text-xs font-mono text-purple-400">{activeSession.id}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{new Date(activeSession.timestamp).toLocaleString()} &bull; {activeSession.messages?.length || 0} messages</div>
                        </div>
                        <div className="flex-grow overflow-y-auto space-y-3 pr-2">
                          {(activeSession.messages || []).map((msg: any, idx: number) => (
                            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                                msg.role === "user"
                                  ? "bg-purple-950/40 text-purple-200 border border-purple-500/20 rounded-br-md"
                                  : "bg-slate-900 text-slate-300 border border-slate-800 rounded-bl-md"
                              }`}>
                                <div className="text-[9px] font-mono text-slate-600 mb-1">
                                  {msg.role === "user" ? "VISITOR" : "JARVISH"} &bull; {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ""}
                                </div>
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex-grow flex flex-col items-center justify-center text-center space-y-3">
                        <Terminal className="w-10 h-10 text-slate-800" />
                        <p className="text-sm text-slate-600 font-mono">Select a session from the left panel to inspect the conversation transcript.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
