import { UploadPDFResponse, ChatHistoryItem } from '@/types/chat';

const AGENT_SERVICE_BASE_URL = process.env.NEXT_PUBLIC_AGENT_SERVICE_URL;

export class ChatService {
  static async uploadPDF(file: File, conversationId: string): Promise<UploadPDFResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${AGENT_SERVICE_BASE_URL}/upload-pdf/?session_id=${conversationId}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload PDF");
    }

    return response.json();
  }

  static async streamQuery(
    query: string, 
    conversationId: string, 
    chatHistory: ChatHistoryItem[]
  ): Promise<ReadableStream<Uint8Array> | null> {
    const response = await fetch(
      `${AGENT_SERVICE_BASE_URL}/query/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: conversationId,
          query: query,
          chat_history: chatHistory
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get response from server");
    }

    return response.body;
  }
}
