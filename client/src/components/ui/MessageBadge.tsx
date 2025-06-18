import React from 'react';
import { MessageSquare } from 'lucide-react';

interface MessageBadgeProps {
  count: number;
  onClick?: () => void;
  className?: string;
}

const MessageBadge: React.FC<MessageBadgeProps> = ({ 
  count, 
  onClick, 
  className = '' 
}) => {
  if (count === 0) {
    return (
      <div 
        className={`relative p-2 text-gray-500 hover:text-gray-700 transition-colors ${className}`}
        onClick={onClick}
      >
        <MessageSquare className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div 
      className={`relative p-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer ${className}`}
      onClick={onClick}
    >
      <MessageSquare className="h-5 w-5" />
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] font-medium animate-pulse">
        {count > 99 ? '99+' : count}
      </span>
    </div>
  );
};

export default MessageBadge; 