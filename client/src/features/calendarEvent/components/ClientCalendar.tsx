import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, EventClickArg } from "@fullcalendar/core";

import { 
  Dumbbell, 
  Heart, 
  Timer, 
  Zap, 
  Calendar, 
  Clock, 
  User, 
  MessageSquare, 
  AlertCircle, 
  Loader2, 
  Utensils,
  Apple,
  Book,
  CheckCircle
} from "lucide-react";
import { useModal } from "../../../hooks/useModal";
import { useKeycloakContext } from "../../../services/useKeycloakContext";
import { CalendarApiService } from "../services/calendarApiService";
import PageMeta from "../../../components/common/PageMeta";
import { Modal } from "../../../components/ui/modal";

interface CalendarEvent extends EventInput {
  extendedProps: {
    type: 'session' | 'meal';
    status: string;
    coach_name?: string;
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

const ClientCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [clientNotes, setClientNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [clientId, setClientId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const { keycloak } = useKeycloakContext();

  const sessionIcons = {
    musculation: <Dumbbell className="w-4 h-4" />,
    cardio: <Heart className="w-4 h-4" />,
    hiit: <Zap className="w-4 h-4" />,
    yoga: <Timer className="w-4 h-4" />,
  };

  const sessionColors = {
    musculation: "#f97316",
    cardio: "#ef4444",
    hiit: "#8b5cf6",
    yoga: "#06b6d4",
  };

  const mealTypeLabels: { [key: string]: string } = {
    "petit-dejeuner": "Petit-déjeuner",
    "collation-matin": "Collation matin",
    "dejeuner": "Déjeuner",
    "collation-apres-midi": "Collation après-midi",
    "diner": "Dîner",
    "collation-soir": "Collation soir"
  };

  useEffect(() => {
    initializeClient();
  }, [keycloak]);

  // Auto-hide success messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const initializeClient = async () => {
    if (!keycloak?.tokenParsed?.sub) {
      setError("Utilisateur non authentifié");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const clientInfo = await CalendarApiService.getClientByUserId(keycloak.tokenParsed.sub);
      setClientId(clientInfo.client_id);

      await loadClientEvents(clientInfo.client_id);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const loadClientEvents = async (clientIdParam?: number) => {
    const targetClientId = clientIdParam || clientId;
    if (!targetClientId) return;

    try {
      setError(null);
      
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const endOfMonth = new Date();
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(23, 59, 59, 999);

      const apiEvents = await CalendarApiService.getClientEvents(
        targetClientId,
        CalendarApiService.formatDateForApi(startOfMonth),
        CalendarApiService.formatDateForApi(endOfMonth)
      );

      const calendarEvents: CalendarEvent[] = apiEvents.map(apiEvent => ({
        id: apiEvent.event_id.toString(),
        title: apiEvent.title,
        start: apiEvent.start_datetime,
        end: apiEvent.end_datetime || undefined,
        backgroundColor: apiEvent.type === 'session' 
          ? (sessionColors[apiEvent.session_type as keyof typeof sessionColors] || '#f97316')
          : '#10b981',
        borderColor: apiEvent.type === 'session' 
          ? (sessionColors[apiEvent.session_type as keyof typeof sessionColors] || '#f97316')
          : '#10b981',
        extendedProps: {
          type: apiEvent.type,
          status: apiEvent.status,
          coach_name: apiEvent.coach?.user_id || 'Coach',
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
      console.error('Erreur lors du chargement des événements:', error);
      setError("Erreur lors du chargement des événements");
    }
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setClientNotes(event.extendedProps.client_notes || "");
    openModal();
  };

  const handleSaveNotes = async () => {
    if (!selectedEvent) return;

    try {
      setSaving(true);
      setError(null);

      const eventId = parseInt(selectedEvent.id as string);
      
      await CalendarApiService.updateClientNotes(eventId, clientNotes);
      
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === selectedEvent.id 
            ? { ...event, extendedProps: { ...event.extendedProps, client_notes: clientNotes } }
            : event
        )
      );
      
      setSuccessMessage('Notes sauvegardées avec succès');
      closeModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError("Erreur lors de la sauvegarde des notes");
    } finally {
      setSaving(false);
    }
  };

  const refreshEvents = async () => {
    if (clientId) {
      await loadClientEvents(clientId);
      setSuccessMessage('Planning actualisé');
    }
  };

  const renderEventContent = (eventInfo: any) => {
    const isSession = eventInfo.event.extendedProps.type === 'session';
    const eventProps = eventInfo.event.extendedProps;
    
    return (
      <div className="text-white p-1.5 rounded-md text-xs">
        <div className="flex items-center gap-1">
          {isSession ? (
            sessionIcons[eventProps.session_type as keyof typeof sessionIcons] || <Dumbbell className="w-3 h-3" />
          ) : (
            <Utensils className="w-3 h-3" />
          )}
          <div className="font-medium truncate">{eventInfo.event.title}</div>
        </div>
        {eventProps.duration && (
          <div className="text-xs opacity-80 mt-0.5">{eventProps.duration}</div>
        )}
      </div>
    );
  };

  const getSessionTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      musculation: "Musculation",
      cardio: "Cardio",
      hiit: "HIIT",
      yoga: "Yoga"
    };
    return types[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { label: string; className: string } } = {
      planned: { label: "Planifié", className: "bg-blue-100 text-blue-800" },
      completed: { label: "Complété", className: "bg-green-100 text-green-800" },
      cancelled: { label: "Annulé", className: "bg-red-100 text-red-800" },
      in_progress: { label: "En cours", className: "bg-yellow-100 text-yellow-800" }
    };

    const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-800" };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
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
        title="Mon Planning | FitConnect"
        description="Consultez vos séances et repas planifiés par votre coach"
      />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mon Planning</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visualisez vos séances et repas planifiés par votre coach
        </p>
        
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={refreshEvents}
            className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
          >
            Actualiser
          </button>
          
          {events.length > 0 && (
            <span className="text-sm text-gray-500">
              {events.length} événement{events.length > 1 ? 's' : ''} planifié{events.length > 1 ? 's' : ''}
            </span>
          )}
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
              left: "prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            locales={[frLocale]}
            locale="fr"
            events={events}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            height="auto"
            eventDisplay="block"
            dayMaxEvents={3}
            moreLinkClick="popover"
          />
        </div>

        <Modal
          isOpen={isOpen}
          onClose={() => {
            if (!saving) {
              closeModal();
            }
          }}
          className="max-w-[600px] p-6"
        >
          <div className="flex flex-col">
            <div className="mb-6">
              <h5 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {selectedEvent?.title}
              </h5>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                {selectedEvent?.start && new Date(selectedEvent.start as string).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                {selectedEvent?.extendedProps.duration && (
                  <>
                    <Clock className="w-4 h-4 ml-2" />
                    {selectedEvent.extendedProps.duration}
                  </>
                )}
              </div>
              
              {/* Badges */}
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                {/* Type d'événement */}
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedEvent?.extendedProps.type === 'session' 
                    ? 'bg-orange-100 text-orange-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {selectedEvent?.extendedProps.type === 'session' ? (
                    <>
                      {sessionIcons[selectedEvent.extendedProps.session_type as keyof typeof sessionIcons] || <Dumbbell className="w-3 h-3" />}
                      {getSessionTypeLabel(selectedEvent.extendedProps.session_type || '')}
                    </>
                  ) : (
                    <>
                      <Utensils className="w-3 h-3" />
                      {mealTypeLabels[selectedEvent?.extendedProps.meal_type || ''] || 'Repas'}
                    </>
                  )}
                </span>

                {/* Badge programme/repas existant */}
                {selectedEvent?.extendedProps.program_id && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <Book className="w-3 h-3" />
                    Programme
                  </span>
                )}
                {selectedEvent?.extendedProps.meal_id && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    <Apple className="w-3 h-3" />
                    Repas planifié
                  </span>
                )}

                {/* Statut */}
                {getStatusBadge(selectedEvent?.extendedProps.status || 'planned')}
              </div>
            </div>

            {/* Informations spécifiques */}
            {selectedEvent?.extendedProps.calories && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-800">
                  🔥 {selectedEvent.extendedProps.calories} calories
                </span>
              </div>
            )}

            {/* Instructions du coach */}
            {selectedEvent?.extendedProps.coach_name && (
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-orange-800 dark:text-orange-300">
                    Instructions de votre coach
                  </span>
                </div>
                {selectedEvent.extendedProps.coach_notes ? (
                  <p className="text-sm text-orange-700 dark:text-orange-300 whitespace-pre-wrap">
                    {selectedEvent.extendedProps.coach_notes}
                  </p>
                ) : (
                  <p className="text-sm text-orange-600 dark:text-orange-400 italic">
                    Aucune instruction spécifique
                  </p>
                )}
              </div>
            )}

            {/* Notes du client */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Mes notes
              </label>
              <textarea
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
                placeholder="Ajoutez vos commentaires sur cette séance/repas..."
                rows={4}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:text-white focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-700"
                disabled={saving}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Ces notes sont privées et visibles uniquement par vous et votre coach
              </p>
            </div>

            {/* Affichage des erreurs dans le modal */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-800">{error}</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 mt-6 justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
                disabled={saving}
              >
                Fermer
              </button>
              <button
                onClick={handleSaveNotes}
                disabled={saving}
                className="px-4 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Sauvegarde...' : 'Sauvegarder mes notes'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default ClientCalendar;