import { ReactNode, useState, useEffect, useMemo } from "react";
import {
  FaSave,
  FaPlus,
  FaMinus,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import Button from "../../../../components/ui/button/Button";
import Input from "../../../../components/form/input/InputField";
import TextArea from "../../../../components/form/input/TextArea";
import Select from "../../../../components/form/Select";
import Badge from "../../../../components/ui/badge/Badge";
import { Modal } from "../../../../components/ui/modal/index";
import {
  DifficultyLevelLabels,
  ProgramCategoryLabels,
  DifficultyLevel,
  ProgramCategory,
  ProgramFormExercise,
} from "../../types";
import exercicesService from "../../../exercices/services/exercicesService";
import { MuscleCategoryLabels } from "../../../exercices/types";
import { useCoachId } from "../../../../hooks/useCoachId";

// Type pour le formulaire adapté à l'entité
interface ProgramFormData {
  coach_id: number;
  name: string;
  description: string;
  difficulty_level: DifficultyLevel;
  category: ProgramCategory;
  exercises: {
    exercise_id: number;
    order_number: number;
    sets?: number;
    repetitions?: number;
    recommended_weight?: number;
    duration_seconds?: number;
    rest_seconds?: number;
    instructions?: string;
  }[];
}

// États initial du formulaire - coach_id sera maintenant dynamique
const getInitialFormState = (coachId: number): ProgramFormData => ({
  coach_id: coachId,
  name: "",
  description: "",
  difficulty_level: "beginner" as DifficultyLevel,
  category: "strength" as ProgramCategory,
  exercises: [],
});

interface ProgramFormProps {
  programData?: ProgramFormData;
  isSubmitting?: boolean;
  formError?: string | ReactNode;
  onSubmit: (formData: ProgramFormData) => void;
  onCancel: () => void;
  mode: "add" | "edit";
}

const ProgramForm = ({
  programData,
  isSubmitting = false,
  formError,
  onSubmit,
  onCancel,
  mode,
}: ProgramFormProps) => {
  const { coachId } = useCoachId();

  // Utiliser useMemo pour éviter la recréation à chaque render
  const initialFormState = useMemo(() => {
    const state = getInitialFormState(coachId);
    return state;
  }, [coachId]);

  // États du formulaire
  const [formData, setFormData] = useState<ProgramFormData>(
    programData || initialFormState
  );
  const [exercisesList, setExercisesList] = useState<ProgramFormExercise[]>([]);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [selectedExerciseForEdit, setSelectedExerciseForEdit] = useState<
    number | null
  >(null);

  // Log when exercise modal state changes
  useEffect(() => {}, [isExerciseModalOpen]);

  // État temporaire pour l'ajout d'exercice
  const [tempExercise, setTempExercise] = useState({
    exercise_id: 0,
    sets: 3,
    repetitions: 10,
    recommended_weight: undefined as number | undefined,
    duration_seconds: undefined as number | undefined,
    rest_seconds: undefined as number | undefined,
    instructions: "",
  });

  // Récupérer la liste des exercices disponibles
  const { data: availableExercises } = useQuery({
    queryKey: ["exercises", "all"],
    queryFn: () => exercicesService.getExercises({ page: 1, limit: 100 }),
  });

  // Synchroniser exercisesList avec formData.exercises
  useEffect(() => {
    if (formData.exercises.length > 0 && availableExercises?.data) {
      const exercisesWithDetails = formData.exercises
        .map((ex) => {
          const exerciseDetail = availableExercises.data.find(
            (e) => e.exercise_id === ex.exercise_id
          );
          return {
            exercise_id: ex.exercise_id,
            exercise_name: exerciseDetail?.name || "Exercice non trouvé",
            muscle_category: exerciseDetail?.muscle_category || "",
            order_number: ex.order_number,
            sets: ex.sets,
            repetitions: ex.repetitions,
            recommended_weight: ex.recommended_weight,
            duration_seconds: ex.duration_seconds,
            rest_seconds: ex.rest_seconds,
            instructions: ex.instructions,
          };
        })
        .sort((a, b) => a.order_number - b.order_number);
      setExercisesList(exercisesWithDetails);
    }
  }, [formData.exercises, availableExercises]);

  // Mise à jour des données du programme au changement de props
  useEffect(() => {
    if (programData) {
      setFormData(programData);
    } else if (mode === "add") {
      // Seulement réinitialiser en mode ajout si pas de programData
      setFormData(initialFormState);
    }
  }, [programData, mode, initialFormState]);

  // Gestionnaires de changement pour les champs simples
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTextAreaChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fonctions pour réorganiser les exercices
  const moveExercise = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= exercisesList.length) return;

    const updatedList = [...exercisesList];
    [updatedList[index], updatedList[newIndex]] = [
      updatedList[newIndex],
      updatedList[index],
    ];

    // Mettre à jour les order_number
    const reorderedList = updatedList.map((item, idx) => ({
      ...item,
      order_number: idx + 1,
    }));

    setExercisesList(reorderedList);

    // Mettre à jour formData
    setFormData((prev) => ({
      ...prev,
      exercises: reorderedList.map((item) => ({
        exercise_id: item.exercise_id,
        order_number: item.order_number,
        sets: item.sets,
        repetitions: item.repetitions,
        recommended_weight: item.recommended_weight,
        duration_seconds: item.duration_seconds,
        rest_seconds: item.rest_seconds,
        instructions: item.instructions,
      })),
    }));
  };

  // Ajouter un exercice
  const handleAddExercise = () => {
    if (!tempExercise.exercise_id || tempExercise.exercise_id === 0) {
      return;
    }

    const exerciseDetail = availableExercises?.data.find(
      (e) => e.exercise_id === tempExercise.exercise_id
    );
    if (!exerciseDetail) {
      return;
    }

    const newExercise: ProgramFormExercise = {
      exercise_id: tempExercise.exercise_id,
      exercise_name: exerciseDetail.name,
      muscle_category: exerciseDetail.muscle_category,
      order_number: exercisesList.length + 1,
      sets: tempExercise.sets,
      repetitions: tempExercise.repetitions,
      recommended_weight: tempExercise.recommended_weight,
      duration_seconds: tempExercise.duration_seconds,
      rest_seconds: tempExercise.rest_seconds,
      instructions: tempExercise.instructions,
    };

    const updatedList = [...exercisesList, newExercise];
    setExercisesList(updatedList);

    // Mettre à jour formData
    setFormData((prev) => ({
      ...prev,
      exercises: updatedList.map((item) => ({
        exercise_id: item.exercise_id,
        order_number: item.order_number,
        sets: item.sets,
        repetitions: item.repetitions,
        recommended_weight: item.recommended_weight,
        duration_seconds: item.duration_seconds,
        rest_seconds: item.rest_seconds,
        instructions: item.instructions,
      })),
    }));

    // Reset tempExercise
    setTempExercise({
      exercise_id: 0,
      sets: 3,
      repetitions: 10,
      recommended_weight: undefined,
      duration_seconds: undefined,
      rest_seconds: undefined,
      instructions: "",
    });

    setIsExerciseModalOpen(false);
  };

  // Modifier un exercice existant
  const handleEditExercise = (index: number) => {
    const exercise = exercisesList[index];
    setTempExercise({
      exercise_id: exercise.exercise_id,
      sets: exercise.sets || 3,
      repetitions: exercise.repetitions || 10,
      recommended_weight: exercise.recommended_weight,
      duration_seconds: exercise.duration_seconds,
      rest_seconds: exercise.rest_seconds,
      instructions: exercise.instructions || "",
    });
    setSelectedExerciseForEdit(index);
    setIsExerciseModalOpen(true);
  };

  // Sauvegarder les modifications d'un exercice
  const handleSaveExerciseEdit = () => {
    if (selectedExerciseForEdit === null) return;

    const updatedList = [...exercisesList];
    updatedList[selectedExerciseForEdit] = {
      ...updatedList[selectedExerciseForEdit],
      sets: tempExercise.sets,
      repetitions: tempExercise.repetitions,
      recommended_weight: tempExercise.recommended_weight,
      duration_seconds: tempExercise.duration_seconds,
      rest_seconds: tempExercise.rest_seconds,
      instructions: tempExercise.instructions,
    };

    setExercisesList(updatedList);

    // Mettre à jour formData
    setFormData((prev) => ({
      ...prev,
      exercises: updatedList.map((item) => ({
        exercise_id: item.exercise_id,
        order_number: item.order_number,
        sets: item.sets,
        repetitions: item.repetitions,
        recommended_weight: item.recommended_weight,
        duration_seconds: item.duration_seconds,
        rest_seconds: item.rest_seconds,
        instructions: item.instructions,
      })),
    }));

    setSelectedExerciseForEdit(null);
    setIsExerciseModalOpen(false);
  };

  // Supprimer un exercice
  const handleRemoveExercise = (index: number) => {
    const updatedList = exercisesList
      .filter((_, i) => i !== index)
      .map((item, newIndex) => ({
        ...item,
        order_number: newIndex + 1,
      }));

    setExercisesList(updatedList);

    // Mettre à jour formData
    setFormData((prev) => ({
      ...prev,
      exercises: updatedList.map((item) => ({
        exercise_id: item.exercise_id,
        order_number: item.order_number,
        sets: item.sets,
        repetitions: item.repetitions,
        recommended_weight: item.recommended_weight,
        duration_seconds: item.duration_seconds,
        rest_seconds: item.rest_seconds,
        instructions: item.instructions,
      })),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAddExerciseClick = () => {
    setSelectedExerciseForEdit(null);
    setTempExercise({
      exercise_id: 0,
      sets: 3,
      repetitions: 10,
      recommended_weight: undefined,
      duration_seconds: undefined,
      rest_seconds: undefined,
      instructions: "",
    });
    setIsExerciseModalOpen(true);
  };

  const handleEditExerciseClick = (index: number) => () => {
    handleEditExercise(index);
  };

  const handleRemoveExerciseClick = (index: number) => () => {
    handleRemoveExercise(index);
  };

  const handleCancelClick = () => {
    onCancel();
  };

  const handleSubmitClick = () => {
    onSubmit(formData);
  };

  const handleCloseModalClick = () => {
    setIsExerciseModalOpen(false);
  };

  const handleSaveExerciseClick = () => {
    selectedExerciseForEdit !== null
      ? handleSaveExerciseEdit()
      : handleAddExercise();
  };

  const exerciseOptions =
    availableExercises?.data
      .filter(
        (ex) =>
          !exercisesList.some(
            (selected) => selected.exercise_id === ex.exercise_id
          )
      )
      .map((exercise) => ({
        value: exercise.exercise_id.toString(),
        label: `${exercise.name} (${
          MuscleCategoryLabels[
            exercise.muscle_category as keyof typeof MuscleCategoryLabels
          ]
        })`,
      })) || [];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {mode === "add" ? "Créer un programme" : "Modifier le programme"}
      </h2>

      {formError && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
          <p>Une erreur est survenue. Veuillez réessayer.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base du programme */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom du programme */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Nom du programme*
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nom du programme"
              className="w-full"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Catégorie*
            </label>
            <Select
              options={Object.entries(ProgramCategoryLabels).map(
                ([value, label]) => ({
                  value,
                  label,
                })
              )}
              defaultValue={formData.category}
              onChange={(value) => handleSelectChange("category", value)}
              placeholder="Sélectionner une catégorie"
              className="w-full"
            />
          </div>

          {/* Niveau de difficulté */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Niveau de difficulté*
            </label>
            <Select
              options={Object.entries(DifficultyLevelLabels).map(
                ([value, label]) => ({
                  value,
                  label,
                })
              )}
              defaultValue={formData.difficulty_level}
              onChange={(value) =>
                handleSelectChange("difficulty_level", value)
              }
              placeholder="Sélectionner un niveau"
              className="w-full"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Description
          </label>
          <TextArea
            value={formData.description}
            onChange={handleTextAreaChange}
            placeholder="Description du programme"
            className="w-full"
            rows={4}
          />
        </div>

        {/* Section des exercices */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Exercices ({exercisesList.length})
            </h3>
            <Button
              onClick={handleAddExerciseClick}
              variant="outline"
              size="sm"
              startIcon={<FaPlus />}
            >
              Ajouter un exercice
            </Button>
          </div>

          {/* Liste des exercices */}
          <div className="space-y-3">
            {exercisesList.map((exercise, index) => (
              <div
                key={exercise.exercise_id}
                className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => moveExercise(index, "up")}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaArrowUp className="text-xs text-gray-400" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveExercise(index, "down")}
                        disabled={index === exercisesList.length - 1}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaArrowDown className="text-xs text-gray-400" />
                      </button>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {exercise.order_number}. {exercise.exercise_name}
                    </span>
                    <Badge color="info" variant="light" size="sm">
                      {MuscleCategoryLabels[
                        exercise.muscle_category as keyof typeof MuscleCategoryLabels
                      ] || exercise.muscle_category}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleEditExerciseClick(index)}
                      variant="outline"
                      size="sm"
                    >
                      Modifier
                    </Button>
                    <Button
                      onClick={handleRemoveExerciseClick(index)}
                      variant="outline"
                      size="sm"
                      startIcon={<FaMinus />}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  {exercise.sets && (
                    <div>
                      <span className="font-medium">Séries:</span>{" "}
                      {exercise.sets}
                    </div>
                  )}
                  {exercise.repetitions && (
                    <div>
                      <span className="font-medium">Répétitions:</span>{" "}
                      {exercise.repetitions}
                    </div>
                  )}
                  {exercise.recommended_weight && (
                    <div>
                      <span className="font-medium">Poids:</span>{" "}
                      {exercise.recommended_weight}kg
                    </div>
                  )}
                  {exercise.duration_seconds && (
                    <div>
                      <span className="font-medium">Durée:</span>{" "}
                      {Math.floor(exercise.duration_seconds / 60)}min{" "}
                      {exercise.duration_seconds % 60}s
                    </div>
                  )}
                  {exercise.rest_seconds && (
                    <div>
                      <span className="font-medium">Repos:</span>{" "}
                      {Math.floor(exercise.rest_seconds / 60)}min{" "}
                      {exercise.rest_seconds % 60}s
                    </div>
                  )}
                </div>

                {exercise.instructions && (
                  <div className="mt-2">
                    <span className="font-medium text-sm">Instructions:</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {exercise.instructions}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {exercisesList.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun exercice ajouté. Cliquez sur "Ajouter un exercice" pour
              commencer.
            </div>
          )}
        </div>

        {/* Boutons de formulaire */}
        <div className="flex justify-end gap-3">
          <Button onClick={handleCancelClick} variant="outline" size="md">
            Annuler
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            disabled={isSubmitting || !formData.name.trim()}
            startIcon={<FaSave />}
          >
            {isSubmitting
              ? "En cours..."
              : mode === "add"
              ? "Créer"
              : "Enregistrer"}
          </Button>
        </div>
      </form>

      {/* Modal pour ajouter/modifier un exercice */}
      <Modal
        isOpen={isExerciseModalOpen}
        onClose={handleCloseModalClick}
        className="max-w-2xl mx-auto p-6"
      >
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {selectedExerciseForEdit !== null
              ? "Modifier l'exercice"
              : "Ajouter un exercice"}
          </h3>

          <div className="space-y-4">
            {/* Sélection de l'exercice (seulement en mode ajout) */}
            {selectedExerciseForEdit === null && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Exercice*
                </label>
                <Select
                  options={exerciseOptions}
                  placeholder="Sélectionner un exercice"
                  defaultValue={
                    tempExercise.exercise_id
                      ? tempExercise.exercise_id.toString()
                      : ""
                  }
                  onChange={(value) =>
                    setTempExercise((prev) => {
                      return {
                        ...prev,
                        exercise_id: Number(value),
                      };
                    })
                  }
                  className="w-full"
                />
              </div>
            )}

            {/* Configuration de l'exercice */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Séries
                </label>
                <Input
                  type="number"
                  value={tempExercise.sets || ""}
                  onChange={(e) =>
                    setTempExercise((prev) => ({
                      ...prev,
                      sets: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="3"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Répétitions
                </label>
                <Input
                  type="number"
                  value={tempExercise.repetitions || ""}
                  onChange={(e) =>
                    setTempExercise((prev) => ({
                      ...prev,
                      repetitions: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="10"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Poids recommandé (kg)
                </label>
                <Input
                  type="number"
                  value={tempExercise.recommended_weight || ""}
                  onChange={(e) =>
                    setTempExercise((prev) => ({
                      ...prev,
                      recommended_weight:
                        parseFloat(e.target.value) || undefined,
                    }))
                  }
                  placeholder="10.5"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Durée d'exercice (secondes)
                </label>
                <Input
                  type="number"
                  value={tempExercise.duration_seconds || ""}
                  onChange={(e) =>
                    setTempExercise((prev) => ({
                      ...prev,
                      duration_seconds: parseInt(e.target.value) || undefined,
                    }))
                  }
                  placeholder="60"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Temps de repos (secondes)
                </label>
                <Input
                  type="number"
                  value={tempExercise.rest_seconds || ""}
                  onChange={(e) =>
                    setTempExercise((prev) => ({
                      ...prev,
                      rest_seconds: parseInt(e.target.value) || undefined,
                    }))
                  }
                  placeholder="90"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Instructions spécifiques
              </label>
              <TextArea
                value={tempExercise.instructions}
                onChange={(value) =>
                  setTempExercise((prev) => ({ ...prev, instructions: value }))
                }
                placeholder="Instructions spécifiques pour cet exercice dans ce programme"
                className="w-full"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button onClick={handleCloseModalClick} variant="outline" size="md">
              Annuler
            </Button>
            <Button
              onClick={handleSaveExerciseClick}
              variant="primary"
              size="md"
              disabled={
                selectedExerciseForEdit === null && !tempExercise.exercise_id
              }
            >
              {selectedExerciseForEdit !== null ? "Sauvegarder" : "Ajouter"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProgramForm;
