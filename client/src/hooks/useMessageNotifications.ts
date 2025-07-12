import { useState, useEffect, useCallback } from "react";
import { messagesApi } from "../api/messages";
import { Message } from "../api/messages";
import { useUserRole } from "./useUserRole";
import { useMessageSocket } from "./useMessageSocket";

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
  const userType = userRole === "coach" ? "coach" : "client";

  // Convertir userId_entity en number pour les appels API
  const userId = userId_entity
    ? typeof userId_entity === "string"
      ? parseInt(userId_entity, 10)
      : userId_entity
    : 0;

  // Récupération du token JWT (à adapter selon votre logique d'authentification)
  const token = localStorage.getItem("token") || "";

  // Utilisation du WebSocket pour les notifications
  const { socket } = useMessageSocket({ token, userId, userType });

  // Ajoute un listener pour les notifications de nouveaux messages
  useEffect(() => {
    if (!socket) return;
    type WSNotifData = {
      message: Message & {
        senderName?: string;
        senderId?: number;
        senderType?: string;
      };
    };
    const handleNewMessageNotification = (data: WSNotifData) => {
      setUnreadCount((prev) => prev + 1);
      setNotifications((prev) => [
        ...prev,
        {
          id: `${Date.now()}`,
          message: data.message.content,
          senderName: data.message.senderName || "Nouveau message",
          conversationId: `${data.message.senderId}-${data.message.senderType}`,
        },
      ]);
      setTimeout(() => {
        setNotifications((prev) => prev.slice(1));
      }, 5000);
    };
    socket.on("newMessageNotification", handleNewMessageNotification);
    return () => {
      socket.off("newMessageNotification", handleNewMessageNotification);
    };
  }, [socket]);

  // Marquer tous les messages comme lus
  const markAllAsRead = useCallback(async () => {
    if (!userId || !userType) return;

    try {
      // Récupérer toutes les conversations
      const conversations = await messagesApi.getConversationsList(
        userId,
        userType
      );

      // Marquer chaque conversation comme lue
      for (const conversation of conversations) {
        if (conversation.unreadCount > 0) {
          await messagesApi.markConversationAsRead(
            userId,
            userType,
            conversation.otherUserId
          );
        }
      }

      setUnreadCount(0);
      setNotifications([]);
    } catch (error) {
      console.error("Erreur lors du marquage comme lu:", error);
    }
  }, [userId, userType]);

  return {
    notifications,
    unreadCount,
    markAllAsRead,
  };
};
