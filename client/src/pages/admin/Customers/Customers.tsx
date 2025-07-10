import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "../../../hooks/useUserRole";
import subscriptionsService from "../../../services/subscriptionsService";

const Customers: React.FC = () => {
  const { coachId, isCoach } = useUserRole();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"pending" | "active">("pending");

  // States pour les modals
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "accept" | "reject" | null;
    subscriptionId: number | null;
    clientName: string;
  }>({ isOpen: false, type: null, subscriptionId: null, clientName: "" });

  const [notificationModal, setNotificationModal] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    message: string;
  }>({ isOpen: false, type: "success", message: "" });

  const [clientProfileModal, setClientProfileModal] = useState<{
    isOpen: boolean;
    client: any;
  }>({ isOpen: false, client: null });

  // Récupérer les demandes en attente
  const { data: pendingRequests, isLoading: loadingPending } = useQuery({
    queryKey: ["pending-requests", coachId],
    queryFn: () =>
      subscriptionsService.getPendingRequestsByCoach(Number(coachId)),
    enabled: !!coachId && isCoach,
  });

  // Récupérer les clients actifs
  const { data: activeClients, isLoading: loadingActive } = useQuery({
    queryKey: ["active-clients", coachId],
    queryFn: () =>
      subscriptionsService.getActiveClientsByCoach(Number(coachId)),
    enabled: !!coachId && isCoach,
  });

  // Mutation pour accepter/refuser une demande
  const updateStatusMutation = useMutation({
    mutationFn: ({
      subscriptionId,
      status,
      start_date,
      end_date,
    }: {
      subscriptionId: number;
      status: "active" | "rejected";
      start_date?: string;
      end_date?: string;
    }) =>
      subscriptionsService.updateSubscriptionStatus(subscriptionId, {
        status,
        start_date,
        end_date,
      }),
    onSuccess: ( variables) => {
      queryClient.invalidateQueries({ queryKey: ["pending-requests"] });
      queryClient.invalidateQueries({ queryKey: ["active-clients"] });
      // Invalider le compteur de demandes en attente
      queryClient.invalidateQueries({ queryKey: ["pending-requests-count"] });
      // Invalider le cache du coach actif pour les clients
      queryClient.invalidateQueries({ queryKey: ["active-coach"] });
      // Invalider les demandes des clients pour mettre à jour les statuts
      queryClient.invalidateQueries({ queryKey: ["client-requests"] });

      // Afficher le modal de succès
      const message =
        variables.status === "active"
          ? "Demande acceptée avec succès ! Le client a été ajouté à vos clients actifs."
          : "Demande refusée. Le client en sera informé.";
      setNotificationModal({ isOpen: true, type: "success", message });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Erreur lors de la mise à jour";
      setNotificationModal({ isOpen: true, type: "error", message });
    },
  });

  const handleAcceptRequest = (subscriptionId: number, clientName: string) => {
    setConfirmModal({
      isOpen: true,
      type: "accept",
      subscriptionId,
      clientName,
    });
  };

  const handleRejectRequest = (subscriptionId: number, clientName: string) => {
    setConfirmModal({
      isOpen: true,
      type: "reject",
      subscriptionId,
      clientName,
    });
  };

  const confirmAction = () => {
    if (!confirmModal.subscriptionId) return;

    if (confirmModal.type === "accept") {
      const startDate = new Date().toISOString().split("T")[0]; // Aujourd'hui
      const endDate = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]; // +6 mois

      updateStatusMutation.mutate({
        subscriptionId: confirmModal.subscriptionId,
        status: "active",
        start_date: startDate,
        end_date: endDate,
      });
    } else if (confirmModal.type === "reject") {
      updateStatusMutation.mutate({
        subscriptionId: confirmModal.subscriptionId,
        status: "rejected",
      });
    }

    setConfirmModal({
      isOpen: false,
      type: null,
      subscriptionId: null,
      clientName: "",
    });
  };

  const cancelAction = () => {
    setConfirmModal({
      isOpen: false,
      type: null,
      subscriptionId: null,
      clientName: "",
    });
  };

  const closeNotificationModal = () => {
    setNotificationModal({ isOpen: false, type: "success", message: "" });
  };

  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      cancelAction();
    }
  };

  const handleNotificationBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeNotificationModal();
    }
  };

  const openClientProfile = (client: any) => {
    setClientProfileModal({ isOpen: true, client });
  };

  const closeClientProfile = () => {
    setClientProfileModal({ isOpen: false, client: null });
  };

  const handleClientProfileBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeClientProfile();
    }
  };

  const handleSendMessage = () => {
    closeClientProfile();
    navigate("/dashboard/chat");
  };

  // Auto-fermeture du modal de notification après 4 secondes
  useEffect(() => {
    if (notificationModal.isOpen) {
      const timer = setTimeout(() => {
        closeNotificationModal();
      }, 4000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [notificationModal.isOpen]);

  if (!isCoach) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">
            Cette page est réservée aux coachs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Gestion des Clients
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gérez vos demandes de coaching et vos clients actifs.
        </p>
      </div>

      {/* Onglets */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-800">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("pending")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "pending"
                  ? "border-orange-500 text-orange-600 dark:text-orange-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Demandes en attente ({pendingRequests?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "active"
                  ? "border-orange-500 text-orange-600 dark:text-orange-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Clients actifs ({activeClients?.length || 0})
            </button>
          </nav>
        </div>
      </div>

      {/* Contenu des onglets */}
      {activeTab === "pending" && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Demandes en attente
          </h2>

          {loadingPending ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : pendingRequests?.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Aucune demande en attente.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests?.map((request) => (
                <div
                  key={request.subscription_id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {request.client?.firstName} {request.client?.lastName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {request.client?.email}
                      </p>

                      {request.client?.goal && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Objectif :
                          </span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {request.client?.goal}
                          </p>
                        </div>
                      )}

                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Demande reçue le{" "}
                        {new Date(request.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex space-x-3 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptRequest(
                            request.subscription_id,
                            request.client?.firstName +
                              " " +
                              request.client?.lastName
                          );
                        }}
                        disabled={updateStatusMutation.isPending}
                        className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        ✅ Accepter
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRejectRequest(
                            request.subscription_id,
                            request.client?.firstName +
                              " " +
                              request.client?.lastName
                          );
                        }}
                        disabled={updateStatusMutation.isPending}
                        className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        ❌ Refuser
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "active" && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Clients actifs
          </h2>

          {loadingActive ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : activeClients?.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Aucun client actif.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeClients?.map((client) => (
                <div
                  key={client.subscription_id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {client.client?.firstName} {client.client?.lastName}
                    </h3>
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Actif
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {client.client?.email}
                  </p>

                  {client.client?.goal && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Objectif :
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {client.client?.goal}
                      </p>
                    </div>
                  )}

                  <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <div>
                      Début :{" "}
                      {client.start_date
                        ? new Date(client.start_date).toLocaleDateString()
                        : "N/A"}
                    </div>
                    <div>
                      Fin :{" "}
                      {client.end_date
                        ? new Date(client.end_date).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openClientProfile(client.client);
                      }}
                      className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Voir le profil
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Envoyer un message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal de profil du client */}
      {clientProfileModal.isOpen && clientProfileModal.client && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/50 flex items-start justify-center p-4 pt-24 z-[9999] backdrop-blur-md"
          onClick={handleClientProfileBackdropClick}
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl transform transition-all border border-gray-200 dark:border-gray-800">
            {/* En-tête du modal avec fermeture */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 flex items-center justify-between rounded-t-xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Profil du Client
              </h2>
              <button
                onClick={closeClientProfile}
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
              <div className="space-y-6">
                {/* Informations personnelles */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg
                      className="w-6 h-6 text-gray-500 dark:text-gray-400 mr-2"
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
                    Informations personnelles
                  </h3>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Prénom
                        </span>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {clientProfileModal.client.firstName}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Nom
                        </span>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {clientProfileModal.client.lastName}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Email
                        </span>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {clientProfileModal.client.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Objectif */}
                {clientProfileModal.client.goal && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
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
                      Objectif
                    </h3>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <p className="text-blue-800 dark:text-blue-300 leading-relaxed">
                        {clientProfileModal.client.goal}
                      </p>
                    </div>
                  </div>
                )}

                {/* Informations supplémentaires */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
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
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Informations complémentaires
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clientProfileModal.client.age && (
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                        <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                          Âge
                        </span>
                        <p className="text-purple-900 dark:text-purple-200 font-medium">
                          {clientProfileModal.client.age} ans
                        </p>
                      </div>
                    )}

                    {clientProfileModal.client.gender && (
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                        <span className="text-sm font-medium text-green-800 dark:text-green-300">
                          Genre
                        </span>
                        <p className="text-green-900 dark:text-green-200 font-medium">
                          {clientProfileModal.client.gender}
                        </p>
                      </div>
                    )}

                    {clientProfileModal.client.weight && (
                      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                        <span className="text-sm font-medium text-orange-800 dark:text-orange-300">
                          Poids
                        </span>
                        <p className="text-orange-900 dark:text-orange-200 font-medium">
                          {clientProfileModal.client.weight} kg
                        </p>
                      </div>
                    )}

                    {clientProfileModal.client.height && (
                      <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 border border-teal-200 dark:border-teal-800">
                        <span className="text-sm font-medium text-teal-800 dark:text-teal-300">
                          Taille
                        </span>
                        <p className="text-teal-900 dark:text-teal-200 font-medium">
                          {clientProfileModal.client.height} cm
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={handleSendMessage}
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
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      Envoyer un message
                    </button>
                    <button
                      onClick={closeClientProfile}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors border border-gray-300 dark:border-gray-600"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation */}
      {confirmModal.isOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/50 flex items-center justify-center p-4 z-[9999] backdrop-blur-md"
          onClick={handleModalBackdropClick}
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all border border-gray-200 dark:border-gray-800">
            {/* En-tête du modal */}
            <div className="flex items-center mb-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  confirmModal.type === "accept"
                    ? "bg-green-100 dark:bg-green-900/30"
                    : "bg-red-100 dark:bg-red-900/30"
                }`}
              >
                <svg
                  className={`w-6 h-6 ${
                    confirmModal.type === "accept"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {confirmModal.type === "accept" ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  )}
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {confirmModal.type === "accept"
                  ? "Accepter la demande"
                  : "Refuser la demande"}
              </h3>
            </div>

            {/* Contenu du modal */}
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {confirmModal.type === "accept"
                  ? `Voulez-vous vraiment accepter la demande de coaching de `
                  : `Voulez-vous vraiment refuser la demande de coaching de `}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {confirmModal.clientName}
                </span>{" "}
                ?
              </p>

              {confirmModal.type === "accept" && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
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
                        Informations
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                        Le coaching commencera aujourd'hui et durera 6 mois. Le
                        client sera ajouté à vos clients actifs.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {confirmModal.type === "reject" && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                  <div className="flex items-start space-x-3">
                    <svg
                      className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-300">
                        Attention
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                        Cette action est irréversible. Le client sera informé du
                        refus de sa demande.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex space-x-3">
              <button
                onClick={cancelAction}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors border border-gray-200 dark:border-gray-700"
              >
                Annuler
              </button>
              <button
                onClick={confirmAction}
                disabled={updateStatusMutation.isPending}
                className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors ${
                  confirmModal.type === "accept"
                    ? "bg-green-600 hover:bg-green-700 disabled:bg-green-400 dark:bg-green-500 dark:hover:bg-green-600"
                    : "bg-red-600 hover:bg-red-700 disabled:bg-red-400 dark:bg-red-500 dark:hover:bg-red-600"
                }`}
              >
                {updateStatusMutation.isPending
                  ? "..."
                  : confirmModal.type === "accept"
                  ? "Accepter"
                  : "Refuser"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de notification */}
      {notificationModal.isOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/50 flex items-center justify-center p-4 z-[9999] backdrop-blur-md"
          onClick={handleNotificationBackdropClick}
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all border border-gray-200 dark:border-gray-800">
            {/* Icône */}
            <div className="flex items-center justify-center mb-6">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  notificationModal.type === "success"
                    ? "bg-green-100 dark:bg-green-900/30"
                    : "bg-red-100 dark:bg-red-900/30"
                }`}
              >
                <svg
                  className={`w-8 h-8 ${
                    notificationModal.type === "success"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {notificationModal.type === "success" ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  )}
                </svg>
              </div>
            </div>

            {/* Titre */}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-4">
              {notificationModal.type === "success" ? "Succès !" : "Erreur"}
            </h3>

            {/* Message */}
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6 leading-relaxed">
              {notificationModal.message}
            </p>

            {/* Bouton d'action */}
            <div className="text-center">
              <button
                onClick={closeNotificationModal}
                className={`w-full px-6 py-3 text-white rounded-lg font-medium transition-colors ${
                  notificationModal.type === "success"
                    ? "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                    : "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                }`}
              >
                {notificationModal.type === "success" ? "Parfait !" : "Compris"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
