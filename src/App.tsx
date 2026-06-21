import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import HomeView from "./components/HomeView";
import ThreadView from "./components/ThreadView";
import SpacesPanel from "./components/SpacesPanel";
import ComputerPanel from "./components/ComputerPanel";
import ArtifactsPanel from "./components/ArtifactsPanel";
import CustomizePanel from "./components/CustomizePanel";
import { Thread, Space, Message, FocusLens, UserProfile } from "./types";
import { Sparkles, Check, Lock, Loader2, RefreshCw } from "lucide-react";

export default function App() {
  // Navigation states
  const [currentView, setCurrentView] = useState<string>("home");
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Data states (Persisted in localStorage)
  const [threads, setThreads] = useState<Thread[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Guest Explorer",
    aiProfile: "Software designer at a local startup who prefers technical diagrams and precise scientific citations.",
    searchPreference: "detailed",
  });

  // Action states
  const [selectedModel, setSelectedModel] = useState<string>("moonshotai/kimi-k2.6");
  const [isSearching, setIsSearching] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Synchronize initial lists from localStorage
  useEffect(() => {
    const cachedThreads = localStorage.getItem("pplx_threads");
    if (cachedThreads) {
      try {
        setThreads(JSON.parse(cachedThreads));
      } catch (e) {
        console.error("Failed to restore threads", e);
      }
    }

    const cachedSpaces = localStorage.getItem("pplx_spaces");
    if (cachedSpaces) {
      try {
        setSpaces(JSON.parse(cachedSpaces));
      } catch (e) {
        console.error("Failed to restore spaces", e);
      }
    } else {
      // Default placeholder spaces
      const defaultSpaces: Space[] = [
        {
          id: "sp-1",
          name: "Academic Engineering",
          description: "Prefers formal scientific whitepapers and LaTeX math formulations.",
          icon: "📚",
        },
        {
          id: "sp-2",
          name: "Investment Analysis",
          description: "Highlights stock performers, revenue parameters, and market forecasts.",
          icon: "💰",
        },
      ];
      setSpaces(defaultSpaces);
      localStorage.setItem("pplx_spaces", JSON.stringify(defaultSpaces));
    }

    const cachedProfile = localStorage.getItem("pplx_profile");
    if (cachedProfile) {
      try {
        setUserProfile(JSON.parse(cachedProfile));
      } catch (e) {
        console.error("Failed to restore profile", e);
      }
    }
  }, []);

  // Save changes to localStorage helper
  const saveThreadsToCache = (updatedThreads: Thread[]) => {
    setThreads(updatedThreads);
    localStorage.setItem("pplx_threads", JSON.stringify(updatedThreads));
  };

  const handleUpdateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem("pplx_profile", JSON.stringify(profile));
  };

  const handleCreateSpace = (name: string, description: string, icon: string) => {
    const newSpace: Space = {
      id: `sp-${Date.now()}`,
      name,
      description,
      icon,
    };
    const updated = [...spaces, newSpace];
    setSpaces(updated);
    localStorage.setItem("pplx_spaces", JSON.stringify(updated));
  };

  const handleClearAllThreads = () => {
    setThreads([]);
    setCurrentThreadId(null);
    setCurrentView("home");
    localStorage.removeItem("pplx_threads");
  };

  const handleSelectThread = (id: string) => {
    setCurrentThreadId(id);
    setCurrentView("thread");
  };

  const handleDeleteThread = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const updated = threads.filter((t) => t.id !== id);
    saveThreadsToCache(updated);
    if (currentThreadId === id) {
      setCurrentThreadId(null);
      setCurrentView("home");
    }
  };

  const handleNewThread = () => {
    setCurrentThreadId(null);
    setCurrentView("home");
  };

  // Submit search query directly to custom back-end API
  const handleSearchSubmit = async (query: string, focus: FocusLens, modelName: string) => {
    setIsSearching(true);
    
    // Provision new active Thread object
    const newThreadId = `thr-${Date.now()}`;
    const userQueryMessage: Message = {
      id: `msg-${Date.now()}-u`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newThread: Thread = {
      id: newThreadId,
      title: query.substring(0, 42) + (query.length > 42 ? "..." : ""),
      messages: [userQueryMessage],
      focus,
      spaceId: selectedSpaceId,
      timestamp: new Date().toLocaleDateString(),
    };

    const updatedThreads = [newThread, ...threads];
    saveThreadsToCache(updatedThreads);
    setCurrentThreadId(newThreadId);
    setCurrentView("thread");

    try {
      // Setup payload including spaces description context if present inside a locked space
      let promptQuery = query;
      if (selectedSpaceId) {
        const spaceContext = spaces.find((s) => s.id === selectedSpaceId);
        if (spaceContext) {
          promptQuery = `[Context Constraints for this space: ${spaceContext.description}] ${query}`;
        }
      }

      // Append custom user profile context if saved
      if (userProfile.aiProfile) {
        promptQuery += `\n\n(Respond keeping in mind user context: "${userProfile.aiProfile}". Make sure formatting is set to "${userProfile.searchPreference}" preference).`;
      }

      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: promptQuery,
          focus,
          selectedModel: modelName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "GenAI search system exception");
      }

      const geminiMessage: Message = {
        id: `msg-${Date.now()}-g`,
        role: "model",
        content: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sources: data.sources,
        suggestedFollowUps: data.suggestedFollowUps,
        selectedModel: modelName,
      };

      const finalThreads = updatedThreads.map((t) => {
        if (t.id === newThreadId) {
          return { ...t, messages: [...t.messages, geminiMessage] };
        }
        return t;
      });

      saveThreadsToCache(finalThreads);

    } catch (err: any) {
      console.error(err);
      const errorMessage: Message = {
        id: `msg-${Date.now()}-g`,
        role: "model",
        content: `### ⚠️ API Operational Error\n${err?.message || "GenAI proxy route failed. Verify connectivity and API Keys."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isError: true,
      };

      const finalThreads = updatedThreads.map((t) => {
        if (t.id === newThreadId) {
          return { ...t, messages: [...t.messages, errorMessage] };
        }
        return t;
      });
      saveThreadsToCache(finalThreads);
    } finally {
      setIsSearching(false);
    }
  };

  // Submit follow-up conversational question query
  const handleSendFollowUp = async (query: string) => {
    if (!currentThreadId) return;
    setIsSearching(true);

    const activeThread = threads.find((t) => t.id === currentThreadId);
    if (!activeThread) return;

    const userFollowUp: Message = {
      id: `msg-${Date.now()}-u`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const threadWithUserMsg = {
      ...activeThread,
      messages: [...activeThread.messages, userFollowUp],
    };

    const updatedThreads = threads.map((t) => (t.id === currentThreadId ? threadWithUserMsg : t));
    saveThreadsToCache(updatedThreads);

    try {
      // Map conversation history in a simplified structure for Express router
      // Only keep the content of text messages for search grounding context
      const historyContext = activeThread.messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      let promptQuery = query;
      if (userProfile.aiProfile) {
        promptQuery += `\n\n(Remember user constraints: "${userProfile.aiProfile}". Custom preference is "${userProfile.searchPreference}")`;
      }

      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: promptQuery,
          history: historyContext,
          focus: activeThread.focus,
          selectedModel,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "GenAI follow up exception");
      }

      const geminiMessage: Message = {
        id: `msg-${Date.now()}-g`,
        role: "model",
        content: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sources: data.sources,
        suggestedFollowUps: data.suggestedFollowUps,
        selectedModel,
      };

      const finalThreads = updatedThreads.map((t) => {
        if (t.id === currentThreadId) {
          return { ...t, messages: [...t.messages, geminiMessage] };
        }
        return t;
      });

      saveThreadsToCache(finalThreads);

    } catch (err: any) {
      console.error(err);
      const errorMessage: Message = {
        id: `msg-${Date.now()}-g`,
        role: "model",
        content: `### ⚠️ Follow-up Failed\n${err?.message || "There was an error communicating with the search server."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isError: true,
      };

      const finalThreads = updatedThreads.map((t) => {
        if (t.id === currentThreadId) {
          return { ...t, messages: [...t.messages, errorMessage] };
        }
        return t;
      });
      saveThreadsToCache(finalThreads);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setIsSigningIn(true);
      setTimeout(() => {
        handleUpdateProfile({
          ...userProfile,
          name: emailInput.split("@")[0],
        });
        setIsSigningIn(false);
        setIsSignInOpen(false);
      }, 1500);
    }
  };

  const activeThread = threads.find((t) => t.id === currentThreadId);
  const activeSpace = spaces.find((s) => s.id === selectedSpaceId);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background font-sans text-on-surface antialiased transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        spaces={spaces}
        selectedSpaceId={selectedSpaceId}
        onSelectSpace={setSelectedSpaceId}
        threads={threads}
        currentThreadId={currentThreadId}
        onSelectThread={handleSelectThread}
        onDeleteThread={handleDeleteThread}
        onNewThread={handleNewThread}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        userProfile={userProfile}
        onOpenSignIn={() => setIsSignInOpen(true)}
      />

      {/* Main Container Frame */}
      <main
        className={`flex-1 h-full relative overflow-y-auto bg-background transition-all duration-300 ${
          isSidebarOpen ? "pl-60" : "pl-16"
        } custom-scrollbar`}
      >
        {/* Render exact dashboard views depends on navigation */}
        {currentView === "home" && (
          <HomeView
            onSearchSubmit={handleSearchSubmit}
            spaceName={activeSpace ? activeSpace.name : null}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />
        )}

        {currentView === "thread" && activeThread && (
          <ThreadView
            thread={activeThread}
            onNavigateBack={() => setCurrentView("home")}
            onSendFollowUp={handleSendFollowUp}
            isSearching={isSearching}
            selectedModel={selectedModel}
            onSetSelectedModel={setSelectedModel}
          />
        )}

        {currentView === "computer" && <ComputerPanel />}

        {currentView === "spaces" && (
          <SpacesPanel
            spaces={spaces}
            selectedSpaceId={selectedSpaceId}
            onSelectSpace={setSelectedSpaceId}
            onCreateSpace={handleCreateSpace}
          />
        )}

        {currentView === "artifacts" && <ArtifactsPanel />}

        {currentView === "customize" && (
          <CustomizePanel
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onClearAllThreads={handleClearAllThreads}
          />
        )}
      </main>

      {/* High-Fidelity Profile login Modal simulation */}
      {isSignInOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in animate-duration-200">
          <div className="bg-white border border-outline-variant max-w-sm w-full rounded-2xl p-6 shadow-xl relative text-left">
            <h2 className="text-xl font-sans font-light tracking-tight text-primary mb-1">
              Join PointAI Spaces
            </h2>
            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
              Create an account to securely persist custom models, collaborate on spaces, and compile reports.
            </p>

            <form onSubmit={handleSignInSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="vevonsongs@gmail.com"
                  className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-slate-300 outline-none"
                />
              </div>

              <div className="flex items-center gap-2.5 mt-2 justify-end border-t border-slate-50 pt-4">
                <button
                  type="button"
                  onClick={() => setIsSignInOpen(false)}
                  className="text-xs text-slate-500 font-semibold px-3 py-1.5 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSigningIn}
                  className="bg-slate-900 border border-slate-800 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  {isSigningIn ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Register Access</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
