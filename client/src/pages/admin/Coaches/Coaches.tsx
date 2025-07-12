import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/axios";
import { useUserRole } from "../../../hooks/useUserRole";
import subscriptionsService from "../../../services/subscriptionsService";

interface Coach {
  coach_id: number;
  specialty: string;
  bio: string;
  firstName: string;
  lastName: string;
  email: string;
  certifications: string;
  hourly_rate: number;
  availability: string;
  photo: string;
  subscription_status: string;
}

const Coaches: React.FC = () => {
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    coach: Coach | null;
  }>({ isOpen: false, coach: null });
  const [profileModal, setProfileModal] = useState<{
    isOpen: boolean;
    coach: Coach | null;
  }>({ isOpen: false, coach: null });
  const [successModal, setSuccessModal] = useState(false);
  const { userId_entity: clientId } = useUserRole();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Convertir clientId en number pour les appels API
  const clientIdNumber = clientId ? Number(clientId) : null;

  // Récupérer le coach attribué au client (s'il existe)
  const { data: activeCoachSubscription, isLoading: isLoadingActiveCoach } =
    useQuery({
      queryKey: ["active-coach", clientIdNumber],
      queryFn: () =>
        subscriptionsService.getActiveCoachByClient(clientIdNumber!),
      enabled: !!clientIdNumber,
      staleTime: 1000 * 60 * 2, // 2 minutes
    });

  // Récupérer toutes les demandes du client pour vérifier les statuts
  const { data: clientRequests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ["client-requests", clientIdNumber],
    queryFn: () => subscriptionsService.getClientRequests(clientIdNumber!),
    enabled: !!clientIdNumber && !activeCoachSubscription, // Seulement si pas de coach actif
    staleTime: 1000 * 30, // 30 secondes
  });

  // Récupérer la liste des coachs (seulement si le client n'a pas de coach attribué)
  const {
    data: coaches,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["coaches"],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{
          data: Coach[];
          total: number;
          page: number;
          limit: number;
        }>("/coaches");
        console.log("API Response:", response.data);
        return response.data;
      } catch (err) {
        console.error("Error fetching coaches:", err);
        throw err;
      }
    },
    enabled: !activeCoachSubscription, // Ne charger la liste que si pas de coach attribué
  });
  console.log("coaches:", coaches);

  // Filtrer les coachs qui ont un abonnement actif - correction de la structure
  const activeCoaches =
    coaches?.data && Array.isArray(coaches.data)
      ? coaches.data.filter(
          (coach: Coach) => coach.subscription_status === "active"
        )
      : [];
  console.log("activeCoaches:", activeCoaches);

  // Mutation pour créer une demande de coaching
  const createRequestMutation = useMutation({
    mutationFn: (coachId: number) =>
      subscriptionsService.createCoachingRequest({
        client_id: clientIdNumber!,
        coach_id: coachId,
        subscription_type: "coaching",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      // Invalider les demandes en attente pour tous les coachs
      queryClient.invalidateQueries({ queryKey: ["pending-requests-count"] });
      // Invalider la query du coach actif pour détecter quand il accepte
      queryClient.invalidateQueries({ queryKey: ["active-coach"] });
      // Invalider les demandes du client pour mettre à jour les statuts
      queryClient.invalidateQueries({ queryKey: ["client-requests"] });
      setSuccessModal(true);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Erreur lors de l'envoi de la demande";
      alert(errorMessage);
    },
  });

  const handleSendRequest = (coachId: number) => {
    if (!clientIdNumber) {
      alert("Erreur : informations client non disponibles");
      return;
    }

    const coach = activeCoaches.find((c) => c.coach_id === coachId);
    if (coach) {
      setConfirmationModal({ isOpen: true, coach });
    }
  };

  const confirmSendRequest = () => {
    if (confirmationModal.coach) {
      createRequestMutation.mutate(confirmationModal.coach.coach_id);
      setConfirmationModal({ isOpen: false, coach: null });
    }
  };

  const cancelSendRequest = () => {
    setConfirmationModal({ isOpen: false, coach: null });
  };

  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      cancelSendRequest();
    }
  };

  const openProfileModal = (coach: Coach) => {
    setProfileModal({ isOpen: true, coach });
  };

  const closeProfileModal = () => {
    setProfileModal({ isOpen: false, coach: null });
  };

  const handleProfileModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeProfileModal();
    }
  };

  const closeSuccessModal = () => {
    setSuccessModal(false);
  };

  const handleSuccessModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeSuccessModal();
    }
  };

  const handleContactCoach = () => {
    navigate("/dashboard/chat");
  };

  const handleScheduleSession = () => {
    navigate("/dashboard/calendar");
  };

  // Fonction pour obtenir le statut d'une demande avec un coach
  const getRequestStatusForCoach = (coachId: number) => {
    if (!clientRequests) return null;

    const request = clientRequests.find((req) => req.coach_id === coachId);
    return request ? request.status : null;
  };

  // Auto-fermeture du modal de succès après 4 secondes
  useEffect(() => {
    if (successModal) {
      const timer = setTimeout(() => {
        closeSuccessModal();
      }, 4000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [successModal]);

  if (isLoadingActiveCoach || isLoading || isLoadingRequests) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">
            Erreur lors du chargement des coachs.
          </p>
        </div>
      </div>
    );
  }

  // Si le client a un coach attribué, afficher sa vue dédiée
  if (activeCoachSubscription?.coach) {
    const coach = activeCoachSubscription.coach;
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Votre Coach Personnel
          </h1>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <p className="text-green-700 dark:text-green-300 font-medium">
              ✅ Félicitations ! Votre demande a été acceptée.
            </p>
            <p className="text-green-600 dark:text-green-400 text-sm mt-1">
              Coaching actif depuis le{" "}
              {new Date(
                activeCoachSubscription.start_date!
              ).toLocaleDateString()}
              {activeCoachSubscription.end_date && (
                <>
                  {" "}
                  jusqu'au{" "}
                  {new Date(
                    activeCoachSubscription.end_date
                  ).toLocaleDateString()}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Carte du coach attribué */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <div className="h-64 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                {(coach as any).photo ? (
                  <img
                    src={(coach as any).photo}
                    alt={`${coach.firstName} ${coach.lastName}`}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <div className="text-8xl">👤</div>
                  </div>
                )}
              </div>
            </div>
            <div className="md:w-2/3 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {coach.firstName} {coach.lastName}
              </h2>
              <p className="text-orange-600 dark:text-orange-400 font-semibold text-lg mb-4">
                {coach.specialty}
              </p>

              {(coach as any).bio && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    À propos
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {(coach as any).bio}
                  </p>
                </div>
              )}

              {(coach as any).certifications && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Certifications
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {(coach as any).certifications}
                  </p>
                </div>
              )}

              {(coach as any).availability && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Disponibilités
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {(coach as any).availability}
                  </p>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={handleContactCoach}
                  className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  📞 Contacter mon coach
                </button>
                <button
                  onClick={handleScheduleSession}
                  className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  📅 Programmer une séance
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Nos Coachs Certifiés
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Découvrez nos coachs professionnels et choisissez celui qui correspond
          le mieux à vos objectifs.
        </p>
      </div>

      {activeCoaches.length === 0 ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
          <p className="text-yellow-600 dark:text-yellow-400">
            Aucun coach actif disponible pour le moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCoaches.map((coach: Coach) => (
            <div
              key={coach.coach_id}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-800 transition-shadow duration-300 overflow-hidden"
            >
              {/* Photo du coach */}
              <div className="h-48 bg-gray-100 dark:bg-gray-800 relative flex items-center justify-center">
                {coach.photo ? (
                  <img
                    src={coach.photo}
                    alt={`${coach.firstName} ${coach.lastName}`}
                    className="max-w-full max-h-full object-contain rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <div className="text-6xl">👤</div>
                  </div>
                )}
              </div>

              {/* Informations du coach */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {coach.firstName} {coach.lastName}
                </h3>

                <p className="text-orange-600 dark:text-orange-400 font-medium mb-3">
                  {coach.specialty}
                </p>

                {coach.bio && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {coach.bio}
                  </p>
                )}

                {coach.hourly_rate && (
                  <div className="mb-4">
                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {coach.hourly_rate}€/h
                    </span>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  {coach.certifications && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Certifications:
                      </span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {coach.certifications}
                      </p>
                    </div>
                  )}

                  {coach.availability && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Disponibilités:
                      </span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {coach.availability}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => openProfileModal(coach)}
                    className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Voir le profil
                  </button>

                  {(() => {
                    const requestStatus = getRequestStatusForCoach(
                      coach.coach_id
                    );

                    if (requestStatus === "pending") {
                      return (
                        <button
                          disabled
                          className="w-full bg-yellow-500 dark:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg cursor-not-allowed"
                        >
                          ⏳ Demande envoyée
                        </button>
                      );
                    }

                    if (requestStatus === "rejected") {
                      return (
                        <div>
                          <button
                            disabled
                            className="w-full bg-red-500 dark:bg-red-600 text-white font-medium py-2 px-4 rounded-lg cursor-not-allowed"
                          >
                            ❌ Demande refusée
                          </button>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                            Vous pourrez refaire une demande plus tard
                          </p>
                        </div>
                      );
                    }

                    // Aucune demande ou statut inconnu - afficher le bouton normal
                    return (
                      <button
                        onClick={() => handleSendRequest(coach.coach_id)}
                        disabled={createRequestMutation.isPending}
                        className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        {createRequestMutation.isPending
                          ? "Envoi..."
                          : "Faire une demande"}
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de détail du coach */}
      {selectedCoach && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/50 flex items-center justify-center p-4 z-[999999] backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedCoach(null);
            }
          }}
        >
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800">
            {/* Header du modal */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedCoach.firstName} {selectedCoach.lastName}
                </h2>
                <p className="text-orange-600 dark:text-orange-400 font-medium text-lg">
                  {selectedCoach.specialty}
                </p>
              </div>
              <button
                onClick={() => setSelectedCoach(null)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                ✕
              </button>
            </div>

            {/* Contenu du modal */}
            <div className="p-6 space-y-6">
              {selectedCoach.bio && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    À propos
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {selectedCoach.bio}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedCoach.certifications && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Certifications
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedCoach.certifications}
                    </p>
                  </div>
                )}

                {selectedCoach.availability && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Disponibilités
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedCoach.availability}
                    </p>
                  </div>
                )}
              </div>

              {selectedCoach.hourly_rate && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Tarif
                  </h3>
                  <p className="text-green-600 dark:text-green-400 text-2xl font-bold">
                    {selectedCoach.hourly_rate}€
                    <span className="text-base font-normal">/heure</span>
                  </p>
                </div>
              )}
            </div>

            {/* Footer avec le bouton d'action */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
              {(() => {
                const requestStatus = getRequestStatusForCoach(
                  selectedCoach.coach_id
                );

                if (requestStatus === "pending") {
                  return (
                    <button
                      disabled
                      className="w-full bg-yellow-500 dark:bg-yellow-600 text-white font-medium py-3 px-6 rounded-lg cursor-not-allowed"
                    >
                      ⏳ Demande envoyée
                    </button>
                  );
                }

                if (requestStatus === "rejected") {
                  return (
                    <div>
                      <button
                        disabled
                        className="w-full bg-red-500 dark:bg-red-600 text-white font-medium py-3 px-6 rounded-lg cursor-not-allowed"
                      >
                        ❌ Demande refusée
                      </button>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        Vous pourrez refaire une demande plus tard
                      </p>
                    </div>
                  );
                }

                return (
                  <button
                    onClick={() => handleSendRequest(selectedCoach.coach_id)}
                    disabled={createRequestMutation.isPending}
                    className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    {createRequestMutation.isPending
                      ? "Envoi..."
                      : "Faire une demande"}
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de demande */}
      {confirmationModal.isOpen && confirmationModal.coach && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/50 flex items-center justify-center p-4 z-[999999] backdrop-blur-md"
          onClick={handleModalBackdropClick}
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all border border-gray-200 dark:border-gray-800">
            {/* En-tête du modal */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Confirmer votre demande
              </h3>
            </div>

            {/* Contenu du modal */}
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Voulez-vous vraiment envoyer une demande de coaching à{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {confirmationModal.coach.firstName}{" "}
                  {confirmationModal.coach.lastName}
                </span>{" "}
                ?
              </p>

              {/* Info du coach */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  {confirmationModal.coach.photo ? (
                    <img
                      src={confirmationModal.coach.photo}
                      alt={`${confirmationModal.coach.firstName} ${confirmationModal.coach.lastName}`}
                      className="w-12 h-12 rounded-full object-contain bg-white dark:bg-gray-900"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <span className="text-lg font-semibold">
                        {confirmationModal.coach.firstName?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {confirmationModal.coach.firstName}{" "}
                      {confirmationModal.coach.lastName}
                    </p>
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      {confirmationModal.coach.specialty}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Le coach recevra votre demande et pourra l'accepter ou la
                refuser.
              </p>
            </div>

            {/* Boutons d'action */}
            <div className="flex space-x-3">
              <button
                onClick={cancelSendRequest}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors border border-gray-200 dark:border-gray-700"
              >
                Annuler
              </button>
              <button
                onClick={confirmSendRequest}
                disabled={createRequestMutation.isPending}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
              >
                {createRequestMutation.isPending ? "Envoi..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de succès */}
      {successModal && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/50 flex items-center justify-center p-4 z-[999999] backdrop-blur-md"
          onClick={handleSuccessModalBackdropClick}
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all border border-gray-200 dark:border-gray-800">
            {/* Icône de succès */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Titre */}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-4">
              Demande envoyée avec succès !
            </h3>

            {/* Message */}
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6 leading-relaxed">
              Le coach va examiner votre demande et vous recevrez une
              notification dès qu'il aura pris une décision.
            </p>

            {/* Informations supplémentaires */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Prochaines étapes
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    Votre demande est maintenant en attente. Le coach a 48h pour
                    répondre.
                  </p>
                </div>
              </div>
            </div>

            {/* Bouton d'action */}
            <div className="text-center">
              <button
                onClick={closeSuccessModal}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                Parfait !
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de profil du coach */}
      {profileModal.isOpen && profileModal.coach && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/50 flex items-start justify-center p-4 pt-24 z-[999999] backdrop-blur-md"
          onClick={handleProfileModalBackdropClick}
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-2xl transform transition-all border border-gray-200 dark:border-gray-800">
            {/* En-tête du modal avec fermeture */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 flex items-center justify-between rounded-t-xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Profil du Coach
              </h2>
              <button
                onClick={closeProfileModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Contenu du profil */}
            <div className="p-6">
              <div className="md:flex gap-6">
                {/* Photo du coach */}
                <div className="md:w-1/3 mb-6 md:mb-0">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden">
                    {profileModal.coach.photo ? (
                      <img
                        src={profileModal.coach.photo}
                        alt={`${profileModal.coach.firstName} ${profileModal.coach.lastName}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                        <div className="text-8xl">👤</div>
                      </div>
                    )}
                  </div>

                  {/* Badge de statut */}
                  <div className="mt-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Coach Actif
                    </span>
                  </div>
                </div>

                {/* Informations détaillées */}
                <div className="md:w-2/3 space-y-6">
                  {/* Nom et spécialité */}
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {profileModal.coach.firstName}{" "}
                      {profileModal.coach.lastName}
                    </h3>
                    <p className="text-xl text-orange-600 dark:text-orange-400 font-semibold">
                      Spécialiste en {profileModal.coach.specialty}
                    </p>
                  </div>

                  {/* Tarif */}
                  {profileModal.coach.hourly_rate && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center">
                        <svg
                          className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                        <div>
                          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                            Tarif horaire
                          </p>
                          <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                            {profileModal.coach.hourly_rate}€/heure
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* À propos */}
                  {profileModal.coach.bio && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <svg
                          className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        À propos de moi
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {profileModal.coach.bio}
                      </p>
                    </div>
                  )}

                  {/* Certifications */}
                  {profileModal.coach.certifications && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <svg
                          className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                          />
                        </svg>
                        Certifications
                      </h4>
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                        <p className="text-green-800 dark:text-green-300">
                          {profileModal.coach.certifications}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Disponibilités */}
                  {profileModal.coach.availability && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <svg
                          className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Disponibilités
                      </h4>
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                        <p className="text-purple-800 dark:text-purple-300">
                          {profileModal.coach.availability}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Contact */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Contact
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-700 dark:text-gray-300">
                        {profileModal.coach.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => {
                      closeProfileModal();
                      handleSendRequest(profileModal.coach!.coach_id);
                    }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                    Faire une demande de coaching
                  </button>
                  <button
                    onClick={closeProfileModal}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors border border-gray-300 dark:border-gray-600"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coaches;
