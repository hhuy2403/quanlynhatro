import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import UserManagement from './pages/admin/UserManagement';
import RoomManagement from './pages/admin/RoomManagement';
import InvoiceManagement from './pages/admin/InvoiceManagement';
import ContractManagement from './pages/admin/ContractManagement';
import DashboardLandlord from './pages/landlord/DashboardLandlord';
import DashboardTenant from './pages/tenant/DashboardTenant';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const token = localStorage.getItem('token');
  const roleName = JSON.parse(localStorage.getItem('user_info'))?.role?.name?.toLowerCase() || '';

  const getDashboardPath = (roleName) => {
    switch (roleName) {
      case 'admin':
        return '/dashboard-admin';
      case 'landlord':
        return '/dashboard-landlord';
      case 'tenant':
        return '/dashboard-tenant';
      default:
        return '/login';
    }
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          token ? (
            <Navigate to={getDashboardPath(roleName)} />
          ) : (
            <Login />
          )
        }
      />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard-admin"
        element={
          <ProtectedRoute roleRequired="admin">
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-management"
        element={
          <ProtectedRoute roleRequired="admin">
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/room-management"
        element={
          <ProtectedRoute roleRequired="admin">
            <RoomManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoice-management"
        element={
          <ProtectedRoute roleRequired="admin">
            <InvoiceManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contract-management"
        element={
          <ProtectedRoute roleRequired="admin">
            <ContractManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard-landlord"
        element={
          <ProtectedRoute roleRequired="landlord">
            <DashboardLandlord />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard-tenant"
        element={
          <ProtectedRoute roleRequired="tenant">
            <DashboardTenant />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
