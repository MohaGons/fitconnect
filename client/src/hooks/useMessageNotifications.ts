import { useState, useEffect, useCallback } from 'react';
import { messagesApi } from '../api/messages';
import { useUserRole } from './useUserRole';

interface MessageNotification {
  id: string;
  message: string;
  senderName: string;
  conversationId: string;
}

export const useMessageNotifications = () => {
  const [notifications, setNotifications] = useState<MessageNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { userId_entity, userRole } = useUserRole();
  const userType = userRole === 'coach' ? 'coach' : 'client';

  // Charger le compteur de messages non lus
  const loadUnreadCount = useCallback(async () => {
    if (!userId_entity || !userType) return;
    
    try {
      const count = await messagesApi.getUnreadCount(userId_entity as number, userType);
      setUnreadCount(count);
    } catch (error) {
      console.error('Erreur lors du chargement du compteur de messages non lus:', error);
    }
  }, [userId_entity, userType]);

  // Ajouter une notification
  const addNotification = useCallback((notification: MessageNotification) => {
    setNotifications(prev => [...prev, notification]);
    setUnreadCount(prev => prev + 1);
    
    // Supprimer la notification après 5 secondes
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  }, []);

  // Supprimer une notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Marquer tous les messages comme lus
  const markAllAsRead = useCallback(async () => {
    if (!userId_entity || !userType) return;
    
    try {
      // Récupérer toutes les conversations
      const conversations = await messagesApi.getConversationsList(userId_entity as number, userType);
      
      // Marquer chaque conversation comme lue
      for (const conversation of conversations) {
        if (conversation.unreadCount > 0) {
          await messagesApi.markConversationAsRead(
            userId_entity as number,
            userType,
            conversation.otherUserId
          );
        }
      }
      
      setUnreadCount(0);
      setNotifications([]);
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  }, [userId_entity, userType]);

  // Simuler la réception de nouveaux messages (pour la démo)
  // Dans un vrai projet, cela serait remplacé par WebSocket ou Server-Sent Events
  useEffect(() => {
    if (!userId_entity || !userType) return;

    const interval = setInterval(async () => {
      try {
        const currentCount = await messagesApi.getUnreadCount(userId_entity, userType);
        
        // Si le nombre de messages non lus a augmenté
        if (currentCount > unreadCount) {
          const conversations = await messagesApi.getConversationsList(userId_entity, userType);
          const newMessages = conversations.filter(conv => conv.unreadCount > 0);
          
          // Ajouter des notifications pour les nouveaux messages
          newMessages.forEach(conv => {
            addNotification({
              id: `${conv.otherUserId}-${Date.now()}`,
              message: conv.lastMessage.content,
              senderName: conv.otherUserName,
              conversationId: `${conv.otherUserType}-${conv.otherUserId}`,
            });
          });
        }
        
        setUnreadCount(currentCount);
      } catch (error) {
        console.error('Erreur lors de la vérification des nouveaux messages:', error);
      }
    }, 10000); // Vérifier toutes les 10 secondes

    return () => clearInterval(interval);
  }, [userId_entity, userType, unreadCount, addNotification]);

  // Charger le compteur initial
  useEffect(() => {
    loadUnreadCount();
  }, [loadUnreadCount]);

  return {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAllAsRead,
    loadUnreadCount,
  };
}; 