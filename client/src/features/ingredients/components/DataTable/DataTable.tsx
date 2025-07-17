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
import ingredientService from "../../services/ingredientService";
import {
  FoodItem,
  FoodItemCreate,
  FOOD_CATEGORIES,
  FoodItemFilters,
} from "../../types";
import { MdRestaurant } from "react-icons/md";
import IngredientForm from "../IngredientForm/IngredientForm";
import TableSkeleton from "../../../../components/common/TableSkeleton";

interface DataTableProps {
  searchPlaceholder?: string;
  initialPageSize?: number;
  initialPageIndex?: number;
}

interface IngredientFormData {
  name: string;
  calories?: number | string;
  protein?: number | string;
  carbs?: number | string;
  fat?: number | string;
  category?: string;
}

const queryKeys = {
  lists: () => ["ingredients"],
  detail: (id: number) => ["ingredients", id],
};

const DataTable = ({
  searchPlaceholder = "Rechercher un ingrédient...",
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
  const [selectedIngredientId, setSelectedIngredientId] = useState<
    number | null
  >(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ingredientToDelete, setIngredientToDelete] = useState<number | null>(
    null
  );
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  // Construction des filtres pour la requête
  const filters: FoodItemFilters = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: globalFilter,
    category: columnFilters.find((f) => f.id === "category")?.value as string,
  };

  // Harmonisation : la clé de cache dépend de tous les filtres
  const queryKey = ["ingredients", filters];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => ingredientService.getFoodItemsPaginated(filters),
  });

  // DEBUG : Affiche la réponse reçue de l'API
  console.log("[DEBUG] Réponse reçue de l'API ingredients:", data);

  // Requête pour récupérer les détails d'un ingrédient
  const { data: selectedIngredient, isLoading: isLoadingDetails } = useQuery({
    queryKey: queryKeys.detail(selectedIngredientId || 0),
    queryFn: () => ingredientService.getFoodItemById(selectedIngredientId || 0),
    enabled:
      !!selectedIngredientId &&
      (isDetailModalOpen || (isFormModalOpen && formMode === "edit")),
  });

  // Mutation pour la suppression
  const deleteIngredientMutation = useMutation({
    mutationFn: (id: number) => {
      console.log("[DEBUG] Appel API de suppression pour l'ID:", id);
      return ingredientService.deleteFoodItem(id);
    },
    onSuccess: (_data, id) => {
      console.log("[DEBUG] Suppression réussie pour l'ID:", id);
      queryClient.removeQueries({ queryKey: queryKeys.detail(id) });
      // Invalider toutes les requêtes d'ingrédients (paginées et non paginées)
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      setIsDeleteModalOpen(false);
      setIngredientToDelete(null);
    },
    onError: (error, id) => {
      console.log(
        "[DEBUG] Erreur lors de la suppression de l'ID:",
        id,
        "Erreur:",
        error
      );
    },
  });

  // Mutation pour la création
  const createIngredientMutation = useMutation({
    mutationFn: (data: FoodItemCreate) =>
      ingredientService.createFoodItem(data),
    onSuccess: () => {
      // Invalider toutes les requêtes d'ingrédients
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      setIsFormModalOpen(false);
    },
  });

  // Mutation pour la mise à jour
  const updateIngredientMutation = useMutation({
    mutationFn: (data: { id: number; formData: FoodItemCreate }) => {
      const updateData = {
        ...data.formData,
      };
      return ingredientService.updateFoodItem(data.id, updateData);
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(data.id) });
      // Invalider toutes les requêtes d'ingrédients
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      setIsFormModalOpen(false);
    },
  });

  // Gestionnaires d'événements
  const handleOpenDetailModal = (id: number) => {
    setSelectedIngredientId(id);
    setIsDetailModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setFormMode("add");
    setIsFormModalOpen(true);
    setSelectedIngredientId(null);
  };

  const handleOpenEditModal = (id: number) => {
    setFormMode("edit");
    setSelectedIngredientId(id);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedIngredientId(null);
  };

  const handleOpenDeleteModal = (id: number) => {
    setIngredientToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log(
      "[DEBUG] handleConfirmDelete appelé, ingredientToDelete:",
      ingredientToDelete
    );
    if (ingredientToDelete !== null) {
      console.log(
        "[DEBUG] Lancement de la suppression pour l'ID:",
        ingredientToDelete
      );
      deleteIngredientMutation.mutate(ingredientToDelete);
    } else {
      console.log("[DEBUG] Erreur: ingredientToDelete est null");
    }
  };

  const handleSubmitForm = (formData: IngredientFormData) => {
    // Conversion des types string en number pour les champs numériques
    const ingredientData: FoodItemCreate = {
      ...formData,
      calories: formData.calories ? Number(formData.calories) : undefined,
      protein: formData.protein
        ? parseFloat(String(formData.protein))
        : undefined,
      carbs: formData.carbs ? parseFloat(String(formData.carbs)) : undefined,
      fat: formData.fat ? parseFloat(String(formData.fat)) : undefined,
    };

    if (formMode === "add") {
      createIngredientMutation.mutate(ingredientData);
    } else if (selectedIngredientId) {
      updateIngredientMutation.mutate({
        id: selectedIngredientId,
        formData: ingredientData,
      });
    }
  };

  // Configuration des colonnes
  const columnHelper = createColumnHelper<FoodItem>();

  const columns = [
    columnHelper.accessor("food_id", {
      header: "ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("name", {
      header: "Nom",
      cell: (info) => (
        <div className="font-medium text-gray-900 dark:text-white">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("category", {
      header: "Catégorie",
      cell: (info) => {
        const category = info.getValue();
        return category ? (
          <Badge color="info" variant="light" size="sm">
            {FOOD_CATEGORIES.find((cat) => cat.value === category)?.label ||
              category}
          </Badge>
        ) : (
          <span className="text-gray-500">Non définie</span>
        );
      },
    }),
    columnHelper.accessor("calories", {
      header: "Calories (100g)",
      cell: (info) => (info.getValue() ? `${info.getValue()} kcal` : "-"),
    }),
    columnHelper.accessor(
      (row) => {
        const macros = [];
        if (row.protein) macros.push(`P: ${row.protein}g`);
        if (row.carbs) macros.push(`G: ${row.carbs}g`);
        if (row.fat) macros.push(`L: ${row.fat}g`);
        return macros.length > 0 ? macros.join(" | ") : "-";
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
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const ingredient = row.original;
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleOpenDetailModal(ingredient.food_id)}
              className="p-1"
              title="Voir"
            >
              <FaEye color="gray" />
            </button>
            <button
              onClick={() => handleOpenEditModal(ingredient.food_id)}
              className="p-1"
              title="Modifier"
            >
              <FaEdit color="gray" />
            </button>
            <button
              onClick={() => handleOpenDeleteModal(ingredient.food_id)}
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
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
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

        {/* Filtres par catégories - badges cliquables */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            Catégories :
          </span>
          <button
            onClick={() => {
              setColumnFilters((prev) =>
                prev.filter((f) => f.id !== "category")
              );
            }}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              !columnFilters.find((f) => f.id === "category")
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Toutes
          </button>
          {FOOD_CATEGORIES.map((category) => (
            <button
              key={category.value}
              onClick={() => {
                setColumnFilters((prev) => {
                  const filtered = prev.filter((f) => f.id !== "category");
                  return [
                    ...filtered,
                    { id: "category", value: category.value },
                  ];
                });
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                columnFilters.find((f) => f.id === "category")?.value ===
                category.value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {category.label}
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
          Ajouter un ingrédient
        </Button>
      </div>

      {isLoading && <TableSkeleton />}

      {/* Table des ingrédients */}
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
                    <p className="text-gray-500">Aucun ingrédient trouvé</p>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 dark:bg-gray-900 dark:text-white"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
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

        {/* Pagination avancée */}
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
                    ingrédients
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
        ) : selectedIngredient ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Détails de l'ingrédient
            </h2>

            <div className="space-y-4">
              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom
                  </label>
                  <p className="text-gray-900 dark:text-white font-semibold">
                    {selectedIngredient.name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Catégorie
                  </label>
                  {selectedIngredient.category ? (
                    <Badge color="info" variant="light" size="md">
                      {FOOD_CATEGORIES.find(
                        (cat) => cat.value === selectedIngredient.category
                      )?.label || selectedIngredient.category}
                    </Badge>
                  ) : (
                    <span className="text-gray-500">Non définie</span>
                  )}
                </div>
              </div>

              {/* Informations nutritionnelles pour 100g */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Informations nutritionnelles (pour 100g)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {selectedIngredient.calories || "-"}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Calories (kcal)
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {selectedIngredient.protein || "-"}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Protéines (g)
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {selectedIngredient.carbs || "-"}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Glucides (g)
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                      {selectedIngredient.fat || "-"}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Lipides (g)
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Créé le
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(selectedIngredient.created_at).toLocaleString(
                      "fr-FR"
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Modifié le
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(selectedIngredient.updated_at).toLocaleString(
                      "fr-FR"
                    )}
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
                  handleOpenEditModal(selectedIngredient.food_id);
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
          <IngredientForm
            ingredientData={selectedIngredient}
            isSubmitting={
              createIngredientMutation.isPending ||
              updateIngredientMutation.isPending
            }
            formError={(
              createIngredientMutation.error || updateIngredientMutation.error
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
              Êtes-vous sûr de vouloir supprimer cet ingrédient ? Cette action
              est irréversible.
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
