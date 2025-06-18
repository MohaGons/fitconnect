import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Coach } from '../coaches/entities/coach.entity';
import { Client } from '../clients/entities/client.entity';
import { UserType } from './dto/create-message.dto';
import {
  Subscription,
  SubscriptionStatus,
} from '../subscriptions/entities/subscription.entity';

type ConversationItem = {
  otherUserId: number;
  otherUserName: string;
  otherUserType: UserType;
  lastMessage: Message;
  unreadCount: number;
};

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(Coach)
    private coachRepository: Repository<Coach>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    // Vérifier que les utilisateurs existent
    await this.validateUser(
      createMessageDto.sender_id,
      createMessageDto.sender_type,
    );
    await this.validateUser(
      createMessageDto.recipient_id,
      createMessageDto.recipient_type,
    );

    // Vérifier qu'il y a une relation active entre coach et client
    await this.validateCoachClientRelationship(
      createMessageDto.sender_id,
      createMessageDto.sender_type,
      createMessageDto.recipient_id,
      createMessageDto.recipient_type,
    );

    const message = new Message();
    message.content = createMessageDto.content;
    if (createMessageDto.message_type) {
      message.message_type = createMessageDto.message_type;
    }
    if (createMessageDto.attachment_url) {
      message.attachment_url = createMessageDto.attachment_url;
    }
    message.read = false;

    if (createMessageDto.sender_type === UserType.COACH) {
      message.sender_coach_id = createMessageDto.sender_id;
    } else {
      message.sender_client_id = createMessageDto.sender_id;
    }

    if (createMessageDto.recipient_type === UserType.COACH) {
      message.recipient_coach_id = createMessageDto.recipient_id;
    } else {
      message.recipient_client_id = createMessageDto.recipient_id;
    }

    return this.messagesRepository.save(message);
  }

  async findAll() {
    return this.messagesRepository.find({
      relations: [
        'sender_coach',
        'sender_client',
        'recipient_coach',
        'recipient_client',
      ],
      order: { sent_date: 'DESC' },
    });
  }

  async findOne(id: number) {
    const message = await this.messagesRepository.findOne({
      where: { message_id: id },
      relations: [
        'sender_coach',
        'sender_client',
        'recipient_coach',
        'recipient_client',
      ],
    });
    if (!message) {
      throw new NotFoundException(`Message #${id} not found`);
    }
    return message;
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const message = await this.findOne(id);
    Object.assign(message, updateMessageDto);
    return this.messagesRepository.save(message);
  }

  async remove(id: number) {
    const message = await this.findOne(id);
    return this.messagesRepository.remove(message);
  }

  async getUnreadCount(userId: number, userType: UserType) {
    const whereClause = userType === UserType.COACH
      ? { recipient_coach_id: userId, read: false }
      : { recipient_client_id: userId, read: false };

    return this.messagesRepository.count({ where: whereClause });
  }

  async findConversation(
    userId: number,
    userType: UserType,
    otherUserId?: number,
  ) {
    let whereClause: any[];

    if (otherUserId) {
      // Conversation spécifique avec un autre utilisateur
      if (userType === UserType.COACH) {
        whereClause = [
          { sender_coach_id: userId, recipient_client_id: otherUserId },
          { sender_client_id: otherUserId, recipient_coach_id: userId },
        ];
      } else {
        whereClause = [
          { sender_client_id: userId, recipient_coach_id: otherUserId },
          { sender_coach_id: otherUserId, recipient_client_id: userId },
        ];
      }
    } else {
      // Toutes les conversations de l'utilisateur
      whereClause = userType === UserType.COACH
        ? [{ sender_coach_id: userId }, { recipient_coach_id: userId }]
        : [{ sender_client_id: userId }, { recipient_client_id: userId }];
    }

    return this.messagesRepository.find({
      where: whereClause,
      relations: [
        'sender_coach',
        'sender_client',
        'recipient_coach',
        'recipient_client',
      ],
      order: {
        sent_date: 'ASC',
      },
    });
  }

  async getConversationsList(userId: number, userType: UserType) {
    if (userType === UserType.COACH) {
      const activeSubscriptions = await this.subscriptionRepository.find({
        where: {
          coach_id: userId,
          status: SubscriptionStatus.ACTIVE
        },
        relations: ['client']
      });

      const conversations: ConversationItem[] = [];

      for (const subscription of activeSubscriptions) {
        const messages = await this.findConversation(userId, userType, subscription.client_id);
        
        let lastMessage: Message;
        let unreadCount = 0;

        if (messages.length > 0) {
          lastMessage = messages[messages.length - 1];
          unreadCount = messages.filter(msg => 
            !msg.read && msg.recipient_coach_id === userId
          ).length;
        } else {
          lastMessage = {
            message_id: 0,
            content: 'Bienvenue ! Vous pouvez maintenant communiquer avec votre coach.',
            sent_date: new Date(),
            read: true,
            sender_coach_id: null,
            sender_client_id: null,
            recipient_coach_id: userId,
            recipient_client_id: subscription.client_id,
            message_type: 'system',
            attachment_url: null,
            created_at: new Date(),
            updated_at: new Date(),
            sender_coach: null,
            sender_client: null,
            recipient_coach: null,
            recipient_client: subscription.client,
          } as Message;
        }

        const conversation = {
          otherUserId: subscription.client_id,
          otherUserName: `${subscription.client.firstName} ${subscription.client.lastName}`,
          otherUserType: UserType.CLIENT,
          lastMessage,
          unreadCount
        };
        
        conversations.push(conversation);
      }

      return conversations.sort((a, b) => 
        new Date(b.lastMessage.sent_date).getTime() - new Date(a.lastMessage.sent_date).getTime()
      );

    } else {
      const activeSubscription = await this.subscriptionRepository.findOne({
        where: {
          client_id: userId,
          status: SubscriptionStatus.ACTIVE
        },
        relations: ['coach']
      });

      if (!activeSubscription) {
        return [];
      }

      const messages = await this.findConversation(userId, userType, activeSubscription.coach_id);
      
      let lastMessage: Message;
      let unreadCount = 0;

      if (messages.length > 0) {
        lastMessage = messages[messages.length - 1];
        unreadCount = messages.filter(msg => 
          !msg.read && msg.recipient_client_id === userId
        ).length;
      } else {
        lastMessage = {
          message_id: 0,
          content: 'Bienvenue ! Vous pouvez maintenant communiquer avec votre client.',
          sent_date: new Date(),
          read: true,
          sender_coach_id: activeSubscription.coach_id,
          sender_client_id: null,
          recipient_coach_id: null,
          recipient_client_id: userId,
          message_type: 'system',
          attachment_url: null,
          created_at: new Date(),
          updated_at: new Date(),
          sender_coach: activeSubscription.coach,
          sender_client: null,
          recipient_coach: null,
          recipient_client: null,
        } as Message;
      }

      const conversation = {
        otherUserId: activeSubscription.coach_id,
        otherUserName: `${activeSubscription.coach.firstName} ${activeSubscription.coach.lastName}`,
        otherUserType: UserType.COACH,
        lastMessage,
        unreadCount
      };
      
      return [conversation];
    }
  }

  async markAsRead(messageId: number, userId: number, userType: UserType) {
    const message = await this.findOne(messageId);
    
    // Vérifier que l'utilisateur est bien le destinataire
    const isRecipient = userType === UserType.COACH 
      ? message.recipient_coach_id === userId
      : message.recipient_client_id === userId;
    
    if (!isRecipient) {
      throw new ForbiddenException('Vous ne pouvez marquer comme lu que les messages qui vous sont destinés');
    }
    
    message.read = true;
    return this.messagesRepository.save(message);
  }

  async markConversationAsRead(userId: number, userType: UserType, otherUserId: number) {
    const whereClause = userType === UserType.COACH
      ? { recipient_coach_id: userId, sender_client_id: otherUserId, read: false }
      : { recipient_client_id: userId, sender_coach_id: otherUserId, read: false };
    
    await this.messagesRepository.update(whereClause, { read: true });
  }

  private async validateUser(userId: number, userType: UserType) {
    if (userType === UserType.COACH) {
      const coach = await this.coachRepository.findOne({ where: { coach_id: userId } });
      if (!coach) {
        throw new NotFoundException(`Coach with id ${userId} not found`);
      }
      return coach;
    } else {
      const client = await this.clientRepository.findOne({ where: { client_id: userId } });
      if (!client) {
        throw new NotFoundException(`Client with id ${userId} not found`);
      }
      return client;
    }
  }

  private async validateCoachClientRelationship(senderId: number, senderType: UserType, recipientId: number, recipientType: UserType) {
    // S'assurer qu'un coach communique avec un client et vice versa
    if (senderType === recipientType) {
      throw new BadRequestException('Les messages ne peuvent être échangés qu\'entre un coach et un client');
    }

    const coachId = senderType === UserType.COACH ? senderId : recipientId;
    const clientId = senderType === UserType.CLIENT ? senderId : recipientId;

    // Vérifier qu'il y a une relation active
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        coach_id: coachId,
        client_id: clientId,
        status: SubscriptionStatus.ACTIVE
      }
    });

    if (!subscription) {
      throw new ForbiddenException('Vous ne pouvez communiquer qu\'avec vos clients/coaches actifs');
    }
  }
}
