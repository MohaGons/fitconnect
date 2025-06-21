import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  photo_url: string;
  subscription_status: string;
}

const Coaches: React.FC = () => {
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const { userId_entity: clientId } = useUserRole();
  const queryClient = useQueryClient();

  // Récupérer le coach attribué au client (s'il existe)
  const { data: activeCoachSubscription, isLoading: isLoadingActiveCoach } =
    useQuery({
      queryKey: ["active-coach", clientId],
      queryFn: () => subscriptionsService.getActiveCoachByClient(clientId!),
      enabled: !!clientId,
      staleTime: 1000 * 60 * 2, // 2 minutes
    });

  // Récupérer toutes les demandes du client pour vérifier les statuts
  const { data: clientRequests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ["client-requests", clientId],
    queryFn: () => subscriptionsService.getClientRequests(clientId!),
    enabled: !!clientId && !activeCoachSubscription, // Seulement si pas de coach actif
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
        const response = await apiClient.get<Coach[]>("/coaches");
        console.log("API Response:", response.data);
        return response.data;
      } catch (err) {
        console.error("Error fetching coaches:", err);
        throw err;
      }
    },
    enabled: !activeCoachSubscription, // Ne charger la liste que si pas de coach attribué
  });

  // Filtrer les coachs qui ont un abonnement actif - avec vérification de type
  const activeCoaches = Array.isArray(coaches)
    ? coaches.filter((coach) => coach.subscription_status === "active")
    : [];

  // Mutation pour créer une demande de coaching
  const createRequestMutation = useMutation({
    mutationFn: (coachId: number) =>
      subscriptionsService.createCoachingRequest({
        client_id: clientId!,
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
      alert(
        "Demande envoyée avec succès ! Le coach va examiner votre demande."
      );
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Erreur lors de l'envoi de la demande";
      alert(errorMessage);
    },
  });

  const handleSendRequest = (coachId: number) => {
    if (!clientId) {
      alert("Erreur : informations client non disponibles");
      return;
    }

    if (
      window.confirm("Voulez-vous envoyer une demande de coaching à ce coach ?")
    ) {
      createRequestMutation.mutate(coachId);
    }
  };

  // Fonction pour obtenir le statut d'une demande avec un coach
  const getRequestStatusForCoach = (coachId: number) => {
    if (!clientRequests) return null;

    const request = clientRequests.find((req) => req.coach_id === coachId);
    return request ? request.status : null;
  };

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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Erreur lors du chargement des coachs.</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Votre Coach Personnel
          </h1>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700 font-medium">
              ✅ Félicitations ! Votre demande a été acceptée.
            </p>
            <p className="text-green-600 text-sm mt-1">
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
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <div className="h-64 bg-gray-200">
                {(coach as any).photo_url ? (
                  <img
                    src={(coach as any).photo_url}
                    alt={`${coach.firstName} ${coach.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <div className="text-8xl">👤</div>
                  </div>
                )}
              </div>
            </div>
            <div className="md:w-2/3 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {coach.firstName} {coach.lastName}
              </h2>
              <p className="text-orange-600 font-semibold text-lg mb-4">
                {coach.specialty}
              </p>

              {(coach as any).bio && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">À propos</h3>
                  <p className="text-gray-600">{(coach as any).bio}</p>
                </div>
              )}

              {(coach as any).certifications && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Certifications
                  </h3>
                  <p className="text-gray-600">
                    {(coach as any).certifications}
                  </p>
                </div>
              )}

              {(coach as any).availability && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Disponibilités
                  </h3>
                  <p className="text-gray-600">{(coach as any).availability}</p>
                </div>
              )}

              <div className="flex space-x-4">
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                  📞 Contacter mon coach
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Nos Coachs Certifiés
        </h1>
        <p className="text-gray-600">
          Découvrez nos coachs professionnels et choisissez celui qui correspond
          le mieux à vos objectifs.
        </p>
      </div>

      {activeCoaches.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-600">
            Aucun coach actif disponible pour le moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCoaches.map((coach) => (
            <div
              key={coach.coach_id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              {/* Photo du coach */}
              <div className="h-48 bg-gray-200 relative">
                {coach.photo_url ? (
                  <img
                    src={coach.photo_url}
                    alt={`${coach.firstName} ${coach.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <div className="text-6xl">👤</div>
                  </div>
                )}
              </div>

              {/* Informations du coach */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {coach.firstName} {coach.lastName}
                </h3>

                <p className="text-orange-600 font-medium mb-3">
                  {coach.specialty}
                </p>

                {coach.bio && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {coach.bio}
                  </p>
                )}

                {coach.hourly_rate && (
                  <div className="mb-4">
                    <span className="text-lg font-semibold text-green-600">
                      {coach.hourly_rate}€/h
                    </span>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  {coach.certifications && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">
                        Certifications:
                      </span>
                      <p className="text-gray-600">{coach.certifications}</p>
                    </div>
                  )}

                  {coach.availability && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">
                        Disponibilités:
                      </span>
                      <p className="text-gray-600">{coach.availability}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCoach(coach)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
                          className="w-full bg-yellow-500 text-white font-medium py-2 px-4 rounded-lg cursor-not-allowed"
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
                            className="w-full bg-red-500 text-white font-medium py-2 px-4 rounded-lg cursor-not-allowed"
                          >
                            ❌ Demande refusée
                          </button>
                          <p className="text-xs text-gray-500 mt-1 text-center">
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
                        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header du modal */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCoach.firstName} {selectedCoach.lastName}
                </h2>
                <p className="text-orange-600 font-medium text-lg">
                  {selectedCoach.specialty}
                </p>
              </div>
              <button
                onClick={() => setSelectedCoach(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Contenu du modal */}
            <div className="p-6 space-y-6">
              {selectedCoach.bio && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">À propos</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedCoach.bio}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedCoach.certifications && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Certifications
                    </h3>
                    <p className="text-gray-600">
                      {selectedCoach.certifications}
                    </p>
                  </div>
                )}

                {selectedCoach.availability && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Disponibilités
                    </h3>
                    <p className="text-gray-600">
                      {selectedCoach.availability}
                    </p>
                  </div>
                )}
              </div>

              {selectedCoach.hourly_rate && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Tarif</h3>
                  <p className="text-green-600 text-2xl font-bold">
                    {selectedCoach.hourly_rate}€
                    <span className="text-base font-normal">/heure</span>
                  </p>
                </div>
              )}
            </div>

            {/* Footer avec le bouton d'action */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              {(() => {
                const requestStatus = getRequestStatusForCoach(
                  selectedCoach.coach_id
                );

                if (requestStatus === "pending") {
                  return (
                    <button
                      disabled
                      className="w-full bg-yellow-500 text-white font-medium py-3 px-6 rounded-lg cursor-not-allowed"
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
                        className="w-full bg-red-500 text-white font-medium py-3 px-6 rounded-lg cursor-not-allowed"
                      >
                        ❌ Demande refusée
                      </button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Vous pourrez refaire une demande plus tard
                      </p>
                    </div>
                  );
                }

                return (
                  <button
                    onClick={() => handleSendRequest(selectedCoach.coach_id)}
                    disabled={createRequestMutation.isPending}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
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
    </div>
  );
};

export default Coaches;
