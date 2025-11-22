import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">ConstructMarket</h3>
            <p className="text-gray-300 text-sm">
              Marketplace interno para compra y venta de materiales de construcción sobrantes entre jefes de obra.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/marketplace" className="text-gray-300 hover:text-white text-sm transition">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/materials/create" className="text-gray-300 hover:text-white text-sm transition">
                  Publicar Material
                </Link>
              </li>
              <li>
                <Link to="/my-materials" className="text-gray-300 hover:text-white text-sm transition">
                  Mis Materiales
                </Link>
              </li>
              <li>
                <Link to="/transactions" className="text-gray-300 hover:text-white text-sm transition">
                  Transacciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <p className="text-gray-300 text-sm">
              ¿Necesitas ayuda?
            </p>
            <p className="text-gray-300 text-sm mt-2">
              Email: support@constructmarket.com
            </p>
            <p className="text-gray-300 text-sm">
              Tel: +34 900 123 456
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} ConstructMarket. Proyecto Final - IronHack Master Program.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

