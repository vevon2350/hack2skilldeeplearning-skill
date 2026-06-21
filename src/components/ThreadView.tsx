import { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";
import { 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  CornerDownRight, 
  ExternalLink, 
  Grid, 
  Send, 
  ArrowUpRight,
  RefreshCw,
  Clock,
  CheckCircle,
  Copy,
  Check,
  Zap,
  Cpu,
  Atom
} from "lucide-react";
import { Thread, FocusLens, Message } from "../types";

interface ThreadViewProps {
  thread: Thread;
  onNavigateBack: () => void;
  onSendFollowUp: (query: string) => void;
  isSearching: boolean;
  selectedModel: string;
  onSetSelectedModel?: (model: string) => void;
}

const GeminiLogo = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z" fill="url(#gemini-grad-thread)" />
    <defs>
      <linearGradient id="gemini-grad-thread" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4285F4" />
        <stop offset="40%" stopColor="#9B51E0" />
        <stop offset="70%" stopColor="#E040FB" />
        <stop offset="100%" stopColor="#FF7043" />
      </linearGradient>
    </defs>
  </svg>
);

const NvidiaLogo = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`${className} text-[#76B900]`} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.5a9.5 9.5 0 0 0 -9.5 9.5c0 5.25 4.25 9.5 9.5 9.5c2.4 0 4.6 -.9 6.25 -2.4a.5.5 0 0 0 -.05 -.75l-1.05 -.8a.5.5 0 0 0 -.6 .05c-1.2 1 -2.85 1.6 -4.55 1.6c-4 0 -7.25 -3.25 -7.25 -7.25s3.25 -7.25 7.25 -7.25c2.2 0 4.15 1 5.45 2.6c.15 .2 .45 .2 .6 0l1.1 -1.1c.2 -.2 .15 -.5 -.05 -.65A9.4 9.4 0 0 0 12 2.5zM12 6.25a5.75 5.75 0 0 0 -5.75 5.75c0 3.17 2.58 5.75 5.75 5.75c1.45 0 2.78 -.54 3.8 -1.44a.4.4 0 0 1 .53 .02l.8 .8c.18 .18 .15 .47 -.06 .62a7.65 7.65 0 0 1 -5.07 1.95a7.65 7.65 0 0 1 -7.65 -7.65a7.65 7.65 0 0 1 7.65 -7.65c1.7 0 3.27 .56 4.54 1.5a.4.4 0 0 1 .05 .57l-.85 .85a.4.4 0 0 1 -.54 .05a5.7 5.7 0 0 0 -3.2 -1.02zM12 10a2 2 0 1 1 -2 2a2 2 0 0 1 2 -2z" />
  </svg>
);

const OpenAiLogo = ({ className = "w-3.5 h-3.5", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`${className} text-stone-900 dark:text-white`} xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>OpenAI</title>
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
  </svg>
);

