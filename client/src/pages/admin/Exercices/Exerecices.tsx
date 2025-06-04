import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import DataTable from "../../../features/exercices/components/DataTable/DataTable";

const Exerecices: React.FC = () => {
  
  return (
    <div className=" dark:bg-gray-900  ">
     <PageBreadcrumb pageTitle="Exercices" />
      
      <DataTable 
        apiEndpoint="exercices"
        featurePath="exercices"
        searchPlaceholder="Rechercher un exercice..."
      />
    </div>
  );
};

export default Exerecices