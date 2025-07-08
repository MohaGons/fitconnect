import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { UserType } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';

@ApiTags('messages')
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau message' })
  @ApiResponse({
    status: 201,
    description: 'Message créé avec succès',
  })
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les messages' })
  @ApiResponse({
    status: 200,
    description: 'Messages récupérés avec succès',
  })
  findAll() {
    return this.messagesService.findAll();
  }

  @Get('unread/count')
  @ApiOperation({ summary: 'Récupérer le nombre de messages non lus' })
  @ApiQuery({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiQuery({ name: 'userType', enum: UserType, description: 'Type d\'utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Nombre de messages non lus récupéré avec succès',
  })
  getUnreadCount(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('userType') userType: UserType,
  ) {
    return this.messagesService.getUnreadCount(userId, userType);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Récupérer la liste des conversations' })
  @ApiQuery({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiQuery({ name: 'userType', enum: UserType, description: 'Type d\'utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Liste des conversations récupérée avec succès',
  })
  getConversationsList(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('userType') userType: UserType,
  ) {
    return this.messagesService.getConversationsList(userId, userType);
  }

  @Get('conversation/:userId')
  @ApiOperation({ summary: 'Récupérer une conversation spécifique' })
  @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiQuery({ name: 'userType', enum: UserType, description: 'Type d\'utilisateur' })
  @ApiQuery({ name: 'otherUserId', required: false, description: 'ID de l\'autre utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Conversation récupérée avec succès',
  })
  findConversation(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('userType') userType: UserType,
    @Query('otherUserId') otherUserId?: string,
  ) {
    const otherUserIdNumber = otherUserId ? parseInt(otherUserId) : undefined;
    return this.messagesService.findConversation(userId, userType, otherUserIdNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un message par ID' })
  @ApiParam({ name: 'id', description: 'ID du message' })
  @ApiResponse({
    status: 200,
    description: 'Message récupéré avec succès',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.messagesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un message' })
  @ApiParam({ name: 'id', description: 'ID du message' })
  @ApiResponse({
    status: 200,
    description: 'Message mis à jour avec succès',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Patch('conversation/read')
  @ApiOperation({ summary: 'Marquer une conversation comme lue' })
  @ApiQuery({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiQuery({ name: 'userType', enum: UserType, description: 'Type d\'utilisateur' })
  @ApiQuery({ name: 'otherUserId', description: 'ID de l\'autre utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Conversation marquée comme lue avec succès',
  })
  markConversationAsRead(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('userType') userType: UserType,
    @Query('otherUserId', ParseIntPipe) otherUserId: number,
  ) {
    return this.messagesService.markConversationAsRead(userId, userType, otherUserId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marquer un message comme lu' })
  @ApiParam({ name: 'id', description: 'ID du message' })
  @ApiQuery({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiQuery({ name: 'userType', enum: UserType, description: 'Type d\'utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Message marqué comme lu avec succès',
  })
  markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId', ParseIntPipe) userId: number,
    @Query('userType') userType: UserType,
  ) {
    return this.messagesService.markAsRead(id, userId, userType);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un message' })
  @ApiParam({ name: 'id', description: 'ID du message' })
  @ApiResponse({
    status: 204,
    description: 'Message supprimé avec succès',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.messagesService.remove(id);
  }
}
