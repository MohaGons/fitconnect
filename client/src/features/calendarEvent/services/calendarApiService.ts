import { 
  ApiCalendarEvent, 
  ClientInfo, 
  CoachInfo, 
  CreateEventDto, 
  UpdateEventDto,
  ScheduleSessionDto,
  ScheduleMealDto,
  PlanningOptions,
  Program,
  Meal
} from "../types";
import apiClient from "../../../api/axios";

export class CalendarApiService {
  
  static async getCoachByUserId(userId: string): Promise<CoachInfo> {
    const response = await apiClient.get<CoachInfo>(`/coaches/by-user-id/${userId}`);
    console.log('Coach response data:', response.data);
    return response.data;
  }

  static async getClientByUserId(userId: string): Promise<ClientInfo> {
    const response = await apiClient.get<ClientInfo>(`/clients/by-user-id/${userId}`);
    return response.data;
  }

  static async getCoachClients(coachId: number): Promise<any[]> {
    const response = await apiClient.get(`/calendar-events/coach/${coachId}/clients`);
    return response.data;
  }

  static async getCoachEvents(coachId: number, startDate?: string, endDate?: string): Promise<ApiCalendarEvent[]> {
    let url = `/calendar-events/coach/${coachId}`;
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await apiClient.get<ApiCalendarEvent[]>(url);
    return response.data;
  }

  static async getClientEvents(clientId: number, startDate?: string, endDate?: string): Promise<ApiCalendarEvent[]> {
    let url = `/calendar-events/client/${clientId}`;
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await apiClient.get<ApiCalendarEvent[]>(url);
    return response.data;
  }

  static async getEvent(eventId: number): Promise<ApiCalendarEvent> {
    const response = await apiClient.get<ApiCalendarEvent>(`/calendar-events/${eventId}`);
    return response.data;
  }

  static async createEvent(eventData: CreateEventDto): Promise<ApiCalendarEvent> {
    const response = await apiClient.post<ApiCalendarEvent>('/calendar-events', eventData);
    return response.data;
  }

  static async updateEvent(eventId: number, eventData: UpdateEventDto): Promise<ApiCalendarEvent> {
    const response = await apiClient.patch<ApiCalendarEvent>(`/calendar-events/${eventId}`, eventData);
    return response.data;
  }

  static async updateClientNotes(eventId: number, clientNotes: string): Promise<ApiCalendarEvent> {
    const response = await apiClient.patch<ApiCalendarEvent>(
      `/calendar-events/${eventId}/client-notes`,
      { client_notes: clientNotes }
    );
    return response.data;
  }

  static async deleteEvent(eventId: number): Promise<void> {
    await apiClient.delete(`/calendar-events/${eventId}`);
  }

  // Nouvelles méthodes pour la planification

  /**
   * Planifier une séance à partir d'un programme existant
   */
  static async scheduleSession(sessionData: ScheduleSessionDto): Promise<ApiCalendarEvent> {
    const response = await apiClient.post<ApiCalendarEvent>('/calendar-events/schedule/session', sessionData);
    return response.data;
  }

  /**
   * Planifier un repas à partir d'un repas existant
   */
  static async scheduleMeal(mealData: ScheduleMealDto): Promise<ApiCalendarEvent> {
    const response = await apiClient.post<ApiCalendarEvent>('/calendar-events/schedule/meal', mealData);
    return response.data;
  }

  /**
   * Récupérer toutes les options de planification pour un coach
   */
  static async getPlanningOptions(coachId: number, clientId?: number): Promise<PlanningOptions> {
    let url = `/calendar-events/planning-options/coach/${coachId}`;
    if (clientId) {
      url += `?clientId=${clientId}`;
    }
    const response = await apiClient.get<PlanningOptions>(url);
    return response.data;
  }

  /**
   * Récupérer les programmes disponibles pour un coach
   */
  static async getAvailablePrograms(coachId: number): Promise<Program[]> {
    const response = await apiClient.get<Program[]>(`/calendar-events/available-programs/coach/${coachId}`);
    return response.data;
  }

  /**
   * Récupérer les repas disponibles
   */
  static async getAvailableMeals(coachId?: number, planId?: number): Promise<Meal[]> {
    let url = '/calendar-events/available-meals';
    const params = new URLSearchParams();
    
    if (coachId) params.append('coachId', coachId.toString());
    if (planId) params.append('planId', planId.toString());
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await apiClient.get<Meal[]>(url);
    return response.data;
  }

  // Méthodes utilitaires

  static formatDateForApi(date: Date): string {
    return date.toISOString();
  }

  static formatDateRange(startDate: Date, endDate: Date) {
    return {
      startDate: this.formatDateForApi(startDate),
      endDate: this.formatDateForApi(endDate),
    };
  }

  // Conversion des données API vers le format FullCalendar
  static convertApiEventToCalendarEvent(apiEvent: ApiCalendarEvent) {
    return {
      id: apiEvent.event_id.toString(),
      title: apiEvent.title,
      start: apiEvent.start_datetime,
      end: apiEvent.end_datetime || undefined,
      backgroundColor: apiEvent.type === 'session' ? '#f97316' : '#10b981',
      borderColor: apiEvent.type === 'session' ? '#f97316' : '#10b981',
      extendedProps: {
        type: apiEvent.type,
        status: apiEvent.status,
        coach_id: apiEvent.coach_id,
        client_id: apiEvent.client_id,
        client_name: apiEvent.client?.user_id,
        coach_name: apiEvent.coach?.user_id,
        coach_notes: apiEvent.coach_notes,
        client_notes: apiEvent.client_notes,
        duration: apiEvent.duration,
        session_type: apiEvent.session_type,
        meal_type: apiEvent.meal_type,
        calories: apiEvent.calories,
        program_id: apiEvent.program_id,
        meal_id: apiEvent.meal_id,
      },
    };
  }

  /**
   * Validation des données avant envoi
   */
  static validateSessionData(data: ScheduleSessionDto): string[] {
    const errors: string[] = [];
    
    if (!data.coach_id) errors.push('ID du coach requis');
    if (!data.client_id) errors.push('ID du client requis');
    if (!data.program_id) errors.push('ID du programme requis');
    if (!data.start_datetime) errors.push('Date de début requise');
    
    return errors;
  }

  static validateMealData(data: ScheduleMealDto): string[] {
    const errors: string[] = [];
    
    if (!data.coach_id) errors.push('ID du coach requis');
    if (!data.client_id) errors.push('ID du client requis');
    if (!data.meal_id) errors.push('ID du repas requis');
    if (!data.start_datetime) errors.push('Date de début requise');
    
    return errors;
  }

  /**
   * Formatage des erreurs API
   */
  static handleApiError(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'Une erreur inattendue s\'est produite';
  }
}