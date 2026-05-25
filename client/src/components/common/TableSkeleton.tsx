import React from 'react';

interface SkeletonProps {
  rows?: number;
  columns?: number;
  showPagination?: boolean;
  showFilters?: boolean;
}

const TableSkeleton: React.FC<SkeletonProps> = ({
  rows = 5,
  columns = 4,
  showPagination = true,
  showFilters = true
}) => {
  const pulseAnimation = "animate-pulse";
  
  const renderFilters = () => (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      {/* Recherche */}
      <div className="relative w-full sm:w-72">
        <div className={`${pulseAnimation} h-11 bg-gray-200 dark:bg-gray-700 rounded-lg w-full`}></div>
      </div>
      
      {/* Filtres */}
      <div className="flex gap-2">
        <div className={`${pulseAnimation} h-11 bg-gray-200 dark:bg-gray-700 rounded-lg w-36`}></div>
        <div className={`${pulseAnimation} h-11 bg-gray-200 dark:bg-gray-700 rounded-lg w-36`}></div>
      </div>
      
      {/* Bouton Ajouter */}
      <div className={`${pulseAnimation} h-11 bg-gray-200 dark:bg-gray-700 rounded-lg w-56`}></div>
    </div>
  );
  
  // Placeholder pour la pagination
  const renderPagination = () => (
    <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
      <div className="flex-1 flex justify-between sm:hidden">
        <div className={`${pulseAnimation} h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-24`}></div>
        <div className={`${pulseAnimation} h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-24`}></div>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <div className={`${pulseAnimation} h-5 bg-gray-200 dark:bg-gray-700 rounded w-40`}></div>
        </div>
        <div className="flex gap-x-2 items-center">
          <div className={`${pulseAnimation} h-5 bg-gray-200 dark:bg-gray-700 rounded w-16`}></div>
          <div className={`${pulseAnimation} h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-20`}></div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className={`${pulseAnimation} h-10 bg-gray-200 dark:bg-gray-700 w-10 ${i === 0 ? 'rounded-l-md' : i === 3 ? 'rounded-r-md' : ''}`}></div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Filtres */}
      {showFilters && renderFilters()}
      
      {/* Table */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            {/* En-tête */}
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {Array(columns).fill(0).map((_, i) => (
                  <th key={i} className="px-6 py-3 text-left">
                    <div className={`${pulseAnimation} h-5 bg-gray-200 dark:bg-gray-700 rounded w-${i === 0 ? '10' : i === columns - 1 ? '20' : '32'}`}></div>
                  </th>
                ))}
              </tr>
            </thead>
            
            {/* Corps */}
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {Array(rows).fill(0).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array(columns).fill(0).map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      {colIndex === 0 ? (
                        <div className="flex items-center justify-center">
                          <div className={`${pulseAnimation} h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full`}></div>
                        </div>
                      ) : colIndex === columns - 1 ? (
                        <div className="flex space-x-2">
                          {Array(3).fill(0).map((_, i) => (
                            <div key={i} className={`${pulseAnimation} h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full`}></div>
                          ))}
                        </div>
                      ) : (
                        <div className={`${pulseAnimation} h-5 bg-gray-200 dark:bg-gray-700 rounded w-${colIndex === 1 ? '32' : '16'}`}></div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {showPagination && renderPagination()}
      </div>
    </div>
  );
};

export default TableSkeleton;