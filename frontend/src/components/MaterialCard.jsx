import { Link } from 'react-router-dom';

const MaterialCard = ({ material }) => {
  const {
    _id,
    title,
    price,
    category,
    condition,
    location,
    status,
    images = [],
    quantity,
    unit,
  } = material;

  // Get status badge class
  const getStatusBadgeClass = () => {
    switch (status) {
      case 'disponible':
        return 'badge-disponible';
      case 'reservado':
        return 'badge-reservado';
      case 'vendido':
        return 'badge-vendido';
      default:
        return 'badge';
    }
  };

  // Get condition in Spanish
  const getConditionText = () => {
    const conditions = {
      'nuevo': 'Nuevo',
      'como-nuevo': 'Como Nuevo',
      'buen-estado': 'Buen Estado',
      'usado': 'Usado',
      'necesita-reparacion': 'Necesita Reparación'
    };
    return conditions[condition] || condition;
  };

  // Get category in Spanish
  const getCategoryText = () => {
    const categories = {
      'vallas': 'Vallas',
      'conos': 'Conos',
      'palets': 'Palets',
      'andamios': 'Andamios',
      'herramientas': 'Herramientas',
      'maquinaria': 'Maquinaria',
      'materiales-construccion': 'Materiales de Construcción',
      'señalizacion': 'Señalización',
      'proteccion': 'Protección',
      'otros': 'Otros'
    };
    return categories[category] || category;
  };

  const isSold = status === 'vendido';

  const cardContent = (
    <div className={`card transition-shadow duration-300 ${isSold ? 'opacity-60 grayscale hover:shadow-lg cursor-not-allowed' : 'hover:shadow-xl'}`}>
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {images.length > 0 ? (
          <img
            src={images[0]}
            alt={title}
            className={`w-full h-full object-cover ${isSold ? 'grayscale opacity-60' : ''}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <span className={getStatusBadgeClass()}>
            {status === 'disponible' ? 'Disponible' : status === 'reservado' ? 'Reservado' : status === 'vendido' ? 'Vendido' : status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-primary-600 font-semibold uppercase tracking-wide mb-1">
          {getCategoryText()}
        </p>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Quantity and condition */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <span>{quantity} {unit}</span>
          <span>•</span>
          <span>{getConditionText()}</span>
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-1">{location}</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-construction-orange">
            €{price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500 ml-1">/ {unit}</span>
        </div>
      </div>
    </div>
  );

  // If sold, don't make it a link
  if (isSold) {
    return cardContent;
  }

  return (
    <Link to={`/materials/${_id}`}>
      {cardContent}
    </Link>
  );
};

export default MaterialCard;

