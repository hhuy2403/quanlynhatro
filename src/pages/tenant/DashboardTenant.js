import { useNavigate } from 'react-router-dom';

const DashboardTenant = () => {
  const navigate = useNavigate(); // useNavigate phải nằm trong component

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    // Xóa dữ liệu trong localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('role_id');
    localStorage.removeItem('role_name');

    // Điều hướng về trang đăng nhập
    navigate('/');
  };

  // Hàm điều hướng nhanh đến các trang quản lý
  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div>
      <h1>Dashboard Người Thuê</h1>
      <p>Xem hợp đồng và hóa đơn của bạn.</p>

      <button onClick={() => navigateTo('/contracts')} style={buttonStyle}>
        Quản lý Hợp Đồng
      </button>
      <button onClick={() => navigateTo('/invoices')} style={buttonStyle}>
        Quản lý Hóa Đơn
      </button>

      <button onClick={handleLogout} style={{ ...buttonStyle, backgroundColor: 'red', color: 'white' }}>
        Đăng Xuất
      </button>
    </div>
  );
};

const buttonStyle = {
  margin: '10px',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  backgroundColor: '#4CAF50',
  color: 'white',
  cursor: 'pointer',
};

export default DashboardTenant;
