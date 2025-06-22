import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUser } from '../../../context/UserContext';
import api from "../../../api/axios";
import { processFileToBase64 } from '../../../services/fileUploadService';

const Profile = () => {
    const { user, role, setUser } = useUser();
    const [apiError, setApiError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL;
    const realm = import.meta.env.VITE_KEYCLOAK_REALM;
    const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;
    const redirectUri = encodeURIComponent("http://localhost:5173/");
    const resetPasswordUrl = `${keycloakUrl}/realms/${realm}/login-actions/reset-credentials?client_id=${clientId}&redirect_uri=${redirectUri}`;
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
    if (!user || !role) return;
    if (role === 'CLIENT') {
      reset({
        lastName: user.lastName || "",
        firstName: user.firstName || "",
        email: user.email || "",
        birth_date: user.birth_date || "",
        gendre: user.gendre || "",
        weight: user.weight || "",
        height: user.height || "",
        goal: user.goal || "",
        dietary_restrictions: user.dietary_restrictions || "",
        health_issues: user.health_issues || "",
        sport_experience: user.sport_experience || "",
        photo: "",
      });
    } else if (role === 'COACH') {
      reset({
        lastName: user.lastName || "",
        firstName: user.firstName || "",
        email: user.email || "",
        bio: user.bio || "",
        certifications: user.certifications || "",
        availability: user.availability || "",
        specialty: user.specialty || "",
        photo: "",
      });
    }
  }, [user, role, reset]);

  const onSubmitClient = async (data: any) => {
    try {
      setApiError(null);
      if (data.photo && data.photo[0]) {
        const file = data.photo[0];
        const base64 = await processFileToBase64(file);
        data.photo = base64;
      } else {
        delete data.photo;
      }
      await api.patch(`/clients/${user.client_id}`, data);
      setSuccessMsg("Profil client mis à jour !");
      setUser({ ...user, ...data }); 
      console.log("Formulaire client soumis :", data);
    } catch (error: any) {
      setApiError("Erreur lors de la mise à jour du profil client.");
    }
  };

  const onSubmitCoach = async (data: any) => {
    try {
      setApiError(null);
      if (data.photo && data.photo[0]) {
        const file = data.photo[0];
        const base64 = await processFileToBase64(file);
        data.photo = base64;
      } else {
        delete data.photo;
      }
      const response = await api.patch(`/coaches/${user.coach_id}`, data);
      setSuccessMsg("Profil client mis à jour !");
      setUser({ ...user, ...data }); 
      console.log("Mise à jour réussie :", response.data);
    } catch (error: any) {
      setApiError("Erreur lors de la mise à jour du profil coach.");
    }
  };

