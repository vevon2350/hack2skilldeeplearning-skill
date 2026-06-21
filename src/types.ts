export interface Source {
  title: string;
  url: string;
}

export type FocusLens = "all" | "academic" | "writing";

export interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
  sources?: Source[];
  suggestedFollowUps?: string[];
  isError?: boolean;
  selectedModel?: string;
}

export interface Thread {
  id: string;
  title: string;
  messages: Message[];
  focus: FocusLens;
  spaceId: string | null;
  timestamp: string;
}

export interface Space {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface UserProfile {
  name: string;
  aiProfile: string; // Brief description of what user does for custom context
  searchPreference: string; // e.g. "detailed", "concise"
}
