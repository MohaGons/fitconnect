import React from 'react';
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import DataTable from "../../../features/ingredients/components/DataTable/DataTable";

const Ingredients: React.FC = () => {
  return (
    <div className="dark:bg-gray-900">
      <PageBreadcrumb pageTitle="Ingrédients" />

      <DataTable
        searchPlaceholder="Rechercher un ingrédient..."
      />
    </div>
  );
};

export default Ingredients; 