import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message, CreateMessageDto } from '../api/messages';

const SOCKET_URL = 'https://api.fitnessconnect.fr';

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
    if (!token || !userId || !userType) {
      console.log('useMessageSocket: Paramètres manquants', { token: !!token, userId, userType });
      return;
    }

    console.log('useMessageSocket: Connexion WebSocket...', { userId, userType, SOCKET_URL });
    
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('useMessageSocket: Connecté au WebSocket');
      setConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      console.log('useMessageSocket: Déconnecté du WebSocket');
      setConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('useMessageSocket: Erreur de connexion WebSocket', error);
      setError('Erreur de connexion WebSocket');
      setConnected(false);
    });

    socket.on('newMessage', (data) => {
      console.log('useMessageSocket: Nouveau message reçu', data);
      setMessages((prev) => {
        // Vérifier si le message n'existe pas déjà
        const messageExists = prev.some(msg => msg.message_id === data.message.message_id);
        if (messageExists) {
          console.log('useMessageSocket: Message déjà présent, ignoré');
          return prev;
        }
        return [...prev, data.message];
      });
    });

    socket.on('messageSent', (data) => {
      console.log('useMessageSocket: Message envoyé confirmé', data);
      setMessages((prev) => {
        // Vérifier si le message n'existe pas déjà
        const messageExists = prev.some(msg => msg.message_id === data.message.message_id);
        if (messageExists) {
          console.log('useMessageSocket: Message déjà présent, ignoré');
          return prev;
        }
        return [...prev, data.message];
      });
    });

    socket.on('messageError', (data) => {
      console.error('useMessageSocket: Erreur de message', data);
      setError(data.error);
    });

    socket.on('joinedConversation', (data) => {
      console.log('useMessageSocket: Rejoint la conversation', data);
    });

    socket.on('leftConversation', (data) => {
      console.log('useMessageSocket: Quitté la conversation', data);
    });

    socket.on('joinConversationError', (data) => {
      console.error('useMessageSocket: Erreur lors de la jointure de conversation', data);
      setError(data.error);
    });

    socket.on('leaveConversationError', (data) => {
      console.error('useMessageSocket: Erreur lors de la sortie de conversation', data);
      setError(data.error);
    });

    return () => {
      console.log('useMessageSocket: Déconnexion WebSocket');
      socket.disconnect();
    };
  }, [token, userId, userType]);

  const sendMessage = useCallback((messageData: CreateMessageDto) => {
    if (socketRef.current && connected) {
      console.log('useMessageSocket: Envoi de message', messageData);
      socketRef.current.emit('sendMessage', messageData);
    } else {
      console.error('useMessageSocket: Impossible d\'envoyer le message - socket non connecté');
      setError('Connexion WebSocket perdue');
    }
  }, [connected]);

  const joinConversation = useCallback((otherUserId: number, otherUserType: 'coach' | 'client') => {
    if (socketRef.current && connected) {
      console.log('useMessageSocket: Rejoindre conversation', { otherUserId, otherUserType });
      socketRef.current.emit('joinConversation', { otherUserId, otherUserType });
    } else {
      console.error('useMessageSocket: Impossible de rejoindre la conversation - socket non connecté');
    }
  }, [connected]);

  const leaveConversation = useCallback((otherUserId: number, otherUserType: 'coach' | 'client') => {
    if (socketRef.current && connected) {
      console.log('useMessageSocket: Quitter conversation', { otherUserId, otherUserType });
      socketRef.current.emit('leaveConversation', { otherUserId, otherUserType });
    } else {
      console.error('useMessageSocket: Impossible de quitter la conversation - socket non connecté');
    }
  }, [connected]);

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