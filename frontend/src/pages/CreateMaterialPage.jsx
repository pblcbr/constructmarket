import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { materialsAPI } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';

const CreateMaterialPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'otros',
    quantity: 1,
    unit: 'unidades',
    price: 0,
    condition: 'buen-estado',
    location: '',
    projectName: '',
    images: [],
  });

  const categories = [
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

  const units = [
    { value: 'unidades', label: 'Unidades' },
    { value: 'metros', label: 'Metros' },
    { value: 'kg', label: 'Kilogramos' },
    { value: 'cajas', label: 'Cajas' },
    { value: 'palets', label: 'Palets' },
    { value: 'lotes', label: 'Lotes' },
  ];

  const conditions = [
    { value: 'nuevo', label: 'Nuevo' },
    { value: 'como-nuevo', label: 'Como Nuevo' },
    { value: 'buen-estado', label: 'Buen Estado' },
    { value: 'usado', label: 'Usado' },
    { value: 'necesita-reparacion', label: 'Necesita Reparación' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar los 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      // Use environment variable for API URL, fallback to localhost for development
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';
      const uploadUrl = `${apiUrl}/upload`;

      const response = await axios.post(
        uploadUrl,
        formDataUpload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Add the uploaded image URL to the form
      setFormData({
        ...formData,
        images: [...formData.images, response.data.url]
      });

      // Reset file input
      e.target.value = '';
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.response?.data?.message || 'Error al subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Clean up form data - remove empty strings
      const cleanData = {
        ...formData,
        projectName: formData.projectName.trim() || undefined,
      };
      
      console.log('Sending data:', cleanData);
      
      const response = await materialsAPI.create(cleanData);
      navigate(`/materials/${response.data.material._id}`);
    } catch (err) {
      console.error('Error creating material:', err);
      console.error('Error response:', err.response?.data);
      
      let errorMessage = 'Error al crear el material';
      
      if (err.response?.data) {
        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
        if (err.response.data.errors && err.response.data.errors.length > 0) {
          errorMessage = err.response.data.errors.map(e => e.message || e.msg).join(', ');
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="mb-8">Publicar Material</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <ErrorMessage message={error} onClose={() => setError('')} />

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="input"
              placeholder="Ej: Vallas metálicas de obra"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows="4"
              className="input"
              placeholder="Describe el material, su estado, características, etc."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Category and Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <select
                id="category"
                name="category"
                required
                className="input"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                Condición *
              </label>
              <select
                id="condition"
                name="condition"
                required
                className="input"
                value={formData.condition}
                onChange={handleChange}
              >
                {conditions.map((cond) => (
                  <option key={cond.value} value={cond.value}>
                    {cond.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad *
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                required
                min="1"
                className="input"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                Unidad *
              </label>
              <select
                id="unit"
                name="unit"
                required
                className="input"
                value={formData.unit}
                onChange={handleChange}
              >
                {units.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Precio (€) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              required
              min="0"
              step="0.01"
              className="input"
              placeholder="0.00"
              value={formData.price}
              onChange={handleChange}
            />
            <p className="mt-1 text-sm text-gray-500">Precio por unidad</p>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              className="input"
              placeholder="Ej: Madrid, Calle Mayor 123"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          {/* Project Name */}
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Proyecto / Obra <span className="text-gray-400 text-xs">(opcional)</span>
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              className="input"
              placeholder="Ej: Edificio Residencial Norte"
              value={formData.projectName}
              onChange={handleChange}
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imágenes <span className="text-gray-400 text-xs">(opcional)</span>
            </label>
            <div className="space-y-3">
              {/* File Upload */}
              <div>
                <label className="w-full">
                  <div className="btn-primary text-center cursor-pointer inline-flex items-center justify-center w-full">
                    {uploadingImage ? (
                      <>
                        <LoadingSpinner size="small" />
                        <span className="ml-2">Subiendo imagen...</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Seleccionar Imagen desde tu PC
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>

              <p className="text-xs text-gray-500">
                Máximo 5MB por imagen. Formatos: JPG, PNG, GIF, WebP
              </p>
              
              {formData.images.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Imágenes añadidas ({formData.images.length})
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={img} 
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200?text=Error+al+cargar';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                          title="Eliminar imagen"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary flex-1"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex-1 flex justify-center items-center"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="small" />
                <span className="ml-2">Publicando...</span>
              </>
            ) : (
              'Publicar Material'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMaterialPage;

