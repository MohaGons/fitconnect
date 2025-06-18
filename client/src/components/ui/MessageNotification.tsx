import React from 'react';
import { MessageSquare, X } from 'lucide-react';

interface MessageNotificationProps {
  message: string;
  senderName: string;
  onClose: () => void;
  onOpen: () => void;
}

const MessageNotification: React.FC<MessageNotificationProps> = ({
  message,
  senderName,
  onClose,
  onOpen,
}) => {
  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            Nouveau message de {senderName}
          </p>
          <p className="text-sm text-gray-600 truncate mt-1">
            {message}
          </p>
          <button
            onClick={onOpen}
            className="text-xs text-blue-600 hover:text-blue-800 mt-2 font-medium"
          >
            Voir la conversation
          </button>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default MessageNotification; 