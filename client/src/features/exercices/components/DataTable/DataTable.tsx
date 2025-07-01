import { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
  SortingState,
  ColumnFiltersState,
  ColumnDef,
  OnChangeFn,
  Row,
  Cell,
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
import exercicesService from "../../services/exercicesService";
import {
  Exercise,
  MuscleCategoryLabels,
  DifficultyLevelLabels,
  DifficultyLevel,
  MuscleCategory,
  ExerciseUpdate,
} from "../../types";
import { IoMdFitness } from "react-icons/io";
import ExerciseForm from "../ExerciseForm/ExerciseForm";
import TableSkeleton from "../../../../components/common/TableSkeleton";

interface Filters {
  page: number;
  limit: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  muscle_category?: MuscleCategory;
  difficulty_level?: DifficultyLevel;
  [key: string]: unknown;
}

// Type pour le formulaire adapté à l'entité
interface ExerciseFormData {
  name: string;
  description: string;
  muscle_category: MuscleCategory;
  difficulty_level: DifficultyLevel;
  image: string;
  video_url: string;
}

const queryKeys = {
  all: ["exercises"] as const,
  lists: () => [...queryKeys.all, "list"] as const,
  list: (filters: Filters) => [...queryKeys.lists(), filters] as const,
  details: () => [...queryKeys.all, "detail"] as const,
  detail: (id: number) => [...queryKeys.details(), id] as const,
};

interface DataTableProps {
  apiEndpoint?: string;
  featurePath?: string;
  searchPlaceholder?: string;
  initialPageSize?: number;
  initialPageIndex?: number;
}

export function DataTable({
  searchPlaceholder = "Rechercher...",
  initialPageSize = 10,
  initialPageIndex = 0,
}: DataTableProps) {
  const queryClient = useQueryClient();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPageIndex,
    pageSize: initialPageSize,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedGlobalFilter(globalFilter);
    }, 300);

    return () => clearTimeout(timer);
  }, [globalFilter]);

  const queryParams: Filters = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedGlobalFilter,
    ...(sorting.length > 0 && {
      sort: sorting[0].id,
      order: sorting[0].desc ? "desc" : "asc",
    }),
    ...Object.fromEntries(
      columnFilters.map((filter) => [filter.id, filter.value])
    ),
  };

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.list(queryParams),
    queryFn: () => exercicesService.getExercises(queryParams),
  });

  const { data: selectedExercise, isLoading: isLoadingDetails } = useQuery({
    queryKey: queryKeys.detail(selectedExerciseId || 0),
    queryFn: () => exercicesService.getExerciseById(selectedExerciseId || 0),
    enabled:
      !!selectedExerciseId &&
      (isDetailModalOpen || (isFormModalOpen && formMode === "edit")),
  });

  const deleteExerciseMutation = useMutation({
    mutationFn: (id: number) => exercicesService.deleteExercise(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      setIsDeleteModalOpen(false);
      setExerciseToDelete(null);
    },
  });

  const createExerciseMutation = useMutation({
    mutationFn: (data: ExerciseFormData) =>
      exercicesService.createExercise(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      setIsFormModalOpen(false);
    },
  });

  const updateExerciseMutation = useMutation({
    mutationFn: (data: { id: number; formData: ExerciseFormData }) => {
      const updateData: ExerciseUpdate = {
        ...data.formData,
      };
      return exercicesService.updateExercise(data.id, updateData);
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      setIsFormModalOpen(false);
    },
  });

  const handleOpenDetailModal = (id: number) => {
    setSelectedExerciseId(id);
    setIsDetailModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setFormMode("add");
    setIsFormModalOpen(true);
    setSelectedExerciseId(null);
  };

  const handleOpenEditModal = (id: number) => {
    setFormMode("edit");
    setSelectedExerciseId(id);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedExerciseId(null);
  };

  const handleOpenDeleteModal = (id: number) => {
    setExerciseToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (exerciseToDelete !== null) {
      deleteExerciseMutation.mutate(exerciseToDelete);
    }
  };

  const handleSubmitForm = (formData: ExerciseFormData) => {
    if (formMode === "add") {
      createExerciseMutation.mutate(formData);
    } else if (selectedExerciseId) {
      updateExerciseMutation.mutate({ id: selectedExerciseId, formData });
    }
  };

  const difficultyColorMap: Record<
    DifficultyLevel,
    { color: "success" | "info" | "warning" | "error"; label: string }
  > = {
    beginner: { color: "success", label: DifficultyLevelLabels.beginner },
    intermediate: { color: "info", label: DifficultyLevelLabels.intermediate },
    advanced: { color: "warning", label: DifficultyLevelLabels.advanced },
    expert: { color: "error", label: DifficultyLevelLabels.expert },
  };

  const columnHelper = createColumnHelper<Exercise>();

  const columns: ColumnDef<Exercise>[] = [
    columnHelper.accessor("image", {
      header: "Image",
      cell: ({ row }: { row: Row<Exercise> }) => (
        <div className="flex items-center justify-center">
          <div className="h-10 w-10 flex-shrink-0">
            <img
              src={row.original.image || "/placeholder-image.jpg"}
              alt={row.original.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>
        </div>
      ),
      enableSorting: false,
    }),

    columnHelper.accessor("name", {
      header: "Nom",
      cell: (info: Cell<Exercise, string>) => info.getValue(),
      enableSorting: true,
    }),

    columnHelper.accessor("muscle_category", {
      header: "Catégorie",
      cell: (info: Cell<Exercise, string>) =>
        MuscleCategoryLabels[info.getValue() as MuscleCategory],
      enableSorting: true,
      filterFn: "equals",
    }),

    columnHelper.accessor("difficulty_level", {
      header: "Difficulté",
      cell: (info: Cell<Exercise, string>) => {
        const level = info.getValue() as DifficultyLevel;
        const { color, label } = difficultyColorMap[level] || {
          color: "light",
          label: "Inconnu",
        };

        return (
          <Badge color={color} variant="light" size="md">
            {label}
          </Badge>
        );
      },
      enableSorting: true,
      filterFn: "equals",
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: Row<Exercise> }) => {
        const exercise = row.original;

        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleOpenDetailModal(exercise.exercise_id)}
              className="p-1"
              title="Voir"
            >
              <FaEye color="gray" />
            </button>
            <button
              onClick={() => handleOpenEditModal(exercise.exercise_id)}
              className="p-1"
              title="Modifier"
            >
              <FaEdit color="gray" />
            </button>
            <button
              onClick={() => handleOpenDeleteModal(exercise.exercise_id)}
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
  const handlePaginationChange: OnChangeFn<PaginationState> = (
    updaterOrValue
  ) => {
    setPagination((prev) => {
      if (typeof updaterOrValue === "function") {
        return updaterOrValue(prev);
      }
      return updaterOrValue;
    });
  };
  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilter(value);
  };

  const table = useReactTable({
    data: data?.data || [],
    columns,
    pageCount: data?.total ? Math.ceil(data.total / pagination.pageSize) : -1,
    state: {
      sorting,
      columnFilters,
      pagination,
      globalFilter,
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onPaginationChange: handlePaginationChange,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: handleGlobalFilterChange,
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

  const isSubmittingForm =
    createExerciseMutation.isPending || updateExerciseMutation.isPending;
  const formError =
    createExerciseMutation.error || updateExerciseMutation.error;

  // Préparer les données du formulaire en mode édition
  const getFormData = (): ExerciseFormData => {
    if (formMode === "edit" && selectedExercise) {
      return {
        name: selectedExercise.name,
        description: selectedExercise.description || "",
        muscle_category: selectedExercise.muscle_category as MuscleCategory,
        difficulty_level: selectedExercise.difficulty_level as DifficultyLevel,
        image: selectedExercise.image || "",
        video_url: selectedExercise.video_url || "",
      };
    }

    return {
      name: "",
      description: "",
      muscle_category: "chest" as MuscleCategory,
      difficulty_level: "beginner" as DifficultyLevel,
      image: "",
      video_url: "",
    };
  };

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
            onChange={(e) => handleGlobalFilterChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
          />
        </div>

        {/* Filtres */}
        <div className="flex gap-2">
          {/* Filtre de catégorie de muscle */}
          <Select
            options={Object.entries(MuscleCategoryLabels).map(
              ([value, label]) => ({
                value: value,
                label: label,
              })
            )}
            placeholder="Toutes les catégories"
            defaultValue={
              (columnFilters.find((f) => f.id === "muscle_category")
                ?.value as MuscleCategory) || ""
            }
            onChange={(value) => {
              setColumnFilters((prev) => {
                const filtered = prev.filter((f) => f.id !== "muscle_category");
                if (value) {
                  return [
                    ...filtered,
                    { id: "muscle_category", value: value as MuscleCategory },
                  ];
                }
                return filtered;
              });
            }}
            className="min-w-36"
          />

          {/* Filtre de niveau de difficulté */}
          <Select
            options={Object.entries(DifficultyLevelLabels).map(
              ([value, label]) => ({
                value: value,
                label: label,
              })
            )}
            placeholder="Tous les niveaux"
            defaultValue={
              (columnFilters.find((f) => f.id === "difficulty_level")
                ?.value as DifficultyLevel) || ""
            }
            onChange={(value) => {
              setColumnFilters((prev) => {
                const filtered = prev.filter(
                  (f) => f.id !== "difficulty_level"
                );
                if (value) {
                  return [
                    ...filtered,
                    { id: "difficulty_level", value: value as DifficultyLevel },
                  ];
                }
                return filtered;
              });
            }}
            className="min-w-36"
          />
        </div>

        <Button
          onClick={handleOpenAddModal}
          variant="primary"
          size="sm"
          className="w-56"
          startIcon={<IoMdFitness />}
        >
          Ajouter un exercice
        </Button>
      </div>

      {isLoading && <TableSkeleton />}

      {/* Table */}
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
                    <p className="text-gray-500">Aucun exercice trouvé</p>
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

      {/* Modal de détails de l'exercice */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        className="max-w-4xl mx-auto m-5 overflow-hidden"
      >
        {isLoadingDetails ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : selectedExercise ? (
          <div>
            {/* Image en tête si disponible */}
            {selectedExercise.image && (
              <div className="relative h-56 w-full bg-gray-100 dark:bg-gray-700">
                <img
                  src={selectedExercise.image}
                  alt={selectedExercise.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedExercise.name}
                </h1>
                <div className="mt-2 md:mt-0">
                  <Badge
                    color={
                      difficultyColorMap[
                        selectedExercise.difficulty_level as DifficultyLevel
                      ]?.color || "light"
                    }
                    variant="light"
                    size="md"
                  >
                    {difficultyColorMap[
                      selectedExercise.difficulty_level as DifficultyLevel
                    ]?.label || "Inconnu"}
                  </Badge>
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
                          Catégorie
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {
                            MuscleCategoryLabels[
                              selectedExercise.muscle_category as MuscleCategory
                            ]
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Difficulté
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {
                            DifficultyLevelLabels[
                              selectedExercise.difficulty_level as DifficultyLevel
                            ]
                          }
                        </p>
                      </div>
                      {selectedExercise.video_url && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Vidéo
                          </p>
                          <a
                            href={selectedExercise.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Voir la vidéo
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedExercise.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Description
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {selectedExercise.description}
                    </p>
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
                    handleOpenEditModal(selectedExercise.exercise_id);
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

      {/* Modal du formulaire d'ajout/modification */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        className="max-w-2xl mx-auto p-6 overflow-auto max-h-[90vh]"
      >
        {formMode === "edit" && isLoadingDetails ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <ExerciseForm
            exerciseData={getFormData()}
            isSubmitting={isSubmittingForm}
            formError={formError?.toString()}
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
              Êtes-vous sûr de vouloir supprimer cet exercice ? Cette action est
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
}

// Fonction helper pour createColumnHelper
function createColumnHelper<TData extends object>() {
  const accessor = <TAccessor extends keyof TData | (string & {})>(
    accessor: TAccessor | ((row: TData) => string),
    opts?: Record<string, unknown>
  ) => {
    return {
      id:
        typeof accessor === "function"
          ? String(Math.random())
          : String(accessor),
      accessorFn:
        typeof accessor === "function"
          ? accessor
          : (row: TData) => row[accessor as keyof TData],
      ...opts,
    };
  };

  const display = (opts: Record<string, unknown>) => {
    return {
      id: opts.id as string,
      ...opts,
    };
  };

  return { accessor, display };
}

export default DataTable;
