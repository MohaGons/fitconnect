export class CreateNutritionPlanDto {
  coach_id: number;
  client_id: number;
  name?: string;
  daily_calories?: number;
  goal?: string;
  comments?: string;
}
