import { useForm } from 'react-hook-form';
import apiClient from '../../../api/axios';
import { useKeycloakContext } from '../../../services/useKeycloakContext';
import { useState } from 'react';
import { processFileToBase64 } from '../../../services/fileUploadService';

const ClientForm = () => {
  const { register, handleSubmit, formState : { errors }} = useForm();
  const { keycloak } = useKeycloakContext();
  const userId = keycloak?.tokenParsed?.sub;
  const firstName = keycloak?.tokenParsed?.given_name;
  const lastName = keycloak?.tokenParsed?.family_name;
  const email = keycloak?.tokenParsed?.email;

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    try {
       if (data.photo && data.photo[0]) {
        const file = data.photo[0]; 
        const base64 = await processFileToBase64(file)
        data.photo = base64; 
      }
      data.user_id = userId;
      data.firstName = firstName;
      data.lastName = lastName;
      data.email = email;
      await apiClient.post('/clients', data);

      // Attribution du rôle "CLIENT"
      const token = keycloak.token;
      await apiClient.post(
        '/auth/choose-role',
        { role: 'CLIENT' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

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
      <label className="block text-sm font-medium">Date de naissance</label>
      <input
        type="date"
        className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        {...register('birth_date', { required: "Ce champ est requis." })}
      />
      {errors.birth_date?.message && (
        <p className="text-red-500 text-sm mt-1">{String(errors.birth_date.message)}</p>
      )}
    </div>

    <div className="flex-1 min-w-[200px]">
      <label className="block text-sm font-medium">Genre</label>
      <select
        className="w-full mt-1 px-4 py-2 text-sm border rounded-md bg-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        {...register('gendre', { required: "Ce champ est requis." })}
      >
        <option value="">Sélectionnez</option>
        <option value="Homme">Homme</option>
        <option value="Femme">Femme</option>
      </select>
      {errors.gendre?.message && (
        <p className="text-red-500 text-sm mt-1">{String(errors.gendre.message)}</p>
      )}
    </div>
  </div>

  {/* Poids + Taille */}
  <div className="flex flex-wrap gap-4">
    <div className="flex-1 min-w-[200px]">
      <label className="block text-sm font-medium">Poids (kg)</label>
      <input
        type="number"
        step="0.01"
        min={0}
        placeholder="Ex: 70.5"
        className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        {...register('weight', { required: "Ce champ est requis." })}
      />
      {errors.weight?.message && (
        <p className="text-red-500 text-sm mt-1">{String(errors.weight.message)}</p>
      )}
    </div>

    <div className="flex-1 min-w-[200px]">
      <label className="block text-sm font-medium">Taille (cm)</label>
      <input
        type="number"
        step="0.01"
        min={0}
        placeholder="Ex: 175.5"
        className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        {...register('height', { required: "Ce champ est requis." })}
      />
      {errors.height?.message && (
        <p className="text-red-500 text-sm mt-1">{String(errors.height.message)}</p>
      )}
    </div>
  </div>

  {/* Objectifs */}
  <div>
    <label className="block text-sm font-medium">Objectifs</label>
    <input
      type="text"
      placeholder="Ex: Perte de poids, Prise de masse"
      className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
      {...register('goal', { required: "Ce champ est requis." })}
    />
    {errors.goal?.message && (
      <p className="text-red-500 text-sm mt-1">{String(errors.goal.message)}</p>
    )}
  </div>

  {/* Restrictions alimentaires */}
  <div>
    <label className="block text-sm font-medium">Restrictions alimentaires</label>
    <input
      type="text"
      placeholder="Ex: Végétarien, Allergies"
      className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
      {...register('dietary_restrictions', { required: "Ce champ est requis." })}
    />
    {errors.dietary_restrictions?.message && (
      <p className="text-red-500 text-sm mt-1">{String(errors.dietary_restrictions.message)}</p>
    )}
  </div>

  {/* Problèmes de santé */}
  <div>
    <label className="block text-sm font-medium">Problèmes de santé</label>
    <input
      type="text"
      placeholder="Ex: Diabète, Hypertension"
      className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
      {...register('health_issues', { required: "Ce champ est requis." })}
    />
    {errors.health_issues?.message && (
      <p className="text-red-500 text-sm mt-1">{String(errors.health_issues.message)}</p>
    )}
  </div>

  {/* Expérience sportive */}
  <div>
    <label className="block text-sm font-medium">Expérience sportive</label>
    <input
      type="text"
      placeholder="Ex: Débutant, Intermédiaire, Avancé"
      className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
      {...register('sport_experience', { required: "Ce champ est requis." })}
    />
    {errors.sport_experience?.message && (
      <p className="text-red-500 text-sm mt-1">{String(errors.sport_experience.message)}</p>
    )}
  </div>

  {/* Photo de Profil */}
  <div>
    <label className="block text-sm font-medium">Photo de Profil</label>
    <input
      type="file"
      className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
      {...register('photo', { required: "Ce champ est requis." })}
    />
    {errors.photo?.message && (
      <p className="text-red-500 text-sm mt-1">{String(errors.photo.message)}</p>
    )}
  </div>
  <div className="flex items-start gap-3">
  <label className="flex items-center space-x-3 cursor-pointer">
    <input
      type="checkbox"
      className="w-5 h-5 appearance-none cursor-pointer border border-gray-300 checked:border-transparent rounded-md checked:bg-orange-500"
      {...register("termsAccepted", { required: "Vous devez accepter les conditions." })}
    />
  </label>
  <p className="inline-block text-xs text-gray-500">
    En créant un compte, vous acceptez les{" "}
    <a
      className="text-orange-400"
      href="/cgu"
      target="_blank"
      rel="noopener noreferrer"
    >
      Conditions Générales d'Utilisation
    </a>{" "}
    et notre{" "}
    <a
      className="text-orange-400"
      href="/privacy-policy"
      target="_blank"
      rel="noopener noreferrer"
    >
      Politique de Confidentialité
    </a>
  </p>
  </div>

{errors.termsAccepted?.message && (
  <p className="text-red-500 text-xs mt-1">{String(errors.termsAccepted.message)}</p>
)}

  {/* Bouton */}
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
