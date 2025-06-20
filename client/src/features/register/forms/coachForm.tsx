import { useForm } from 'react-hook-form';
import api from '../../../api/api';
import { processFileToBase64 } from '../../../services/fileUploadService';
import { useKeycloakContext } from '../../../services/useKeycloakContext';

const CoachForm = () => {
    const { register, handleSubmit } = useForm();
    const { keycloak } = useKeycloakContext();
    const userId = keycloak?.tokenParsed?.sub; 
    const firstName = keycloak?.tokenParsed?.given_name;
    const lastName = keycloak?.tokenParsed?.family_name;
    const email = keycloak?.tokenParsed?.email;


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
        {...register("bio" , { required: true })}
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
        {...register("certifications" , { required: true })}
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
        {...register("availability" , { required: true })}
      />
      </div>
      <div>
      <label className="block text-sm font-medium">
      Photo de Profil
      </label>
        <input
        type="file"
        className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        {...register("photo" , { required: true })}
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
