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
      alert("Coach enregistré avec succès !");
       // 2. Assigner le rôle "COACH"
       const token = keycloak.token;
       await api.post(
         '/auth/choose-role',
         { role: 'COACH' },
         { headers: { Authorization: `Bearer ${token}` } }
       );
 
       alert('Coach enregistré et rôle assigné avec succès !');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      
      <input
        type="text"
        placeholder="Spécialité"
        className="border p-2 w-full border-zinc-300 focus:outline-none focus:border-orange-500"
        {...register("specialty", { required: true })}
      />
      <textarea
        placeholder="Bio du Coach" 
        className="border p-2 w-full border-zinc-300 focus:outline-none focus:border-orange-500"
        {...register("bio")}
      />
      <input
        type="text"
        placeholder="Vos Certifications et Diplômes"
        className="border p-2 w-full border-zinc-300 focus:outline-none focus:border-orange-500"
        {...register("certifications")}
      />
      
      <input
        type="text"
        placeholder="Disponibilité (Ex: Lundi, Mercredi, Vendredi)"
        className="border p-2 w-full border-zinc-300 focus:outline-none focus:border-orange-500"
        {...register("availability")}
      />
      <input
        type="file"
        className="border p-2 w-full border-zinc-300 focus:outline-none focus:border-orange-500"
        {...register("photo_url")}
      />
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
