// This is a placeholder page - functionality similar to CreateMaterialPage but for editing
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { materialsAPI } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';

const EditMaterialPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    fetchMaterial();
  }, [id]);

  const fetchMaterial = async () => {
    try {
      const response = await materialsAPI.getById(id);
      const material = response.data;
      setFormData({
        title: material.title,
        description: material.description,
        category: material.category,
        quantity: material.quantity,
        unit: material.unit,
        price: material.price,
        condition: material.condition,
        location: material.location,
        projectName: material.projectName || '',
      });
    } catch (err) {
      setError('Error al cargar el material');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await materialsAPI.update(id, formData);
      navigate(`/materials/${id}`);
    } catch (err) {
      setError('Error al actualizar el material');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="mb-8">Editar Material</h1>
      <ErrorMessage message={error} onClose={() => setError('')} />
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <input type="text" name="title" required className="input" value={formData?.title || ''} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
            <textarea name="description" required rows="4" className="input" value={formData?.description || ''} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio (€) *</label>
            <input type="number" name="price" required min="0" step="0.01" className="input" value={formData?.price || 0} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad *</label>
            <input type="number" name="quantity" required min="1" className="input" value={formData?.quantity || 1} onChange={handleChange} />
          </div>
        </div>
        <div className="mt-8 flex gap-4">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancelar</button>
          <button type="submit" disabled={isSaving} className="btn-primary flex-1">{isSaving ? 'Guardando...' : 'Guardar Cambios'}</button>
        </div>
      </form>
    </div>
  );
};

export default EditMaterialPage;

