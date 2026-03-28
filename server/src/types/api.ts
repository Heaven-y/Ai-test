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

export interface ApiErrorResponse {
  ok: false;
  error: {
    code: string;
    message: string;
  };
}
