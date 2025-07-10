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
import mealService from "../../services/mealService";
import {
  Meal,
  MealType,
  MealTypeLabels,
  MEAL_TYPE_OPTIONS,
  MealCreate,
  MealUpdate,
  MealFoodCreate,
} from "../../types";
import { MdRestaurant } from "react-icons/md";
import MealForm from "../MealForm/MealForm";
import TableSkeleton from "../../../../components/common/TableSkeleton";

interface DataTableProps {
  searchPlaceholder?: string;
  initialPageSize?: number;
  initialPageIndex?: number;
  planId?: number; // Pour filtrer par plan nutritionnel
}

interface MealFormData {
  plan_id: number | null;
  name: string;
  meal_type?: MealType;
  calories?: number | string;
  protein?: number | string;
  carbs?: number | string;
  fat?: number | string;
  instructions?: string;
}

const queryKeys = {
  lists: () => ["meals"],
  detail: (id: number) => ["meals", id],
};

const DataTable = ({
  searchPlaceholder = "Rechercher un repas...",
  initialPageSize = 10,
  initialPageIndex = 0,
  planId,
}: DataTableProps) => {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPageIndex,
    pageSize: initialPageSize,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedMealId, setSelectedMealId] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [mealToDelete, setMealToDelete] = useState<number | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  // Construction des filtres pour la requête
  const filters = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: globalFilter,
    plan_id: planId,
    ...Object.fromEntries(columnFilters.map((f) => [f.id, f.value])),
  };

  // Harmonisation : la clé de cache dépend de tous les filtres
  const queryKey = ["meals", filters];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => mealService.getMeals(filters),
  });

  // DEBUG : Affiche la réponse reçue de l'API
  console.log("[DEBUG] Réponse reçue de l'API meals:", data);

  // Requête pour récupérer les détails d'un repas
  const { data: selectedMeal, isLoading: isLoadingDetails } = useQuery({
    queryKey: queryKeys.detail(selectedMealId || 0),
    queryFn: () => mealService.getMealById(selectedMealId || 0),
    enabled:
      !!selectedMealId &&
      (isDetailModalOpen || (isFormModalOpen && formMode === "edit")),
  });

  // Requête pour récupérer les ingrédients du repas sélectionné
  const { data: mealIngredients, isLoading: isLoadingIngredients } = useQuery({
    queryKey: ["meal-foods", selectedMealId],
    queryFn: () => mealService.getMealFoods(selectedMealId || 0),
    enabled: !!selectedMealId && isDetailModalOpen,
  });

  // Mutation pour la suppression
  const deleteMealMutation = useMutation({
    mutationFn: (id: number) => mealService.deleteMeal(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      setIsDeleteModalOpen(false);
      setMealToDelete(null);
    },
  });

  // Mutation pour la création
  const createMealMutation = useMutation({
    mutationFn: async (data: {
      mealData: MealCreate;
      temporaryIngredients?: MealFoodCreate[];
    }) => {
      const { mealData, temporaryIngredients } = data;

      // D'abord créer le repas
      const createdMeal = await mealService.createMeal(mealData);

      // Ensuite ajouter les ingrédients si il y en a
      if (temporaryIngredients && temporaryIngredients.length > 0) {
        for (const ingredient of temporaryIngredients) {
          const ingredientWithMealId = {
            ...ingredient,
            meal_id: createdMeal.meal_id,
          };
          await mealService.addMealFood(ingredientWithMealId);
        }
      }

      return createdMeal;
    },
    onSuccess: (newMeal) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      setIsFormModalOpen(false);

      // Proposer d'ajouter plus d'ingrédients ou de voir le repas
      const shouldViewMeal = window.confirm(
        "Repas créé avec succès ! Voulez-vous voir le résultat final ?"
      );

      if (shouldViewMeal) {
        setTimeout(() => {
          handleOpenDetailModal(newMeal.meal_id);
        }, 100);
      }
    },
  });

  // Mutation pour la mise à jour
  const updateMealMutation = useMutation({
    mutationFn: (data: { id: number; formData: MealCreate }) => {
      const updateData: MealUpdate = {
        ...data.formData,
      };
      return mealService.updateMeal(data.id, updateData);
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      setIsFormModalOpen(false);
    },
  });

  // Gestionnaires d'événements
  const handleOpenDetailModal = (id: number) => {
    setSelectedMealId(id);
    setIsDetailModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setFormMode("add");
    setIsFormModalOpen(true);
    setSelectedMealId(null);
  };

  const handleOpenEditModal = (id: number) => {
    setFormMode("edit");
    setSelectedMealId(id);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedMealId(null);
  };

  const handleOpenDeleteModal = (id: number) => {
    setMealToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (mealToDelete !== null) {
      deleteMealMutation.mutate(mealToDelete);
    }
  };

  const handleSubmitForm = (
    formData: MealFormData,
    temporaryIngredients?: MealFoodCreate[]
  ) => {
    // Conversion des types string en number pour les champs numériques
    const mealData: MealCreate = {
      ...formData,
      calories: formData.calories ? Number(formData.calories) : undefined,
      protein: formData.protein
        ? parseFloat(String(formData.protein))
        : undefined,
      carbs: formData.carbs ? parseFloat(String(formData.carbs)) : undefined,
      fat: formData.fat ? parseFloat(String(formData.fat)) : undefined,
    };

    if (formMode === "add") {
      // En mode création, on passe aussi les ingrédients temporaires
      createMealMutation.mutate({ mealData, temporaryIngredients });
    } else if (selectedMealId) {
      updateMealMutation.mutate({ id: selectedMealId, formData: mealData });
    }
  };

  // Configuration des colonnes
  const columnHelper = createColumnHelper<Meal>();

  const columns = [
    columnHelper.accessor("meal_id", {
      header: "ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("name", {
      header: "Nom du repas",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("meal_type", {
      header: "Type",
      cell: (info) => {
        const mealType = info.getValue() as MealType;
        return mealType ? (
          <Badge color="info" variant="light" size="md">
            {MealTypeLabels[mealType]}
          </Badge>
        ) : (
          "Non défini"
        );
      },
    }),
    columnHelper.accessor("calories", {
      header: "Calories",
      cell: (info) =>
        info.getValue() ? `${info.getValue()} kcal` : "Non défini",
    }),
    columnHelper.accessor(
      (row) => {
        const macros = [];
        if (row.protein) macros.push(`P: ${row.protein}g`);
        if (row.carbs) macros.push(`G: ${row.carbs}g`);
        if (row.fat) macros.push(`L: ${row.fat}g`);
        return macros.length > 0 ? macros.join(" | ") : "Non défini";
      },
      {
        id: "macros",
        header: "Macros (P/G/L)",
        cell: (info) => (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {info.getValue()}
          </span>
        ),
      }
    ),
    columnHelper.accessor(
      (row) => {
        if (!row.plan_id) {
          return "Aucun plan (repas libre)";
        }
        if (row.nutrition_plan?.name) {
          return row.nutrition_plan.name;
        }
        return `Plan #${row.plan_id}`;
      },
      {
        id: "nutrition_plan",
        header: "Plan nutritionnel",
        cell: (info) => (
          <span
            className={
              info.getValue() === "Aucun plan (repas libre)"
                ? "text-gray-500 dark:text-gray-400 italic"
                : ""
            }
          >
            {info.getValue()}
          </span>
        ),
      }
    ),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const meal = row.original;
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleOpenDetailModal(meal.meal_id)}
              className="p-1"
              title="Voir"
            >
              <FaEye color="gray" />
            </button>
            <button
              onClick={() => handleOpenEditModal(meal.meal_id)}
              className="p-1"
              title="Modifier"
            >
              <FaEdit color="gray" />
            </button>
            <button
              onClick={() => handleOpenDeleteModal(meal.meal_id)}
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

        {/* Filtres par types de repas - badges cliquables */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            Types :
          </span>
          <button
            onClick={() => {
              setColumnFilters((prev) =>
                prev.filter((f) => f.id !== "meal_type")
              );
            }}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              !columnFilters.find((f) => f.id === "meal_type")
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Tous
          </button>
          {MEAL_TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setColumnFilters((prev) => {
                  const filtered = prev.filter((f) => f.id !== "meal_type");
                  return [
                    ...filtered,
                    { id: "meal_type", value: option.value as MealType },
                  ];
                });
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                columnFilters.find((f) => f.id === "meal_type")?.value ===
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
          startIcon={<MdRestaurant />}
        >
          Ajouter un repas
        </Button>
      </div>

      {isLoading && <TableSkeleton />}

      {/* Table des repas */}
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
                    <p className="text-gray-500">Aucun repas trouvé</p>
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
        {/* Pagination */}
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
                    repas
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
                  <FaChevronLeft className="h-4 w-4" />
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
                  <FaChevronRight className="h-4 w-4" />
                  <FaChevronRight className="h-4 w-4 -ml-1" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* Modal de détail */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        className="max-w-3xl mx-auto p-6"
      >
        {isLoadingDetails ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : selectedMeal ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Détails du repas
            </h2>

            <div className="space-y-4">
              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom
                  </label>
                  <p className="text-gray-900 dark:text-white font-semibold">
                    {selectedMeal.name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type de repas
                  </label>
                  {selectedMeal.meal_type ? (
                    <Badge color="info" variant="light" size="md">
                      {MealTypeLabels[selectedMeal.meal_type]}
                    </Badge>
                  ) : (
                    <span className="text-gray-500">Non défini</span>
                  )}
                </div>
              </div>

              {/* Plan nutritionnel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Plan nutritionnel
                </label>
                <p className="text-gray-900 dark:text-white">
                  {!selectedMeal.plan_id ? (
                    <span className="text-gray-500 dark:text-gray-400 italic">
                      Aucun plan (repas libre)
                    </span>
                  ) : (
                    <>
                      {selectedMeal.nutrition_plan?.name ||
                        `Plan #${selectedMeal.plan_id}`}
                      {selectedMeal.nutrition_plan?.client && (
                        <span className="text-gray-600 dark:text-gray-400 ml-2">
                          - {selectedMeal.nutrition_plan.client.first_name}{" "}
                          {selectedMeal.nutrition_plan.client.last_name}
                        </span>
                      )}
                      {selectedMeal.nutrition_plan?.coach && (
                        <span className="text-gray-600 dark:text-gray-400 ml-2">
                          (Coach: {selectedMeal.nutrition_plan.coach.first_name}{" "}
                          {selectedMeal.nutrition_plan.coach.last_name})
                        </span>
                      )}
                    </>
                  )}
                </p>
              </div>

              {/* Informations nutritionnelles */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Informations nutritionnelles
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {selectedMeal.calories || "-"}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Calories (kcal)
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {selectedMeal.protein || "-"}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Protéines (g)
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {selectedMeal.carbs || "-"}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Glucides (g)
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                      {selectedMeal.fat || "-"}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Lipides (g)
                    </div>
                  </div>
                </div>
              </div>

              {/* Ingrédients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Ingrédients
                </label>
                {isLoadingIngredients ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-500">
                      Chargement des ingrédients...
                    </span>
                  </div>
                ) : mealIngredients && mealIngredients.length > 0 ? (
                  <div className="space-y-3">
                    {mealIngredients.map((ingredient) => (
                      <div
                        key={ingredient.meal_food_id}
                        className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {ingredient.food_item?.name ||
                              `Aliment #${ingredient.food_item_id}`}
                          </div>
                          {ingredient.food_item?.category && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Catégorie: {ingredient.food_item.category}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {ingredient.quantity} {ingredient.unit}
                          </div>
                          {ingredient.food_item &&
                            ingredient.food_item.calories && (
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                ~
                                {Math.round(
                                  (ingredient.food_item.calories *
                                    ingredient.quantity) /
                                    100
                                )}{" "}
                                kcal
                              </div>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">
                      Aucun ingrédient ajouté
                    </p>
                  </div>
                )}
              </div>

              {/* Instructions */}
              {selectedMeal.instructions && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Instructions de préparation
                  </label>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                      {selectedMeal.instructions}
                    </p>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Créé le
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(selectedMeal.created_at).toLocaleString("fr-FR")}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Modifié le
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(selectedMeal.updated_at).toLocaleString("fr-FR")}
                  </p>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
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
                  handleOpenEditModal(selectedMeal.meal_id);
                }}
                variant="primary"
                size="md"
                startIcon={<FaEdit />}
              >
                Modifier
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">Aucune donnée disponible</p>
          </div>
        )}
      </Modal>

      {/* Modal de formulaire */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        className="max-w-4xl mx-auto p-6"
      >
        {formMode === "edit" && isLoadingDetails ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <MealForm
            mealData={selectedMeal}
            isSubmitting={
              createMealMutation.isPending || updateMealMutation.isPending
            }
            formError={(
              createMealMutation.error || updateMealMutation.error
            )?.toString()}
            onSubmit={(formData, temporaryIngredients) =>
              handleSubmitForm(formData, temporaryIngredients)
            }
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
              Êtes-vous sûr de vouloir supprimer ce repas ? Cette action est
              irréversible.
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
