import { useState } from "react";
import { FaSave } from "react-icons/fa";
import Button from "../../../../components/ui/button/Button";
import Input from "../../../../components/form/input/InputField";
import TextArea from "../../../../components/form/input/TextArea";
import Select from "../../../../components/form/Select";
import { NutritionPlan, NutritionGoal, NUTRITION_GOAL_OPTIONS } from "../../types";

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
  const [formData, setFormData] = useState<NutritionPlanFormData>({
    coach_id: planData?.coach_id || 0,
    client_id: planData?.client_id || 0,
    name: planData?.name || "",
    daily_calories: planData?.daily_calories || undefined,
    goal: planData?.goal || undefined,
    comments: planData?.comments || "",
  });

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
      [name]: value,
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
        {/* Coach ID */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            ID du coach*
          </label>
          <Input
            type="number"
            name="coach_id"
            value={formData.coach_id}
            onChange={handleChange}
            placeholder="ID du coach"
            className="w-full"
            aria-required="true"
          />
        </div>

        {/* Client ID */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            ID du client*
          </label>
          <Input
            type="number"
            name="client_id"
            value={formData.client_id}
            onChange={handleChange}
            placeholder="ID du client"
            className="w-full"
            aria-required="true"
          />
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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NutritionPlanForm; 