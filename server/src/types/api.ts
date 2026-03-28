export interface HealthResponse {
  ok: true;
  service: string;
  timestamp: string;
}

export interface ServiceInfoResponse {
  ok: true;
  project: {
    name: string;
    description: string;
    currentStage: string;
  };
  techStack: {
    frontend: string;
    backend: string;
    database: string;
    model: string;
  };
}

export interface ChatEchoRequest {
  message: string;
}

export interface ChatEchoResponse {
  ok: true;
  userMessage: string;
  assistantMessage: string;
}

export interface ChatHistoryMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatDemoRequest {
  systemPrompt?: string;
  messages: ChatHistoryMessage[];
}

export interface ChatDemoResponse {
  ok: true;
  userMessage: string;
  assistantMessage: string;
  intent: "learning_plan" | "project_scope" | "tech_choice" | "general";
  suggestions: string[];
  historyCount: number;
  appliedSystemPrompt: string | null;
}

export interface ApiErrorResponse {
  ok: false;
  error: {
    code: string;
    message: string;
  };
}
