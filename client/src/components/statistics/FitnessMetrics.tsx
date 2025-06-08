import {
  ArrowDownIcon,
  ArrowUpIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { Activity, Flame, Calendar, Weight } from "lucide-react";

export default function FitnessMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Métrique Séances Réalisées --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl dark:bg-gray-800">
          <Activity className="text-orange-500 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Séances ce mois
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              18/24
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            12.5%
          </Badge>
        </div>
      </div>
      {/* <!-- Métrique Séances End --> */}

      {/* <!-- Métrique Calories --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl dark:bg-gray-800">
          <Flame className="text-orange-500 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Calories brûlées
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              8,245 kcal
            </h4>
          </div>

          <Badge color="success">
            <ArrowUpIcon />
            18.2%
          </Badge>
        </div>
      </div>
      {/* <!-- Métrique Calories End --> */}

      {/* <!-- Métrique Poids Actuel --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl dark:bg-gray-800">
          <Weight className="text-orange-500 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Poids actuel
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              72.5 kg
            </h4>
          </div>

          <Badge color="success">
            <ArrowDownIcon />
            2.5 kg
          </Badge>
        </div>
      </div>
      {/* <!-- Métrique Poids End --> */}

      {/* <!-- Métrique Jours d'entraînement --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl dark:bg-gray-800">
          <Calendar className="text-orange-500 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Régularité
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              87%
            </h4>
          </div>

          <Badge color="success">
            <ArrowUpIcon />
            5%
          </Badge>
        </div>
      </div>
      {/* <!-- Métrique Régularité End --> */}
    </div>
  );
}