import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEventsService } from './calendar-events.service';
import { CalendarEventsController } from './calendar-events.controller';
import { CalendarEvent } from './entities/calendar-event.entity';
import { Client } from '../clients/entities/client.entity';
import { Coach } from '../coaches/entities/coach.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Program } from '../programs/entities/program.entity';
import { Meal } from '../meals/entities/meal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CalendarEvent,
      Client,
      Coach,
      Subscription,
      Program,
      Meal,
    ]),
  ],
  controllers: [CalendarEventsController],
  providers: [CalendarEventsService],
  exports: [CalendarEventsService],
})
export class CalendarEventsModule {}
