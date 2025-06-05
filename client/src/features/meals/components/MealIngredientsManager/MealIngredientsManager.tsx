import { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../../../../components/ui/button/Button";
import Input from "../../../../components/form/input/InputField";
import Select from "../../../../components/form/Select";
import Badge from "../../../../components/ui/badge/Badge";
import mealService from "../../services/mealService";
import { MealFood, MealFoodCreate, FOOD_UNITS, FoodItem } from "../../types";

interface MealIngredientsManagerProps {
  mealId: number | null;
  readOnly?: boolean;
  onIngredientsChange?: () => void;
  temporaryIngredients?: MealFoodCreate[];
  onAddTemporaryIngredient?: (ingredient: Omit<MealFoodCreate, 'meal_id'>) => void;
  onUpdateTemporaryIngredient?: (index: number, updates: Partial<MealFoodCreate>) => void;
  onRemoveTemporaryIngredient?: (index: number) => void;
}

interface IngredientFormData {
  food_id: number;
  quantity: number | string;
  unit: string;
}

const MealIngredientsManager = ({ 
  mealId, 
  readOnly = false,
  onIngredientsChange,
  temporaryIngredients = [],
  onAddTemporaryIngredient,
  onUpdateTemporaryIngredient,
  onRemoveTemporaryIngredient,
}: MealIngredientsManagerProps) => {
  const queryClient = useQueryClient();
  const [isAddingIngredient, setIsAddingIngredient] = useState(false);
  const [editingIngredientId, setEditingIngredientId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newIngredient, setNewIngredient] = useState<IngredientFormData>({
    food_id: 0,
    quantity: "",
    unit: "g",
  });

  // Requête pour récupérer les ingrédients du repas
  const { data: mealIngredients, isLoading: isLoadingIngredients } = useQuery({
    queryKey: ['meal-foods', mealId],
    queryFn: () => mealService.getMealFoods(mealId || 0),
    enabled: !!mealId,
  });

  // Requête pour récupérer la liste des aliments disponibles
  const { data: availableFoods } = useQuery({
    queryKey: ['food-items', searchTerm],
    queryFn: () => mealService.getFoodItems(searchTerm),
  });

  // Mutation pour ajouter un ingrédient
  const addIngredientMutation = useMutation({
    mutationFn: (data: MealFoodCreate) => mealService.addMealFood(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal-foods', mealId] });
      setIsAddingIngredient(false);
      setNewIngredient({ food_id: 0, quantity: "", unit: "g" });
      onIngredientsChange?.();
    },
  });

  // Mutation pour modifier un ingrédient
  const updateIngredientMutation = useMutation({
    mutationFn: (data: { id: number, updates: Partial<MealFoodCreate> }) => 
      mealService.updateMealFood(data.id, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal-foods', mealId] });
      setEditingIngredientId(null);
      onIngredientsChange?.();
    },
  });

  // Mutation pour supprimer un ingrédient
  const deleteIngredientMutation = useMutation({
    mutationFn: (id: number) => mealService.deleteMealFood(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal-foods', mealId] });
      onIngredientsChange?.();
    },
  });

  const handleAddIngredient = () => {
    console.log('Current newIngredient state:', newIngredient); // Debug
    
    if (!newIngredient.food_id || newIngredient.food_id === 0 || !newIngredient.quantity) {
      console.log('Validation failed:', {
        food_id: newIngredient.food_id,
        quantity: newIngredient.quantity
      }); // Debug
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    console.log('Adding ingredient:', newIngredient); // Debug

    if (mealId) {
      // Mode édition : ajouter directement à la base de données
      const ingredientData: MealFoodCreate = {
        meal_id: mealId,
        food_id: newIngredient.food_id,
        quantity: Number(newIngredient.quantity),
        unit: newIngredient.unit,
      };
      addIngredientMutation.mutate(ingredientData);
    } else {
      // Mode création : ajouter aux ingrédients temporaires
      const tempIngredient: Omit<MealFoodCreate, 'meal_id'> = {
        food_id: newIngredient.food_id,
        quantity: Number(newIngredient.quantity),
        unit: newIngredient.unit,
      };
      onAddTemporaryIngredient?.(tempIngredient);
      setIsAddingIngredient(false);
      setNewIngredient({ food_id: 0, quantity: "", unit: "g" });
    }
  };

  const handleUpdateIngredient = (ingredient: MealFood, updates: Partial<IngredientFormData>) => {
    const updateData: Partial<MealFoodCreate> = {};
    
    if (updates.quantity !== undefined) {
      updateData.quantity = Number(updates.quantity);
    }
    if (updates.unit !== undefined) {
      updateData.unit = updates.unit;
    }

    updateIngredientMutation.mutate({
      id: ingredient.meal_food_id,
      updates: updateData,
    });
  };

  const handleUpdateTemporaryIngredientItem = (index: number, updates: Partial<IngredientFormData>) => {
    const updateData: Partial<MealFoodCreate> = {};
    
    if (updates.quantity !== undefined) {
      updateData.quantity = Number(updates.quantity);
    }
    if (updates.unit !== undefined) {
      updateData.unit = updates.unit;
    }

    onUpdateTemporaryIngredient?.(index, updateData);
  };

  const handleDeleteTemporaryIngredient = (index: number) => {
    onRemoveTemporaryIngredient?.(index);
  };

  // Déterminer quelle liste d'ingrédients afficher
  const isTemporaryMode = !mealId;
  const ingredientsToDisplay = isTemporaryMode ? temporaryIngredients : mealIngredients;

  if (isTemporaryMode && (!temporaryIngredients || temporaryIngredients.length === 0)) {
    // Affichage pour mode création sans ingrédients
  }

  const foodOptions = availableFoods?.map(food => ({
    value: food.food_id.toString(),
    label: `${food.name} ${food.category ? `(${food.category})` : ''}`,
  })) || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {isTemporaryMode ? "Ingrédients du repas (à créer)" : "Ingrédients du repas"}
        </h3>
        {!readOnly && (
          <Button
            onClick={() => setIsAddingIngredient(true)}
            variant="primary"
            size="sm"
            startIcon={<FaPlus />}
            disabled={isAddingIngredient}
          >
            Ajouter un ingrédient
          </Button>
        )}
      </div>

      {/* Formulaire d'ajout d'ingrédient */}
      {isAddingIngredient && !readOnly && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Ajouter un ingrédient
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Sélection de l'aliment */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Aliment*
              </label>
              <div className="space-y-2">
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un aliment..."
                  className="w-full"
                />
                <Select
                  options={foodOptions}
                  key={`food-select-${newIngredient.food_id}`}
                  defaultValue={newIngredient.food_id > 0 ? newIngredient.food_id.toString() : ""}
                  onChange={(value) => {
                    console.log('Select changed to:', value); // Debug
                    setNewIngredient(prev => ({ 
                      ...prev, 
                      food_id: parseInt(value, 10) 
                    }));
                  }}
                  placeholder="Sélectionner un aliment"
                  className="w-full"
                />
              </div>
            </div>

            {/* Quantité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantité*
              </label>
              <Input
                type="number"
                step={0.1}
                value={newIngredient.quantity}
                onChange={(e) => setNewIngredient(prev => ({ 
                  ...prev, 
                  quantity: e.target.value 
                }))}
                placeholder="Ex: 150"
                className="w-full"
              />
            </div>

            {/* Unité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Unité*
              </label>
              <Select
                options={FOOD_UNITS}
                defaultValue={newIngredient.unit}
                onChange={(value) => setNewIngredient(prev => ({ 
                  ...prev, 
                  unit: value 
                }))}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button
              onClick={() => {
                setIsAddingIngredient(false);
                setNewIngredient({ food_id: 0, quantity: "", unit: "g" });
                setSearchTerm("");
              }}
              variant="outline"
              size="sm"
              startIcon={<FaTimes />}
            >
              Annuler
            </Button>
            <Button
              onClick={handleAddIngredient}
              variant="primary"
              size="sm"
              startIcon={<FaSave />}
              disabled={addIngredientMutation.isPending}
            >
              {addIngredientMutation.isPending ? "Ajout..." : "Ajouter"}
            </Button>
          </div>
        </div>
      )}

      {/* Liste des ingrédients */}
      <div className="space-y-3">
        {isTemporaryMode ? (
          // Mode création avec ingrédients temporaires
          temporaryIngredients.length > 0 ? (
            temporaryIngredients.map((ingredient, index) => (
              <TemporaryIngredientItem
                key={index}
                ingredient={ingredient}
                index={index}
                availableFoods={availableFoods || []}
                readOnly={readOnly}
                onUpdate={(updates: Partial<IngredientFormData>) => handleUpdateTemporaryIngredientItem(index, updates)}
                onDelete={() => handleDeleteTemporaryIngredient(index)}
              />
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="mx-auto w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium mb-1">Aucun ingrédient ajouté pour ce repas</p>
              {!readOnly && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">
                    Cliquez sur "Ajouter un ingrédient" pour commencer à composer votre repas
                  </p>
                  <p className="text-xs text-gray-400">
                    💡 Les ingrédients seront associés au repas une fois qu'il sera créé
                  </p>
                </div>
              )}
            </div>
          )
        ) : (
          // Mode édition avec ingrédients existants
          isLoadingIngredients ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-500">Chargement des ingrédients...</span>
            </div>
          ) : mealIngredients && mealIngredients.length > 0 ? (
            mealIngredients.map((ingredient) => (
              <IngredientItem
                key={ingredient.meal_food_id}
                ingredient={ingredient}
                isEditing={editingIngredientId === ingredient.meal_food_id}
                readOnly={readOnly}
                onEdit={(id) => setEditingIngredientId(id)}
                onCancelEdit={() => setEditingIngredientId(null)}
                onUpdate={(updates) => handleUpdateIngredient(ingredient, updates)}
                onDelete={(id) => deleteIngredientMutation.mutate(id)}
                isUpdating={updateIngredientMutation.isPending}
                isDeleting={deleteIngredientMutation.isPending}
              />
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="mx-auto w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium mb-1">Aucun ingrédient ajouté pour ce repas</p>
              {!readOnly && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">
                    Cliquez sur "Ajouter un ingrédient" pour commencer à composer votre repas
                  </p>
                  <p className="text-xs text-gray-400">
                    💡 Vous pouvez rechercher parmi tous les ingrédients disponibles et spécifier les quantités précises
                  </p>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

// Composant pour afficher/modifier un ingrédient
interface IngredientItemProps {
  ingredient: MealFood;
  isEditing: boolean;
  readOnly: boolean;
  onEdit: (id: number) => void;
  onCancelEdit: () => void;
  onUpdate: (updates: Partial<IngredientFormData>) => void;
  onDelete: (id: number) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

const IngredientItem = ({
  ingredient,
  isEditing,
  readOnly,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: IngredientItemProps) => {
  const [editQuantity, setEditQuantity] = useState(ingredient.quantity.toString());
  const [editUnit, setEditUnit] = useState(ingredient.unit);

  const handleSaveEdit = () => {
    onUpdate({
      quantity: editQuantity,
      unit: editUnit,
    });
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center space-x-3">
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {ingredient.food_item?.name || `Aliment #${ingredient.food_item_id}`}
            </div>
            {ingredient.food_item?.category && (
              <Badge color="info" variant="light" size="sm">
                {ingredient.food_item.category}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Quantité et unité */}
        {isEditing && !readOnly ? (
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              step={0.1}
              value={editQuantity}
              onChange={(e) => setEditQuantity(e.target.value)}
              className="w-20"
            />
            <Select
              options={FOOD_UNITS}
              defaultValue={editUnit}
              onChange={(value) => setEditUnit(value)}
              className="w-24"
            />
          </div>
        ) : (
          <div className="text-right">
            <div className="font-semibold text-gray-900 dark:text-white">
              {ingredient.quantity} {ingredient.unit}
            </div>
            {ingredient.food_item?.calories && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                ~{Math.round((ingredient.food_item.calories * ingredient.quantity) / 100)} kcal
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {!readOnly && (
          <div className="flex items-center space-x-1">
            {isEditing ? (
              <>
                <Button
                  onClick={onCancelEdit}
                  variant="outline"
                  size="sm"
                  startIcon={<FaTimes />}
                  disabled={isUpdating}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  variant="primary"
                  size="sm"
                  startIcon={<FaSave />}
                  disabled={isUpdating}
                >
                  {isUpdating ? "..." : "Sauver"}
                </Button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onEdit(ingredient.meal_food_id)}
                  className="p-1 text-gray-500 hover:text-blue-600"
                  title="Modifier"
                  disabled={isDeleting}
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(ingredient.meal_food_id)}
                  className="p-1 text-gray-500 hover:text-red-600"
                  title="Supprimer"
                  disabled={isDeleting}
                >
                  <FaTrash />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Composant pour afficher/modifier un ingrédient temporaire
interface TemporaryIngredientItemProps {
  ingredient: MealFoodCreate;
  index: number;
  availableFoods: FoodItem[];
  readOnly: boolean;
  onUpdate: (updates: Partial<IngredientFormData>) => void;
  onDelete: () => void;
}

const TemporaryIngredientItem = ({
  ingredient,
  index,
  availableFoods,
  readOnly,
  onUpdate,
  onDelete,
}: TemporaryIngredientItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editQuantity, setEditQuantity] = useState(ingredient.quantity.toString());
  const [editUnit, setEditUnit] = useState(ingredient.unit);

  const foodItem = availableFoods.find(food => food.food_id === ingredient.food_id);

  const handleSaveEdit = () => {
    onUpdate({
      quantity: editQuantity,
      unit: editUnit,
    });
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center space-x-3">
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {foodItem?.name || `Aliment #${ingredient.food_id}`}
            </div>
            {foodItem?.category && (
              <Badge color="info" variant="light" size="sm">
                {foodItem.category}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Quantité et unité */}
        {isEditing && !readOnly ? (
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              step={0.1}
              value={editQuantity}
              onChange={(e) => setEditQuantity(e.target.value)}
              className="w-20"
            />
            <Select
              options={FOOD_UNITS}
              defaultValue={editUnit}
              onChange={(value) => setEditUnit(value)}
              className="w-24"
            />
          </div>
        ) : (
          <div className="text-right">
            <div className="font-semibold text-gray-900 dark:text-white">
              {ingredient.quantity} {ingredient.unit}
            </div>
            {foodItem?.calories && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                ~{Math.round((foodItem.calories * ingredient.quantity) / 100)} kcal
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {!readOnly && (
          <div className="flex items-center space-x-1">
            {isEditing ? (
              <>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  size="sm"
                  startIcon={<FaTimes />}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  variant="primary"
                  size="sm"
                  startIcon={<FaSave />}
                >
                  Sauver
                </Button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-gray-500 hover:text-blue-600"
                  title="Modifier"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={onDelete}
                  className="p-1 text-gray-500 hover:text-red-600"
                  title="Supprimer"
                >
                  <FaTrash />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MealIngredientsManager; 