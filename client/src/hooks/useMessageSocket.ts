import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message, CreateMessageDto } from '../api/messages';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000/messages';

interface UseMessageSocketOptions {
  token: string;
  userId: number;
  userType: 'coach' | 'client';
}

export function useMessageSocket({ token, userId, userType }: UseMessageSocketOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token || !userId || !userType) return;
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
    });
    socket.on('disconnect', () => {
      setConnected(false);
    });
    socket.on('connect_error', () => {
      setError('Erreur de connexion WebSocket');
    });
    socket.on('newMessage', (data) => {
      setMessages((prev) => [...prev, data.message]);
    });
    socket.on('messageSent', (data) => {
      setMessages((prev) => [...prev, data.message]);
    });
    socket.on('messageError', (data) => {
      setError(data.error);
    });
    // Ajoutez d'autres listeners si besoin

    return () => {
      socket.disconnect();
    };
  }, [token, userId, userType]);

  const sendMessage = useCallback((messageData: CreateMessageDto) => {
    if (socketRef.current) {
      socketRef.current.emit('sendMessage', messageData);
    }
  }, []);

  const joinConversation = useCallback((otherUserId: number, otherUserType: 'coach' | 'client') => {
    if (socketRef.current) {
      socketRef.current.emit('joinConversation', { otherUserId, otherUserType });
    }
  }, []);

  const leaveConversation = useCallback((otherUserId: number, otherUserType: 'coach' | 'client') => {
    if (socketRef.current) {
      socketRef.current.emit('leaveConversation', { otherUserId, otherUserType });
    }
  }, []);

  return {
    messages,
    setMessages,
    error,
    connected,
    sendMessage,
    joinConversation,
    leaveConversation,
    socket: socketRef.current,
  };
} 