import { useState, useEffect } from 'react';
import { materialsAPI } from '../services/api';
import MaterialCard from '../components/MaterialCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const MarketplacePage = () => {
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const categories = [
    { value: '', label: 'Todas las categorías' },
    { value: 'vallas', label: 'Vallas' },
    { value: 'conos', label: 'Conos' },
    { value: 'palets', label: 'Palets' },
    { value: 'andamios', label: 'Andamios' },
    { value: 'herramientas', label: 'Herramientas' },
    { value: 'maquinaria', label: 'Maquinaria' },
    { value: 'materiales-construccion', label: 'Materiales de Construcción' },
    { value: 'señalizacion', label: 'Señalización' },
    { value: 'proteccion', label: 'Protección' },
    { value: 'otros', label: 'Otros' },
  ];

  const conditions = [
    { value: '', label: 'Todas las condiciones' },
    { value: 'nuevo', label: 'Nuevo' },
    { value: 'como-nuevo', label: 'Como Nuevo' },
    { value: 'buen-estado', label: 'Buen Estado' },
    { value: 'usado', label: 'Usado' },
    { value: 'necesita-reparacion', label: 'Necesita Reparación' },
  ];

  useEffect(() => {
    fetchMaterials();
  }, [filters, pagination.currentPage]);

  const fetchMaterials = async () => {
    setIsLoading(true);
    setError('');

    try {
      const params = {
        page: pagination.currentPage,
        limit: 12,
        status: 'disponible',
        ...(filters.category && { category: filters.category }),
        ...(filters.condition && { condition: filters.condition }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.search && { search: filters.search }),
      };

      const response = await materialsAPI.getAll(params);
      setMaterials(response.data.materials);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError('Error al cargar los materiales. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
    setPagination({ ...pagination, currentPage: 1 }); // Reset to first page
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, currentPage: 1 });
    fetchMaterials();
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, currentPage: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Marketplace</h1>
        <p className="text-gray-600">
          Encuentra materiales de construcción de calidad a precios reducidos
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <form onSubmit={handleSearchSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <input
                type="text"
                id="search"
                name="search"
                className="input"
                placeholder="Buscar materiales..."
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                id="category"
                name="category"
                className="input"
                value={filters.category}
                onChange={handleFilterChange}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                Condición
              </label>
              <select
                id="condition"
                name="condition"
                className="input"
                value={filters.condition}
                onChange={handleFilterChange}
              >
                {conditions.map((cond) => (
                  <option key={cond.value} value={cond.value}>
                    {cond.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Precio Mínimo (€)
              </label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                className="input"
                placeholder="0"
                min="0"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
            </div>

            {/* Max Price */}
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Precio Máximo (€)
              </label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                className="input"
                placeholder="10000"
                min="0"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary">
            Aplicar Filtros
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      {/* Results Count */}
      {!isLoading && (
        <div className="mb-4 text-gray-600">
          {pagination.totalItems} {pagination.totalItems === 1 ? 'material encontrado' : 'materiales encontrados'}
        </div>
      )}

      {/* Materials Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="large" />
        </div>
      ) : materials.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {materials.map((material) => (
              <MaterialCard key={material._id} material={material} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              <span className="px-4 py-2 text-gray-700">
                Página {pagination.currentPage} de {pagination.totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron materiales</h3>
          <p className="mt-1 text-sm text-gray-500">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;

