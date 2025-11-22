import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { materialsAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import MaterialCard from '../components/MaterialCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

const MyMaterialsPage = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchMyMaterials();
    }
  }, [user]);

  const fetchMyMaterials = async () => {
    try {
      const response = await materialsAPI.getBySeller(user._id);
      setMaterials(response.data);
    } catch (err) {
      setError('Error al cargar tus materiales');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnpublish = async (materialId) => {
    try {
      setError('');
      setSuccess('');
      
      await materialsAPI.updateStatus(materialId, 'reservado');
      setSuccess('Material despublicado correctamente');
      fetchMyMaterials();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al despublicar el material');
    }
  };

  const handlePublish = async (materialId) => {
    try {
      setError('');
      setSuccess('');
      
      await materialsAPI.updateStatus(materialId, 'disponible');
      setSuccess('Material publicado correctamente');
      fetchMyMaterials();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al publicar el material');
    }
  };

  const handleDelete = async (materialId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este material? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      setDeletingId(materialId);
      
      await materialsAPI.delete(materialId);
      setSuccess('Material eliminado correctamente');
      fetchMyMaterials();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar el material');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1>Mis Materiales</h1>
        <Link to="/materials/create" className="btn-primary">
          Publicar Nuevo Material
        </Link>
      </div>

      <SuccessMessage message={success} onClose={() => setSuccess('')} />
      <ErrorMessage message={error} onClose={() => setError('')} />

      {materials.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {materials.map((material) => {
            const isSold = material.status === 'vendido';
            const isDisabled = isSold;
            
            return (
              <div key={material._id} className={`relative ${isDisabled ? 'opacity-60' : ''}`}>
                <MaterialCard material={material} />
                {isSold && (
                  <div className="mt-2 mb-2 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                      ✓ Transacción completada
                    </span>
                  </div>
                )}
                <div className="mt-2 flex gap-2">
                  {material.status === 'disponible' ? (
                    <button
                      onClick={() => handleUnpublish(material._id)}
                      disabled={isDisabled}
                      className="btn-secondary flex-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Despublicar
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePublish(material._id)}
                      disabled={isDisabled}
                      className="btn-success flex-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Publicar
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(material._id)}
                    disabled={isDisabled || deletingId === material._id}
                    className="btn-danger flex-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === material._id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tienes materiales publicados</h3>
          <p className="mt-1 text-sm text-gray-500 mb-4">Empieza publicando tu primer material</p>
          <Link to="/materials/create" className="btn-primary">
            Publicar Material
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyMaterialsPage;

