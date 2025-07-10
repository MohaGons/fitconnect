import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UserType } from './dto/create-message.dto';
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as jwksRsa from 'jwks-rsa';

interface AuthenticatedSocket extends Socket {
  userId?: number;
  userType?: UserType;
}

interface JwtPayload {
  sub?: string;
  user_id?: string;
  realm_access?: {
    roles?: string[];
  };
  iss?: string;
  aud?: string;
}

interface Message {
  content: string;
  senderName?: string;
  senderId?: number;
  senderType?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
  namespace: '/messages',
})
@Injectable()
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<
    string,
    { userId: number; userType: UserType }
  >();

  private jwksClient = new jwksRsa.JwksClient({
    jwksUri:
      'http://keycloak:8080/realms/MY-REALM/protocol/openid-connect/certs',
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
  });

  constructor(private readonly messagesService: MessagesService) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Authentifier l'utilisateur via le token JWT
      const token: string | undefined =
        (client.handshake.auth.token as string) ||
        (client.handshake.headers.authorization as string)?.replace(
          'Bearer ',
          '',
        );
      if (!token) {
        client.disconnect();
        return;
      }

      // Valider le token JWT avec la stratégie existante
      const userInfo = await this.validateToken(token);
      if (!userInfo) {
        client.disconnect();
        return;
      }

      client.userId = userInfo.userId;
      client.userType = userInfo.userType;

      // Stocker l'utilisateur connecté
      this.connectedUsers.set(client.id, {
        userId: userInfo.userId,
        userType: userInfo.userType,
      });

      // Rejoindre une room spécifique à l'utilisateur
      client.join(`user_${userInfo.userId}_${userInfo.userType}`);

      console.log(
        `Utilisateur connecté: ${userInfo.userId} (${userInfo.userType})`,
      );
    } catch (error) {
      console.error('Erreur lors de la connexion WebSocket:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.connectedUsers.delete(client.id);
    console.log(
      `Utilisateur déconnecté: ${client.userId} (${client.userType})`,
    );
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: CreateMessageDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      if (!client.userId || !client.userType) {
        throw new Error('Utilisateur non authentifié');
      }

      // Créer le message
      const message = await this.messagesService.create(data);

      // Déterminer le destinataire
      const recipientId = data.recipient_id;
      const recipientType = data.recipient_type;

      // Envoyer le message au destinataire
      const recipientRoom = `user_${recipientId}_${recipientType}`;
      this.server.to(recipientRoom).emit('newMessage', {
        message,
        senderId: client.userId,
        senderType: client.userType,
      });

      // Confirmer l'envoi à l'expéditeur
      client.emit('messageSent', { message });

      return { success: true, message };
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur inconnue';
      client.emit('messageError', { error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @MessageBody() data: { messageId: number },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      if (!client.userId || !client.userType) {
        throw new Error('Utilisateur non authentifié');
      }

      await this.messagesService.markAsRead(
        data.messageId,
        client.userId,
        client.userType,
      );

      client.emit('messageMarkedAsRead', { messageId: data.messageId });
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur inconnue';
      client.emit('markAsReadError', { error: errorMessage });
    }
  }

  @SubscribeMessage('joinConversation')
  async handleJoinConversation(
    @MessageBody() data: { otherUserId: number; otherUserType: UserType },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      if (!client.userId || !client.userType) {
        throw new Error('Utilisateur non authentifié');
      }

      // Rejoindre la room de la conversation
      const conversationRoom = this.getConversationRoom(
        client.userId,
        client.userType,
        data.otherUserId,
        data.otherUserType,
      );
      await client.join(conversationRoom);

      client.emit('joinedConversation', { conversationRoom });
    } catch (error) {
      console.error('Erreur lors de la jointure de conversation:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur inconnue';
      client.emit('joinConversationError', { error: errorMessage });
    }
  }

  @SubscribeMessage('leaveConversation')
  async handleLeaveConversation(
    @MessageBody() data: { otherUserId: number; otherUserType: UserType },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      if (!client.userId || !client.userType) {
        throw new Error('Utilisateur non authentifié');
      }

      // Quitter la room de la conversation
      const conversationRoom = this.getConversationRoom(
        client.userId,
        client.userType,
        data.otherUserId,
        data.otherUserType,
      );
      await client.leave(conversationRoom);

      client.emit('leftConversation', { conversationRoom });
    } catch (error) {
      console.error('Erreur lors de la sortie de conversation:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur inconnue';
      client.emit('leaveConversationError', { error: errorMessage });
    }
  }

  // Méthode pour envoyer une notification de nouveau message
  sendNewMessageNotification(
    userId: number,
    userType: UserType,
    message: Message,
  ) {
    try {
      const userRoom = `user_${userId}_${userType}`;
      this.server.to(userRoom).emit('newMessageNotification', {
        message,
        unreadCount: 1, // Vous pourriez calculer le vrai nombre
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur inconnue';
      console.error(
        "Erreur lors de l'envoi de la notification de nouveau message:",
        errorMessage,
      );
    }
  }

  // Méthode pour envoyer une mise à jour du compteur de messages non lus
  sendUnreadCountUpdate(userId: number, userType: UserType, count: number) {
    try {
      const userRoom = `user_${userId}_${userType}`;
      this.server.to(userRoom).emit('unreadCountUpdate', { count });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur inconnue';
      console.error(
        "Erreur lors de l'envoi de la mise à jour du compteur:",
        errorMessage,
      );
    }
  }

  private getConversationRoom(
    userId1: number,
    userType1: UserType,
    userId2: number,
    userType2: UserType,
  ): string {
    // Créer un identifiant unique pour la conversation
    const sortedIds = [userId1, userId2].sort();
    return `conversation_${sortedIds[0]}_${userType1}_${sortedIds[1]}_${userType2}`;
  }

  private async validateToken(
    token: string,
  ): Promise<{ userId: number; userType: UserType } | null> {
    try {
      // Décoder le token pour obtenir le header
      const decodedHeader = jwt.decode(token, { complete: true });
      if (!decodedHeader || typeof decodedHeader === 'string') {
        return null;
      }

      // Debug: afficher les informations du token
      console.log('Token header:', decodedHeader.header);
      console.log('Token payload:', decodedHeader.payload);

      // Récupérer la clé publique depuis JWKS
      const key = await this.jwksClient.getSigningKey(decodedHeader.header.kid);
      const publicKey = key.getPublicKey();

      // Vérifier le token sans vérifier l'issuer et l'audience pour l'instant
      const payload = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
        // issuer: 'http://keycloak:8080/realms/MY-REALM', // Commenté pour debug
        // audience: 'account', // Commenté pour debug
      }) as JwtPayload;

      console.log('Token payload après vérification:', payload);

      // Extraire les informations utilisateur du payload
      const userId = payload.sub || payload.user_id;
      const userType = payload.realm_access?.roles?.includes('COACH')
        ? UserType.COACH
        : UserType.CLIENT;

      if (!userId || !userType) {
        console.log('userId ou userType manquant:', { userId, userType });
        return null;
      }

      return {
        userId:
          typeof userId === 'string' ? parseInt(userId, 10) : Number(userId),
        userType,
      };
    } catch (error) {
      console.error('Erreur lors de la validation du token:', error);
      return null;
    }
  }
}
