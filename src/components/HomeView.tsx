import { useState, useRef, useEffect } from "react";
import { 
  Plus, 
  Search, 
  ChevronDown, 
  Laptop, 
  Sparkles, 
  Mic, 
  MicOff, 
  ArrowRight, 
  Settings,
  BookOpen,
  PenTool,
  Info,
  Zap,
  Cpu,
  Atom
} from "lucide-react";
import { FocusLens } from "../types";

export const GeminiLogo = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z" fill="url(#gemini-grad-home)" />
    <defs>
      <linearGradient id="gemini-grad-home" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4285F4" />
        <stop offset="40%" stopColor="#9B51E0" />
        <stop offset="70%" stopColor="#E040FB" />
        <stop offset="100%" stopColor="#FF7043" />
      </linearGradient>
    </defs>
  </svg>
);

export const NvidiaLogo = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`${className} text-[#76B900]`} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.5a9.5 9.5 0 0 0 -9.5 9.5c0 5.25 4.25 9.5 9.5 9.5c2.4 0 4.6 -.9 6.25 -2.4a.5.5 0 0 0 -.05 -.75l-1.05 -.8a.5.5 0 0 0 -.6 .05c-1.2 1 -2.85 1.6 -4.55 1.6c-4 0 -7.25 -3.25 -7.25 -7.25s3.25 -7.25 7.25 -7.25c2.2 0 4.15 1 5.45 2.6c.15 .2 .45 .2 .6 0l1.1 -1.1c.2 -.2 .15 -.5 -.05 -.65A9.4 9.4 0 0 0 12 2.5zM12 6.25a5.75 5.75 0 0 0 -5.75 5.75c0 3.17 2.58 5.75 5.75 5.75c1.45 0 2.78 -.54 3.8 -1.44a.4.4 0 0 1 .53 .02l.8 .8c.18 .18 .15 .47 -.06 .62a7.65 7.65 0 0 1 -5.07 1.95a7.65 7.65 0 0 1 -7.65 -7.65a7.65 7.65 0 0 1 7.65 -7.65c1.7 0 3.27 .56 4.54 1.5a.4.4 0 0 1 .05 .57l-.85 .85a.4.4 0 0 1 -.54 .05a5.7 5.7 0 0 0 -3.2 -1.02zM12 10a2 2 0 1 1 -2 2a2 2 0 0 1 2 -2z" />
  </svg>
);

export const OpenAiLogo = ({ className = "w-3.5 h-3.5", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`${className} text-stone-900 dark:text-white`} xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>OpenAI</title>
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
  </svg>
);

export const DeepSeekLogo = ({ className = "w-3.5 h-3.5", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`${className} text-[#0D6BF7]`} xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>DeepSeek</title>
    <path d="M23.748 4.651c-.254-.124-.364.113-.512.233-.051.04-.094.09-.137.137-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.155-.708-.311-.955-.65-.172-.24-.219-.509-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.094.172.187.129.323-.082.28-.18.553-.266.833-.055.179-.137.218-.328.14a5.5 5.5 0 0 1-1.737-1.179c-.857-.828-1.631-1.743-2.597-2.46a12 12 0 0 0-.689-.47c-.985-.957.13-1.743.387-1.836.27-.098.094-.433-.778-.428-.872.003-1.67.295-2.687.685a3 3 0 0 1-.465.136 9.6 9.6 0 0 0-2.883-.101c-1.885.21-3.39 1.1-4.497 2.622C.082 8.776-.231 10.854.152 13.02c.403 2.284 1.568 4.175 3.36 5.653 1.857 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.132-.284 4.994-1.86.47.234.962.328 1.78.398.629.058 1.235-.031 1.705-.129.735-.155.684-.836.418-.961-2.155-1.004-1.682-.595-2.112-.926 1.095-1.295 2.768-3.598 3.284-6.733.05-.346.115-.834.108-1.114-.004-.171.035-.238.23-.257a4.2 4.2 0 0 0 1.545-.475c1.397-.763 1.96-2.016 2.093-3.517.02-.23-.004-.467-.247-.588M11.58 18.168c-2.088-1.642-3.101-2.183-3.52-2.16-.39.024-.32.472-.234.763.09.288.207.487.371.74.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.168-1.361-.801-2.5-1.86-3.301-3.306-.775-1.393-1.225-2.888-1.299-4.482-.02-.385.094-.522.477-.592a4.7 4.7 0 0 1 1.53-.038c2.131.311 3.946 1.264 5.467 2.774.868.86 1.525 1.887 2.202 2.89.72 1.066 1.494 2.082 2.48 2.915.348.291.626.513.892.677-.802.09-2.14.109-3.055-.615zm1.001-6.44a.306.306 0 0 1 .415-.287.3.3 0 0 1 .113.074.3.3 0 0 1 .086.214c0 .17-.136.307-.308.307a.303.303 0 0 1-.306-.307m3.11 1.596c-.2.081-.4.151-.591.16a1.25 1.25 0 0 1-.798-.254c-.274-.23-.47-.358-.551-.758a1.7 1.7 0 0 1 .015-.588c.07-.327-.007-.537-.238-.727-.188-.156-.426-.199-.689-.199a.6.6 0 0 1-.254-.078.253.253 0 0 1-.114-.358 1 1 0 0 1 .192-.21c.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.392.451.462.576.685.915.176.264.336.536.446.848.066.194-.02.353-.25.45" />
  </svg>
);

