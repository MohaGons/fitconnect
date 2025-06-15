import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";

import { 
  Dumbbell, 
  Heart, 
  Timer, 
  Zap, 
  MessageSquare,
  Utensils,
  Users,
  AlertCircle,
  Loader2,
  CheckCircle,
  Book,
  Apple
} from "lucide-react";
import { useModal } from "../../../hooks/useModal";
import { useKeycloakContext } from "../../../services/useKeycloakContext";
import { 
  CalendarApiService,
} from "../services/calendarApiService";
import PageMeta from "../../../components/common/PageMeta";
import { Modal } from "../../../components/ui/modal";
import { CreateEventDto, UpdateEventDto, ScheduleSessionDto, ScheduleMealDto, Program, Meal } from "../types";

interface CalendarEvent extends EventInput {
  extendedProps: {
    type: 'session' | 'meal';
    status: string;
    client_id?: number;
    client_name?: string;
    coach_notes?: string;
    client_notes?: string;
    duration?: string;
    session_type?: string;
    meal_type?: string;
    calories?: number;
    program_id?: number;
    meal_id?: number;
  };
}

interface Client {
  client_id: number;
  user_id: string;
}

const CoachCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedClient, setSelectedClient] = useState<number | ''>('');
  const [eventType, setEventType] = useState<'session' | 'meal'>('session');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [coachId, setCoachId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // États pour les séances
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [sessionDuration, setSessionDuration] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<number | ''>('');
  const [useExistingProgram, setUseExistingProgram] = useState(false);
  
  // États pour les repas
  const [mealTitle, setMealTitle] = useState("");
  const [mealType, setMealType] = useState("");
  const [mealNotes, setMealNotes] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<number | ''>('');
  const [useExistingMeal, setUseExistingMeal] = useState(false);
  const [calories, setCalories] = useState<number | ''>('');
  
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const { keycloak } = useKeycloakContext();

  const sessionTypes = {
    musculation: { label: "Musculation", icon: <Dumbbell className="w-4 h-4" />, color: "#f97316" },
    cardio: { label: "Cardio", icon: <Heart className="w-4 h-4" />, color: "#ef4444" },
    hiit: { label: "HIIT", icon: <Zap className="w-4 h-4" />, color: "#8b5cf6" },
    yoga: { label: "Yoga", icon: <Timer className="w-4 h-4" />, color: "#06b6d4" },
  };

  const mealTypes = [
    { value: "petit-dejeuner", label: "Petit-déjeuner" },
    { value: "collation-matin", label: "Collation matin" },
    { value: "dejeuner", label: "Déjeuner" },
    { value: "collation-apres-midi", label: "Collation après-midi" },
    { value: "diner", label: "Dîner" },
    { value: "collation-soir", label: "Collation soir" },
  ];

  useEffect(() => {
    if (keycloak?.tokenParsed?.sub) {
      initializeCoach();
    }
  }, [keycloak]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Charger les programmes quand le coach est initialisé
  useEffect(() => {
    if (coachId) {
      loadPrograms();
      loadMeals();
    }
  }, [coachId]);

  // Mettre à jour le programme sélectionné quand on en choisit un
  useEffect(() => {
    if (selectedProgram && programs.length > 0 && useExistingProgram) {
      const program = programs.find(p => p.program_id === Number(selectedProgram));
      if (program) {
        // Ne pas permettre de modifier le titre quand on utilise un programme existant
        setSessionTitle(program.name);
        setSessionType(program.category || '');
      }
    }
  }, [selectedProgram, programs, useExistingProgram]);

  // Mettre à jour le repas sélectionné quand on en choisit un
  useEffect(() => {
    if (selectedMeal && meals.length > 0 && useExistingMeal) {
      const meal = meals.find(m => m.meal_id === Number(selectedMeal));
      if (meal) {
        // Ne pas permettre de modifier le titre quand on utilise un repas existant
        setMealTitle(meal.name);
        setMealType(meal.meal_type || '');
        setCalories(meal.total_calories || '');
      }
    }
  }, [selectedMeal, meals, useExistingMeal]);

  const initializeCoach = async () => {
    const userId = keycloak?.tokenParsed?.sub;
    if (!userId) {
      setError("Utilisateur non authentifié");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const coachInfo = await CalendarApiService.getCoachByUserId(userId);
      setCoachId(coachInfo.coach_id);
      await loadCoachData(coachInfo.coach_id);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const loadPrograms = async () => {
    if (!coachId) return;
    try {
      const availablePrograms = await CalendarApiService.getAvailablePrograms(coachId);
      setPrograms(availablePrograms);
    } catch (error) {
      console.error('Erreur lors du chargement des programmes:', error);
    }
  };

  const loadMeals = async () => {
    if (!coachId) return;
    try {
      const availableMeals = await CalendarApiService.getAvailableMeals(coachId);
      setMeals(availableMeals);
    } catch (error) {
      console.error('Erreur lors du chargement des repas:', error);
    }
  };

  const loadCoachData = async (coachIdParam?: number) => {
    const targetCoachId = coachIdParam || coachId;
    if (!targetCoachId) return;

    try {
      setError(null);

      const coachClients = await CalendarApiService.getCoachClients(targetCoachId);
      setClients(coachClients);
      
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const endOfMonth = new Date();
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(23, 59, 59, 999);

      const apiEvents = await CalendarApiService.getCoachEvents(
        targetCoachId,
        CalendarApiService.formatDateForApi(startOfMonth),
        CalendarApiService.formatDateForApi(endOfMonth)
      );
      
      const calendarEvents: CalendarEvent[] = apiEvents.map(apiEvent => ({
        id: apiEvent.event_id.toString(),
        title: apiEvent.title,
        start: apiEvent.start_datetime,
        end: apiEvent.end_datetime || undefined,
        backgroundColor: apiEvent.type === 'session' 
          ? (sessionTypes[apiEvent.session_type as keyof typeof sessionTypes]?.color || '#f97316')
          : '#10b981',
        borderColor: apiEvent.type === 'session' 
          ? (sessionTypes[apiEvent.session_type as keyof typeof sessionTypes]?.color || '#f97316')
          : '#10b981',
        extendedProps: {
          type: apiEvent.type,
          status: apiEvent.status,
          client_id: apiEvent.client_id,
          client_name: apiEvent.client?.user_id || 'Client',
          coach_notes: apiEvent.coach_notes,
          client_notes: apiEvent.client_notes,
          duration: apiEvent.duration,
          session_type: apiEvent.session_type,
          meal_type: apiEvent.meal_type,
          calories: apiEvent.calories,
          program_id: apiEvent.program_id,
          meal_id: apiEvent.meal_id,
        },
      }));

      setEvents(calendarEvents);
    } catch (error) {
      console.error('Erreur lors du chargement des données du coach:', error);
      setError("Erreur lors du chargement des données");
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventDate(selectInfo.startStr);
    if (selectInfo.start) {
      const startTime = selectInfo.start.toTimeString().substring(0, 5);
      if (startTime !== "00:00") {
        setEventTime(startTime);
      }
    }
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    
    const eventProps = event.extendedProps;
    setEventType(eventProps.type);
    setSelectedClient(eventProps.client_id || '');
    setEventDate(event.start?.toISOString().split('T')[0] || '');
    setEventTime(event.start?.toTimeString().substring(0, 5) || '');
    
    if (eventProps.type === 'session') {
      setSessionTitle(event.title);
      setSessionType(eventProps.session_type || '');
      setSessionDuration(eventProps.duration || '');
      setSessionNotes(eventProps.coach_notes || '');
      if (eventProps.program_id) {
        setSelectedProgram(eventProps.program_id);
        setUseExistingProgram(true);
      }
    } else {
      setMealTitle(event.title);
      setMealType(eventProps.meal_type || '');
      setMealNotes(eventProps.coach_notes || '');
      setCalories(eventProps.calories || '');
      if (eventProps.meal_id) {
        setSelectedMeal(eventProps.meal_id);
        setUseExistingMeal(true);
      }
    }
    
    openModal();
  };

  const handleSaveEvent = async () => {
    if (!selectedClient || !coachId) {
      setError('Veuillez sélectionner un client');
      return;
    }

    if (!eventDate) {
      setError('Veuillez sélectionner une date');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const startDateTime = eventTime 
        ? `${eventDate}T${eventTime}:00.000Z`
        : `${eventDate}T12:00:00.000Z`;

      let newEvent;

      if (selectedEvent) {
        // Mode modification
        const updateData: UpdateEventDto = {
          title: eventType === 'session' ? sessionTitle : mealTitle,
          start_datetime: startDateTime,
          coach_notes: eventType === 'session' ? sessionNotes : mealNotes,
        };

        if (eventType === 'session') {
          updateData.session_type = sessionType;
          updateData.duration = sessionDuration;
        } else {
          updateData.meal_type = mealType;
          updateData.calories = calories || undefined;
        }

        newEvent = await CalendarApiService.updateEvent(
          parseInt(selectedEvent.id as string),
          updateData
        );

        const calendarEvent = CalendarApiService.convertApiEventToCalendarEvent(newEvent);
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === selectedEvent.id ? calendarEvent : event
          )
        );

        setSuccessMessage('Événement modifié avec succès');
      } else {
        // Mode création
        if (eventType === 'session' && useExistingProgram && selectedProgram) {
          // Utiliser scheduleSession pour planifier à partir d'un programme
          const scheduleData: ScheduleSessionDto = {
            coach_id: coachId,
            client_id: Number(selectedClient),
            program_id: Number(selectedProgram),
            start_datetime: startDateTime,
            duration: sessionDuration || undefined,
            coach_notes: sessionNotes || undefined,
            status: 'planned',
          };

          newEvent = await CalendarApiService.scheduleSession(scheduleData);
        } else if (eventType === 'meal' && useExistingMeal && selectedMeal) {
          // Utiliser scheduleMeal pour planifier à partir d'un repas
          const scheduleData: ScheduleMealDto = {
            coach_id: coachId,
            client_id: Number(selectedClient),
            meal_id: Number(selectedMeal),
            start_datetime: startDateTime,
            coach_notes: mealNotes || undefined,
            status: 'planned',
          };

          newEvent = await CalendarApiService.scheduleMeal(scheduleData);
        } else {
          // Création manuelle classique
          if (eventType === 'session' && (!sessionTitle || !sessionType)) {
            setError('Veuillez remplir le titre et le type de séance');
            setSaving(false);
            return;
          }

          if (eventType === 'meal' && (!mealTitle || !mealType)) {
            setError('Veuillez remplir le titre et le type de repas');
            setSaving(false);
            return;
          }

          const createData: CreateEventDto = {
            coach_id: coachId,
            client_id: Number(selectedClient),
            title: eventType === 'session' ? sessionTitle : mealTitle,
            type: eventType,
            start_datetime: startDateTime,
            status: 'planned',
            coach_notes: eventType === 'session' ? sessionNotes : mealNotes,
          };

          if (eventType === 'session') {
            createData.session_type = sessionType;
            createData.duration = sessionDuration;
          } else {
            createData.meal_type = mealType;
            if (calories) createData.calories = Number(calories);
          }

          newEvent = await CalendarApiService.createEvent(createData);
        }

        const calendarEvent = CalendarApiService.convertApiEventToCalendarEvent(newEvent);
        setEvents(prevEvents => [...prevEvents, calendarEvent]);

        setSuccessMessage('Événement créé avec succès');
      }

      closeModal();
      resetModalFields();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError("Erreur lors de la sauvegarde de l'événement");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await CalendarApiService.deleteEvent(parseInt(selectedEvent.id as string));

      setEvents(prevEvents => 
        prevEvents.filter(event => event.id !== selectedEvent.id)
      );

      setSuccessMessage('Événement supprimé avec succès');
      closeModal();
      resetModalFields();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError("Erreur lors de la suppression de l'événement");
    } finally {
      setSaving(false);
    }
  };

  const resetModalFields = () => {
    setSelectedEvent(null);
    setSelectedClient('');
    setEventType('session');
    setSessionTitle('');
    setSessionType('');
    setSessionDuration('');
    setSessionNotes('');
    setSelectedProgram('');
    setUseExistingProgram(false);
    setMealTitle('');
    setMealType('');
    setMealNotes('');
    setSelectedMeal('');
    setUseExistingMeal(false);
    setCalories('');
    setEventDate('');
    setEventTime('');
    setError(null);
  };

  const refreshData = async () => {
    if (coachId) {
      await Promise.all([
        loadCoachData(coachId),
        loadPrograms(),
        loadMeals()
      ]);
      setSuccessMessage('Données actualisées');
    }
  };

  const renderEventContent = (eventInfo: any) => {
    const isSession = eventInfo.event.extendedProps.type === 'session';
    const eventProps = eventInfo.event.extendedProps;
    
    return (
      <div className="text-white p-1.5 rounded-md text-xs overflow-hidden">
        <div className="flex items-center gap-1">
          {isSession ? (
            sessionTypes[eventProps.session_type as keyof typeof sessionTypes]?.icon
          ) : (
            <Utensils className="w-3 h-3" />
          )}
          <div className="font-medium truncate">{eventInfo.event.title}</div>
        </div>
        {eventProps.duration && (
          <div className="text-xs opacity-80">{eventProps.duration}</div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
          <span className="text-gray-600">Chargement de votre planning...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Planning Coach | FitConnect"
        description="Planifiez les séances et repas de vos clients"
      />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Planning Coach</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Planifiez et gérez les séances et repas de vos clients
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={refreshData}
              className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
            >
              Actualiser
            </button>
            
            {events.length > 0 && (
              <span className="text-sm text-gray-500">
                {events.length} événement{events.length > 1 ? 's' : ''} • {clients.length} client{clients.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages de statut */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">{successMessage}</span>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-orange-100 bg-white dark:border-orange-900/30 dark:bg-white/[0.03]">
        <div className="fitness-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next addEventButton",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            locales={[frLocale]}
            locale="fr"
            events={events}
            selectable={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            customButtons={{
              addEventButton: {
                text: "Planifier +",
                click: () => {
                  resetModalFields();
                  setEventDate(new Date().toISOString().split('T')[0]);
                  openModal();
                },
              },
            }}
            height="auto"
            eventDisplay="block"
            dayMaxEvents={3}
            moreLinkClick="popover"
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5, 6],
              startTime: '08:00',
              endTime: '20:00',
            }}
          />
        </div>

        <Modal
          isOpen={isOpen}
          onClose={() => {
            if (!saving) {
              closeModal();
              resetModalFields();
            }
          }}
          className="max-w-[700px] p-6"
        >
          <div className="flex flex-col">
            <div className="mb-6">
              <h5 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {selectedEvent ? "Modifier l'événement" : "Planifier un événement"}
              </h5>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-800">{error}</span>
                </div>
              </div>
            )}

            {/* Affichage spécial pour les événements existants liés à des programmes/repas */}
            {selectedEvent && (selectedEvent.extendedProps.program_id || selectedEvent.extendedProps.meal_id) && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  {selectedEvent.extendedProps.program_id ? (
                    <>
                      <Book className="w-4 h-4" />
                      <span>Cet événement est lié à un programme existant</span>
                    </>
                  ) : (
                    <>
                      <Apple className="w-4 h-4" />
                      <span>Cet événement est lié à un repas existant</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Sélection du client */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Client *
              </label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(Number(e.target.value) || '')}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-700"
                disabled={saving}
              >
                <option value="">Sélectionner un client</option>
                {clients.map(client => (
                  <option key={client.client_id} value={client.client_id}>
                    {client.user_id}
                  </option>
                ))}
              </select>
            </div>

            {/* Type d'événement */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Type d'événement *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="eventType"
                    value="session"
                    checked={eventType === 'session'}
                    onChange={(e) => setEventType(e.target.value as 'session')}
                    className="sr-only"
                    disabled={saving || !!selectedEvent}
                  />
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    eventType === 'session' 
                      ? 'border-orange-500 bg-orange-50 text-orange-700' 
                      : 'border-gray-300 text-gray-700'
                  }`}>
                    <Dumbbell className="w-4 h-4" />
                    Séance
                  </div>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="eventType"
                    value="meal"
                    checked={eventType === 'meal'}
                    onChange={(e) => setEventType(e.target.value as 'meal')}
                    className="sr-only"
                    disabled={saving || !!selectedEvent}
                  />
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    eventType === 'meal' 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-gray-300 text-gray-700'
                  }`}>
                    <Utensils className="w-4 h-4" />
                    Repas
                  </div>
                </label>
              </div>
            </div>

            {/* Champs pour les séances */}
            {eventType === 'session' && (
              <>
                {/* Toggle pour utiliser un programme existant */}
                {!selectedEvent && programs.length > 0 && (
                  <div className="mb-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useExistingProgram}
                        onChange={(e) => {
                          setUseExistingProgram(e.target.checked);
                          if (!e.target.checked) {
                            setSelectedProgram('');
                            setSessionTitle('');
                            setSessionType('');
                          }
                        }}
                        className="sr-only"
                        disabled={saving}
                      />
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                        useExistingProgram 
                          ? 'border-orange-500 bg-orange-50 text-orange-700' 
                          : 'border-gray-300 text-gray-700'
                      }`}>
                        <Book className="w-4 h-4" />
                        Utiliser un programme existant
                      </div>
                    </label>
                  </div>
                )}

                {useExistingProgram && !selectedEvent ? (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Programme *
                      </label>
                      <select
                        value={selectedProgram}
                        onChange={(e) => setSelectedProgram(Number(e.target.value) || '')}
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-700"
                        disabled={saving}
                      >
                        <option value="">Sélectionner un programme</option>
                        {programs.map(program => (
                          <option key={program.program_id} value={program.program_id}>
                            {program.name} - {program.category}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Affichage des informations du programme sélectionné */}
                    {selectedProgram && (
                      <div className="mb-4 p-4 bg-orange-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Nom de la séance
                            </label>
                            <p className="text-sm font-medium text-gray-800">{sessionTitle}</p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Type de séance
                            </label>
                            <p className="text-sm font-medium text-gray-800">
                              {sessionTypes[sessionType as keyof typeof sessionTypes]?.label || sessionType}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Durée
                      </label>
                      <input
                        type="text"
                        value={sessionDuration}
                        onChange={(e) => setSessionDuration(e.target.value)}
                        placeholder="Ex: 60 min, 1h30..."
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-700"
                        disabled={saving}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nom de la séance *
                      </label>
                      <input
                        type="text"
                        value={sessionTitle}
                        onChange={(e) => setSessionTitle(e.target.value)}
                        placeholder="Ex: Séance Jambes, HIIT Full Body..."
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-700"
                        disabled={saving}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Type de séance *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(sessionTypes).map(([key, type]) => (
                          <label key={key} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="sessionType"
                              value={key}
                              checked={sessionType === key}
                              onChange={(e) => setSessionType(e.target.value)}
                              className="sr-only"
                              disabled={saving}
                            />
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors w-full ${
                              sessionType === key 
                                ? 'border-orange-500 bg-orange-50 text-orange-700' 
                                : 'border-gray-300 text-gray-700'
                            }`}>
                              {type.icon}
                              {type.label}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Durée
                      </label>
                      <input
                        type="text"
                        value={sessionDuration}
                        onChange={(e) => setSessionDuration(e.target.value)}
                        placeholder="Ex: 60 min, 1h30..."
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-700"
                        disabled={saving}
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {/* Champs pour les repas */}
            {eventType === 'meal' && (
              <>
                {/* Toggle pour utiliser un repas existant */}
                {!selectedEvent && meals.length > 0 && (
                  <div className="mb-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useExistingMeal}
                        onChange={(e) => {
                          setUseExistingMeal(e.target.checked);
                          if (!e.target.checked) {
                            setSelectedMeal('');
                            setMealTitle('');
                            setMealType('');
                            setCalories('');
                          }
                        }}
                        className="sr-only"
                        disabled={saving}
                      />
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                        useExistingMeal 
                          ? 'border-green-500 bg-green-50 text-green-700' 
                          : 'border-gray-300 text-gray-700'
                      }`}>
                        <Apple className="w-4 h-4" />
                        Utiliser un repas existant
                      </div>
                    </label>
                  </div>
                )}

                {useExistingMeal && !selectedEvent ? (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Repas *
                      </label>
                      <select
                        value={selectedMeal}
                        onChange={(e) => setSelectedMeal(Number(e.target.value) || '')}
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-700"
                        disabled={saving}
                      >
                        <option value="">Sélectionner un repas</option>
                        {meals.map(meal => (
                          <option key={meal.meal_id} value={meal.meal_id}>
                            {meal.name} - {meal.total_calories} cal
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Affichage des informations du repas sélectionné */}
                    {selectedMeal && (
                      <div className="mb-4 p-4 bg-green-50 rounded-lg">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Nom du repas
                            </label>
                            <p className="text-sm font-medium text-gray-800">{mealTitle}</p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Type de repas
                            </label>
                            <p className="text-sm font-medium text-gray-800">
                              {mealTypes.find(t => t.value === mealType)?.label || mealType || 'Non défini'}
                            </p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Calories
                            </label>
                            <p className="text-sm font-medium text-gray-800">{calories || 'Non défini'} cal</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nom du repas *
                      </label>
                      <input
                        type="text"
                        value={mealTitle}
                        onChange={(e) => setMealTitle(e.target.value)}
                        placeholder="Ex: Salade de quinoa, Smoothie protéiné..."
                        className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-700"
                        disabled={saving}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Type de repas *
                        </label>
                        <select
                          value={mealType}
                          onChange={(e) => setMealType(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-700"
                          disabled={saving}
                        >
                          <option value="">Sélectionner</option>
                          {mealTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Calories
                        </label>
                        <input
                          type="number"
                          value={calories}
                          onChange={(e) => setCalories(Number(e.target.value) || '')}
                          placeholder="450"
                          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-700"
                          disabled={saving}
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Date et heure */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-700"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Heure (optionnel)
                </label>
                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-700"
                  disabled={saving}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Instructions pour le client
              </label>
              <textarea
                value={eventType === 'session' ? sessionNotes : mealNotes}
                onChange={(e) => eventType === 'session' ? setSessionNotes(e.target.value) : setMealNotes(e.target.value)}
                placeholder="Ajoutez des instructions ou commentaires pour votre client..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-700"
                disabled={saving}
              />
            </div>

            <div className="flex items-center gap-3 justify-between">
              <div>
                {selectedEvent && (
                  <button
                    onClick={handleDeleteEvent}
                    disabled={saving}
                    className="px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Supprimer
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    closeModal();
                    resetModalFields();
                  }}
                  disabled={saving}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveEvent}
                  disabled={saving}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving 
                    ? (selectedEvent ? 'Modification...' : 'Création...')
                    : (selectedEvent ? "Modifier" : "Planifier")
                  }
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default CoachCalendar;