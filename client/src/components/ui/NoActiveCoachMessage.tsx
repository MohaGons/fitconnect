import React from 'react';
import { UserPlus, MessageSquare } from 'lucide-react';

const NoActiveCoachMessage: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucun coach actif
        </h3>
        <p className="text-gray-600 mb-6">
          Vous devez avoir un coach actif pour pouvoir utiliser la messagerie. 
          Demandez à un coach de vous accepter ou attendez qu'il réponde à votre demande.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-medium text-blue-900 mb-1">
                Comment ça marche ?
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Faites une demande à un coach</li>
                <li>• Attendez que le coach accepte votre demande</li>
                <li>• Une fois accepté, vous pourrez communiquer</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoActiveCoachMessage; 