const DeepSeekLogo = ({ className = "w-3.5 h-3.5", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`${className} text-[#0D6BF7]`} xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>DeepSeek</title>
    <path d="M23.748 4.651c-.254-.124-.364.113-.512.233-.051.04-.094.09-.137.137-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.155-.708-.311-.955-.65-.172-.24-.219-.509-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.094.172.187.129.323-.082.28-.18.553-.266.833-.055.179-.137.218-.328.14a5.5 5.5 0 0 1-1.737-1.179c-.857-.828-1.631-1.743-2.597-2.46a12 12 0 0 0-.689-.47c-.985-.957.13-1.743.387-1.836.27-.098.094-.433-.778-.428-.872.003-1.67.295-2.687.685a3 3 0 0 1-.465.136 9.6 9.6 0 0 0-2.883-.101c-1.885.21-3.39 1.1-4.497 2.622C.082 8.776-.231 10.854.152 13.02c.403 2.284 1.568 4.175 3.36 5.653 1.857 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.132-.284 4.994-1.86.47.234.962.328 1.78.398.629.058 1.235-.031 1.705-.129.735-.155.684-.836.418-.961-2.155-1.004-1.682-.595-2.112-.926 1.095-1.295 2.768-3.598 3.284-6.733.05-.346.115-.834.108-1.114-.004-.171.035-.238.23-.257a4.2 4.2 0 0 0 1.545-.475c1.397-.763 1.96-2.016 2.093-3.517.02-.23-.004-.467-.247-.588M11.58 18.168c-2.088-1.642-3.101-2.183-3.52-2.16-.39.024-.32.472-.234.763.09.288.207.487.371.74.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.168-1.361-.801-2.5-1.86-3.301-3.306-.775-1.393-1.225-2.888-1.299-4.482-.02-.385.094-.522.477-.592a4.7 4.7 0 0 1 1.53-.038c2.131.311 3.946 1.264 5.467 2.774.868.86 1.525 1.887 2.202 2.89.72 1.066 1.494 2.082 2.48 2.915.348.291.626.513.892.677-.802.09-2.14.109-3.055-.615zm1.001-6.44a.306.306 0 0 1 .415-.287.3.3 0 0 1 .113.074.3.3 0 0 1 .086.214c0 .17-.136.307-.308.307a.303.303 0 0 1-.306-.307m3.11 1.596c-.2.081-.4.151-.591.16a1.25 1.25 0 0 1-.798-.254c-.274-.23-.47-.358-.551-.758a1.7 1.7 0 0 1 .015-.588c.07-.327-.007-.537-.238-.727-.188-.156-.426-.199-.689-.199a.6.6 0 0 1-.254-.078.253.253 0 0 1-.114-.358 1 1 0 0 1 .192-.21c.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.392.451.462.576.685.915.176.264.336.536.446.848.066.194-.02.353-.25.45" />
  </svg>
);

