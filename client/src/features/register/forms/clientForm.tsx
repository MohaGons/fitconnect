import { useForm } from 'react-hook-form';
import api from '../../../api/api';
import { useKeycloakContext } from '../../../services/useKeycloakContext';
import { useState } from 'react';

const ClientForm = () => {
  const { register, handleSubmit } = useForm();
  const { keycloak } = useKeycloakContext();
  const userId = keycloak?.tokenParsed?.sub;

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);

      data.user_id = userId;
      await api.post('/clients', data);

      // Attribution du rôle "CLIENT"
      const token = keycloak.token;
      await api.post(
        '/auth/choose-role',
        { role: 'CLIENT' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Attendre 3 secondes avant redirection
      await new Promise((resolve) => setTimeout(resolve, 3000));
      window.location.href = '/dashboard/home';
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
      Date de naissance
      </label>
      <input
      type="date"
      className="border p-2 w-full border-zinc-300 focus:outline-none focus:border-orange-500"
      {...register('birth_date')}
      />
      </div>
      <div>
      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
      Poids (kg)
      </label>
        <input
        type="number"
        step="0.01"
        min={0}
        placeholder='Ex: 70.5'
        className="border p-2 w-full border-zinc-300 focus:outline-none focus:border-orange-500"
        {...register('weight')}
      />
      </div>
      <div>
      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
      Taille (cm)
      </label>
        <input
       type="number"
       step="0.01"
       min={0}
       placeholder='Ex: 175.5'
        className="border p-2 w-full border-zinc-300 focus:outline-none focus:border-orange-500"
        {...register('height')}
      />
      </div>
      <div>
      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
      Objectifs
      </label>
        <input
        type="text"
        placeholder="Ex: Perte de poids, Prise de masse"
        className="border p-2 w-full border-zinc-300 focus:outline-none focus:border-orange-500"
        {...register('goal')}
      />
      </div>
      <div>
      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
      Restrictions alimentaires
          </label>
      <input
        type="text"
        placeholder="Ex: Végétarien, Allergies"
        className="border p-2 w-full border-zinc-300 focus:outline-none focus:border-orange-500"
        {...register('dietary_restrictions')}
      />
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
      Problèmes de santé
          </label>
      <input
        type="text"
        placeholder="Ex: Diabète, Hypertension"
        className="border p-2 w-full border-zinc-300 focus:outline-none focus:border-orange-500"
        {...register('health_issues')}
      />
      </div>
      <div>

      </div>
      <div>
      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
      Expérience sportive
          </label>
        <input
        type="text"
        placeholder="Ex: Débutant, Intermédiaire, Avancé"
        className="border p-2 w-full border-zinc-300 focus:outline-none focus:border-orange-500"
        {...register('sport_experience')}
      />
      </div>
      

      <button
        type="submit"
        disabled={isLoading}
        className="bg-orange-600 text-white px-4 py-2 rounded"
      >
        {isLoading ? 'Traitement en cours...' : 'Enregistrer Client'}
      </button>

      {isLoading && (
        <div className="text-center text-sm text-gray-500">Veuillez patienter...</div>
      )}
    </form>
  );
};

export default ClientForm;
