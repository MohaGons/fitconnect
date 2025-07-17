import { useState, useEffect } from "react";
import { FaSave } from "react-icons/fa";
import Button from "../../../../components/ui/button/Button";
import Input from "../../../../components/form/input/InputField";
import TextArea from "../../../../components/form/input/TextArea";
import Select from "../../../../components/form/Select";
import { Meal, MealType, MEAL_TYPE_OPTIONS, MealFoodCreate } from "../../types";
import nutritionService from "../../../nutrition/services/nutritionService";
import { NutritionPlan } from "../../../nutrition/types";
import MealIngredientsManager from "../MealIngredientsManager/MealIngredientsManager";

interface MealFormData {
  plan_id: number | null;
  name: string;
  meal_type?: MealType;
  calories?: number | string;
  protein?: number | string;
  carbs?: number | string;
  fat?: number | string;
  instructions?: string;
}

interface MealFormProps {
  mealData?: Meal;
  isSubmitting?: boolean;
  formError?: string;
  onSubmit: (formData: MealFormData, temporaryIngredients?: MealFoodCreate[]) => void;
  onCancel: () => void;
  mode: "add" | "edit";
}

const MealForm = ({
  mealData,
  isSubmitting = false,
  formError,
  onSubmit,
  onCancel,
  mode,
}: MealFormProps) => {
  const [formData, setFormData] = useState<MealFormData>({
    plan_id: mealData?.plan_id || null,
    name: mealData?.name || "",
    meal_type: mealData?.meal_type || undefined,
    calories: mealData?.calories || undefined,
    protein: mealData?.protein || undefined,
    carbs: mealData?.carbs || undefined,
    fat: mealData?.fat || undefined,
    instructions: mealData?.instructions || "",
  });

  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    mealData?.plan_id ? mealData.plan_id.toString() : ""
  );

  // État pour gérer les ingrédients temporaires en mode création
  const [temporaryIngredients, setTemporaryIngredients] = useState<MealFoodCreate[]>([]);

  // Charger les plans nutritionnels
  useEffect(() => {
    const loadNutritionPlans = async () => {
      try {
        setIsLoadingPlans(true);
        const response = await nutritionService.getNutritionPlans({
          page: 1,
          limit: 100, // Récupérer beaucoup de plans pour avoir le choix
        });
        setNutritionPlans(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des plans nutritionnels:', error);
      } finally {
        setIsLoadingPlans(false);
      }
    };

    loadNutritionPlans();
  }, []);

  // Créer les options pour le Select
  const planOptions = [
    { value: "", label: "Aucun plan (repas libre)" },
    ...nutritionPlans.map(plan => ({
      value: plan.plan_id.toString(),
      label: plan.name || `Plan #${plan.plan_id}` + 
        (plan.client ? ` - ${plan.client.firstName} ${plan.client.lastName}` : '') +
        (plan.coach ? ` (Coach: ${plan.coach.firstName} ${plan.coach.lastName})` : '')
    }))
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['calories', 'plan_id'].includes(name) 
        ? (value === '' ? undefined : Number(value))
        : ['protein', 'carbs', 'fat'].includes(name)
        ? (value === '' ? undefined : parseFloat(value))
        : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'plan_id') {
      setSelectedPlanId(value);
      setFormData(prev => {
        const newData = {
          ...prev,
          plan_id: value === "" ? null : parseInt(value, 10),
        };
        return newData;
      });
    } else {
      setFormData(prev => {
        const newData = {
          ...prev,
          [name]: value,
        };
        return newData;
      });
    }
  };

  const handleTextAreaChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: value,
    }));
  };

  // Gestionnaires pour les ingrédients temporaires
  const handleAddTemporaryIngredient = (ingredient: Omit<MealFoodCreate, 'meal_id'>) => {
    const newIngredient: MealFoodCreate = {
      ...ingredient,
      meal_id: 0, // Sera remplacé par l'ID du repas créé
    };
    setTemporaryIngredients(prev => [...prev, newIngredient]);
  };

  const handleUpdateTemporaryIngredient = (index: number, updates: Partial<MealFoodCreate>) => {
    setTemporaryIngredients(prev => 
      prev.map((ingredient, i) => 
        i === index ? { ...ingredient, ...updates } : ingredient
      )
    );
  };

  const handleRemoveTemporaryIngredient = (index: number) => {
    setTemporaryIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation (plan optionnel maintenant)
    // Pas de validation obligatoire sur plan_id car les repas peuvent être orphelins
    
    if (!formData.name.trim()) {
      alert('Veuillez saisir un nom pour le repas');
      return;
    }
    
    // Passer les ingrédients temporaires uniquement en mode création
    onSubmit(formData, mode === "add" ? temporaryIngredients : undefined);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
        {mode === "add" ? "Créer un nouveau repas" : "Modifier le repas"}
      </h2>

      {formError && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-3 sm:px-4 py-3 rounded mb-4 sm:mb-6 text-sm sm:text-base">
          <p>Une erreur est survenue. Veuillez réessayer.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Section 1: Plan nutritionnel et Nom du repas */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Plan nutritionnel */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm sm:text-base">
              Plan nutritionnel (optionnel)
            </label>
            {isLoadingPlans ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-500">Chargement des plans...</span>
              </div>
            ) : (
              (() => {
                return (
                  <Select
                    options={planOptions}
                    defaultValue={selectedPlanId || ""}
                    onChange={(value) => handleSelectChange("plan_id", value)}
                    placeholder="Sélectionner un plan nutritionnel"
                    className="w-full"
                  />
                );
              })()
            )}
          </div>

          {/* Nom du repas */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm sm:text-base">
              Nom du repas*
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Salade de quinoa aux légumes"
              className="w-full"
              aria-required="true"
            />
          </div>
        </div>

        {/* Section 2: Type de repas et Instructions */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Type de repas */}
          <div className="lg:col-span-1">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm sm:text-base">
              Type de repas
            </label>
            <Select
              options={MEAL_TYPE_OPTIONS}
              defaultValue={formData.meal_type || ""}
              onChange={(value) => handleSelectChange("meal_type", value)}
              placeholder="Sélectionner un type de repas"
              className="w-full"
            />
          </div>

          {/* Instructions */}
          <div className="lg:col-span-2">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm sm:text-base">
              Instructions de préparation
            </label>
            <TextArea
              value={formData.instructions || ""}
              onChange={handleTextAreaChange}
              placeholder="Instructions détaillées pour préparer ce repas..."
              className="w-full"
              rows={3}
            />
          </div>
        </div>

        {/* Section 3: Informations nutritionnelles */}
        <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg border">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Informations nutritionnelles
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Calories */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1 sm:mb-2 text-xs sm:text-sm">
                Calories (kcal)
              </label>
              <Input
                type="number"
                name="calories"
                value={formData.calories || ""}
                onChange={handleChange}
                placeholder="Ex: 350"
                className="w-full text-sm"
              />
            </div>

            {/* Protéines */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1 sm:mb-2 text-xs sm:text-sm">
                Protéines (g)
              </label>
              <Input
                type="number"
                name="protein"
                value={formData.protein ? String(formData.protein) : ""}
                onChange={handleChange}
                placeholder="Ex: 25.5"
                className="w-full text-sm"
              />
            </div>

            {/* Glucides */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1 sm:mb-2 text-xs sm:text-sm">
                Glucides (g)
              </label>
              <Input
                type="number"
                name="carbs"
                value={formData.carbs ? String(formData.carbs) : ""}
                onChange={handleChange}
                placeholder="Ex: 45.2"
                className="w-full text-sm"
              />
            </div>

            {/* Lipides */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1 sm:mb-2 text-xs sm:text-sm">
                Lipides (g)
              </label>
              <Input
                type="number"
                name="fat"
                value={formData.fat ? String(formData.fat) : ""}
                onChange={handleChange}
                placeholder="Ex: 12.8"
                className="w-full text-sm"
              />
            </div>
          </div>
        </div>

        {/* Gestionnaire d'ingrédients */}
        <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg border">
          {mode === "edit" && mealData ? (
            <MealIngredientsManager
              mealId={mealData.meal_id}
              onIngredientsChange={() => {
                // Optionnel : rafraîchir les données si nécessaire
              }}
            />
          ) : (
            <MealIngredientsManager
              mealId={null}
              temporaryIngredients={temporaryIngredients}
              onAddTemporaryIngredient={handleAddTemporaryIngredient}
              onUpdateTemporaryIngredient={handleUpdateTemporaryIngredient}
              onRemoveTemporaryIngredient={handleRemoveTemporaryIngredient}
            />
          )}
        </div>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            size="md"
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            startIcon={<FaSave />}
            disabled={isSubmitting || isLoadingPlans}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            {isSubmitting ? "Enregistrement..." : 
             mode === "add" ? "Créer le repas" : "Enregistrer"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MealForm; 