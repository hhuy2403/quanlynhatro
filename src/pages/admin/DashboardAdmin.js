import { useNavigate } from 'react-router-dom';

const DashboardAdmin = () => {
  const navigate = useNavigate();

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
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <p>Chào mừng bạn đến với trang quản trị. Dưới đây là các mục quản lý chính.</p>

      <div style={menuStyle}>
        <button
          onClick={() => navigateTo('/user-management')}
          style={buttonStyle}
        >
          Quản lý Tài khoản
        </button>
        <button
          onClick={() => navigateTo('/room-management')}
          style={buttonStyle}
        >
          Quản lý Phòng
        </button>
        <button
          onClick={() => navigateTo('/invoice-management')}
          style={buttonStyle}
        >
          Quản lý Hóa đơn
        </button>
        <button
          onClick={() => navigateTo('/contract-management')}
          style={buttonStyle}
        >
          Quản lý Hợp đồng
        </button>
      </div>

      <button
        onClick={handleLogout}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#ff4d4f',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Đăng Xuất
      </button>
    </div>
  );
};

// CSS inline cho menu và button
const menuStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  marginTop: '30px',
};

const buttonStyle = {
  padding: '15px 30px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.3s',
};

export default DashboardAdmin;
