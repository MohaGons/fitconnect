import PageMeta from "../../../components/common/PageMeta";
import FitnessMetrics from "../../../components/statistics/FitnessMetrics";
import WeightProgressChart from "../../../components/statistics/WeightProgressChart";
import MonthlyGoal from "../../../components/statistics/MonthlyGoal";
import PerformanceChart from "../../../components/statistics/PerformanceChart";

export default function HomeClient() {
  return (
    <>
      <PageMeta
        title="Mon Tableau de Bord | FitConnect"
        description="Suivez vos progrès, accédez à vos programmes d'entraînement personnalisés et gérez votre planning fitness depuis votre tableau de bord FitConnect."
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6 dark:bg-gray-900">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <FitnessMetrics />
          <WeightProgressChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyGoal />
        </div>

        <div className="col-span-12">
          <PerformanceChart />
        </div>
      </div>
    </>
  );
}