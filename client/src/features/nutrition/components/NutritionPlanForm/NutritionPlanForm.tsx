import { useState, useEffect } from "react";
import { FaSave } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import Button from "../../../../components/ui/button/Button";
import Input from "../../../../components/form/input/InputField";
import TextArea from "../../../../components/form/input/TextArea";
import Select from "../../../../components/form/Select";
import { NutritionPlan, NutritionGoal, NUTRITION_GOAL_OPTIONS } from "../../types";
import { useUserRole } from "../../../../hooks/useUserRole";
import { nutritionService } from "../../services/nutritionService";

interface NutritionPlanFormData {
  coach_id: number;
  client_id: number;
  name?: string;
  daily_calories?: number;
  goal?: NutritionGoal;
  comments?: string;
}

interface NutritionPlanFormProps {
  planData?: NutritionPlan;
  isSubmitting?: boolean;
  formError?: string;
  onSubmit: (formData: NutritionPlanFormData) => void;
  onCancel: () => void;
  mode: "add" | "edit";
}

const NutritionPlanForm = ({
  planData,
  isSubmitting = false,
  formError,
  onSubmit,
  onCancel,
  mode,
}: NutritionPlanFormProps) => {
  const { coachId, isCoach } = useUserRole();
  
  const [formData, setFormData] = useState<NutritionPlanFormData>({
    coach_id: planData?.coach_id || (coachId ? Number(coachId) : 0),
    client_id: planData?.client_id || 0,
    name: planData?.name || "",
    daily_calories: planData?.daily_calories || undefined,
    goal: planData?.goal || undefined,
    comments: planData?.comments || "",
  });

  // Récupérer les clients du coach
  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: ["coach-clients", coachId],
    queryFn: () => nutritionService.getCoachClients(Number(coachId)),
    enabled: !!coachId && isCoach,
  });

  // Mettre à jour l'ID du coach quand il est disponible
  useEffect(() => {
    if (coachId && mode === "add") {
      setFormData(prev => ({
        ...prev,
        coach_id: Number(coachId)
      }));
    }
  }, [coachId, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'daily_calories' ? Number(value) || undefined : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: name === 'client_id' ? Number(value) : value,
    }));
  };

  const handleTextAreaChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      comments: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Options pour le sélecteur de clients
  const clientOptions = clients?.map((client: { client_id: number; user_id: string; firstName?: string; lastName?: string }) => ({
    value: client.client_id.toString(),
    label: `${client.firstName || ''} ${client.lastName || ''} (${client.user_id})`
  })) || [];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {mode === "add" ? "Ajouter un plan nutritionnel" : "Modifier le plan nutritionnel"}
      </h2>

      {formError && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
          <p>Une erreur est survenue. Veuillez réessayer.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sélection du client */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Client*
          </label>
          {isLoadingClients ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-500">Chargement des clients...</span>
            </div>
          ) : (
            <Select
              options={clientOptions}
              defaultValue={formData.client_id ? formData.client_id.toString() : ""}
              onChange={(value) => handleSelectChange("client_id", value)}
              placeholder="Sélectionner un client"
              className="w-full"
              aria-required="true"
            />
          )}
          {clientOptions.length === 0 && !isLoadingClients && (
            <p className="text-sm text-gray-500 mt-1">
              Aucun client actif trouvé. Assurez-vous d'avoir des clients avec des abonnements actifs.
            </p>
          )}
        </div>

        {/* Nom du plan */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Nom du plan
          </label>
          <Input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="Ex: Plan perte de poids - Semaine 1"
            className="w-full"
          />
        </div>

        {/* Calories quotidiennes */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Calories quotidiennes
          </label>
          <Input
            type="number"
            name="daily_calories"
            value={formData.daily_calories || ""}
            onChange={handleChange}
            placeholder="Calories quotidiennes"
            className="w-full"
          />
        </div>

        {/* Objectif */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Objectif
          </label>
          <Select
            options={NUTRITION_GOAL_OPTIONS}
            defaultValue={formData.goal}
            onChange={(value) => handleSelectChange("goal", value)}
            placeholder="Sélectionner un objectif"
            className="w-full"
          />
        </div>

        {/* Commentaires */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Commentaires
          </label>
          <TextArea
            value={formData.comments}
            onChange={handleTextAreaChange}
            placeholder="Commentaires sur le plan nutritionnel"
            className="w-full"
            rows={4}
          />
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            size="md"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            startIcon={<FaSave />}
            disabled={isSubmitting || !formData.client_id}
          >
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NutritionPlanForm; 