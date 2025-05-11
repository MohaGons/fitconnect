import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { KeycloakModule } from './keycloak/keycloak.module';
import { UsersModule } from './users/users.module';
import { CoachesModule } from './coaches/coaches.module';
import { ClientsModule } from './clients/clients.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PaymentsModule } from './payments/payments.module';
import { ProgramsModule } from './programs/programs.module';
import { ExercisesModule } from './exercises/exercises.module';
import { ProgramExercisesModule } from './program-exercises/program-exercises.module';
import { SessionsModule } from './sessions/sessions.module';
import { SessionExercisesModule } from './session-exercises/session-exercises.module';
import { NutritionPlansModule } from './nutrition-plans/nutrition-plans.module';
import { MealsModule } from './meals/meals.module';
import { FoodItemsModule } from './food-items/food-items.module';
import { MealFoodsModule } from './meal-foods/meal-foods.module';
import { MealScheduleModule } from './meal-schedule/meal-schedule.module';
import { MealTrackingModule } from './meal-tracking/meal-tracking.module';
import { RecipesModule } from './recipes/recipes.module';
import { RecipeFoodsModule } from './recipe-foods/recipe-foods.module';
import { ProgressTrackingModule } from './progress-tracking/progress-tracking.module';
import { ProgressPhotosModule } from './progress-photos/progress-photos.module';
import { MessagesModule } from './messages/messages.module';
import { ClientGoalsModule } from './client-goals/client-goals.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UserProfileModule, } from './user-profile/user-profile.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'postgres'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'fitness_platform_db'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize:
          configService.get('NODE_ENV', 'development') !== 'production',
      }),
    }),
    AuthModule,
    KeycloakModule,
    StorageModule,
    UsersModule,
    CoachesModule,
    ClientsModule,
    SubscriptionsModule,
    PaymentsModule,
    ProgramsModule,
    ExercisesModule,
    ProgramExercisesModule,
    SessionsModule,
    SessionExercisesModule,
    NutritionPlansModule,
    MealsModule,
    FoodItemsModule,
    MealFoodsModule,
    MealScheduleModule,
    MealTrackingModule,
    RecipesModule,
    RecipeFoodsModule,
    ProgressTrackingModule,
    ProgressPhotosModule,
    MessagesModule,
    ClientGoalsModule,
    NotificationsModule,
    ReviewsModule,
    UserProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
