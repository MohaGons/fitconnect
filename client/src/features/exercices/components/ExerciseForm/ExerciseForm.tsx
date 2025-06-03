import { ReactNode, useState } from "react";
import { FaSave } from "react-icons/fa";
import Button from "../../../../components/ui/button/Button";
import Input from "../../../../components/form/input/InputField";
import TextArea from "../../../../components/form/input/TextArea";
import Select from "../../../../components/form/Select";
import {
  MuscleCategoryLabels,
  DifficultyLevelLabels,
  MuscleCategory,
  DifficultyLevel,
} from "../../types";

// Type pour le formulaire adapté à l'entité
interface ExerciseFormData {
  name: string;
  description: string;
  muscle_category: MuscleCategory;
  difficulty_level: DifficultyLevel;
  image: string;
  video_url: string;
}

// Etat initial du formulaire
const initialFormState: ExerciseFormData = {
  name: "",
  description: "",
  muscle_category: "chest" as MuscleCategory,
  difficulty_level: "beginner" as DifficultyLevel,
  image: "",
  video_url: "",
};

interface ExerciseFormProps {
  exerciseData?: ExerciseFormData;
  isSubmitting?: boolean;
  formError?: string | ReactNode;
  onSubmit: (formData: ExerciseFormData) => void;
  onCancel: () => void;
  mode: "add" | "edit";
}

const ExerciseForm = ({
  exerciseData = initialFormState,
  isSubmitting = false,
  formError,
  onSubmit,
  onCancel,
  mode,
}: ExerciseFormProps) => {
  // État du formulaire
  const [formData, setFormData] = useState<ExerciseFormData>(exerciseData);

  // Gestionnaire de changement pour les champs simples
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {mode === "add" ? "Ajouter un exercice" : "Modifier l'exercice"}
      </h2>

      {formError && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
          <p>Une erreur est survenue. Veuillez réessayer.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom de l'exercice */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Nom de l'exercice*
          </label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nom de l'exercice"
            className="w-full"
          />
        </div>

        {/* Catégorie de muscle */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Catégorie de muscle*
          </label>
          <Select
            options={Object.entries(MuscleCategoryLabels).map(
              ([value, label]) => ({
                value,
                label,
              })
            )}
            defaultValue={formData.muscle_category}
            onChange={(value) => handleSelectChange("muscle_category", value)}
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
            onChange={(value) => handleSelectChange("difficulty_level", value)}
            placeholder="Sélectionner un niveau"
            className="w-full"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Description
          </label>
          <TextArea
            value={formData.description}
            onChange={handleTextAreaChange}
            placeholder="Description de l'exercice"
            className="w-full"
            rows={4}
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            URL de l'image
          </label>
          <Input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full"
          />
          {formData.image && (
            <div className="mt-2 max-w-xs">
              <img
                src={formData.image}
                alt="Prévisualisation"
                className="max-h-32 object-cover rounded-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                }}
              />
            </div>
          )}
        </div>

        {/* Vidéo URL */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            URL de la vidéo
          </label>
          <Input
            type="url"
            name="video_url"
            value={formData.video_url}
            onChange={handleChange}
            placeholder="https://example.com/video.mp4"
            className="w-full"
          />
        </div>

        {/* Boutons de formulaire */}
        <div className="flex justify-end gap-3">
          <Button onClick={onCancel} variant="outline" size="md">
            Annuler
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            disabled={isSubmitting}
            startIcon={<FaSave />}
          >
            {isSubmitting
              ? "En cours..."
              : mode === "add"
              ? "Ajouter"
              : "Enregistrer"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ExerciseForm;
