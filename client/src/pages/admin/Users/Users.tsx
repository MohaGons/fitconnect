import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import DataTable from "../../../features/exercices/components/DataTable/DataTable";

const allCoaches: React.FC = () => {
  return (
    <div className="dark:bg-gray-900">
      <PageBreadcrumb pageTitle="Utilisateurs" />
      
      <DataTable 
        apiEndpoint="clients"
        featurePath="users"
        searchPlaceholder="Rechercher un utilisateur..."
      />
    </div>
  );
};

export default allCoaches;