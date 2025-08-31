import { 
  Conversation, 
  ConversationsResponse, 
  ConversationHistory, 
  AddMessageRequest,
  NewConversationRequest,
  NewConversationResponse 
} from '@/types/conversation';
import { AuthService } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export class ConversationService {
  /**
   * Create new conversation
   */
  static async createConversation(conversationData: NewConversationRequest): Promise<NewConversationResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user_service/v1/conversations/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...AuthService.getAuthHeader(),
          },
          body: JSON.stringify(conversationData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create conversation');
      }

      const data: NewConversationResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  /**
   * Get all conversations for the current user
   */
  static async getUserConversations(userId: number): Promise<Conversation[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user_service/v1/users/${userId}/conversations`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...AuthService.getAuthHeader(),
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch conversations');
      }

      const data: ConversationsResponse = await response.json();

      return data.conversations;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  /**
   * Get conversation history
   */
  static async getConversationHistory(conversationId: string): Promise<ConversationHistory> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user_service/v1/conversations/${conversationId}/history`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...AuthService.getAuthHeader(),
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch conversation history');
      }

      const data: ConversationHistory = await response.json();

      return data;
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      throw error;
    }
  }

  /**
   * Add message to conversation
   */
  static async addMessage(conversationId: string, messageData: AddMessageRequest): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user_service/v1/conversations/${conversationId}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...AuthService.getAuthHeader(),
          },
          body: JSON.stringify(messageData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add message');
      }
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  static async deleteConversation(conversationId: string): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user_service/v1/conversations/${conversationId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...AuthService.getAuthHeader(),
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete conversation');
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }

  static async togglePinConversation(
    conversationId: string, 
    isPinned: boolean
  ): Promise<{ conversation_id: string; is_pinned: boolean; message: string }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user_service/v1/conversations/${conversationId}/pin`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...AuthService.getAuthHeader(),
          },
          body: JSON.stringify({
            is_pinned: isPinned,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update conversation pin status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating conversation pin status:', error);
      throw error;
    }
  }
}
