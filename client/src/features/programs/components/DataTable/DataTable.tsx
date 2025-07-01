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
  FaCopy,
} from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import Select from "../../../../components/form/Select";
import Badge from "../../../../components/ui/badge/Badge";
import { Modal } from "../../../../components/ui/modal/index";
import programsService from "../../services/programsService";
import {
  Program,
  ProgramCategoryLabels,
  DifficultyLevelLabels,
  DifficultyLevel,
  ProgramCategory,
  ProgramUpdate,
} from "../../types";
import { MdFitnessCenter } from "react-icons/md";
import ProgramForm from "../ProgramForm/ProgramForm";
import TableSkeleton from "../../../../components/common/TableSkeleton";
import { useCoachId } from "../../../../hooks/useCoachId";

interface Filters {
  page: number;
  limit: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  category?: ProgramCategory;
  difficulty_level?: DifficultyLevel;
  coach_id?: number;
  [key: string]: unknown;
}

// Type pour le formulaire adapté à l'entité
interface ProgramFormData {
  coach_id: number;
  name: string;
  description: string;
  difficulty_level: DifficultyLevel;
  category: ProgramCategory;
  exercises: {
    exercise_id: number;
    order_number: number;
    sets?: number;
    repetitions?: number;
    recommended_weight?: number;
    duration_seconds?: number;
    rest_seconds?: number;
    instructions?: string;
  }[];
}