const handleDeleteAccount = async () => {
  try {
    setApiError(null);

    if (role === 'CLIENT') {
      await api.patch(`/clients/${user.client_id}`, {
        deleted: true,
        email: `deleted@anonyme.com`,
        firstName: 'Anonyme',
        lastName: 'Anonyme',
        gendre: null,
        weight: 0,
        height: 0,
        goal: null,
        dietary_restrictions: null,
        health_issues: null,
        sport_experience: null,
        photo: null,
        user_id: null, 
      });
    } else if (role === 'COACH') {
      await api.patch(`/coaches/${user.coach_id}`, {
        deleted: true,
        email: `deleted@anonyme.com`,
        firstName: 'Anonyme',
        lastName: 'Anonyme',
        bio: null,
        certifications: null,
        availability: null,
        specialty: null,
        photo: null,
        user_id: null, 
      });
    }

    window.location.href = '/goodbye';
  } catch (error) {
    setApiError("Erreur lors de la suppression du compte.");
  }
};

  return (
    <div className='p-4 flex items-center justify-center md:p-6 dark:bg-gray-900'>
      <div className="w-full max-w-3xl">
        {apiError && (
          <div className="text-red-500 text-center mb-4">{apiError}</div>
        )}

        {successMsg && (
        <div className="mb-4 max-w-3xl relative rounded-lg bg-green-100 border border-green-400 text-green-700 px-4 py-3 text-center font-semibold shadow flex items-center justify-center">
            <span className="flex-1">{successMsg}</span>
            <button
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-green-200 transition"
            onClick={() => setSuccessMsg(null)}
            aria-label="Fermer"
            type="button"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round"/>
                <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            </button>
        </div>
        )}
        {role === 'CLIENT' ? (
            

          <form onSubmit={handleSubmit(onSubmitClient)} className="space-y-4 z-10 p-10 bg-white shadow-2xl rounded-lg max-w-xl md:max-w-2xl lg:max-w-3xl max-w-2xl my-10">
            <h1 className="mb-1 text-2xl font-semibold sm:text-2xl text-center">
              Modifier votre Profile Client
            </h1>

            {/* Avatar Preview */}
            <div className="h-24 w-24 mx-auto rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {user?.photo ? (
                <img src={user.photo} alt="Profil" className="h-full w-full object-cover" />
              ) : (
                <svg className="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                </svg>
              )}
            </div>

            {/* Nom et Prénom */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium">Nom</label>
                <input
                  type="text"
                  className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  {...register("lastName", { required: "Le nom est requis" })}
                />
                {errors.lastName?.message && (
                  <span className="text-red-500 text-xs">{String(errors.lastName.message)}</span>
                )}
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium">Prénom</label>
                <input
                  type="text"
                  className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  {...register("firstName", { required: "Le prénom est requis" })}
                />
                {errors.firstName?.message && (
                  <span className="text-red-500 text-xs">{String(errors.firstName.message)}</span>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                {...register("email", { required: "L'email est requis" })}
              />
              {errors.email?.message && (
                <span className="text-red-500 text-xs">{String(errors.email.message)}</span>
              )}
            </div>

            {/* Date de naissance + Genre */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium">Date de naissance</label>
                <input
                  type="date"
                  className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  {...register("birth_date", { required: "La date de naissance est requise" })}
                />
                {errors.birth_date?.message && (
                  <span className="text-red-500 text-xs">{String(errors.birth_date.message)}</span>
                )}
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium">Genre</label>
                <select
                  className="w-full mt-1 px-4 py-2 text-sm border rounded-md bg-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  {...register("gendre", { required: "Le genre est requis" })}
                >
                  <option value="">Sélectionnez</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                </select>
                {errors.gendre?.message && (
                  <span className="text-red-500 text-xs">{String(errors.gendre.message)}</span>
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
                  {...register("weight", { required: "Le poids est requis" })}
                />
                {errors.weight?.message && (
                  <span className="text-red-500 text-xs">{String(errors.weight.message)}</span>
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
                  {...register("height", { required: "La taille est requise" })}
                />
                {errors.height?.message && (
                  <span className="text-red-500 text-xs">{String(errors.height.message)}</span>
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
                {...register("goal", { required: "L'objectif est requis" })}
              />
              {errors.goal?.message && (
                <span className="text-red-500 text-xs">{String(errors.goal.message)}</span>
              )}
            </div>

            {/* Restrictions alimentaires */}
            <div>
              <label className="block text-sm font-medium">Restrictions alimentaires</label>
              <input
                type="text"
                placeholder="Ex: Végétarien, Allergies"
                className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                {...register("dietary_restrictions", { required: "Ce champ est requis" })}
              />
              {errors.dietary_restrictions?.message && (
                <span className="text-red-500 text-xs">{String(errors.dietary_restrictions.message)}</span>
              )}
            </div>

            {/* Problèmes de santé */}
            <div>
              <label className="block text-sm font-medium">Problèmes de santé</label>
              <input
                type="text"
                placeholder="Ex: Diabète, Hypertension"
                className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                {...register("health_issues", { required: "Ce champ est requis" })}
              />
              {errors.health_issues?.message && (
                <span className="text-red-500 text-xs">{String(errors.health_issues.message)}</span>
              )}
            </div>

            {/* Expérience sportive */}
            <div>
              <label className="block text-sm font-medium">Expérience sportive</label>
              <input
                type="text"
                placeholder="Ex: Débutant, Intermédiaire, Avancé"
                className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                {...register("sport_experience", { required: "Ce champ est requis" })}
              />
              {errors.sport_experience?.message && (
                <span className="text-red-500 text-xs">{String(errors.sport_experience.message)}</span>
              )}
            </div>

            {/* Photo de Profil */}
            <div>
              <label className="block text-sm font-medium">Photo de Profil</label>
              <input
                type="file"
                className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                {...register("photo")}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
            >
              Enregistrer
            </button>


            <div className="flex justify-between items-center mt-6">
            <button
                type="button"
                className="text-sm text-orange-600 font-semibold hover:underline"
                 onClick={() => window.location.href = resetPasswordUrl}
            >
                Changer mon mot de passe
            </button>
            <button
                type="button"
                className="text-sm text-red-600 font-semibold hover:underline"
                onClick={() => setShowDeleteModal(true)}
            >
                Supprimer mon compte
            </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit(onSubmitCoach)} className="space-y-4 z-10 p-10 bg-white shadow-2xl rounded-lg max-w-xl md:max-w-2xl w-[700px] lg:max-w-3xl my-10">
            <h1 className="mb-1 text-2xl font-semibold sm:text-2xl text-center">
              Modifier votre Profile
            </h1>

            {/* Avatar Preview */}
            <div className="h-24 w-24 mx-auto rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {user?.photo ? (
                <img src={user.photo} alt="Profil" className="h-full w-full object-cover" />
              ) : (
                <svg className="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                </svg>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium">Nom</label>
                <input
                  type="text"
                  className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  {...register("lastName", { required: "Le nom est requis" })}
                />
                {errors.lastName?.message && (
                  <span className="text-red-500 text-xs">{String(errors.lastName.message)}</span>
                )}
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium">Prénom</label>
                <input
                  type="text"
                  className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  {...register("firstName", { required: "Le prénom est requis" })}
                />
                {errors.firstName?.message && (
                  <span className="text-red-500 text-xs">{String(errors.firstName.message)}</span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                {...register("email", { required: "L'email est requis" })}
              />
              {errors.email?.message && (
                <span className="text-red-500 text-xs">{String(errors.email.message)}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Spécialité</label>
              <input
                type="text"
                placeholder="Fitness, Nutrition, etc."
                className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                {...register("specialty", { required: "La spécialité est requise" })}
              />
              {errors.specialty?.message && (
                <span className="text-red-500 text-xs">{String(errors.specialty.message)}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Bio du Coach</label>
              <textarea
                placeholder="Parlez-nous de vous"
                className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                {...register("bio", { required: "La bio est requise" })}
              />
              {errors.bio?.message && (
                <span className="text-red-500 text-xs">{String(errors.bio.message)}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Vos Certifications et Diplômes</label>
              <input
                type="text"
                placeholder="Certifications (Ex: Certificat de Coach, Nutritionniste)"
                className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                {...register("certifications", { required: "Ce champ est requis" })}
              />
              {errors.certifications?.message && (
                <span className="text-red-500 text-xs">{String(errors.certifications.message)}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Disponibilité</label>
              <input
                type="text"
                placeholder="Ex: full-time, part-time, weekends"
                className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                {...register("availability", { required: "La disponibilité est requise" })}
              />
              {errors.availability?.message && (
                <span className="text-red-500 text-xs">{String(errors.availability.message)}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Photo de Profil</label>
              <input
                type="file"
                className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                {...register("photo")}
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
            >
              Enregistrer
            </button>
            <div className="flex justify-between items-center mt-6">
            <button
                type="button"
                className="text-sm text-orange-600 font-semibold hover:underline"
                onClick={() => window.location.href = resetPasswordUrl}
            >
                Changer mon mot de passe
            </button>
            <button
                type="button"
                className="text-sm text-red-600 font-semibold hover:underline"
                onClick={() => setShowDeleteModal(true)}
            >
                Supprimer mon compte
            </button>
            </div>
          </form>
        )}
      </div>

    {showDeleteModal && (
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto z-[99999]">
        <div className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"></div>
        <div className="relative w-full rounded-3xl bg-white dark:bg-gray-900 max-w-4xl mx-auto p-6 overflow-auto max-h-[90vh] shadow-lg">
        <h2 className="text-lg font-bold mb-2 text-red-600">Confirmer la suppression</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
            Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-2 mt-6">
            <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={() => setShowDeleteModal(false)}
            >
            Annuler
            </button>
            <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            onClick={handleDeleteAccount}
            >
            Supprimer
            </button>
        </div>
        </div>
    </div>
    )}

    </div>
  );
};

export default Profile;