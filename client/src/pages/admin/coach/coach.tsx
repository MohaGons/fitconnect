import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import DataTable from "../../../features/exercices/components/DataTable/DataTable";

const Coach: React.FC = () => {
  return (
    <div className="dark:bg-gray-900">
      <PageBreadcrumb pageTitle="Coachs" />
      
      <DataTable 
        apiEndpoint="coaches"
        featurePath="coach"
        searchPlaceholder="Rechercher un coach..."
      />
    </div>
  );
};

export default Coach;