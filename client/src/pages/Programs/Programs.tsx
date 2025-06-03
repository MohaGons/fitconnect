import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import DataTable from "../../features/programs/components/DataTable/DataTable";

const Programs: React.FC = () => {
  return (
    <div className=" dark:bg-gray-900  ">
      <PageBreadcrumb pageTitle="Programmes" />

      <DataTable
        apiEndpoint="programs"
        featurePath="programs"
        searchPlaceholder="Rechercher un programme..."
      />
    </div>
  );
};

export default Programs;
