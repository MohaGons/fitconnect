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

  {/* Date de naissance + Genre */}
  <div className="flex flex-wrap gap-4">
    <div className="flex-1 min-w-[200px]">
      <label className="block text-sm font-medium">
        Date de naissance
      </label>
      <input
        type="date"
        className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        {...register('birth_date')}
      />
    </div>
    <div className="flex-1 min-w-[200px]">
      <label className="block text-sm font-medium">
        Genre
      </label>
      <select
        className="w-full mt-1 px-4 py-2 text-sm border rounded-md bg-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        {...register('gender')}
      >
        <option value="">Sélectionnez</option>
        <option value="Homme">Homme</option>
        <option value="Femme">Femme</option>
      </select>
    </div>
  </div>

  {/* Poids + Taille */}
  <div className="flex flex-wrap gap-4">
    <div className="flex-1 min-w-[200px]">
      <label className="block text-sm font-medium">
        Poids (kg)
      </label>
      <input
        type="number"
        step="0.01"
        min={0}
        placeholder="Ex: 70.5"
        className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        {...register('weight')}
      />
    </div>
    <div className="flex-1 min-w-[200px]">
      <label className="block text-sm font-medium">
        Taille (cm)
      </label>
      <input
        type="number"
        step="0.01"
        min={0}
        placeholder="Ex: 175.5"
        className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        {...register('height')}
      />
    </div>
  </div>
      <div>
      <label className="block text-sm font-medium">
      Objectifs
      </label>
        <input
        type="text"
        placeholder="Ex: Perte de poids, Prise de masse"
        className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        {...register('goal')}
      />
      </div>
      <div>
      <label className="block text-sm font-medium">
      Restrictions alimentaires
          </label>
      <input
        type="text"
        placeholder="Ex: Végétarien, Allergies"
        className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        {...register('dietary_restrictions')}
      />
      </div>
      <div>
        <label className="block text-sm font-medium">
      Problèmes de santé
          </label>
      <input
        type="text"
        placeholder="Ex: Diabète, Hypertension"
        className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        {...register('health_issues')}
      />
      </div>
      <div>

      </div>
      <div>
      <label className="block text-sm font-medium">
      Expérience sportive
          </label>
        <input
        type="text"
        placeholder="Ex: Débutant, Intermédiaire, Avancé"
        className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        {...register('sport_experience')}
      />
      </div>
      

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
      >
        Enregistrer
      </button>

     
    </form>
  );
};

export default ClientForm;
