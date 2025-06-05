import React from 'react';
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import DataTable from "../../../features/nutrition/components/DataTable/DataTable";

const Nutrition: React.FC = () => {
  return (
    <div className="dark:bg-gray-900">
      <PageBreadcrumb pageTitle="Plans Nutritionnels" />

      <DataTable
        apiEndpoint="nutrition-plans"
        featurePath="nutrition"
        searchPlaceholder="Rechercher un plan nutritionnel..."
      />
    </div>
  );
};

export default Nutrition;