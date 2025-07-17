import React from 'react';
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import DataTable from "../../../features/meals/components/DataTable/DataTable";

const Meals: React.FC = () => {
  return (
    <div className="dark:bg-gray-900">
      <PageBreadcrumb pageTitle="Repas" />

      <DataTable
        searchPlaceholder="Rechercher un repas..."
      />
    </div>
  );
};

export default Meals; 