import apiClient from './axios';

export interface Message {
  message_id: number;
  sender_coach_id?: number;
  sender_client_id?: number;
  recipient_coach_id?: number;
  recipient_client_id?: number;
  content: string;
  sent_date: string;
  read: boolean;
  message_type?: string;
  attachment_url?: string;
  sender_coach?: {
    coach_id: number;
    firstName: string;
    lastName: string;
  };
  sender_client?: {
    client_id: number;
    firstName: string;
    lastName: string;
  };
  recipient_coach?: {
    coach_id: number;
    firstName: string;
    lastName: string;
  };
  recipient_client?: {
    client_id: number;
    firstName: string;
    lastName: string;
  };
}

export interface CreateMessageDto {
  sender_id: number;
  sender_type: 'coach' | 'client';
  recipient_id: number;
  recipient_type: 'coach' | 'client';
  content: string;
  message_type?: string;
  attachment_url?: string;
}

export interface Conversation {
  otherUserId: number;
  otherUserName: string;
  otherUserType: 'coach' | 'client';
  lastMessage: Message;
  unreadCount: number;
}

export const messagesApi = {
  create: async (data: CreateMessageDto) => {
    const response = await apiClient.post<Message>('/messages', data);
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get<Message[]>('/messages');
    return response.data;
  },

  getConversationsList: async (userId: number, userType: 'coach' | 'client') => {
    const response = await apiClient.get<Conversation[]>(`/messages/conversations?userId=${userId}&userType=${userType}`);
    return response.data;
  },

  getConversation: async (userId: number, userType: 'coach' | 'client', otherUserId?: number) => {
    const params = new URLSearchParams({
      userId: userId.toString(),
      userType: userType,
    });
    
    if (otherUserId) {
      params.append('otherUserId', otherUserId.toString());
    }
    
    const response = await apiClient.get<Message[]>(`/messages/conversation/${userId}?${params.toString()}`);
    return response.data;
  },

  markAsRead: async (messageId: number, userId: number, userType: 'coach' | 'client') => {
    const response = await apiClient.patch<Message>(`/messages/${messageId}/read?userId=${userId}&userType=${userType}`);
    return response.data;
  },

  markConversationAsRead: async (userId: number, userType: 'coach' | 'client', otherUserId: number) => {
    const response = await apiClient.patch<Message>(`/messages/conversation/read?userId=${userId}&userType=${userType}&otherUserId=${otherUserId}`);
    return response.data;
  },

  getUnreadCount: async (userId: number, userType: 'coach' | 'client') => {
    const response = await apiClient.get<number>(`/messages/unread/count?userId=${userId}&userType=${userType}`);
    return response.data;
  },

  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/storage/upload/message', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const result = response.data;
    result.url = `http://34.79.140.130:3000/${result.url}`;
    
    return result;
  },
}; 