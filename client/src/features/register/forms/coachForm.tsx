// components/CoachForm.tsx
const CoachForm= () => {
    return (
      <form className="space-y-4">
        <input type="text" placeholder="Nom du coach" className="border p-2 w-full" />
        <input type="text" placeholder="Spécialité" className="border p-2 w-full" />
        <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded">
          Enregistrer Coach
        </button>
      </form>
    );
  };
  
  export default CoachForm;
  