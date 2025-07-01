import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
  SortingState,
  ColumnFiltersState,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import Select from "../../../../components/form/Select";
import Badge from "../../../../components/ui/badge/Badge";
import { Modal } from "../../../../components/ui/modal/index";
import nutritionService from "../../services/nutritionService";
import {
  NutritionPlan,
  NutritionGoal,
  NutritionGoalLabels,
  NUTRITION_GOAL_OPTIONS,
  NutritionPlanCreate,
  NutritionPlanUpdate,
} from "../../types";
import { IoMdNutrition } from "react-icons/io";
import NutritionPlanForm from "../NutritionPlanForm/NutritionPlanForm";
import TableSkeleton from "../../../../components/common/TableSkeleton";

interface DataTableProps {
  searchPlaceholder?: string;
  initialPageSize?: number;
  initialPageIndex?: number;
}

const queryKeys = {
  lists: () => ["nutrition-plans"],
  detail: (id: number) => ["nutrition-plans", id],
};

const DataTable = ({
  searchPlaceholder = "Rechercher...",
  initialPageSize = 10,
  initialPageIndex = 0,
}: DataTableProps) => {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPageIndex,
    pageSize: initialPageSize,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<number | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  // Construction des filtres pour la requête
  const filters = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: globalFilter,
    ...Object.fromEntries(columnFilters.map((f) => [f.id, f.value])),
  };

  // Harmonisation : la clé de cache dépend de tous les filtres
  const queryKey = ["nutrition-plans", filters];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => nutritionService.getNutritionPlans(filters),
  });

  // DEBUG : Affiche la réponse reçue de l'API
  console.log("[DEBUG] Réponse reçue de l'API:", data);

  // Requête pour récupérer les détails d'un plan
  const { data: selectedPlan, isLoading: isLoadingDetails } = useQuery({
    queryKey: queryKeys.detail(selectedPlanId || 0),
    queryFn: () => nutritionService.getNutritionPlanById(selectedPlanId || 0),
    enabled:
      !!selectedPlanId &&
      (isDetailModalOpen || (isFormModalOpen && formMode === "edit")),
  });

  // Mutation pour la suppression
  const deletePlanMutation = useMutation({
    mutationFn: (id: number) => nutritionService.deleteNutritionPlan(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      // Invalider aussi le cache des repas car ils peuvent avoir été détachés du plan
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      setIsDeleteModalOpen(false);
      setPlanToDelete(null);
    },
  });

  // Mutation pour la création
  const createPlanMutation = useMutation({
    mutationFn: (data: NutritionPlanCreate) =>
      nutritionService.createNutritionPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      setIsFormModalOpen(false);
    },
  });

  // Mutation pour la mise à jour
  const updatePlanMutation = useMutation({
    mutationFn: (data: { id: number; formData: NutritionPlanCreate }) => {
      const updateData: NutritionPlanUpdate = {
        ...data.formData,
      };
      return nutritionService.updateNutritionPlan(data.id, updateData);
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      setIsFormModalOpen(false);
    },
  });

  // Gestionnaires d'événements
  const handleOpenDetailModal = (id: number) => {
    setSelectedPlanId(id);
    setIsDetailModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setFormMode("add");
    setIsFormModalOpen(true);
    setSelectedPlanId(null);
  };

  const handleOpenEditModal = (id: number) => {
    setFormMode("edit");
    setSelectedPlanId(id);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedPlanId(null);
  };

  const handleOpenDeleteModal = (id: number) => {
    setPlanToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (planToDelete !== null) {
      deletePlanMutation.mutate(planToDelete);
    }
  };

  const handleSubmitForm = (formData: NutritionPlanCreate) => {
    if (formMode === "add") {
      createPlanMutation.mutate(formData);
    } else if (selectedPlanId) {
      updatePlanMutation.mutate({ id: selectedPlanId, formData });
    }
  };

  // Configuration des colonnes
  const columnHelper = createColumnHelper<NutritionPlan>();

  const columns = [
    columnHelper.accessor("plan_id", {
      header: "ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("name", {
      header: "Nom",
      cell: (info) => info.getValue() || "Plan sans nom",
    }),
    columnHelper.accessor(
      (row) => {
        if (row.coach && row.coach.first_name && row.coach.last_name) {
          return `${row.coach.first_name} ${row.coach.last_name}`;
        }
        if (row.coach_id) {
          return `ID: ${row.coach_id}`;
        }
        return "Non assigné";
      },
      {
        id: "coach",
        header: "Coach",
        cell: (info) => info.getValue(),
      }
    ),
    columnHelper.accessor(
      (row) => {
        if (row.client && row.client.first_name && row.client.last_name) {
          return `${row.client.first_name} ${row.client.last_name}`;
        }
        if (row.client_id) {
          return `ID: ${row.client_id}`;
        }
        return "Non assigné";
      },
      {
        id: "client",
        header: "Client",
        cell: (info) => info.getValue(),
      }
    ),
    columnHelper.accessor("daily_calories", {
      header: "Calories quotidiennes",
      cell: (info) =>
        info.getValue() ? `${info.getValue()} kcal` : "Non défini",
    }),
    columnHelper.accessor("goal", {
      header: "Objectif",
      cell: (info) => {
        const goal = info.getValue() as NutritionGoal;
        return goal ? (
          <Badge color="info" variant="light" size="md">
            {NutritionGoalLabels[goal]}
          </Badge>
        ) : (
          "Non défini"
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const plan = row.original;
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleOpenDetailModal(plan.plan_id)}
              className="p-1"
              title="Voir"
            >
              <FaEye color="gray" />
            </button>
            <button
              onClick={() => handleOpenEditModal(plan.plan_id)}
              className="p-1"
              title="Modifier"
            >
              <FaEdit color="gray" />
            </button>
            <button
              onClick={() => handleOpenDeleteModal(plan.plan_id)}
              className="p-1"
              title="Supprimer"
            >
              <FaTrash color="gray" />
            </button>
          </div>
        );
      },
    }),
  ];

  // Configuration de la table
  const table = useReactTable({
    data: data?.data || [],
    columns,
    pageCount:
      data && data.total ? Math.ceil(data.total / pagination.pageSize) : -1,
    state: {
      sorting,
      columnFilters,
      pagination,
      globalFilter,
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
  });

  // Rendu des icônes de tri
  const renderSortingIcon = (isSorted: false | string) => {
    if (!isSorted)
      return <FaSort className="ml-1 text-gray-400 inline-block" />;
    return isSorted === "asc" ? (
      <FaSortUp className="ml-1 text-blue-600 inline-block" />
    ) : (
      <FaSortDown className="ml-1 text-blue-600 inline-block" />
    );
  };

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Erreur: Une erreur est survenue lors du chargement des données.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-72">
          <FaSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 "
            color="gray"
          />
          <Input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
          />
        </div>

        {/* Filtres par objectifs - badges cliquables */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            Objectifs :
          </span>
          <button
            onClick={() => {
              setColumnFilters((prev) => prev.filter((f) => f.id !== "goal"));
            }}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              !columnFilters.find((f) => f.id === "goal")
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Tous
          </button>
          {NUTRITION_GOAL_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setColumnFilters((prev) => {
                  const filtered = prev.filter((f) => f.id !== "goal");
                  return [
                    ...filtered,
                    { id: "goal", value: option.value as NutritionGoal },
                  ];
                });
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                columnFilters.find((f) => f.id === "goal")?.value ===
                option.value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <Button
          onClick={handleOpenAddModal}
          variant="primary"
          size="sm"
          className="w-56"
          startIcon={<IoMdNutrition />}
        >
          Ajouter un plan
        </Button>
      </div>

      {isLoading && <TableSkeleton />}

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:border-white/[0.05] dark:bg-gray-900">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "cursor-pointer select-none flex items-center"
                              : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() &&
                            renderSortingIcon(header.column.getIsSorted())}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-16 text-center"
                  >
                    <p className="text-gray-500">
                      Aucun plan nutritionnel trouvé
                    </p>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 dark:bg-gray-900 dark:text-white"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 whitespace-nowrap "
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination harmonisée */}
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:bg-gray-900">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              variant="outline"
              size="sm"
              className={
                !table.getCanPreviousPage()
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }
            >
              Précédent
            </Button>
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              variant="outline"
              size="sm"
              className={
                !table.getCanNextPage() ? "cursor-not-allowed opacity-50" : ""
              }
            >
              Suivant
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Page{" "}
                <span className="font-medium">
                  {table.getState().pagination.pageIndex + 1}
                </span>{" "}
                sur <span className="font-medium">{table.getPageCount()}</span>{" "}
                {data?.total !== undefined && (
                  <>
                    | Total: <span className="font-medium">{data.total}</span>{" "}
                    élément(s)
                  </>
                )}
              </p>
            </div>
            <div className="flex gap-x-2 items-center">
              <span className="text-sm text-gray-700">Afficher</span>
              <Select
                options={[10, 20, 30, 40, 50].map((pageSize) => ({
                  value: pageSize.toString(),
                  label: pageSize.toString(),
                }))}
                defaultValue={table.getState().pagination.pageSize.toString()}
                onChange={(value) => {
                  table.setPageSize(Number(value));
                }}
                className="w-20"
              />
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <Button
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  variant="outline"
                  size="sm"
                  className={
                    !table.getCanPreviousPage()
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }
                >
                  <span className="sr-only">Première page</span>
                  <FaChevronLeft className="h-4 w-4" color="color-primary" />
                  <FaChevronLeft className="h-4 w-4 -ml-1" />
                </Button>
                <Button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  variant="outline"
                  size="sm"
                  className={
                    !table.getCanPreviousPage()
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }
                >
                  <span className="sr-only">Page précédente</span>
                  <FaChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  variant="outline"
                  size="sm"
                  className={
                    !table.getCanNextPage()
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }
                >
                  <span className="sr-only">Page suivante</span>
                  <FaChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  variant="outline"
                  size="sm"
                  className={
                    !table.getCanNextPage()
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }
                >
                  <span className="sr-only">Dernière page</span>
                  <FaChevronRight className="h-4 w-4" />
                  <FaChevronRight className="h-4 w-4 -ml-1" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de détails */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        className="max-w-2xl mx-auto p-6"
      >
        {isLoadingDetails ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : selectedPlan ? (
          <div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Plan nutritionnel #{selectedPlan.plan_id}
                </h1>
                <div className="mt-2 md:mt-0">
                  {selectedPlan.goal && (
                    <Badge color="info" variant="light" size="md">
                      {NutritionGoalLabels[selectedPlan.goal]}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Informations générales
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Coach
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedPlan.coach
                            ? `${selectedPlan.coach.first_name} ${selectedPlan.coach.last_name}`
                            : "Non assigné"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Client
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedPlan.client
                            ? `${selectedPlan.client.first_name} ${selectedPlan.client.last_name}`
                            : "Non assigné"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Calories quotidiennes
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedPlan.daily_calories
                            ? `${selectedPlan.daily_calories} kcal`
                            : "Non défini"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Date de création
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(
                            selectedPlan.creation_date
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Commentaires */}
              {selectedPlan.comments && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Commentaires
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {selectedPlan.comments}
                    </p>
                  </div>
                </div>
              )}

              {/* Liste des repas */}
              {selectedPlan.meals && selectedPlan.meals.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Repas ({selectedPlan.meals.length})
                  </h2>
                  <div className="space-y-3">
                    {selectedPlan.meals.map((meal) => (
                      <div
                        key={meal.meal_id}
                        className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {meal.name}
                          </h3>
                          {meal.meal_type && (
                            <Badge color="info" variant="light" size="sm">
                              {meal.meal_type}
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          {meal.calories && (
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">
                                Calories
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {meal.calories} kcal
                              </p>
                            </div>
                          )}
                          {meal.protein && (
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">
                                Protéines
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {meal.protein}g
                              </p>
                            </div>
                          )}
                          {meal.carbs && (
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">
                                Glucides
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {meal.carbs}g
                              </p>
                            </div>
                          )}
                          {meal.fat && (
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">
                                Lipides
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {meal.fat}g
                              </p>
                            </div>
                          )}
                        </div>
                        {meal.instructions && (
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {meal.instructions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-6">
                <Button
                  onClick={() => setIsDetailModalOpen(false)}
                  variant="outline"
                  size="md"
                >
                  Fermer
                </Button>
                <Button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleOpenEditModal(selectedPlan.plan_id);
                  }}
                  variant="primary"
                  size="md"
                  startIcon={<FaEdit />}
                >
                  Modifier
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p>Aucune donnée disponible</p>
          </div>
        )}
      </Modal>

      {/* Modal de formulaire */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        className="max-w-2xl mx-auto p-6"
      >
        {formMode === "edit" && isLoadingDetails ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <NutritionPlanForm
            planData={selectedPlan}
            isSubmitting={
              createPlanMutation.isPending || updatePlanMutation.isPending
            }
            formError={(
              createPlanMutation.error || updatePlanMutation.error
            )?.toString()}
            onSubmit={handleSubmitForm}
            onCancel={handleCloseFormModal}
            mode={formMode}
          />
        )}
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        className="max-w-md mx-auto p-6"
      >
        <div className="text-center">
          <div className="mt-2 mb-5">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Confirmation de suppression
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Êtes-vous sûr de vouloir supprimer ce plan nutritionnel ? Cette
              action est irréversible.
            </p>
          </div>
          <div className="flex justify-around space-x-3">
            <Button
              onClick={() => setIsDeleteModalOpen(false)}
              variant="outline"
              size="md"
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="primary"
              size="md"
              className="bg-error-500 hover:bg-error-600"
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DataTable;
