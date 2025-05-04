// components/ClientForm.tsx
const ClientForm = () => {
    return (
      <form className="space-y-4">
        <input type="text" placeholder="Nom du client" className="border p-2 w-full" />
        <input type="email" placeholder="Email" className="border p-2 w-full" />
        <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded">
          Enregistrer Client
        </button>
      </form>
    );
  };
  
  export default ClientForm;
  