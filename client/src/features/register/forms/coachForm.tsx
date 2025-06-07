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
      <label className="block text-sm font-medium">
      Spécialité
      </label>
        <input
        type="text"
        placeholder="Fitness, Nutrition, etc."
        className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        {...register("specialty", { required: true })}
      />
      </div>
      <div>
      <label className="block text-sm font-medium">
      Bio du Coach
      </label>
        <textarea
        placeholder="Parlez-nous de vous" 
        className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        {...register("bio")}
      />
      </div>
      <div>
      <label className="block text-sm font-medium">
      Vos Certifications et Diplômes
      </label>
        <input
        type="text"
        placeholder="Certifications (Ex: Certificat de Coach, Nutritionniste)"
        className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        {...register("certifications")}
      />
      </div>
      
      <div>
      <label className="block text-sm font-medium">
      Disponibilité
      </label>
         <input
        type="text"
        placeholder="Ex: full-time, part-time, weekends"
        className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        {...register("availability")}
      />
      </div>
      <div>
      <label className="block text-sm font-medium">
      Photo de Profil
      </label>
        <input
        type="file"
        className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        {...register("photo_url")}
      />
      </div>
      
      <button
        type="submit"
        className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
      >
        Enregistrer
      </button>
    </form>
  );
};

export default CoachForm;
