import { useForm } from 'react-hook-form';
import api from '../../../api/api';
import { useKeycloakContext } from '../../../services/useKeycloakContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ClientForm = () => {
  const { register, handleSubmit } = useForm();
  const { keycloak } = useKeycloakContext();
  const navigate = useNavigate();
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
      <input
        type="date"
        placeholder="Date de naissance"
        className="border p-2 w-full"
        {...register('birth_date')}
      />
      <input
        type="number"
        placeholder="Poids (kg)"
        className="border p-2 w-full"
        {...register('weight')}
      />
      <input
        type="number"
        placeholder="Taille (cm)"
        className="border p-2 w-full"
        {...register('height')}
      />
      <input
        type="text"
        placeholder="Objectif"
        className="border p-2 w-full"
        {...register('goal')}
      />
      <input
        type="text"
        placeholder="Restrictions alimentaires"
        className="border p-2 w-full"
        {...register('dietary_restrictions')}
      />
      <input
        type="text"
        placeholder="Problèmes de santé"
        className="border p-2 w-full"
        {...register('health_issues')}
      />

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