export const QwenLogo = ({ className = "w-3.5 h-3.5", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>Qwen</title>
    <g stroke="url(#qwen-grad-view)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {/* Central Inverted Triangle */}
      <path d="M12 16.2l-3.2-5.5c-.2-.4.1-.9.6-.9h6.4c.5 0 .8.5.6.9l-3.2 5.5c-.2.4-.8.4-1.2 0z" fill="url(#qwen-grad-view)" fillOpacity="0.2" />
      
      {/* Three Symmetrical Folding Ribbons forming the flat-topped Hexagon */}
      <g transform="rotate(0 12 12)">
        <path d="M11 3.5H7.5C6.1 3.5 4.9 4.2 4.2 5.4L2.3 8.7c-.7 1.2-.7 2.6 0 3.8l1.9 3.3c.7 1.2 1.9 1.9 3.3 1.9h2.3c.5 0 .9-.4.9-.9 0-.5-.4-.9-.9-.9H7.5c-.8 0-1.5-.4-1.9-1.1l-1.9-3.3c-.4-.7-.4-1.5 0-2.2l1.9-3.3c.4-.7 1.1-1.1 1.9-1.1H11c.5 0 .9-.4.9-.9s-.4-.9-.9-.9z" />
        <path d="M10.5 17.7c.3.5.9.7 1.4.4.5-.3.7-.9.4-1.4l-2.5-4.3c-.3-.5-.1-1.1.4-1.4.5-.3 1.1-.1 1.4.4l1.5 2.6" opacity="0.85" />
      </g>
      <g transform="rotate(120 12 12)">
        <path d="M11 3.5H7.5C6.1 3.5 4.9 4.2 4.2 5.4L2.3 8.7c-.7 1.2-.7 2.6 0 3.8l1.9 3.3c.7 1.2 1.9 1.9 3.3 1.9h2.3c.5 0 .9-.4.9-.9 0-.5-.4-.9-.9-.9H7.5c-.8 0-1.5-.4-1.9-1.1l-1.9-3.3c-.4-.7-.4-1.5 0-2.2l1.9-3.3c.4-.7 1.1-1.1 1.9-1.1H11c.5 0 .9-.4.9-.9s-.4-.9-.9-.9z" />
        <path d="M10.5 17.7c.3.5.9.7 1.4.4.5-.3.7-.9.4-1.4l-2.5-4.3c-.3-.5-.1-1.1.4-1.4.5-.3 1.1-.1 1.4.4l1.5 2.6" opacity="0.85" />
      </g>
      <g transform="rotate(240 12 12)">
        <path d="M11 3.5H7.5C6.1 3.5 4.9 4.2 4.2 5.4L2.3 8.7c-.7 1.2-.7 2.6 0 3.8l1.9 3.3c.7 1.2 1.9 1.9 3.3 1.9h2.3c.5 0 .9-.4.9-.9 0-.5-.4-.9-.9-.9H7.5c-.8 0-1.5-.4-1.9-1.1l-1.9-3.3c-.4-.7-.4-1.5 0-2.2l1.9-3.3c.4-.7 1.1-1.1 1.9-1.1H11c.5 0 .9-.4.9-.9s-.4-.9-.9-.9z" />
        <path d="M10.5 17.7c.3.5.9.7 1.4.4.5-.3.7-.9.4-1.4l-2.5-4.3c-.3-.5-.1-1.1.4-1.4.5-.3 1.1-.1 1.4.4l1.5 2.6" opacity="0.85" />
      </g>
    </g>
    <defs>
      <linearGradient id="qwen-grad-view" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4F46E5" />
        <stop offset="60%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#E040FB" />
      </linearGradient>
    </defs>
  </svg>
);

export const KimiLogo = ({ className = "w-3.5 h-3.5", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 20 20" 
    fill="currentColor" 
    className={`${className} text-emerald-500 dark:text-emerald-450`} 
    xmlns="http://www.w3.org/2000/svg" 
    {...props}
  >
    <title>Moonshot Kimi</title>
    <path d="M7,1 h6 v1 h-6 z M5,2 h10 v1 h-10 z M4,3 h12 v1 h-12 z M3,4 h12 v1 h-12 z M2,5 h16 v1 h-16 z M2,6 h16 v1 h-16 z M1,7 h18 v1 h-18 z M1,8 h13 v1 h-13 z M16,8 h3 v1 h-3 z M1,9 h16 v1 h-16 z M1,10 h18 v1 h-18 z M1,11 h18 v1 h-18 z M1,12 h11 v1 h-11 z M15,12 h4 v1 h-4 z M2,13 h14 v1 h-14 z M2,14 h16 v1 h-16 z M3,15 h14 v1 h-14 z M4,16 h8 v1 h-8 z M13,16 h3 v1 h-3 z M5,17 h9 v1 h-9 z M7,18 h6 v1 h-6 z" />
  </svg>
);

export const GoogleGLogo = ({ className = "w-3.5 h-3.5", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    {...props}
  >
    <title>Google Gemma</title>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.29-4.53-3.83-4.53z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

export const getModelIcon = (modelName: string) => {
  switch (modelName) {
    case "Gemini 3.5 Flash":
    case "Gemini 3.1 Pro":
      return <GeminiLogo className="w-3.5 h-3.5" />;
    case "google/gemma-4-31b-it":
      return <GoogleGLogo className="w-3.5 h-3.5" />;
    case "openai/gpt-oss-120b":
    case "openai/gpt-oss-20b":
      return <OpenAiLogo className="w-3.5 h-3.5" />;
    case "deepseek-ai/deepseek-v4-pro":
      return <DeepSeekLogo className="w-3.5 h-3.5" />;
    case "qwen/qwen3-next-80b-a3b-instruct":
      return <QwenLogo className="w-3.5 h-3.5" />;
    case "moonshotai/kimi-k2.6":
      return <KimiLogo className="w-3.5 h-3.5" />;
    default:
      return <Sparkles className="w-3.5 h-3.5 text-slate-500" />;
  }
};

interface HomeViewProps {
  onSearchSubmit: (query: string, focus: FocusLens, selectedModel: string) => void;
  spaceName: string | null;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

export default function HomeView({
  onSearchSubmit,
  spaceName,
  selectedModel,
  setSelectedModel,
}: HomeViewProps) {
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState("Discover");
  const [focusLens, setFocusLens] = useState<FocusLens>("all");
  const [isFocusMenuOpen, setIsFocusMenuOpen] = useState(false);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("Ask anything...");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the search text area
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [searchInput]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit();
    }
  };

  const handleFormSubmit = () => {
    if (searchInput.trim()) {
      onSearchSubmit(searchInput.trim(), focusLens, selectedModel);
    }
  };

  const handleTopicClick = (topic: string) => {
    setSearchInput(topic);
    setTimeout(() => {
      onSearchSubmit(topic, focusLens, selectedModel);
    }, 100);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === "Finance") {
      setSearchInput("What are the leading NASDAQ stock performers and investment trends today?");
    } else if (tab === "Health") {
      setSearchInput("Give me a scientific summary of the key benefits of HIIT cardiovascular training.");
    } else if (tab === "Academic") {
      setFocusLens("academic");
      setSearchInput("Latest peer-reviewed findings in quantum computing superposition stability.");
    } else if (tab === "Patents") {
      setSearchInput("Look up quantum computing hardware patents or architectures registered recently.");
    } else {
      setSearchInput("");
      setFocusLens("all");
    }
  };

  const toggleMockRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setPlaceholderText("Listening closely to your voice input...");
      // Simulate speech-to-text input
      setTimeout(() => {
        setSearchInput("Latest artificial intelligence trends and tech breakthroughs");
        setIsRecording(false);
        setPlaceholderText("Ask anything...");
      }, 3000);
    } else {
      setIsRecording(false);
      setPlaceholderText("Ask anything...");
    }
  };

  const categoryTabs = ["Discover", "Finance", "Health", "Academic", "Patents"];

  return (
    <div className="max-w-[800px] mx-auto px-4 min-h-[calc(100vh-6rem)] flex flex-col justify-center items-center pb-20 animate-fade-in">
      {/* Top Header Categories */}
      <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] md:group-data-[sidebar-collapsed=true]:w-[calc(100%-4rem)] z-20 bg-transparent flex justify-center items-center h-16 px-6 gap-8">
        <nav className="hidden sm:flex gap-6 items-center">
          {categoryTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`text-sm font-medium py-1.5 transition-colors border-b-2 relative ${
                activeTab === tab
                  ? "text-primary font-semibold border-primary"
                  : "text-on-surface-variant hover:text-primary border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="flex-1 sm:hidden"></div>
      </header>

      {/* Central Search Canvas */}
      <div className="w-full flex flex-col items-center mt-6">
        {/* Workspace banner / Active space */}
        {spaceName && (
          <div className="mb-4 bg-slate-100 text-slate-800 text-xs px-3 py-1 rounded-full font-semibold border border-outline-variant flex items-center gap-1.5">
            🔑 Inside Workspace: <span className="text-black font-extrabold">{spaceName}</span>
          </div>
        )}

        {/* Brand Mascot Markup */}
        <div className="mb-8 select-none flex items-center justify-center gap-3">
          <svg viewBox="0 0 100 100" className="w-12 h-12 fill-current text-primary animate-fade-in shrink-0" xmlns="http://www.w3.org/2000/svg">
            <path d="M 50 8 L 81 85 L 50 74 L 19 85 Z" />
          </svg>
          <h1 id="root_brand_title" className="text-5xl md:text-6xl font-sans tracking-tight font-light text-primary text-center">
            pointai
          </h1>
        </div>

        {/* Comprehensive Cockpit Search Engine UI */}
        <div className="w-full bg-white border border-outline-variant rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.03)] focus-within:shadow-[0_12px_40px_rgb(0,0,0,0.06)] hover:border-slate-300 transition-all duration-300">
          <div className="flex flex-col gap-3">
            <textarea
              ref={textareaRef}
              rows={1}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholderText}
              className="w-full bg-transparent border-none outline-none focus:ring-0 text-lg p-0 placeholder:text-gray-400 font-sans resize-none custom-scrollbar max-h-40"
            />

            <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-3 gap-3">
              {/* Left Action Elements */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Mock file upload attachments */}
                <button 
                  onClick={() => handleTopicClick("Analyze this data structure: [Root node pointing to child A left and B right].")}
                  className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                  title="Add mock attachment / test document"
                >
                  <Plus className="w-4 h-4" />
                </button>

                {/* Focus Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsFocusMenuOpen(!isFocusMenuOpen);
                      setIsModelMenuOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-all border border-slate-200/50"
                  >
                    {focusLens === "all" && <Search className="w-3.5 h-3.5" />}
                    {focusLens === "academic" && <BookOpen className="w-3.5 h-3.5" />}
                    {focusLens === "writing" && <PenTool className="w-3.5 h-3.5" />}
                    <span className="capitalize">{focusLens === "all" ? "Search" : focusLens}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {isFocusMenuOpen && (
                    <div className="absolute left-0 mt-1 w-44 bg-white border border-outline-variant rounded-xl shadow-lg p-1.5 z-30 flex flex-col">
                      <p className="text-[10px] uppercase font-bold text-slate-400 px-2.5 py-1">Search Focus</p>
                      <button
                        onClick={() => {
                          setFocusLens("all");
                          setIsFocusMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 ${
                          focusLens === "all" ? "bg-slate-100 text-black" : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Search className="w-3.5 h-3.5" />
                        All Search
                      </button>
                      <button
                        onClick={() => {
                          setFocusLens("academic");
                          setIsFocusMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 ${
                          focusLens === "academic" ? "bg-slate-100 text-black" : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Academic Citations
                      </button>
                      <button
                        onClick={() => {
                          setFocusLens("writing");
                          setIsFocusMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 ${
                          focusLens === "writing" ? "bg-slate-100 text-black" : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <PenTool className="w-3.5 h-3.5" />
                        Writing Assistant
                      </button>
                    </div>
                  )}
                </div>

                {/* Computer mock attachment toggle */}
                <button
                  onClick={() => handleTopicClick("Write an Express.js server that runs with TypeScript")}
                  className="xl:flex hidden items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-all"
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Computer code helper</span>
                </button>
              </div>

              {/* Right Side Options */}
              <div className="flex items-center gap-2">
                {/* Model Selector Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsModelMenuOpen(!isModelMenuOpen);
                      setIsFocusMenuOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200/60 hover:bg-slate-100 bg-white text-slate-700 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      {getModelIcon(selectedModel)}
                      <span>
                        {selectedModel === "openai/gpt-oss-120b" ? "OpenAI gpt-oss-120b" :
                         selectedModel === "openai/gpt-oss-20b" ? "OpenAI gpt-oss-20b" :
                         selectedModel === "deepseek-ai/deepseek-v4-pro" ? "DeepSeek V4 Pro" :
                         selectedModel === "qwen/qwen3-next-80b-a3b-instruct" ? "Qwen 3 Next" :
                         selectedModel === "moonshotai/kimi-k2.6" ? "Moonshot Kimi K2.6" :
                         selectedModel === "google/gemma-4-31b-it" ? "Google Gemma 4" :
                         selectedModel}
                      </span>
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                  </button>

                  {isModelMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-30 flex flex-col animate-fade-in max-h-[380px] overflow-y-auto">
                      <p className="text-[10px] uppercase font-bold text-slate-400 px-2.5 py-1.5 select-none tracking-wider">Active System Model</p>
                      
                      {/* OpenAI gpt-oss-120b */}
                       <button
                         onClick={() => {
                           setSelectedModel("openai/gpt-oss-120b");
                           setIsModelMenuOpen(false);
                         }}
                         className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-start gap-2.5 border transition-all ${
                           selectedModel === "openai/gpt-oss-120b" 
                             ? "bg-slate-50 border-slate-200/60 text-slate-900" 
                             : "text-slate-700 hover:bg-slate-50 border-transparent"
                         }`}
                       >
                         <div className="mt-0.5 shrink-0 bg-white p-1 rounded-md shadow-xs border border-slate-100">
                           <OpenAiLogo className="w-3.5 h-3.5" />
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="flex items-center justify-between gap-1">
                             <span className="font-semibold text-slate-800">OpenAI 120b</span>
                             <span className="text-[7.5px] font-extrabold uppercase bg-slate-100 text-slate-800 px-1 py-0.2 rounded-sm select-none tracking-wider">120B</span>
                           </div>
                           <p className="text-[9.5px] text-slate-500 leading-normal mt-0.5">Open-source mammoth reasoning model by OpenAI</p>
                         </div>
                       </button>

                      {/* DeepSeek V4 Pro */}
                      <button
                        onClick={() => {
                          setSelectedModel("deepseek-ai/deepseek-v4-pro");
                          setIsModelMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-start gap-2.5 border mt-1 transition-all ${
                          selectedModel === "deepseek-ai/deepseek-v4-pro" 
                            ? "bg-blue-50/70 border-blue-100/30 text-blue-900" 
                            : "text-slate-700 hover:bg-slate-50 border-transparent"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0 bg-white p-1 rounded-md shadow-xs border border-slate-100">
                          <DeepSeekLogo className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-slate-800">DeepSeek V4 Pro</span>
                            <span className="text-[7.5px] font-extrabold uppercase bg-blue-100 text-blue-800 px-1 py-0.2 rounded-sm select-none tracking-wider font-mono">V4</span>
                          </div>
                          <p className="text-[9.5px] text-slate-500 leading-normal mt-0.5">Advanced reasoning by DeepSeek AI</p>
                        </div>
                      </button>

                      {/* Qwen 3 Next */}
                      <button
                        onClick={() => {
                          setSelectedModel("qwen/qwen3-next-80b-a3b-instruct");
                          setIsModelMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-start gap-2.5 border mt-1 transition-all ${
                          selectedModel === "qwen/qwen3-next-80b-a3b-instruct" 
                            ? "bg-fuchsia-50/70 border-fuchsia-100/30 text-fuchsia-900" 
                            : "text-slate-700 hover:bg-slate-50 border-transparent"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0 bg-white p-1 rounded-md shadow-xs border border-slate-100">
                          <QwenLogo className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-slate-800">Qwen 3 Next</span>
                            <span className="text-[7.5px] font-extrabold uppercase bg-fuchsia-100 text-fuchsia-800 px-1 py-0.2 rounded-sm select-none tracking-wider font-mono">80B</span>
                          </div>
                          <p className="text-[9.5px] text-slate-500 leading-normal mt-0.5">Next-gen open reasoning model by Alibaba</p>
                        </div>
                      </button>

                      {/* Moonshot Kimi K2.6 */}
                      <button
                        onClick={() => {
                          setSelectedModel("moonshotai/kimi-k2.6");
                          setIsModelMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-start gap-2.5 border mt-1 transition-all ${
                          selectedModel === "moonshotai/kimi-k2.6" 
                            ? "bg-emerald-50/70 border-emerald-100/30 text-emerald-955" 
                            : "text-slate-700 hover:bg-slate-50 border-transparent"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0 bg-white p-1 rounded-md shadow-xs border border-slate-100">
                          <KimiLogo className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-slate-800">Kimi K2.6</span>
                            <span className="text-[7.5px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded-sm select-none tracking-wider font-mono">16K</span>
                          </div>
                          <p className="text-[9.5px] text-slate-500 leading-normal mt-0.5">High-intelligence model by Moonshot AI</p>
                        </div>
                      </button>

                      {/* Google Gemma 4 */}
                      <button
                        onClick={() => {
                          setSelectedModel("google/gemma-4-31b-it");
                          setIsModelMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-start gap-2.5 border mt-1 transition-all ${
                          selectedModel === "google/gemma-4-31b-it" 
                            ? "bg-blue-50/70 border-blue-100/30 text-blue-950" 
                            : "text-slate-700 hover:bg-slate-50 border-transparent"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0 bg-white p-1 rounded-md shadow-xs border border-slate-100">
                          <GoogleGLogo className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-slate-800">Google Gemma 4</span>
                            <span className="text-[7.5px] font-extrabold uppercase bg-blue-100 text-blue-800 px-1 py-0.2 rounded-sm select-none tracking-wider font-mono">31B</span>
                          </div>
                          <p className="text-[9.5px] text-slate-500 leading-normal mt-0.5">Deep reasoning open-source model with thinking</p>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {/* Voice microphone capture */}
                <button
                  onClick={toggleMockRecording}
                  className={`p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer ${
                    isRecording ? "text-red-500 bg-red-50 hover:bg-red-100 animate-pulse" : "text-slate-500"
                  }`}
                  title={isRecording ? "Click to stop voice simulation" : "Use custom voice recognition simulation"}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Search submit trigger button */}
                <button
                  onClick={handleFormSubmit}
                  disabled={!searchInput.trim()}
                  className={`w-9 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    searchInput.trim()
                      ? "bg-black text-white hover:opacity-85 scale-100 cursor-pointer"
                      : "bg-slate-100 text-slate-300 scale-95 cursor-not-allowed"
                  }`}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>




    </div>
  );
}
