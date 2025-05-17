import { useForm } from 'react-hook-form';
import api from '../../../api/api';

import { useKeycloakContext } from '../../../services/useKeycloakContext';

const CoachForm = () => {
  const { register, handleSubmit } = useForm();
     const { keycloak } = useKeycloakContext();
     const userId = keycloak?.tokenParsed?.sub; 
  const onSubmit = async (data: any) => {
    try {
      // Gestion du fichier photo
      if (data.photo && data.photo[0]) {
        const formData = new FormData();
        formData.append('file', data.photo[0]);
      
        const uploadRes = await api.post('/storage/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const filename = uploadRes.data.filename;
        data.image = filename;
      }
      data.user_id = userId;
      await api.post('/coaches', data);
       // 2. Assigner le rôle "COACH"
       const token = keycloak.token;
       await api.post(
         '/auth/choose-role',
         { role: 'COACH' },
         { headers: { Authorization: `Bearer ${token}` } }
       );
 
       window.location.href = '/dashboard/home';
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
      Spécialité
      </label>
        <input
        type="text"
        placeholder="Fitness, Nutrition, etc."
        className="border p-2 w-full border-zinc-300 focus:outline-none focus:border-orange-500"
        {...register("specialty", { required: true })}
      />
      </div>
      <div>
      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
      Bio du Coach
      </label>
        <textarea
        placeholder="Parlez-nous de vous" 
        className="border p-2 w-full border-zinc-300 focus:outline-none focus:border-orange-500"
        {...register("bio")}
      />
      </div>
      <div>
      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
      Vos Certifications et Diplômes
      </label>
        <input
        type="text"
        placeholder="Certifications (Ex: Certificat de Coach, Nutritionniste)"
        className="border p-2 w-full border-zinc-300 focus:outline-none focus:border-orange-500"
        {...register("certifications")}
      />
      </div>
      
      <div>
      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
      Disponibilité
      </label>
         <input
        type="text"
        placeholder="Ex: full-time, part-time, weekends"
        className="border p-2 w-full border-zinc-300 focus:outline-none focus:border-orange-500"
        {...register("availability")}
      />
      </div>
      <div>
      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
      Photo de Profil
      </label>
        <input
        type="file"
        className="border p-2 w-full border-zinc-300 focus:outline-none focus:border-orange-500"
        {...register("photo_url")}
      />
      </div>
      
      <button
        type="submit"
        className="bg-orange-600 text-white px-4 py-2 rounded"
      >
        Enregistrer Coach
      </button>
    </form>
  );
};

export default CoachForm;