const QwenLogo = ({ className = "w-3.5 h-3.5", ...props }: React.SVGProps<SVGSVGElement>) => (
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

const KimiLogo = ({ className = "w-3.5 h-3.5", ...props }: React.SVGProps<SVGSVGElement>) => (
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

const GoogleGLogo = ({ className = "w-3.5 h-3.5", ...props }: React.SVGProps<SVGSVGElement>) => (
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

const renderModelBadge = (modelName?: string) => {
  const model = modelName || "moonshotai/kimi-k2.6";
  switch (model) {
    case "moonshotai/kimi-k2.6":
      return (
        <div className="flex items-center gap-1.5 bg-emerald-50/60 dark:bg-emerald-950/10 border border-emerald-200/50 px-2 px-1.5 py-1 rounded-lg shadow-xs">
          <KimiLogo className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">Moonshot Kimi K2.6</span>
          <span className="text-[7.5px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 px-1 py-0.2 rounded-sm select-none tracking-wider font-mono">16K</span>
        </div>
      );
    case "openai/gpt-oss-120b":
      return (
        <div className="flex items-center gap-1.5 bg-slate-50/60 dark:bg-slate-900/10 border border-slate-200/50 px-2 px-1.5 py-1 rounded-lg shadow-xs">
          <OpenAiLogo className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">OpenAI gpt-oss-120b</span>
          <span className="text-[7.5px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-1 py-0.2 rounded-sm select-none tracking-wider font-mono">120B</span>
        </div>
      );
    case "openai/gpt-oss-20b":
      return (
        <div className="flex items-center gap-1.5 bg-slate-50/60 dark:bg-slate-900/10 border border-slate-200/50 px-2 px-1.5 py-1 rounded-lg shadow-xs">
          <OpenAiLogo className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">OpenAI gpt-oss-20b</span>
          <span className="text-[7.5px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-1 py-0.2 rounded-sm select-none tracking-wider font-mono">20B</span>
        </div>
      );
    case "deepseek-ai/deepseek-v4-pro":
      return (
        <div className="flex items-center gap-1.5 bg-blue-50/40 dark:bg-blue-950/10 border border-blue-100/30 px-2 px-1.5 py-1 rounded-lg shadow-xs">
          <DeepSeekLogo className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold text-blue-900">DeepSeek V4 Pro</span>
          <span className="text-[7.5px] font-extrabold uppercase bg-blue-100 text-blue-800 px-1 py-0.2 rounded-sm select-none tracking-wider font-mono flex items-center justify-center">V4</span>
        </div>
      );
    case "qwen/qwen3-next-80b-a3b-instruct":
      return (
        <div className="flex items-center gap-1.5 bg-fuchsia-50/40 dark:bg-fuchsia-950/10 border border-fuchsia-100/30 px-2 px-1.5 py-1 rounded-lg shadow-xs">
          <QwenLogo className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold text-fuchsia-900">Qwen 3 Next</span>
          <span className="text-[7.5px] font-extrabold uppercase bg-fuchsia-100 text-fuchsia-800 px-1 py-0.2 rounded-sm select-none tracking-wider font-mono flex items-center justify-center">80B</span>
        </div>
      );
    case "google/gemma-4-31b-it":
      return (
        <div className="flex items-center gap-1.5 bg-blue-50/60 dark:bg-blue-950/10 border border-blue-200/50 px-2 px-1.5 py-1 rounded-lg shadow-xs">
          <GoogleGLogo className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold text-blue-900 dark:text-blue-200">Google Gemma 4</span>
          <span className="text-[7.5px] font-extrabold uppercase bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-1 py-0.2 rounded-sm select-none tracking-wider font-mono flex items-center justify-center">31B</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-1.5 bg-slate-50/50 border border-slate-100 px-2 px-1.5 py-1 rounded-lg shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-semibold text-slate-800">{model}</span>
        </div>
      );
  }
};

const CodeBlock = ({ language, code }: { language: string; code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <pre className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 my-4 text-xs font-mono shadow-md">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800/80">
        <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider font-sans">{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="p-1 px-1.5 hover:bg-slate-800/80 text-slate-400 hover:text-white rounded transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-sans">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] font-sans">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto custom-scrollbar select-text leading-relaxed">
        <code className="text-slate-200">{code}</code>
      </div>
    </pre>
  );
};

const parseMessageContent = (content: string) => {
  // Matches details tag and extracts the content inside and the summary
  const detailsRegex = /<details[\s\S]*?<summary[\s\S]*?>([\s\S]*?)<\/summary>([\s\S]*?)<\/div>\s*<\/details>/i;
  const match = content.match(detailsRegex);

  if (match) {
    const summaryText = match[1].replace(/<[^>]*>/g, "").trim(); 
    // Strip the wrapping styling tags to keep the inner text clean
    const thinkingText = match[2].replace(/<div[^>]*>/i, "").replace(/<\/div>/i, "").trim();
    const cleanContent = content.replace(detailsRegex, "").trim();
    return {
      hasThinking: true,
      summaryText: summaryText || "Deep Thinking Process",
      thinkingText,
      cleanContent
    };
  }

  // Also check if there's any raw markdown blockquote/thinking formats
  if (content.startsWith("> 🧠 **Thinking")) {
    const lines = content.split('\n');
    const thinkingLines: string[] = [];
    const contentLines: string[] = [];
    let isThinking = true;

    for (const line of lines) {
      if (isThinking) {
        if (line.startsWith(">") || line.trim() === "") {
          thinkingLines.push(line.replace(/^>\s*🧠?/i, "").trim());
        } else {
          isThinking = false;
          contentLines.push(line);
        }
      } else {
        contentLines.push(line);
      }
    }

    return {
      hasThinking: true,
      summaryText: "Deep Thinking Process",
      thinkingText: thinkingLines.join('\n').trim(),
      cleanContent: contentLines.join('\n').trim()
    };
  }

  return {
    hasThinking: false,
    summaryText: "",
    thinkingText: "",
    cleanContent: content
  };
};

export default function ThreadView({
  thread,
  onNavigateBack,
  onSendFollowUp,
  isSearching,
  selectedModel,
  onSetSelectedModel,
}: ThreadViewProps) {
  const [followUpInput, setFollowUpInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread.messages, isSearching]);

  const handleSend = () => {
    if (followUpInput.trim() && !isSearching) {
      onSendFollowUp(followUpInput.trim());
      setFollowUpInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const copyAnswerToClipboard = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to extract clean domain names for source favicon icons
  const getDomainName = (urlString: string) => {
    try {
      const url = new URL(urlString);
      return url.hostname.replace("www.", "");
    } catch {
      return "Web Link";
    }
  };

  return (
    <div className="max-w-[760px] mx-auto px-4 pt-4 pb-32 animate-fade-in relative">
      {/* Thread Title / Back Navigation */}
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-3">
        <button
          onClick={onNavigateBack}
          className="p-1.5 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
          title="Return to search"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-on-surface-variant font-medium">Discover Thread</span>
        <span className="text-xs text-slate-300">/</span>
        <span className="text-xs text-slate-600 font-semibold truncate max-w-[240px]">
          {thread.title}
        </span>
      </div>

      {/* Message History Nodes */}
      <div className="flex flex-col gap-8">
        {thread.messages.map((message, idx) => {
          const isUser = message.role === "user";
          const parsed = parseMessageContent(message.content);

          if (isUser) {
            return (
              <div key={message.id} className="text-left animate-fade-in">
                <h2 className="text-2xl font-sans font-light text-primary tracking-tight mt-2">
                  {message.content}
                </h2>
              </div>
            );
          }

          if (message.isError) {
            return (
              <div key={message.id} className="text-left border-b border-rose-100/50 pb-8 animate-fade-in">
                <div className="bg-rose-50/50 border border-rose-200/60 rounded-xl p-5 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 px-2 bg-rose-100 text-rose-700 rounded-lg flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-rose-650 animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-rose-900 mb-1">
                        PointAI Search Notice
                      </h3>
                      <div className="markdown-body text-slate-700 text-xs sm:text-sm leading-relaxed max-w-none pr-1 mt-2.5">
                        <Markdown>{message.content}</Markdown>
                      </div>

                      {/* Intelligent Action buttons based on error source or current configuration */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {selectedModel !== "moonshotai/kimi-k2.6" && (
                          <button
                            onClick={() => {
                              onSetSelectedModel?.("moonshotai/kimi-k2.6");
                            }}
                            className="bg-slate-900 hover:bg-black text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            Switch to Moonshot Kimi K2.6 (Default)
                          </button>
                        )}
                        <button
                          onClick={onNavigateBack}
                          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all active:scale-95"
                        >
                          Return to Search Input
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={message.id} className="text-left border-b border-slate-100 pb-8 animate-fade-in">
              {/* Grounding Sources (citations list) */}
              {message.sources && message.sources.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-slate-700" />
                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Sources
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-on-surface-variant">
                      {message.sources.length} sources found
                    </span>
                  </div>

                  {/* Sources Carousel Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {message.sources.map((source, sIdx) => (
                      <a
                        key={sIdx}
                        href={source.url}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="bg-slate-50 border border-slate-200/50 hover:bg-slate-100/70 p-2.5 rounded-lg flex flex-col justify-between h-[64px] transition-all duration-200"
                      >
                        <span className="text-[11px] font-semibold text-primary line-clamp-1 leading-tight">
                          {source.title}
                        </span>
                        
                        <div className="flex items-center justify-between mt-1 text-[9px] text-[#444748]">
                          <span className="truncate max-w-[80%] flex items-center gap-1 font-mono">
                            <span className="w-3 h-3 rounded bg-white text-primary flex items-center justify-center text-[8px] font-bold shadow-xs">
                              {sIdx + 1}
                            </span>
                            {getDomainName(source.url)}
                          </span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-55 shrink-0" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Gemini Main Response Markup */}
              <div>
                <div className="flex items-center justify-between mb-2.5 pb-1 border-b border-slate-50/50">
                  <div className="flex items-center gap-1.5">
                    {renderModelBadge(message.selectedModel || selectedModel)}
                  </div>
                  
                  {/* Quick Action toolbar */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => copyAnswerToClipboard(parsed.cleanContent, message.id)}
                      className="p-1 text-[#444748] hover:bg-slate-50 hover:text-black rounded transition-all flex items-center gap-1 text-[10px] cursor-pointer"
                      title="Copy response markdown"
                    >
                      {copiedId === message.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-650" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {parsed.hasThinking && (
                  <details className="group border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl p-3.5 mb-4 select-none transition-all hover:bg-slate-100/40 dark:hover:bg-slate-900/50">
                    <summary className="flex items-center justify-between text-slate-500 font-semibold text-xs list-none cursor-pointer">
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                        <span>{parsed.summaryText}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 group-open:rotate-180 transition-transform duration-200">▼</span>
                    </summary>
                    <div className="mt-3.5 pt-3.5 border-t border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[11px] leading-relaxed max-h-[220px] overflow-y-auto custom-scrollbar whitespace-pre-wrap select-text">
                      {parsed.thinkingText}
                    </div>
                  </details>
                )}

                {/* Markdown Container */}
                <div className="markdown-body text-[14.5px] leading-relaxed max-w-none pr-1">
                  <Markdown
                    components={{
                      code({ className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || "");
                        const isInline = !match && !String(children).includes("\n");
                        const codeString = String(children).replace(/\n$/, "");
                        
                        if (isInline) {
                          return (
                            <code 
                              className="bg-slate-100/80 border border-slate-205 dark:bg-slate-850 dark:border-slate-800 text-rose-600 dark:text-rose-400 px-1.2 py-0.4 rounded text-[12.5px] font-mono font-semibold" 
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        }
                        
                        return (
                          <CodeBlock 
                            language={match ? match[1] : ""} 
                            code={codeString} 
                          />
                        );
                      }
                    }}
                  >
                    {parsed.cleanContent}
                  </Markdown>
                </div>
              </div>

              {/* Related/Follow-up Questions suggestions */}
              {message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
                <div className="mt-8 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 mb-3">
                    <CornerDownRight className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                      Related Questions
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {message.suggestedFollowUps.map((question, qIdx) => (
                      <button
                        key={qIdx}
                        disabled={isSearching}
                        onClick={() => onSendFollowUp(question)}
                        className="w-full text-left bg-slate-50/50 hover:bg-slate-100 hover:text-black border border-slate-150 rounded-lg p-3 text-xs text-slate-700 font-medium font-sans flex items-center justify-between cursor-pointer group active:translate-x-0.5 transition-all"
                      >
                        <span className="truncate pr-4">{question}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-black shrink-0 relative transition-transform group-hover:translate-x-0.5" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Searching Status loaders */}
        {isSearching && (
          <div className="text-left py-4 animate-pulse">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 uppercase mb-4">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-800" />
              <span>Synthesizing Real-Time Web Results...</span>
            </div>
            
            {/* Elegant skeleton cards */}
            <div className="flex flex-col gap-2 max-w-lg mb-6">
              <div className="h-3 bg-slate-100 rounded-full w-full"></div>
              <div className="h-3 bg-slate-100 rounded-full w-[90%]"></div>
              <div className="h-3 bg-slate-100 rounded-full w-[75%]"></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Sticky Bottom conversational Cockpit input bar */}
      <div className="fixed bottom-0 left-0 right-0 md:left-60 bg-[#fbf9f9]/80 backdrop-blur-md border-t border-slate-100 p-4 pb-6 z-20">
        <div className="max-w-[700px] mx-auto bg-white border border-outline-variant rounded-xl px-4 py-2 flex items-center shadow-xs focus-within:ring-1 focus-within:ring-slate-300">
          <CornerDownRight className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
          
          <input
            type="text"
            value={followUpInput}
            onChange={(e) => setFollowUpInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isSearching}
            placeholder={`Ask follow-up query to: "${thread.title}"...`}
            className="w-full bg-transparent border-none outline-none focus:ring-0 text-sm py-1 placeholder:text-slate-400 font-sans"
          />

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded mr-1">
              {thread.focus === "all" ? "Search" : thread.focus}
            </span>
            <button
              onClick={handleSend}
              disabled={!followUpInput.trim() || isSearching}
              className={`w-7.5 h-7.5 rounded-full flex items-center justify-center ${
                followUpInput.trim() && !isSearching
                  ? "bg-slate-900 text-white hover:bg-black cursor-pointer"
                  : "bg-slate-105 text-slate-300 cursor-not-allowed"
              } transition-colors`}
              title="Submit follow up"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
