import { 
  Sparkles, 
  Laptop, 
  FolderClosed, 
  FileCode, 
  Settings, 
  History, 
  LogIn, 
  ChevronRight, 
  Plus, 
  Compass,
  MessageSquare,
  Trash2,
  Lock
} from "lucide-react";
import { Thread, Space } from "../types";

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  spaces: Space[];
  selectedSpaceId: string | null;
  onSelectSpace: (spaceId: string | null) => void;
  threads: Thread[];
  currentThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onDeleteThread: (threadId: string, event: React.MouseEvent) => void;
  onNewThread: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  userProfile: { name: string };
  onOpenSignIn: () => void;
}

export default function Sidebar({
  currentView,
  onNavigate,
  spaces,
  selectedSpaceId,
  onSelectSpace,
  threads,
  currentThreadId,
  onSelectThread,
  onDeleteThread,
  onNewThread,
  isSidebarOpen,
  onToggleSidebar,
  userProfile,
  onOpenSignIn,
}: SidebarProps) {
  return (
    <aside
      id="sidebar"
      className={`fixed left-0 top-0 h-full bg-surface-container-low border-r border-outline-variant flex flex-col p-4 gap-4 z-40 transition-all duration-300 ${
        isSidebarOpen ? "w-60 translate-x-0" : "w-16 translate-x-0 md:w-16"
      } md:translate-x-0`}
    >
      {/* Header / Brand */}
      <div className="flex items-center justify-between mb-1">
        <button
          onClick={() => {
            onNewThread();
            onNavigate("home");
          }}
          className="flex items-center gap-2 text-left hover:opacity-80 transition-opacity"
        >
          {isSidebarOpen ? (
            <span className="font-sans font-bold text-xl text-primary tracking-tighter flex items-center gap-2">
              <svg viewBox="0 0 100 100" className="w-5.5 h-5.5 fill-current text-primary shrink-0 transition-transform duration-300 hover:rotate-12" xmlns="http://www.w3.org/2000/svg">
                <path d="M 50 8 L 81 85 L 50 74 L 19 85 Z" />
              </svg>
              pointai
            </span>
          ) : (
            <span className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center hover:opacity-95 transition-opacity">
              <svg viewBox="0 0 100 100" className="w-5 h-5 fill-current text-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M 50 8 L 81 85 L 50 74 L 19 85 Z" />
              </svg>
            </span>
          )}
        </button>
        
        {isSidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="p-1 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors"
            title="Collapse Sidebar"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
        )}
      </div>

      {/* Primary Action: New Chat */}
      <button
        onClick={onNewThread}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
      >
        <Plus className="w-4 h-4 shrink-0" />
        {isSidebarOpen && <span className="font-sans">New Chat</span>}
      </button>

      {/* Navigation Options */}
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto custom-scrollbar pt-2">
        {/* Discover / Search */}
        <button
          onClick={() => onNavigate("home")}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
            currentView === "home" || currentView === "thread"
              ? "bg-surface-container-highest text-on-surface font-semibold"
              : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          }`}
        >
          <Compass className="w-4 h-4 text-slate-800" />
          {isSidebarOpen && <span>Discover</span>}
        </button>

        {/* Computer */}
        <button
          onClick={() => onNavigate("computer")}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
            currentView === "computer"
              ? "bg-surface-container-highest text-on-surface font-semibold"
              : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          }`}
        >
          <Laptop className="w-4 h-4" />
          {isSidebarOpen && (
            <div className="flex items-center justify-between w-full">
              <span>Computer</span>
              <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">New</span>
            </div>
          )}
        </button>

        {/* Spaces */}
        <button
          onClick={() => onNavigate("spaces")}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
            currentView === "spaces"
              ? "bg-surface-container-highest text-on-surface font-semibold"
              : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          }`}
        >
          <FolderClosed className="w-4 h-4" />
          {isSidebarOpen && <span>Spaces</span>}
        </button>

        {/* Artifacts */}
        <button
          onClick={() => onNavigate("artifacts")}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
            currentView === "artifacts"
              ? "bg-surface-container-highest text-on-surface font-semibold"
              : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          }`}
        >
          <FileCode className="w-4 h-4" />
          {isSidebarOpen && <span>Artifacts</span>}
        </button>

        {/* Customize */}
        <button
          onClick={() => onNavigate("customize")}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
            currentView === "customize"
              ? "bg-surface-container-highest text-on-surface font-semibold"
              : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          }`}
        >
          <Settings className="w-4 h-4" />
          {isSidebarOpen && <span>Customize</span>}
        </button>

        {isSidebarOpen && (
          <>
            {/* Recents / History list */}
            <div className="px-3 mt-4 mb-2 flex items-center justify-between group">
              <span className="text-sm font-medium text-on-surface-variant flex items-center gap-3">
                <History className="w-4 h-4 shrink-0" /> History
              </span>
            </div>

            <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
              {threads.length === 0 ? (
                <span className="px-3 py-2 text-[11px] text-on-surface-variant italic opacity-60">No recent sessions</span>
              ) : (
                threads.map((thr) => (
                  <div
                    key={thr.id}
                    className={`group/thread px-3 py-2 rounded-md text-xs relative flex items-center justify-between cursor-pointer transition-all ${
                      currentThreadId === thr.id
                        ? "bg-surface-container text-primary font-medium"
                        : "text-on-surface-variant hover:bg-surface-container-low"
                    }`}
                    onClick={() => onSelectThread(thr.id)}
                  >
                    <div className="flex items-center gap-1.5 truncate max-w-[80%]">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 text-on-surface-variant/70" />
                      <span className="truncate">{thr.title}</span>
                    </div>
                    
                    <button
                      onClick={(e) => onDeleteThread(thr.id, e)}
                      className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant opacity-0 group-hover/thread:opacity-100 transition-opacity"
                      title="Delete thread"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </nav>

      {/* Footer Nav Bar (Sign In / Collapse Selector) */}
      <div className="mt-auto flex flex-col gap-1 pt-3">
        {!isSidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="mx-auto p-2.5 hover:bg-surface-container text-on-surface-variant rounded-lg transition-colors"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
        
        <button
          onClick={onOpenSignIn}
          className={`flex items-center justify-between w-full p-2 rounded-lg text-left transition-all ${
            isSidebarOpen ? "hover:bg-surface-container" : "hover:bg-transparent"
          }`}
        >
          <div className="flex items-center gap-3 truncate">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 uppercase">
              {userProfile.name ? userProfile.name.charAt(0) : "U"}
            </div>
            {isSidebarOpen && (
              <div className="truncate">
                <p className="text-xs font-semibold text-on-surface truncate">
                  {userProfile.name || "Sign In"}
                </p>
                <p className="text-[10px] text-on-surface-variant truncate opacity-80">
                  Free Member
                </p>
              </div>
            )}
          </div>
          {isSidebarOpen && <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant opacity-50" />}
        </button>
      </div>
    </aside>
  );
}
