import React, { useState, useEffect, useRef } from "react";
import { messagesApi, Message, Conversation } from "../../../api/messages";
import { useUserRole } from "../../../hooks/useUserRole";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Send,
  MessageSquare,
  Search,
  Paperclip,
  CheckCheck,
  Download,
  FileText,
  Image,
} from "lucide-react";
import NoActiveCoachMessage from "../../../components/ui/NoActiveCoachMessage";
import { useMessageSocket } from "../../../hooks/useMessageSocket";

const Chat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { userId_entity, userRole } = useUserRole();
  const userType =
    userRole === "COACH"
      ? "coach"
      : userRole === "CLIENT"
      ? "client"
      : undefined;
  const userId = userId_entity
    ? typeof userId_entity === "string"
      ? parseInt(userId_entity, 10)
      : userId_entity
    : undefined;

  // Récupération du token JWT
  const token = localStorage.getItem("token") || "";

  // Utilisation du hook WebSocket
  const {
    messages: wsMessages,
    setMessages: setWsMessages,
    sendMessage,
    joinConversation,
    leaveConversation,
    connected,
    error: wsError,
  } = useMessageSocket({
    token,
    userId: userId || 0,
    userType: (userType as "coach" | "client") || "client",
  });

  // Chargement initial des conversations
  useEffect(() => {
    if (userId && userType) {
      loadConversations();
      loadUnreadCount();
    }
  }, [userId, userType]);

  // Gestion de la sélection de conversation
  useEffect(() => {
    if (selectedConversation && userId && userType) {
      // Rejoindre la conversation via WebSocket
      joinConversation(
        selectedConversation.otherUserId,
        selectedConversation.otherUserType
      );
      
      // Charger l'historique des messages via API REST
      loadConversationHistory();
      
      // Marquer comme lu
      markConversationAsRead();
    }
    
    // Nettoyage lors du changement de conversation
    return () => {
      if (selectedConversation && userId && userType) {
        leaveConversation(
          selectedConversation.otherUserId,
          selectedConversation.otherUserType
        );
      }
    };
  }, [selectedConversation, userId, userType]);

  // Synchronisation des messages WebSocket avec les messages locaux
  useEffect(() => {
    if (selectedConversation && wsMessages.length > 0) {
      // Filtrer les messages pour la conversation actuelle
      const conversationMessages = wsMessages.filter(msg => {
        if (userType === "coach") {
          return (msg.sender_coach_id === userId && msg.recipient_client_id === selectedConversation.otherUserId) ||
                 (msg.sender_client_id === selectedConversation.otherUserId && msg.recipient_coach_id === userId);
        } else {
          return (msg.sender_client_id === userId && msg.recipient_coach_id === selectedConversation.otherUserId) ||
                 (msg.sender_coach_id === selectedConversation.otherUserId && msg.recipient_client_id === userId);
        }
      });
      
      setLocalMessages(conversationMessages);
    }
  }, [wsMessages, selectedConversation, userId, userType]);

  // Scroll automatique vers le bas
  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  // Gestion des erreurs WebSocket
  useEffect(() => {
    if (wsError) {
      setError(`Erreur de connexion: ${wsError}`);
    }
  }, [wsError]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const loadConversations = async () => {
    if (!userId || !userType) return;

    setLoading(true);
    try {
      const data = await messagesApi.getConversationsList(userId, userType);
      setConversations(data);
      setError(null);
    } catch (error) {
      console.error("Erreur lors du chargement des conversations:", error);
      setError("Impossible de charger les conversations");
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    if (!userId || !userType) return;

    try {
      const count = await messagesApi.getUnreadCount(userId, userType);
      setUnreadCount(count);
      setError(null);
    } catch (error) {
      console.error(
        "Erreur lors du chargement du compteur de messages non lus:",
        error
      );
      setUnreadCount(0);
    }
  };

  const loadConversationHistory = async () => {
    if (!selectedConversation || !userId || !userType) return;

    try {
      const data = await messagesApi.getConversation(
        userId,
        userType,
        selectedConversation.otherUserId
      );
      
      // Mettre à jour les messages WebSocket avec l'historique
      setWsMessages(prevMessages => {
        // Filtrer les messages existants qui ne sont pas dans cette conversation
        const otherMessages = prevMessages.filter(msg => {
          if (userType === "coach") {
            return !((msg.sender_coach_id === userId && msg.recipient_client_id === selectedConversation.otherUserId) ||
                    (msg.sender_client_id === selectedConversation.otherUserId && msg.recipient_coach_id === userId));
          } else {
            return !((msg.sender_client_id === userId && msg.recipient_coach_id === selectedConversation.otherUserId) ||
                    (msg.sender_coach_id === selectedConversation.otherUserId && msg.recipient_client_id === userId));
          }
        });
        
        return [...otherMessages, ...data];
      });
      
      setError(null);
    } catch (error) {
      console.error("Erreur lors du chargement de la conversation:", error);
      setError("Impossible de charger la conversation");
    }
  };

  const markConversationAsRead = async () => {
    if (!selectedConversation || !userId || !userType) return;

    try {
      await messagesApi.markConversationAsRead(
        userId,
        userType,
        selectedConversation.otherUserId
      );
      
      // Mettre à jour le compteur local
      setUnreadCount((prev) =>
        Math.max(0, prev - selectedConversation.unreadCount)
      );
      
      // Mettre à jour la conversation dans la liste
      setConversations((prev) =>
        prev.map((conv) =>
          conv.otherUserId === selectedConversation.otherUserId
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
    } catch (error) {
      console.error("Erreur lors du marquage comme lu:", error);
    }
  };

  // Envoi de message via WebSocket
  const handleSendMessage = async () => {
    if (!selectedConversation || !userId || !userType || !newMessage.trim()) {
      return;
    }
    
    if (!connected) {
      setError("Pas de connexion WebSocket. Tentative de reconnexion...");
      return;
    }

    const messageData = {
      sender_id: userId,
      sender_type: userType as "coach" | "client",
      recipient_id: selectedConversation.otherUserId,
      recipient_type: selectedConversation.otherUserType,
      content: newMessage,
      message_type: "text",
    };

    try {
      sendMessage(messageData);
      setNewMessage("");
      setError(null);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      setError("Impossible d'envoyer le message");
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.otherUserName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isOwnMessage = (message: Message) => {
    if (userType === "coach") {
      return message.sender_coach_id === userId;
    } else {
      return message.sender_client_id === userId;
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!selectedConversation || !userId || !userType) return;

    setUploading(true);
    setError(null);

    try {
      // Upload du fichier
      const uploadResult = await messagesApi.uploadFile(file);

      // Créer le message avec le fichier attaché
      const messageData = {
        sender_id: userId,
        sender_type: userType as "coach" | "client",
        recipient_id: selectedConversation.otherUserId,
        recipient_type: selectedConversation.otherUserType,
        content: `Fichier: ${file.name}`,
        message_type: "file",
        attachment_url: uploadResult.url,
      };

      // Envoyer via WebSocket
      sendMessage(messageData);

      // Mettre à jour la conversation dans la liste
      setConversations((prev) =>
        prev.map((conv) =>
          conv.otherUserId === selectedConversation.otherUserId
            ? {
                ...conv,
                unreadCount: 0,
              }
            : conv
        )
      );
    } catch (error) {
      console.error("Erreur lors de l'upload du fichier:", error);
      setError("Impossible d'uploader le fichier");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset l'input pour permettre de sélectionner le même fichier
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const renderMessageContent = (message: Message) => {
    // Si c'est un message avec fichier attaché
    if (message.message_type === "file" && message.attachment_url) {
      const isImage = message.attachment_url.match(
        /\.(jpg|jpeg|png|gif|webp)$/i
      );
      const isPdf = message.attachment_url.match(/\.pdf$/i);
      const isDocument = message.attachment_url.match(/\.(doc|docx|txt)$/i);

      return (
        <div className="space-y-2">
          <p className="text-sm">{message.content}</p>
          <div className="border rounded-lg p-3 bg-gray-50">
            {isImage ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Image className="h-4 w-4" />
                  <span>Image</span>
                </div>
                <img
                  src={message.attachment_url}
                  alt="Image jointe"
                  className="max-w-full max-h-64 rounded-lg cursor-pointer hover:opacity-90"
                  onClick={() => window.open(message.attachment_url, "_blank")}
                />
              </div>
            ) : isPdf ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Document PDF</p>
                  <p className="text-xs text-gray-500">
                    Cliquez pour télécharger
                  </p>
                </div>
                <button
                  onClick={() => window.open(message.attachment_url, "_blank")}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ) : isDocument ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Document</p>
                  <p className="text-xs text-gray-500">
                    Cliquez pour télécharger
                  </p>
                </div>
                <button
                  onClick={() => window.open(message.attachment_url, "_blank")}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Paperclip className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Fichier joint</p>
                  <p className="text-xs text-gray-500">
                    Cliquez pour télécharger
                  </p>
                </div>
                <button
                  onClick={() => window.open(message.attachment_url, "_blank")}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Message texte normal
    return <p className="text-sm">{message.content}</p>;
  };

  if (!userId || !userType) {
    return (
      <div>
        Impossible de charger la messagerie (utilisateur non authentifié).
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  // Si c'est un client et qu'il n'a pas de conversations (pas de coach actif)
  if (userType === "client" && !loading && conversations.length === 0) {
    return <NoActiveCoachMessage />;
  }

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar des conversations */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Messages
              </h2>
              {/* Indicateur de connexion WebSocket */}
              <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} 
                   title={connected ? 'Connecté' : 'Déconnecté'} />
            </div>

            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une conversation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Compteur de messages non lus */}
            {unreadCount > 0 && (
              <div className="mt-2 text-sm text-blue-600 font-medium">
                {unreadCount} message(s) non lu(s)
              </div>
            )}
          </div>

          {/* Liste des conversations */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Chargement des conversations...
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Aucune conversation trouvée
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={`${conversation.otherUserId}-${conversation.otherUserType}`}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.otherUserId === conversation.otherUserId
                      ? "bg-blue-50 border-blue-200"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.otherUserName}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage.content}
                      </p>
                    </div>
                    <div className="flex flex-col items-end ml-2">
                      <span className="text-xs text-gray-400">
                        {format(
                          new Date(conversation.lastMessage.sent_date),
                          "HH:mm",
                          { locale: fr }
                        )}
                      </span>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 mt-1">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Zone de chat */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header de la conversation */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <h3 className="text-lg font-semibold text-gray-800">
                  {selectedConversation.otherUserName}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedConversation.otherUserType === "coach"
                    ? "Coach"
                    : "Client"}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {localMessages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun message dans cette conversation</p>
                    <p className="text-sm">Commencez la conversation !</p>
                  </div>
                ) : (
                  localMessages.map((message) => (
                    <div
                      key={message.message_id}
                      className={`flex ${
                        isOwnMessage(message) ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwnMessage(message)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        <div className="space-y-2">
                          {renderMessageContent(message)}
                          <div className="flex items-center gap-1">
                            <span className="text-xs opacity-75">
                              {format(new Date(message.sent_date), "HH:mm", {
                                locale: fr,
                              })}
                            </span>
                            {isOwnMessage(message) && (
                              <CheckCheck
                                className={`h-3 w-3 ${
                                  message.read
                                    ? "text-blue-300"
                                    : "text-gray-400"
                                }`}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAttachmentClick}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={uploading}
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Tapez votre message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!connected}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || !connected || uploading}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
                {!connected && (
                  <p className="text-sm text-red-500 mt-2">
                    Connexion perdue. Tentative de reconnexion...
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Sélectionnez une conversation pour commencer</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
