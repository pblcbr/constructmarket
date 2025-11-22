import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MarketplacePage from './pages/MarketplacePage';
import MaterialDetailPage from './pages/MaterialDetailPage';
import CreateMaterialPage from './pages/CreateMaterialPage';
import EditMaterialPage from './pages/EditMaterialPage';
import MyMaterialsPage from './pages/MyMaterialsPage';
import TransactionsPage from './pages/TransactionsPage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './components/PrivateRoute';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/materials/:id" element={<MaterialDetailPage />} />

        {/* Private routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/materials/create" element={<CreateMaterialPage />} />
          <Route path="/materials/edit/:id" element={<EditMaterialPage />} />
          <Route path="/my-materials" element={<MyMaterialsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;

