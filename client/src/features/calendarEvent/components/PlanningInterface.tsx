import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Calendar, Clock, User, ChefHat, Dumbbell, Plus, Check, X, Search, Filter, RefreshCw } from 'lucide-react';
import { CalendarApiService } from '../services/calendarApiService';
import { useKeycloakContext } from '../../../services/useKeycloakContext';
import { PlanningOptions,  ScheduleSessionDto, ScheduleMealDto } from '../types';

interface PlanningInterfaceProps {
  onEventScheduled?: () => void;
  initialDate?: string;
  initialClient?: number;
}

const PlanningInterface: React.FC<PlanningInterfaceProps> = ({
  onEventScheduled,
  initialDate,
  initialClient
}) => {
  const [activeTab, setActiveTab] = useState<'session' | 'meal'>('session');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [coachId, setCoachId] = useState<number | null>(null);
  
  // Données de planification
  const [planningOptions, setPlanningOptions] = useState<PlanningOptions>({
    programs: [],
    meals: [],
    clients: []
  });

  // Filtres et recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [mealTypeFilter, setMealTypeFilter] = useState('');

  // États pour la planification de séance
  const [sessionForm, setSessionForm] = useState<Partial<ScheduleSessionDto>>({
    client_id: initialClient || undefined,
    program_id: undefined,
    start_datetime: initialDate || '',
    end_datetime: '',
    duration: '60 min',
    coach_notes: '',
  });

  // États pour la planification de repas
  const [mealForm, setMealForm] = useState<Partial<ScheduleMealDto>>({
    client_id: initialClient || undefined,
    meal_id: undefined,
    start_datetime: initialDate || '',
    meal_type: 'dejeuner',
    coach_notes: '',
  });

  const { keycloak } = useKeycloakContext();

  // Effets
  useEffect(() => {
    if (keycloak?.tokenParsed?.sub) {
      initializeCoach();
    }
  }, [keycloak]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fonctions utilitaires memoizées
  const getDifficultyColor = useMemo(() => (level: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-orange-100 text-orange-800',
      expert: 'bg-red-100 text-red-800',
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  }, []);

  const getCategoryIcon = useMemo(() => (category: string) => {
    const icons = {
      strength: '💪',
      cardio: '🏃',
      flexibility: '🧘',
      hiit: '⚡',
      functional: '🏋️',
      rehabilitation: '🏥',
    };
    return icons[category as keyof typeof icons] || '🏃';
  }, []);

  const getMealTypeLabel = useMemo(() => (type: string) => {
    const labels = {
      'petit-dejeuner': 'Petit-déjeuner',
      'collation-matin': 'Collation matin',
      'dejeuner': 'Déjeuner',
      'collation-apres-midi': 'Collation après-midi',
      'diner': 'Dîner',
      'collation-soir': 'Collation soir',
    };
    return labels[type as keyof typeof labels] || type;
  }, []);

  // Filtrage optimisé avec useMemo
  const filteredPrograms = useMemo(() => {
    return planningOptions.programs.filter(program => {
      const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (program.description && program.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = !categoryFilter || program.category === categoryFilter;
      const matchesDifficulty = !difficultyFilter || program.difficulty_level === difficultyFilter;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [planningOptions.programs, searchTerm, categoryFilter, difficultyFilter]);

  const filteredMeals = useMemo(() => {
    return planningOptions.meals.filter(meal => {
      const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMealType = !mealTypeFilter || meal.meal_type === mealTypeFilter;
      
      return matchesSearch && matchesMealType;
    });
  }, [planningOptions.meals, searchTerm, mealTypeFilter]);

  // Fonction utilitaire pour formater les dates
  const formatDateTime = useCallback((date: string, time?: string): string => {
    if (!date) return '';
    
    if (time) {
      return `${date}T${time}:00.000Z`;
    }
    
    // Si pas d'heure spécifiée, utiliser 12:00 par défaut
    return `${date}T12:00:00.000Z`;
  }, []);

  // Fonctions d'initialisation
  const initializeCoach = useCallback(async () => {
    try {
      const userId = keycloak?.tokenParsed?.sub;
      if (!userId) {
        throw new Error('Utilisateur non authentifié');
      }

      const coachInfo = await CalendarApiService.getCoachByUserId(userId);
      setCoachId(coachInfo.coach_id);
      await loadPlanningOptions(coachInfo.coach_id);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      setMessage({ text: 'Erreur lors de l\'initialisation', type: 'error' });
    }
  }, [keycloak]);

  const loadPlanningOptions = useCallback(async (coachIdParam?: number) => {
    const targetCoachId = coachIdParam || coachId;
    if (!targetCoachId) return;

    try {
      setLoading(true);
      const options = await CalendarApiService.getPlanningOptions(targetCoachId);
      setPlanningOptions(options);
    } catch (error) {
      console.error('Erreur lors du chargement des options:', error);
      setMessage({ text: 'Erreur lors du chargement des options', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [coachId]);

  // Fonctions de planification
  const scheduleSession = useCallback(async () => {
    if (!coachId || !sessionForm.client_id || !sessionForm.program_id || !sessionForm.start_datetime) {
      setMessage({ text: 'Veuillez remplir tous les champs obligatoires', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const sessionData: ScheduleSessionDto = {
        coach_id: coachId,
        client_id: sessionForm.client_id,
        program_id: sessionForm.program_id,
        start_datetime: sessionForm.start_datetime,
        end_datetime: sessionForm.end_datetime || '',
        duration: sessionForm.duration || '60 min',
        coach_notes: sessionForm.coach_notes || '',
        status: 'planned'
      };

      const errors = CalendarApiService.validateSessionData(sessionData);
      if (errors.length > 0) {
        setMessage({ text: errors.join(', '), type: 'error' });
        return;
      }

      await CalendarApiService.scheduleSession(sessionData);
      
      setMessage({ text: 'Séance planifiée avec succès !', type: 'success' });
      
      // Reset form
      setSessionForm({
        client_id: initialClient || undefined,
        program_id: undefined,
        start_datetime: initialDate || '',
        end_datetime: '',
        duration: '60 min',
        coach_notes: '',
      });

      // Notify parent component
      onEventScheduled?.();
    } catch (error) {
      console.error('Erreur lors de la planification de séance:', error);
      const errorMessage = CalendarApiService.handleApiError(error);
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [coachId, sessionForm, initialClient, initialDate, onEventScheduled]);

  const scheduleMeal = useCallback(async () => {
    if (!coachId || !mealForm.client_id || !mealForm.meal_id || !mealForm.start_datetime) {
      setMessage({ text: 'Veuillez remplir tous les champs obligatoires', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const mealData: ScheduleMealDto = {
        coach_id: coachId,
        client_id: mealForm.client_id,
        meal_id: mealForm.meal_id,
        start_datetime: mealForm.start_datetime,
        meal_type: mealForm.meal_type || 'dejeuner',
        coach_notes: mealForm.coach_notes || '',
        status: 'planned'
      };

      const errors = CalendarApiService.validateMealData(mealData);
      if (errors.length > 0) {
        setMessage({ text: errors.join(', '), type: 'error' });
        return;
      }

      await CalendarApiService.scheduleMeal(mealData);
      
      setMessage({ text: 'Repas planifié avec succès !', type: 'success' });
      
      // Reset form
      setMealForm({
        client_id: initialClient || undefined,
        meal_id: undefined,
        start_datetime: initialDate || '',
        meal_type: 'dejeuner',
        coach_notes: '',
      });

      // Notify parent component
      onEventScheduled?.();
    } catch (error) {
      console.error('Erreur lors de la planification de repas:', error);
      const errorMessage = CalendarApiService.handleApiError(error);
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [coachId, mealForm, initialClient, initialDate, onEventScheduled]);

  // Gestionnaires d'événements
  const handleDateChange = useCallback((value: string) => {
    const formattedValue = value ? formatDateTime(value) : '';
    if (activeTab === 'session') {
      setSessionForm(prev => ({ ...prev, start_datetime: formattedValue }));
    } else {
      setMealForm(prev => ({ ...prev, start_datetime: formattedValue }));
    }
  }, [activeTab, formatDateTime]);

  const handleTimeChange = useCallback((value: string) => {
    const currentDate = activeTab === 'session' 
      ? sessionForm.start_datetime?.split('T')[0] 
      : mealForm.start_datetime?.split('T')[0];
    
    if (currentDate && value) {
      const formattedValue = formatDateTime(currentDate, value);
      if (activeTab === 'session') {
        setSessionForm(prev => ({ ...prev, start_datetime: formattedValue }));
      } else {
        setMealForm(prev => ({ ...prev, start_datetime: formattedValue }));
      }
    }
  }, [activeTab, sessionForm.start_datetime, mealForm.start_datetime, formatDateTime]);

  const handleProgramSelect = useCallback((programId: number) => {
    setSessionForm(prev => ({ ...prev, program_id: programId }));
  }, []);

  const handleMealSelect = useCallback((mealId: number) => {
    setMealForm(prev => ({ ...prev, meal_id: mealId }));
  }, []);

  // Chargement initial
  if (loading && planningOptions.programs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              Planification avancée
            </h1>
            <p className="text-gray-600 mt-2">
              Sélectionnez vos programmes et repas existants pour les planifier rapidement
            </p>
          </div>
          <button
            onClick={() => loadPlanningOptions()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>
      </div>

      {/* Message de statut */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`} role="alert">
          {message.type === 'success' ? <Check className="h-5 w-5 flex-shrink-0" /> : <X className="h-5 w-5 flex-shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Onglets */}
      <div className="flex border-b mb-6" role="tablist">
        <button
          onClick={() => setActiveTab('session')}
          className={`px-6 py-3 font-medium transition-colors duration-200 ${
            activeTab === 'session'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
          role="tab"
          aria-selected={activeTab === 'session'}
          aria-controls="session-panel"
        >
          <Dumbbell className="inline-block h-5 w-5 mr-2" />
          Séances ({planningOptions.programs.length})
        </button>
        <button
          onClick={() => setActiveTab('meal')}
          className={`px-6 py-3 font-medium transition-colors duration-200 ${
            activeTab === 'meal'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
          role="tab"
          aria-selected={activeTab === 'meal'}
          aria-controls="meal-panel"
        >
          <ChefHat className="inline-block h-5 w-5 mr-2" />
          Repas ({planningOptions.meals.length})
        </button>
      </div>

      {/* Contenu des onglets */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Formulaire de planification */}
        <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {activeTab === 'session' ? 'Planifier une séance' : 'Planifier un repas'}
          </h2>
          
          <div className="space-y-4">
            {/* Sélection du client */}
            <div>
              <label htmlFor="client-select" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline-block h-4 w-4 mr-1" />
                Client *
              </label>
              <select
                id="client-select"
                value={activeTab === 'session' ? sessionForm.client_id || '' : mealForm.client_id || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : undefined;
                  if (activeTab === 'session') {
                    setSessionForm(prev => ({ ...prev, client_id: value }));
                  } else {
                    setMealForm(prev => ({ ...prev, client_id: value }));
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Sélectionner un client</option>
                {planningOptions.clients.map(client => (
                  <option key={client.client_id} value={client.client_id}>
                    {client.user_id}
                  </option>
                ))}
              </select>
            </div>

            {/* Sélection programme/repas */}
            <div>
              <label htmlFor="item-select" className="block text-sm font-medium text-gray-700 mb-2">
                {activeTab === 'session' ? 'Programme *' : 'Repas *'}
              </label>
              <select
                id="item-select"
                value={activeTab === 'session' ? sessionForm.program_id || '' : mealForm.meal_id || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : undefined;
                  if (activeTab === 'session') {
                    setSessionForm(prev => ({ ...prev, program_id: value }));
                  } else {
                    setMealForm(prev => ({ ...prev, meal_id: value }));
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">{activeTab === 'session' ? 'Sélectionner un programme' : 'Sélectionner un repas'}</option>
                {activeTab === 'session' 
                  ? filteredPrograms.map(program => (
                      <option key={program.program_id} value={program.program_id}>
                        {program.name} ({program.category})
                      </option>
                    ))
                  : filteredMeals.map(meal => (
                      <option key={meal.meal_id} value={meal.meal_id}>
                        {meal.name} {meal.calories && `(${meal.calories} kcal)`}
                      </option>
                    ))
                }
              </select>
            </div>

            {/* Date et heure */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="date-input" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline-block h-4 w-4 mr-1" />
                  Date *
                </label>
                <input
                  id="date-input"
                  type="date"
                  value={activeTab === 'session' ? sessionForm.start_datetime?.split('T')[0] || '' : mealForm.start_datetime?.split('T')[0] || ''}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="time-input" className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline-block h-4 w-4 mr-1" />
                  Heure
                </label>
                <input
                  id="time-input"
                  type="time"
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Champs spécifiques */}
            {activeTab === 'session' && (
              <div>
                <label htmlFor="duration-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Durée estimée
                </label>
                <select
                  id="duration-select"
                  value={sessionForm.duration || '60 min'}
                  onChange={(e) => setSessionForm(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="30 min">30 minutes</option>
                  <option value="45 min">45 minutes</option>
                  <option value="60 min">1 heure</option>
                  <option value="90 min">1h30</option>
                  <option value="120 min">2 heures</option>
                </select>
              </div>
            )}

            {activeTab === 'meal' && (
              <div>
                <label htmlFor="meal-type-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Type de repas
                </label>
                <select
                  id="meal-type-select"
                  value={mealForm.meal_type || 'dejeuner'}
                  onChange={(e) => setMealForm(prev => ({ ...prev, meal_type: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="petit-dejeuner">Petit-déjeuner</option>
                  <option value="collation-matin">Collation matin</option>
                  <option value="dejeuner">Déjeuner</option>
                  <option value="collation-apres-midi">Collation après-midi</option>
                  <option value="diner">Dîner</option>
                  <option value="collation-soir">Collation soir</option>
                </select>
              </div>
            )}

            {/* Notes */}
            <div>
              <label htmlFor="notes-textarea" className="block text-sm font-medium text-gray-700 mb-2">
                Notes pour le client
              </label>
              <textarea
                id="notes-textarea"
                value={activeTab === 'session' ? sessionForm.coach_notes || '' : mealForm.coach_notes || ''}
                onChange={(e) => {
                  if (activeTab === 'session') {
                    setSessionForm(prev => ({ ...prev, coach_notes: e.target.value }));
                  } else {
                    setMealForm(prev => ({ ...prev, coach_notes: e.target.value }));
                  }
                }}
                placeholder="Instructions ou conseils spéciaux..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>

            {/* Bouton de planification */}
            <button
              onClick={activeTab === 'session' ? scheduleSession : scheduleMeal}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Plus className="h-5 w-5" />
              )}
              {loading ? 'Planification...' : `Planifier ${activeTab === 'session' ? 'la séance' : 'le repas'}`}
            </button>
          </div>
        </div>

        {/* Liste des programmes/repas */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {activeTab === 'session' ? 'Programmes disponibles' : 'Repas disponibles'}
              <span className="text-sm text-gray-500 ml-2">
                ({activeTab === 'session' ? filteredPrograms.length : filteredMeals.length})
              </span>
            </h2>
          </div>

          {/* Filtres et recherche */}
          <div className="mb-4 space-y-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder={`Rechercher ${activeTab === 'session' ? 'un programme' : 'un repas'}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {activeTab === 'session' ? (
                <>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Toutes catégories</option>
                    <option value="strength">Musculation</option>
                    <option value="cardio">Cardio</option>
                    <option value="hiit">HIIT</option>
                    <option value="flexibility">Flexibilité</option>
                    <option value="functional">Fonctionnel</option>
                  </select>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Tous niveaux</option>
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
                    <option value="expert">Expert</option>
                  </select>
                </>
              ) : (
                <select
                  value={mealTypeFilter}
                  onChange={(e) => setMealTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tous types</option>
                  <option value="petit-dejeuner">Petit-déjeuner</option>
                  <option value="dejeuner">Déjeuner</option>
                  <option value="diner">Dîner</option>
                  <option value="collation-matin">Collation matin</option>
                  <option value="collation-apres-midi">Collation après-midi</option>
                  <option value="collation-soir">Collation soir</option>
                </select>
              )}
            </div>
          </div>

          {/* Grille des éléments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {activeTab === 'session' 
              ? filteredPrograms.map(program => (
                  <div 
                    key={program.program_id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                      sessionForm.program_id === program.program_id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleProgramSelect(program.program_id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleProgramSelect(program.program_id);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCategoryIcon(program.category)}</span>
                        <h3 className="font-medium text-gray-800">{program.name}</h3>
                      </div>
                    </div>
                    {program.description && (
                      <p className="text-sm text-gray-600 mb-2 overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>{program.description}</p>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(program.difficulty_level)}`}>
                        {program.difficulty_level}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {program.category}
                      </span>
                    </div>
                  </div>
                ))
              : filteredMeals.map(meal => (
                  <div 
                    key={meal.meal_id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                      mealForm.meal_id === meal.meal_id 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleMealSelect(meal.meal_id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleMealSelect(meal.meal_id);
                      }
                    }}
                  >
                    <h3 className="font-medium text-gray-800 mb-2">{meal.name}</h3>
                    {meal.instructions && (
                      <p className="text-sm text-gray-600 mb-2 overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>{meal.instructions}</p>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      {meal.calories && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                          {meal.calories} kcal
                        </span>
                      )}
                      {meal.meal_type && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {getMealTypeLabel(meal.meal_type)}
                        </span>
                      )}
                    </div>
                  </div>
                ))
            }
          </div>

          {/* Message si aucun résultat */}
          {((activeTab === 'session' && filteredPrograms.length === 0) || 
            (activeTab === 'meal' && filteredMeals.length === 0)) && (
            <div className="text-center py-8 text-gray-500">
              <Filter className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Aucun {activeTab === 'session' ? 'programme' : 'repas'} trouvé avec ces critères</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanningInterface;