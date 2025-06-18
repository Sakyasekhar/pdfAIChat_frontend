const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export class ChatService {
  static async uploadPDF(file, sessionId) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${API_BASE_URL}/upload-pdf/?session_id=${sessionId}`,
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

  static async streamQuery(query, sessionId, chatHistory) {
    const response = await fetch('/api/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        session_id: sessionId,
        chat_history: chatHistory
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get response from server");
    }

    return response.body;
  }
}