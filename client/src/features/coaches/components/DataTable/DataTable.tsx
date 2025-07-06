import { useState, useEffect } from "react";
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
import TableSkeleton from "../../../../components/common/TableSkeleton";
// Import du service au lieu d'utiliser l'API directement
import { coachesService } from "../../services/coachesService";

interface Coach {
  coach_id: number;
  user_id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string | null;
  certifications: string | null;
  availability: string | null;
  specialty: string | null;
  photo: string | null;
  deleted: boolean;
  created_at: string;
}

interface CoachFilters {
  page: number;
  limit: number;
  search?: string;
  deleted?: boolean;
}

interface DataTableProps {
  searchPlaceholder?: string;
  initialPageSize?: number;
  initialPageIndex?: number;
}

const DataTable = ({
  searchPlaceholder = "Rechercher un coach...",
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
  const [selectedCoachId, setSelectedCoachId] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [coachToDelete, setCoachToDelete] = useState<number | null>(null);
  const [coachesData, setCoachesData] = useState<Coach[]>([]);
  const [totalCoaches, setTotalCoaches] = useState(0);

  // Construction des filtres pour la requête
  const filters: CoachFilters = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  };
  
  if (globalFilter) filters.search = globalFilter;
  
  const deletedFilter = columnFilters.find((f) => f.id === "deleted");
  if (deletedFilter) filters.deleted = deletedFilter.value as boolean;

  // Requête API via le service
  const { data, isLoading, error } = useQuery({
    queryKey: ["coaches", filters],
    queryFn: async () => {
      try {
        const result = await coachesService.getCoachesPaginated(filters);
        console.log("API response:", result);
        return result;
      } catch (err) {
        console.error("Error fetching coaches:", err);
        throw err;
      }
    },
  });

  // Ajout d'un delay pour éviter trop de requêtes pendant la frappe
  useEffect(() => {
    const timer = setTimeout(() => {
      // Si la recherche change, invalidez la requête
      if (globalFilter) {
        queryClient.invalidateQueries({ queryKey: ["coaches"] });
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [globalFilter, queryClient]);

  // Mise à jour des données quand la réponse API change
  useEffect(() => {
    if (data) {
      // Gérer les différentes structures possibles de réponse API
      if (Array.isArray(data)) {
        setCoachesData(data);
        setTotalCoaches(data.length);
            } else if (data.data && Array.isArray(data.data)) {
        setCoachesData(data.data);
        setTotalCoaches(data.total || data.data.length);
      } else {
        console.error("Format de données inattendu:", data);
        setCoachesData([]);
        setTotalCoaches(0);
      }
    }
  }, [data]);

  // Requête pour récupérer les détails d'un coach via le service
  const { data: selectedCoach, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["coach", selectedCoachId],
    queryFn: async () => {
      try {
        if (!selectedCoachId) throw new Error("ID du coach non défini");
        // Utilise le service au lieu de l'appel API direct
        const result = await coachesService.getCoachById(selectedCoachId);
        console.log("Coach details:", result);
        return result;
      } catch (err) {
        console.error("Error fetching coach details:", err);
        throw err;
      }
    },
    enabled: !!selectedCoachId && isDetailModalOpen,
  });

  // Mutation pour la suppression via le service
  const deleteCoachMutation = useMutation({
    mutationFn: (id: number) => {
      return coachesService.deleteCoach(id);
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["coaches"] });
      setIsDeleteModalOpen(false);
      setCoachToDelete(null);
    },
  });

  // Gestionnaires d'événements
  const handleOpenDetailModal = (id: number) => {
    setSelectedCoachId(id);
    setIsDetailModalOpen(true);
  };

  const handleOpenDeleteModal = (id: number) => {
    setCoachToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (coachToDelete !== null) {
      deleteCoachMutation.mutate(coachToDelete);
    }
  };

  // Configuration des colonnes
  const columnHelper = createColumnHelper<Coach>();

  const columns = [
    columnHelper.accessor("coach_id", {
      header: "ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor(row => row.photo || "", {
      id: "photo",
      header: "Photo",
      cell: (info) => (
        <div className="flex items-center justify-center">
          {info.row.original.photo ? (
            <img 
              src={info.row.original.photo} 
              alt={`${info.row.original.firstName} ${info.row.original.lastName}`}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              {info.row.original.firstName?.[0]?.toUpperCase() || '?'}
            </div>
          )}
        </div>
      ),
    }),
    columnHelper.accessor("firstName", {
      header: "Prénom",
      cell: (info) => (
        <div className="font-medium text-gray-900 dark:text-white">
          {info.getValue() || "Non renseigné"}
        </div>
      ),
    }),
    columnHelper.accessor("lastName", {
      header: "Nom",
      cell: (info) => (
        <div className="font-medium text-gray-900 dark:text-white">
          {info.getValue() || "Non renseigné"}
        </div>
      ),
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => info.getValue() || "Non renseigné",
    }),
    columnHelper.accessor("specialty", {
      header: "Spécialité",
      cell: (info) => info.getValue() || "Non renseigné",
    }),
    columnHelper.accessor("created_at", {
      header: "Date d'inscription",
      cell: (info) => {
        try {
          return info.getValue() 
            ? new Date(info.getValue()).toLocaleDateString() 
            : "Non renseigné";
        } catch (e) {
          return "Date invalide";
        }
      }
    }),
    columnHelper.accessor("deleted", {
      header: "Statut",
      cell: (info) => (
        <Badge 
          color={info.getValue() ? "error" : "success"} 
          variant="light" 
          size="sm"
        >
          {info.getValue() ? "Inactif" : "Actif"}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const coach = row.original;
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleOpenDetailModal(coach.coach_id)}
              className="p-1"
              title="Voir"
            >
              <FaEye className="text-gray-600" />
            </button>
          </div>
        );
      },
    }),
  ];

  // Configuration de la table avec les données mises à jour
  const table = useReactTable({
    data: coachesData,
    columns,
    pageCount: Math.ceil(totalCoaches / pagination.pageSize) || -1,
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

  // Affichage des erreurs de requête
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Erreur: Une erreur est survenue lors du chargement des données.</p>
        <p className="text-xs mt-1">{(error as Error).message}</p>
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

        {/* Filtres par statut - badges cliquables */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            Statut :
          </span>
          <button
            onClick={() => {
              setColumnFilters((prev) =>
                prev.filter((f) => f.id !== "deleted")
              );
            }}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              !columnFilters.find((f) => f.id === "deleted")
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => {
              setColumnFilters((prev) => {
                const filtered = prev.filter((f) => f.id !== "deleted");
                return [...filtered, { id: "deleted", value: false }];
              });
            }}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              columnFilters.find((f) => f.id === "deleted")?.value === false
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Actifs
          </button>
          <button
            onClick={() => {
              setColumnFilters((prev) => {
                const filtered = prev.filter((f) => f.id !== "deleted");
                return [...filtered, { id: "deleted", value: true }];
              });
            }}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              columnFilters.find((f) => f.id === "deleted")?.value === true
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Inactifs
          </button>
        </div>
      </div>

      {isLoading ? <TableSkeleton /> : (
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
                {!isLoading && table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-16 text-center"
                    >
                      <p className="text-gray-500">Aucun coach trouvé</p>
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
                  sur <span className="font-medium">{table.getPageCount() || 1}</span>{" "}
                  | Total: <span className="font-medium">{totalCoaches}</span>{" "}
                  coachs
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
      )}

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
        ) : selectedCoach ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Détails du coach
            </h2>

            <div className="space-y-4">
              {/* Photo du coach */}
              <div className="flex justify-center mb-6">
                {selectedCoach.photo ? (
                  <img 
                    src={selectedCoach.photo} 
                    alt={`${selectedCoach.firstName} ${selectedCoach.lastName}`} 
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-bold">
                    {selectedCoach.firstName?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              
              {/* Informations personnelles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Prénom
                  </label>
                  <p className="text-gray-900 dark:text-white font-semibold">
                    {selectedCoach.firstName || "Non renseigné"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom
                  </label>
                  <p className="text-gray-900 dark:text-white font-semibold">
                    {selectedCoach.lastName || "Non renseigné"}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedCoach.email || "Non renseigné"}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Spécialité
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedCoach.specialty || "Non renseigné"}
                  </p>
                </div>
              </div>

              {/* Informations professionnelles */}
              <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Biographie
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedCoach.bio || "Non renseigné"}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Certifications
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedCoach.certifications || "Non renseigné"}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Disponibilités
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedCoach.availability || "Non renseigné"}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Statut
                  </label>
                  <Badge 
                    color={selectedCoach.deleted ? "error" : "success"} 
                    variant="light" 
                    size="md"
                  >
                    {selectedCoach.deleted ? "Inactif" : "Actif"}
                  </Badge>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Créé le
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(selectedCoach.created_at).toLocaleString("fr-FR")}
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
                  window.location.href = `/admin/coach/edit/${selectedCoach.coach_id}`;
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
              Êtes-vous sûr de vouloir désactiver ce coach ? Cette action peut être inversée ultérieurement.
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
              Désactiver
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DataTable;