const queryKeys = {
  all: ["programs"] as const,
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
  const {
    coachId,
    isLoading: isLoadingCoachId,
    error: coachIdError,
  } = useCoachId();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPageIndex,
    pageSize: initialPageSize,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(
    null
  );
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [programToDuplicate, setProgramToDuplicate] = useState<number | null>(
    null
  );
  const [duplicateName, setDuplicateName] = useState("");

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
    queryFn: () => programsService.getPrograms(queryParams),
  });

  const { data: selectedProgram, isLoading: isLoadingDetails } = useQuery({
    queryKey: queryKeys.detail(selectedProgramId || 0),
    queryFn: () => programsService.getProgramById(selectedProgramId || 0),
    enabled:
      !!selectedProgramId &&
      (isDetailModalOpen || (isFormModalOpen && formMode === "edit")),
  });

  const deleteProgramMutation = useMutation({
    mutationFn: (id: number) => programsService.deleteProgram(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      setIsDeleteModalOpen(false);
      setProgramToDelete(null);
    },
  });

  const duplicateProgramMutation = useMutation({
    mutationFn: (data: { id: number; name: string; coach_id: number }) =>
      programsService.duplicateProgram(data.id, {
        name: data.name,
        coach_id: data.coach_id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      setIsDuplicateModalOpen(false);
      setProgramToDuplicate(null);
      setDuplicateName("");
    },
  });

  const createProgramMutation = useMutation({
    mutationFn: (data: ProgramFormData) => programsService.createProgram(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      setIsFormModalOpen(false);
    },
  });

  const updateProgramMutation = useMutation({
    mutationFn: (data: { id: number; formData: ProgramFormData }) => {
      const updateData: ProgramUpdate = {
        ...data.formData,
      };
      return programsService.updateProgram(data.id, updateData);
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      setIsFormModalOpen(false);
    },
  });

  const handleOpenDetailModal = (id: number) => {
    setSelectedProgramId(id);
    setIsDetailModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setFormMode("add");
    setIsFormModalOpen(true);
    setSelectedProgramId(null);
  };

  const handleOpenEditModal = (id: number) => {
    setFormMode("edit");
    setSelectedProgramId(id);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedProgramId(null);
  };

  const handleOpenDeleteModal = (id: number) => {
    setProgramToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleOpenDuplicateModal = (id: number) => {
    setProgramToDuplicate(id);
    setIsDuplicateModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (programToDelete !== null) {
      deleteProgramMutation.mutate(programToDelete);
    }
  };

  const handleConfirmDuplicate = () => {
    if (programToDuplicate !== null && duplicateName.trim()) {
      duplicateProgramMutation.mutate({
        id: programToDuplicate,
        name: duplicateName.trim(),
        coach_id: coachId,
      });
    }
  };

  const handleSubmitForm = (formData: ProgramFormData) => {
    if (formMode === "add") {
      createProgramMutation.mutate(formData);
    } else if (selectedProgramId) {
      updateProgramMutation.mutate({ id: selectedProgramId, formData });
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

  const categoryColorMap: Record<
    ProgramCategory,
    { color: "success" | "info" | "warning" | "error"; label: string }
  > = {
    strength: { color: "error", label: ProgramCategoryLabels.strength },
    cardio: { color: "warning", label: ProgramCategoryLabels.cardio },
    flexibility: { color: "success", label: ProgramCategoryLabels.flexibility },
    hiit: { color: "error", label: ProgramCategoryLabels.hiit },
    functional: { color: "info", label: ProgramCategoryLabels.functional },
    rehabilitation: {
      color: "success",
      label: ProgramCategoryLabels.rehabilitation,
    },
  };

  const columnHelper = createColumnHelper<Program>();

  const columns: ColumnDef<Program>[] = [
    columnHelper.accessor("name", {
      header: "Nom du programme",
      cell: (info: Cell<Program, string>) => (
        <div className="font-medium text-gray-900 dark:text-white">
          {info.getValue()}
        </div>
      ),
      enableSorting: true,
    }),

    columnHelper.accessor("category", {
      header: "Catégorie",
      cell: (info: Cell<Program, string>) => {
        const category = info.getValue() as ProgramCategory;
        const { color, label } = categoryColorMap[category] || {
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

    columnHelper.accessor("difficulty_level", {
      header: "Difficulté",
      cell: (info: Cell<Program, string>) => {
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

    columnHelper.accessor("program_exercises", {
      header: "Exercices",
      cell: ({ row }: { row: Row<Program> }) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {row.original.program_exercises?.length || 0} exercice(s)
        </div>
      ),
      enableSorting: false,
    }),

    columnHelper.accessor("creation_date", {
      header: "Date de création",
      cell: (info: Cell<Program, string>) => {
        const date = new Date(info.getValue());
        return (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {date.toLocaleDateString("fr-FR")}
          </div>
        );
      },
      enableSorting: true,
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: Row<Program> }) => {
        const program = row.original;

        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleOpenDetailModal(program.program_id)}
              className="p-1"
              title="Voir"
            >
              <FaEye color="gray" />
            </button>
            <button
              onClick={() => handleOpenEditModal(program.program_id)}
              className="p-1"
              title="Modifier"
            >
              <FaEdit color="gray" />
            </button>
            <button
              onClick={() => handleOpenDuplicateModal(program.program_id)}
              className="p-1"
              title="Dupliquer"
            >
              <FaCopy color="gray" />
            </button>
            <button
              onClick={() => handleOpenDeleteModal(program.program_id)}
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
    createProgramMutation.isPending || updateProgramMutation.isPending;
  const formError = createProgramMutation.error || updateProgramMutation.error;

  // Préparer les données du formulaire en mode édition
  const getFormData = (): ProgramFormData => {
    if (formMode === "edit" && selectedProgram) {
      return {
        coach_id: selectedProgram.coach_id,
        name: selectedProgram.name,
        description: selectedProgram.description || "",
        difficulty_level: selectedProgram.difficulty_level as DifficultyLevel,
        category: selectedProgram.category as ProgramCategory,
        exercises: selectedProgram.program_exercises.map((pe) => ({
          exercise_id: pe.exercise_id,
          order_number: pe.order_number,
          sets: pe.sets,
          repetitions: pe.repetitions,
          recommended_weight: pe.recommended_weight,
          duration_seconds: pe.duration_seconds,
          rest_seconds: pe.rest_seconds,
          instructions: pe.instructions,
        })),
      };
    }

    return {
      coach_id: coachId,
      name: "",
      description: "",
      difficulty_level: "beginner" as DifficultyLevel,
      category: "strength" as ProgramCategory,
      exercises: [],
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
          {/* Filtre de catégorie */}
          <Select
            options={Object.entries(ProgramCategoryLabels).map(
              ([value, label]) => ({
                value: value,
                label: label,
              })
            )}
            placeholder="Toutes les catégories"
            defaultValue={
              (columnFilters.find((f) => f.id === "category")
                ?.value as ProgramCategory) || ""
            }
            onChange={(value) => {
              setColumnFilters((prev) => {
                const filtered = prev.filter((f) => f.id !== "category");
                if (value) {
                  return [
                    ...filtered,
                    { id: "category", value: value as ProgramCategory },
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
          startIcon={<MdFitnessCenter />}
        >
          Créer un programme
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
                    <p className="text-gray-500">Aucun programme trouvé</p>
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

      {/* Modal de détails du programme */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        className="max-w-4xl mx-auto m-5 overflow-hidden"
      >
        {isLoadingDetails ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : selectedProgram ? (
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedProgram.name}
              </h1>
              <div className="mt-2 md:mt-0 flex gap-2">
                <Badge
                  color={
                    categoryColorMap[
                      selectedProgram.category as ProgramCategory
                    ]?.color || "light"
                  }
                  variant="light"
                  size="md"
                >
                  {categoryColorMap[selectedProgram.category as ProgramCategory]
                    ?.label || "Inconnu"}
                </Badge>
                <Badge
                  color={
                    difficultyColorMap[
                      selectedProgram.difficulty_level as DifficultyLevel
                    ]?.color || "light"
                  }
                  variant="light"
                  size="md"
                >
                  {difficultyColorMap[
                    selectedProgram.difficulty_level as DifficultyLevel
                  ]?.label || "Inconnu"}
                </Badge>
              </div>
            </div>

            {selectedProgram.description && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Description
                </h2>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {selectedProgram.description}
                  </p>
                </div>
              </div>
            )}

            {/* Liste des exercices */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Exercices ({selectedProgram.program_exercises.length})
              </h2>
              <div className="space-y-3">
                {selectedProgram.program_exercises
                  .sort((a, b) => a.order_number - b.order_number)
                  .map((programExercise) => (
                    <div
                      key={programExercise.program_exercise_id}
                      className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {programExercise.order_number}.{" "}
                          {programExercise.exercise?.name ||
                            "Exercice supprimé"}
                        </h3>
                        {programExercise.exercise?.muscle_category && (
                          <Badge color="info" variant="light" size="sm">
                            {programExercise.exercise.muscle_category}
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        {programExercise.sets && (
                          <div>
                            <span className="font-medium">Séries:</span>{" "}
                            {programExercise.sets}
                          </div>
                        )}
                        {programExercise.repetitions && (
                          <div>
                            <span className="font-medium">Répétitions:</span>{" "}
                            {programExercise.repetitions}
                          </div>
                        )}
                        {programExercise.recommended_weight && (
                          <div>
                            <span className="font-medium">Poids:</span>{" "}
                            {programExercise.recommended_weight}kg
                          </div>
                        )}
                        {programExercise.duration_seconds && (
                          <div>
                            <span className="font-medium">Durée:</span>{" "}
                            {Math.floor(programExercise.duration_seconds / 60)}
                            min {programExercise.duration_seconds % 60}s
                          </div>
                        )}
                        {programExercise.rest_seconds && (
                          <div>
                            <span className="font-medium">Repos:</span>{" "}
                            {Math.floor(programExercise.rest_seconds / 60)}
                            min {programExercise.rest_seconds % 60}s
                          </div>
                        )}
                      </div>
                      {programExercise.instructions && (
                        <div className="mt-2">
                          <span className="font-medium text-sm">
                            Instructions:
                          </span>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {programExercise.instructions}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button
                onClick={() => setIsDetailModalOpen(false)}
                variant="outline"
                size="md"
              >
                Fermer
              </Button>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleOpenDuplicateModal(selectedProgram.program_id);
                  }}
                  variant="outline"
                  size="md"
                  startIcon={<FaCopy />}
                >
                  Dupliquer
                </Button>
                <Button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleOpenEditModal(selectedProgram.program_id);
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
        className="max-w-4xl mx-auto p-6 overflow-auto max-h-[90vh]"
      >
        {formMode === "edit" && isLoadingDetails ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <ProgramForm
            programData={getFormData()}
            isSubmitting={isSubmittingForm}
            formError={formError?.toString()}
            onSubmit={handleSubmitForm}
            onCancel={handleCloseFormModal}
            mode={formMode}
          />
        )}
      </Modal>

      {/* Modal de duplication */}
      <Modal
        isOpen={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
        className="max-w-md mx-auto p-6"
      >
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Dupliquer le programme
          </h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nouveau nom du programme
            </label>
            <Input
              type="text"
              value={duplicateName}
              onChange={(e) => setDuplicateName(e.target.value)}
              placeholder="Nom du programme dupliqué"
              className="w-full"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              onClick={() => setIsDuplicateModalOpen(false)}
              variant="outline"
              size="md"
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmDuplicate}
              variant="primary"
              size="md"
              disabled={
                !duplicateName.trim() || duplicateProgramMutation.isPending
              }
            >
              {duplicateProgramMutation.isPending
                ? "Duplication..."
                : "Dupliquer"}
            </Button>
          </div>
        </div>
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
              Êtes-vous sûr de vouloir supprimer ce programme ? Cette action est
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
