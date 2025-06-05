export enum MealType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack',
  PRE_WORKOUT = 'pre_workout',
  POST_WORKOUT = 'post_workout',
}

export class CreateMealDto {
  plan_id: number;
  name: string;
  meal_type?: MealType | string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  instructions?: string;
}
