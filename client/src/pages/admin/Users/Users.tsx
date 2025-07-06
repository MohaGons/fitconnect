import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import DataTable from "../../../features/clients/components/DataTable/DataTable";

const allCoaches: React.FC = () => {
  return (
    <div className="dark:bg-gray-900">
      <PageBreadcrumb pageTitle="Tous les clients" />
      
      <DataTable 
      />
    </div>
  );
};

export default allCoaches;