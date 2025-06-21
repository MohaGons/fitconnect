import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useUser } from '../../../context/UserContext'; 

const Profile = () => {
  const { user, role } = useUser();
  const [form, setForm] = useState<any>({});
  const { register, handleSubmit } = useForm();
  console.log("User:", user);
  console.log("Role:", role);
  useEffect(() => {
    if (!user || !role) return;

    if (role === 'CLIENT') {
      setForm({
        name: user?.firstName || "",
        email: user?.email || "",
        birth_date: user?.birth_date || "",
        gendre: user?.gendre || "",
        weight: user?.weight || "",
        height: user?.height || "",
        goal: user?.goal || "",
        dietary_restrictions: user?.dietary_restrictions || "",
        health_issues: user?.health_issues || "",
        sport_experience: user?.sport_experience || "",
        photo: user?.photo || "",
      });
    } else if (role === 'COACH') {
      setForm({
         name: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        bio: user?.bio || "",
        experience_years: user?.experience_years || "",
        certifications: user?.certifications || "",
        availability: user?.availability || "",
        specialty: user?.specialty || "",
        hourly_rate: user?.hourly_rate || "",
        photo: user?.photo || "",
      });
    }
  }, [user, role]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // const { name, value, files } = e.target;
    // if (name === "photo" && files) {
    //   setForm({ ...form, [name]: files[0] });
    // } else {
    //   setForm({ ...form, [name]: value });
    // }
  };

  const handleSubmitClient = (e: React.FormEvent) => {
    e.preventDefault();
    // Appelle ta fonction de mise à jour ici
    console.log("Formulaire soumis :", form);
  };

  const handleSubmitCoach = (e: React.FormEvent) => {
    e.preventDefault();
    // Appelle ta fonction de mise à jour ici
    console.log("Formulaire soumis :", form);
  };

  return (

<div className='p-4 flex items-center justify-center  md:p-6 dark:bg-gray-900'>

{role === 'CLIENT' ? (
    <form onSubmit={handleSubmitClient} className="space-y-4 z-10 p-10 bg-white shadow-2xl rounded-lg max-w-xl md:max-w-2xl lg:max-w-3xl w-[700px] my-10">
      
        <h1 className="mb-1 text-2xl font-semibold sm:text-2xl text-center">
            Modifier votre Profile Client
          </h1>

      {/* Avatar Preview */}
      <div className="h-24 w-24 mx-auto rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
        {form.photo && typeof form.photo === "string" ? (
          <img src={form.photo} alt="Profil" className="h-full w-full object-cover" />
        ) : (
          <svg className="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
          </svg>
        )}
      </div>

      {/* Nom */}
      <div>
        <label className="block text-sm font-medium">Nom</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {/* Date de naissance + Genre */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium">Date de naissance</label>
          <input
            type="date"
            name="birth_date"
            value={form.birth_date}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium">Genre</label>
          <select
            name="gendre"
            value={form.gendre}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 text-sm border rounded-md bg-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
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
          <label className="block text-sm font-medium">Poids (kg)</label>
          <input
            type="number"
            step="0.01"
            min={0}
            name="weight"
            value={form.weight}
            onChange={handleChange}
            placeholder="Ex: 70.5"
            className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium">Taille (cm)</label>
          <input
            type="number"
            step="0.01"
            min={0}
            name="height"
            value={form.height}
            onChange={handleChange}
            placeholder="Ex: 175.5"
            className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Objectifs */}
      <div>
        <label className="block text-sm font-medium">Objectifs</label>
        <input
          type="text"
          name="goal"
          value={form.goal}
          onChange={handleChange}
          placeholder="Ex: Perte de poids, Prise de masse"
          className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {/* Restrictions alimentaires */}
      <div>
        <label className="block text-sm font-medium">Restrictions alimentaires</label>
        <input
          type="text"
          name="dietary_restrictions"
          value={form.dietary_restrictions}
          onChange={handleChange}
          placeholder="Ex: Végétarien, Allergies"
          className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {/* Problèmes de santé */}
      <div>
        <label className="block text-sm font-medium">Problèmes de santé</label>
        <input
          type="text"
          name="health_issues"
          value={form.health_issues}
          onChange={handleChange}
          placeholder="Ex: Diabète, Hypertension"
          className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {/* Expérience sportive */}
      <div>
        <label className="block text-sm font-medium">Expérience sportive</label>
        <input
          type="text"
          name="sport_experience"
          value={form.sport_experience}
          onChange={handleChange}
          placeholder="Ex: Débutant, Intermédiaire, Avancé"
          className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {/* Photo de Profil */}
      <div>
        <label className="block text-sm font-medium">Photo de Profil</label>
        <input
          type="file"
          name="photo"
          onChange={handleChange}
          className="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
      >
        Enregistrer
      </button>
    </form>
  ) : (
    <form onSubmit={handleSubmitCoach} className="space-y-4 z-10 p-10 bg-white shadow-2xl rounded-lg max-w-xl md:max-w-2xl w-[700px] lg:max-w-3xl my-10">
      
        <h1 className="mb-1 text-2xl font-semibold sm:text-2xl text-center">
            Modifier votre Profile
        </h1>

      {/* Avatar Preview */}
      <div className="h-24 w-24 mx-auto rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
        {form.photo && typeof form.photo === "string" ? (
          <img src={form.photo} alt="Profil" className="h-full w-full object-cover" />
        ) : (
          <svg className="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
          </svg>
        )}
      </div>

      <div>
      <label className="block text-sm font-medium">
      Spécialité
      </label>
        <input
        type="text"
        value={form.specialty ?? ""}
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
        value={form.bio ?? ""}
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
        value={form.certifications ?? ""}
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
        value={form.availability ?? ""}
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
  )

}
    

    

</div>
    
    
  );
};

export default Profile;
