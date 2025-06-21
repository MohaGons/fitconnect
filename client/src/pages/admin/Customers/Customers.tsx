import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserRole } from "../../../hooks/useUserRole";
import subscriptionsService from "../../../services/subscriptionsService";

const Customers: React.FC = () => {
  const { coachId, isCoach } = useUserRole();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"pending" | "active">("pending");

  // Récupérer les demandes en attente
  const { data: pendingRequests, isLoading: loadingPending } = useQuery({
    queryKey: ["pending-requests", coachId],
    queryFn: () => subscriptionsService.getPendingRequestsByCoach(coachId!),
    enabled: !!coachId && isCoach,
  });

  // Récupérer les clients actifs
  const { data: activeClients, isLoading: loadingActive } = useQuery({
    queryKey: ["active-clients", coachId],
    queryFn: () => subscriptionsService.getActiveClientsByCoach(coachId!),
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-requests"] });
      queryClient.invalidateQueries({ queryKey: ["active-clients"] });
      // Invalider le compteur de demandes en attente
      queryClient.invalidateQueries({ queryKey: ["pending-requests-count"] });
      // Invalider le cache du coach actif pour les clients
      queryClient.invalidateQueries({ queryKey: ["active-coach"] });
      // Invalider les demandes des clients pour mettre à jour les statuts
      queryClient.invalidateQueries({ queryKey: ["client-requests"] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Erreur lors de la mise à jour");
    },
  });

  const handleAcceptRequest = (subscriptionId: number) => {
    const startDate = new Date().toISOString().split("T")[0]; // Aujourd'hui
    const endDate = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0]; // +6 mois

    if (window.confirm("Voulez-vous accepter cette demande de coaching ?")) {
      updateStatusMutation.mutate({
        subscriptionId,
        status: "active",
        start_date: startDate,
        end_date: endDate,
      });
    }
  };

  const handleRejectRequest = (subscriptionId: number) => {
    if (window.confirm("Voulez-vous refuser cette demande de coaching ?")) {
      updateStatusMutation.mutate({
        subscriptionId,
        status: "rejected",
      });
    }
  };

  if (!isCoach) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Cette page est réservée aux coachs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestion des Clients
        </h1>
        <p className="text-gray-600">
          Gérez vos demandes de coaching et vos clients actifs.
        </p>
      </div>

      {/* Onglets */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("pending")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "pending"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Demandes en attente ({pendingRequests?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "active"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
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
          <h2 className="text-xl font-semibold mb-4">Demandes en attente</h2>

          {loadingPending ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : pendingRequests?.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-gray-600">Aucune demande en attente.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests?.map((request) => (
                <div
                  key={request.subscription_id}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.client?.firstName} {request.client?.lastName}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {request.client?.email}
                      </p>

                      {request.client?.goal && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-gray-700">
                            Objectif :
                          </span>
                          <p className="text-sm text-gray-600">
                            {request.client?.goal}
                          </p>
                        </div>
                      )}

                      <div className="text-sm text-gray-500">
                        Demande reçue le{" "}
                        {new Date(request.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex space-x-3 ml-4">
                      <button
                        onClick={() =>
                          handleAcceptRequest(request.subscription_id)
                        }
                        disabled={updateStatusMutation.isPending}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        ✅ Accepter
                      </button>
                      <button
                        onClick={() =>
                          handleRejectRequest(request.subscription_id)
                        }
                        disabled={updateStatusMutation.isPending}
                        className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
          <h2 className="text-xl font-semibold mb-4">Clients actifs</h2>

          {loadingActive ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : activeClients?.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-gray-600">Aucun client actif.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeClients?.map((client) => (
                <div
                  key={client.subscription_id}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {client.client?.firstName} {client.client?.lastName}
                    </h3>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Actif
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">
                    {client.client?.email}
                  </p>

                  {client.client?.goal && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        Objectif :
                      </span>
                      <p className="text-sm text-gray-600">
                        {client.client?.goal}
                      </p>
                    </div>
                  )}

                  <div className="text-sm text-gray-500 space-y-1">
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
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                      Voir le profil
                    </button>
                    <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                      Envoyer un message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Customers;
