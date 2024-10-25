import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [user_name, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const getAccountInfo = async (token) => {
    try {
      const response = await axios.get('https://cdtnapi.lyhai.id.vn/api/v1/account/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = response.data.data;
      const roleName = user?.role?.name?.toLowerCase() || 'unknown';
      localStorage.setItem('user_info', JSON.stringify(user));
      localStorage.setItem('token', token);
      navigate(`/${roleName === 'admin' ? 'dashboard-admin' : roleName === 'landlord' ? 'dashboard-landlord' : 'dashboard-tenant'}`);
    } catch (error) {
      setErrorMessage('Không thể lấy thông tin tài khoản. Vui lòng thử lại.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://cdtnapi.lyhai.id.vn/api/v1/auth/system/login', {
        username: user_name,
        password,
      });
      const token = response.data.data?.access_token;
      if (token) {
        await getAccountInfo(token);
      }
    } catch (error) {
      setErrorMessage('Đăng nhập thất bại. Vui lòng kiểm tra thông tin.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Đăng Nhập</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Nhập Tên Người Dùng"
          value={user_name}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ marginBottom: '10px', width: '300px', padding: '10px' }}
        />
        <input
          type="password"
          placeholder="Nhập Mật Khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ marginBottom: '10px', width: '300px', padding: '10px' }}
        />
        <button type="submit" style={{ width: '320px', padding: '10px' }}>
          Đăng Nhập
        </button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <p>Chưa có tài khoản? <a href="/register">Đăng ký ngay</a></p>
    </div>
  );
};

export default Login;
