import { useState } from "react";
import { FaSave } from "react-icons/fa";
import Button from "../../../../components/ui/button/Button";
import Input from "../../../../components/form/input/InputField";
import Select from "../../../../components/form/Select";
import { FoodItem, FoodItemCreate, FOOD_CATEGORIES } from "../../types";

interface IngredientFormData {
  name: string;
  calories?: number | string;
  protein?: number | string;
  carbs?: number | string;
  fat?: number | string;
  category?: string;
}

interface IngredientFormProps {
  ingredientData?: FoodItem;
  isSubmitting?: boolean;
  formError?: string;
  onSubmit: (formData: IngredientFormData) => void;
  onCancel: () => void;
  mode: "add" | "edit";
}

const IngredientForm = ({
  ingredientData,
  isSubmitting = false,
  formError,
  onSubmit,
  onCancel,
  mode,
}: IngredientFormProps) => {
  const [formData, setFormData] = useState<IngredientFormData>({
    name: ingredientData?.name || "",
    calories: ingredientData?.calories || undefined,
    protein: ingredientData?.protein || undefined,
    carbs: ingredientData?.carbs || undefined,
    fat: ingredientData?.fat || undefined,
    category: ingredientData?.category || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['calories'].includes(name) 
        ? (value === '' ? undefined : Number(value))
        : ['protein', 'carbs', 'fat'].includes(name)
        ? (value === '' ? undefined : parseFloat(value))
        : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      alert('Veuillez saisir un nom pour l\'ingrédient');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {mode === "add" ? "Ajouter un ingrédient" : "Modifier l'ingrédient"}
      </h2>

      {formError && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
          <p>Une erreur est survenue. Veuillez réessayer.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom de l'ingrédient */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Nom de l'ingrédient*
          </label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Pomme, Riz brun, Saumon..."
            className="w-full"
            aria-required="true"
          />
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Catégorie
          </label>
          <Select
            options={FOOD_CATEGORIES}
            defaultValue={formData.category}
            onChange={(value) => handleSelectChange("category", value)}
            placeholder="Sélectionner une catégorie"
            className="w-full"
          />
        </div>

        {/* Informations nutritionnelles (pour 100g) */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Informations nutritionnelles (pour 100g)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Calories */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Calories (kcal)
              </label>
              <Input
                type="number"
                name="calories"
                value={formData.calories ? String(formData.calories) : ""}
                onChange={handleChange}
                placeholder="Ex: 52"
                className="w-full"
              />
            </div>

            {/* Protéines */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Protéines (g)
              </label>
              <Input
                type="number"
                step="0.1"
                name="protein"
                value={formData.protein ? String(formData.protein) : ""}
                onChange={handleChange}
                placeholder="Ex: 3.2"
                className="w-full"
              />
            </div>

            {/* Glucides */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Glucides (g)
              </label>
              <Input
                type="number"
                step="0.1"
                name="carbs"
                value={formData.carbs ? String(formData.carbs) : ""}
                onChange={handleChange}
                placeholder="Ex: 14.2"
                className="w-full"
              />
            </div>

            {/* Lipides */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Lipides (g)
              </label>
              <Input
                type="number"
                step="0.1"
                name="fat"
                value={formData.fat ? String(formData.fat) : ""}
                onChange={handleChange}
                placeholder="Ex: 0.2"
                className="w-full"
              />
            </div>
          </div>
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

export default IngredientForm; 