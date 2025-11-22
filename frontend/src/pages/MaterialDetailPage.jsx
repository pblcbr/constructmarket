import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { materialsAPI, transactionsAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

const MaterialDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [material, setMaterial] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseData, setPurchaseData] = useState({
    quantity: 1,
    notes: '',
  });

  useEffect(() => {
    fetchMaterial();
  }, [id]);

  const fetchMaterial = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await materialsAPI.getById(id);
      setMaterial(response.data);
    } catch (err) {
      console.error('Error fetching material:', err);
      setError('Material no encontrado');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await transactionsAPI.create({
        materialId: material._id,
        quantity: purchaseData.quantity,
        notes: purchaseData.notes,
      });

      setSuccess('¡Solicitud de compra enviada con éxito!');
      setShowPurchaseModal(false);
      fetchMaterial(); // Refresh material data
    } catch (err) {
      console.error('Error creating transaction:', err);
      setError(err.response?.data?.message || 'Error al crear la solicitud de compra');
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error && !material) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error} />
        <Link to="/marketplace" className="btn-primary mt-4">
          Volver al Marketplace
        </Link>
      </div>
    );
  }

  const isOwner = user && material && user._id === material.seller._id;
  const canPurchase = isAuthenticated && !isOwner && material.status === 'disponible';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SuccessMessage message={success} onClose={() => setSuccess('')} />
      <ErrorMessage message={error} onClose={() => setError('')} />

      {/* Back button */}
      <Link to="/marketplace" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver al Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="bg-gray-200 rounded-lg overflow-hidden aspect-square">
            {material.images && material.images.length > 0 ? (
              <img
                src={material.images[0]}
                alt={material.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          <span className={`badge-${material.status} mb-3`}>
            {material.status === 'disponible' ? 'Disponible' : material.status === 'reservado' ? 'Reservado' : 'Vendido'}
          </span>

          <h1 className="mb-4">{material.title}</h1>

          <div className="mb-6">
            <span className="text-4xl font-bold text-construction-orange">
              €{material.price.toLocaleString()}
            </span>
            <span className="text-gray-500 ml-2">/ {material.unit}</span>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center text-gray-700">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="font-medium mr-2">Categoría:</span> {material.category}
            </div>

            <div className="flex items-center text-gray-700">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="font-medium mr-2">Cantidad:</span> {material.quantity} {material.unit}
            </div>

            <div className="flex items-center text-gray-700">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium mr-2">Condición:</span> {material.condition}
            </div>

            <div className="flex items-center text-gray-700">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className="font-medium mr-2">Ubicación:</span> {material.location}
            </div>

            {material.projectName && (
              <div className="flex items-center text-gray-700">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="font-medium mr-2">Proyecto:</span> {material.projectName}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="mb-3">Descripción</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{material.description}</p>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="mb-3">Vendedor</h3>
            <div className="flex items-center">
              <div className="bg-primary-100 rounded-full h-12 w-12 flex items-center justify-center mr-3">
                <span className="text-primary-600 font-semibold text-lg">
                  {material.seller.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium">{material.seller.name}</p>
                {material.seller.company && (
                  <p className="text-sm text-gray-600">{material.seller.company}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {canPurchase && (
              <button
                onClick={() => setShowPurchaseModal(true)}
                className="btn-primary flex-1"
              >
                Solicitar Compra
              </button>
            )}
            
            {isOwner && (
              <>
                <Link
                  to={`/materials/edit/${material._id}`}
                  className="btn-secondary flex-1 text-center"
                >
                  Editar
                </Link>
              </>
            )}

            {!isAuthenticated && (
              <Link to="/login" className="btn-primary flex-1 text-center">
                Iniciar Sesión para Comprar
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="mb-4">Solicitar Compra</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad (disponible: {material.quantity})
                </label>
                <input
                  type="number"
                  min="1"
                  max={material.quantity}
                  className="input"
                  value={purchaseData.quantity}
                  onChange={(e) => setPurchaseData({ ...purchaseData, quantity: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas (opcional)
                </label>
                <textarea
                  className="input"
                  rows="3"
                  placeholder="Añade cualquier información adicional..."
                  value={purchaseData.notes}
                  onChange={(e) => setPurchaseData({ ...purchaseData, notes: e.target.value })}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <div className="flex justify-between mb-2">
                  <span>Precio unitario:</span>
                  <span className="font-medium">€{material.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-construction-orange">
                    €{(material.price * purchaseData.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handlePurchase}
                className="btn-primary flex-1"
              >
                Confirmar Solicitud
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialDetailPage;

