import { useState, useEffect } from 'react';
import { transactionsAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

const TransactionsPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all'); // all, buyer, seller

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const fetchTransactions = async () => {
    try {
      const role = filter === 'all' ? undefined : filter;
      const response = await transactionsAPI.getAll({ role });
      setTransactions(response.data.transactions);
    } catch (err) {
      setError('Error al cargar las transacciones');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      pendiente: 'badge-pendiente',
      confirmada: 'badge-confirmada',
      completada: 'badge-completada',
      cancelada: 'badge-cancelada',
    };
    return classes[status] || 'badge';
  };

  const getStatusText = (status) => {
    const texts = {
      pendiente: 'Pendiente',
      confirmada: 'Confirmada',
      completada: 'Completada',
      cancelada: 'Cancelada',
    };
    return texts[status] || status;
  };

  const handleAccept = async (transactionId) => {
    try {
      setError('');
      setSuccess('');
      
      await transactionsAPI.accept(transactionId);
      
      setSuccess('Oferta aceptada. La transacción está completada.');
      
      // Refresh transactions
      fetchTransactions();
    } catch (err) {
      console.error('Error accepting transaction:', err);
      console.error('Error response:', err.response?.data);
      
      let errorMessage = 'Error al aceptar la transacción';
      
      if (err.response?.data) {
        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
          errorMessage = err.response.data.errors.map(e => e.message || e.msg).join(', ');
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        }
      }
      
      setError(errorMessage);
    }
  };

  const handleReject = async (transactionId) => {
    try {
      setError('');
      setSuccess('');
      
      await transactionsAPI.reject(transactionId);
      
      setSuccess('Oferta rechazada. El material vuelve a estar disponible.');
      
      // Refresh transactions
      fetchTransactions();
    } catch (err) {
      console.error('Error rejecting transaction:', err);
      setError(err.response?.data?.message || 'Error al rechazar la transacción');
    }
  };


  const isSeller = (transaction) => {
    return user && transaction.seller?._id === user._id;
  };

  const canAcceptReject = (transaction) => {
    return isSeller(transaction) && transaction.status === 'pendiente';
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="mb-8">Mis Transacciones</h1>

      <div className="mb-6 flex gap-2">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'btn-primary' : 'btn-secondary'}>
          Todas
        </button>
        <button onClick={() => setFilter('buyer')} className={filter === 'buyer' ? 'btn-primary' : 'btn-secondary'}>
          Compras
        </button>
        <button onClick={() => setFilter('seller')} className={filter === 'seller' ? 'btn-primary' : 'btn-secondary'}>
          Ventas
        </button>
      </div>

      <SuccessMessage message={success} onClose={() => setSuccess('')} />
      <ErrorMessage message={error} onClose={() => setError('')} />

      {transactions.length > 0 ? (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction._id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{transaction.material?.title || 'Material'}</h3>
                  <p className="text-sm text-gray-600">{transaction.material?.category}</p>
                </div>
                <span className={getStatusBadge(transaction.status)}>
                  {getStatusText(transaction.status)}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-600">Cantidad:</span>
                  <p className="font-medium">{transaction.quantity}</p>
                </div>
                <div>
                  <span className="text-gray-600">Precio Total:</span>
                  <p className="font-medium text-construction-orange">€{transaction.totalPrice.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Comprador:</span>
                  <p className="font-medium">{transaction.buyer?.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Vendedor:</span>
                  <p className="font-medium">{transaction.seller?.name}</p>
                </div>
              </div>

              {/* Action buttons for seller */}
              {canAcceptReject(transaction) && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <p className="text-sm text-gray-600 mb-3">
                    Como vendedor, puedes aceptar o rechazar esta oferta:
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAccept(transaction._id)}
                      className="btn-success flex-1"
                    >
                      ✓ Aceptar Oferta
                    </button>
                    <button
                      onClick={() => handleReject(transaction._id)}
                      className="btn-danger flex-1"
                    >
                      ✗ Rechazar Oferta
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500">No tienes transacciones</p>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;

