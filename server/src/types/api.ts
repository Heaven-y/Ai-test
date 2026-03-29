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

export type ChatDemoIntent =
  | "learning_plan"
  | "project_scope"
  | "tech_choice"
  | "general";

export interface ChatDemoResponse {
  ok: true;
  userMessage: string;
  assistantMessage: string;
  intent: ChatDemoIntent;
  suggestions: string[];
  historyCount: number;
  appliedSystemPrompt: string | null;
}

export interface ChatCompletionsRequest {
  model?: string;
  systemPrompt?: string;
  messages: ChatHistoryMessage[];
}

export interface ChatCompletionsResponse {
  ok: true;
  id: string;
  model: string;
  createdAt: string;
  output: {
    role: "assistant";
    content: string;
  };
  finishReason: "stop";
  usage: {
    messageCount: number;
  };
}

export interface ApiErrorResponse {
  ok: false;
  error: {
    code: string;
    message: string;
  };
}
