import React, { useState, useEffect, useRef } from 'react';
import { messagesApi, Message, Conversation } from '../../../api/messages';
import { useUserRole } from '../../../hooks/useUserRole';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Send, 
  MessageSquare, 
  Search, 
  Paperclip,
  CheckCheck,
  Download,
  FileText,
  Image
} from 'lucide-react';
import NoActiveCoachMessage from '../../../components/ui/NoActiveCoachMessage';

const Chat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { userId_entity, userRole } = useUserRole();
  const userType = userRole === 'COACH' ? 'coach' : userRole === 'CLIENT' ? 'client' : '';
  
  // Convertir userId_entity en number pour l'API
  const userId = typeof userId_entity === 'string' ? parseInt(userId_entity, 10) : userId_entity;

  useEffect(() => {
    if (userId && userType) {
      loadConversations();
      loadUnreadCount();
    }
  }, [userId, userType]);

  useEffect(() => {
    if (selectedConversation && userId && userType) {
      loadConversation();
      markConversationAsRead();
    }
  }, [selectedConversation, userId, userType]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    if (!userId || !userType) return;
    
    setLoading(true);
    try {
      const data = await messagesApi.getConversationsList(userId, userType);
      setConversations(data);
      setError(null);
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
      setError('Impossible de charger les conversations');
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
      console.error('Erreur lors du chargement du compteur de messages non lus:', error);
      setUnreadCount(0);
    }
  };

  const loadConversation = async () => {
    if (!selectedConversation || !userId || !userType) return;
    
    try {
      const data = await messagesApi.getConversation(
        userId, 
        userType, 
        selectedConversation.otherUserId
      );
      setMessages(data);
      setError(null);
    } catch (error) {
      console.error('Erreur lors du chargement de la conversation:', error);
      setError('Impossible de charger la conversation');
      setMessages([]);
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
      setUnreadCount(prev => Math.max(0, prev - selectedConversation.unreadCount));
      // Mettre à jour la conversation dans la liste
      setConversations(prev => 
        prev.map(conv => 
          conv.otherUserId === selectedConversation.otherUserId 
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || !newMessage.trim() || !userId || !userType) return;

    const messageData = {
      sender_id: userId,
      sender_type: userType as 'coach' | 'client',
      recipient_id: selectedConversation.otherUserId,
      recipient_type: selectedConversation.otherUserType,
      content: newMessage.trim(),
    };

    try {
      const message = await messagesApi.create(messageData);
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setError(null);
      
      // Mettre à jour la conversation dans la liste
      setConversations(prev => 
        prev.map(conv => 
          conv.otherUserId === selectedConversation.otherUserId 
            ? { 
                ...conv, 
                lastMessage: message,
                unreadCount: 0
              }
            : conv
        )
      );
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setError('Impossible d\'envoyer le message');
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherUserName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isOwnMessage = (message: Message) => {
    if (userType === 'coach') {
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
        sender_type: userType as 'coach' | 'client',
        recipient_id: selectedConversation.otherUserId,
        recipient_type: selectedConversation.otherUserType,
        content: `Fichier: ${file.name}`,
        message_type: 'file',
        attachment_url: uploadResult.url,
      };

      const message = await messagesApi.create(messageData);
      setMessages(prev => [...prev, message]);
      
      // Mettre à jour la conversation dans la liste
      setConversations(prev => 
        prev.map(conv => 
          conv.otherUserId === selectedConversation.otherUserId 
            ? { 
                ...conv, 
                lastMessage: message,
                unreadCount: 0
              }
            : conv
        )
      );
    } catch (error) {
      console.error('Erreur lors de l\'upload du fichier:', error);
      setError('Impossible d\'uploader le fichier');
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
      fileInputRef.current.value = '';
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const renderMessageContent = (message: Message) => {
    // Si c'est un message avec fichier attaché
    if (message.message_type === 'file' && message.attachment_url) {
      const isImage = message.attachment_url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
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
                  onClick={() => window.open(message.attachment_url, '_blank')}
                />
              </div>
            ) : isPdf ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Document PDF</p>
                  <p className="text-xs text-gray-500">Cliquez pour télécharger</p>
                </div>
                <button
                  onClick={() => window.open(message.attachment_url, '_blank')}
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
                  <p className="text-xs text-gray-500">Cliquez pour télécharger</p>
                </div>
                <button
                  onClick={() => window.open(message.attachment_url, '_blank')}
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
                  <p className="text-xs text-gray-500">Cliquez pour télécharger</p>
                </div>
                <button
                  onClick={() => window.open(message.attachment_url, '_blank')}
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  // Si c'est un client et qu'il n'a pas de conversations (pas de coach actif)
  if (userType === 'client' && !loading && conversations.length === 0) {
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
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune conversation</p>
                <p className="text-sm">
                  {userType === 'coach' 
                    ? 'Aucun client actif pour le moment' 
                    : 'Aucun coach actif pour le moment'
                  }
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={`${conversation.otherUserType}-${conversation.otherUserId}`}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.otherUserId === conversation.otherUserId 
                      ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                      : ''
                  }`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {conversation.otherUserName}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {format(new Date(conversation.lastMessage.sent_date), 'HH:mm', { locale: fr })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate flex-1">
                      {conversation.lastMessage.content}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="ml-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Zone de conversation */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header de la conversation */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {selectedConversation.otherUserName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {selectedConversation.otherUserName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedConversation.otherUserType === 'coach' ? 'Coach' : 'Client'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun message dans cette conversation</p>
                    <p className="text-sm">Commencez la conversation !</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.message_id}
                      className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwnMessage(message)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <div className="space-y-2">
                          {renderMessageContent(message)}
                          <div className="flex items-center gap-1">
                            <span className="text-xs opacity-75">
                              {format(new Date(message.sent_date), 'HH:mm', { locale: fr })}
                            </span>
                            {isOwnMessage(message) && (
                              <CheckCheck className={`h-3 w-3 ${message.read ? 'text-blue-300' : 'text-gray-400'}`} />
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
              <div className="bg-white border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                  <div className="flex-1 flex items-end gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileSelect}
                      accept="image/*,.pdf,.txt,.doc,.docx"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={handleAttachmentClick}
                      disabled={uploading}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Paperclip className="h-4 w-4" />
                    </button>
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Écrivez votre message..."
                      className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || uploading}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
                {uploading && (
                  <div className="mt-2 text-sm text-blue-600">
                    Upload en cours...
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Sélectionnez une conversation</h3>
                <p className="text-sm">Choisissez une conversation pour commencer à discuter</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;