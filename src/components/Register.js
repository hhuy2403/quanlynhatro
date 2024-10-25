import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    full_name: '',
    nick_name: '',
    email_address: '',
    user_name: '',
    hashed_password: '',
    phone_number: '',
    date_of_birth: '',
    gender: 0, // 0: Nam, 1: Nữ
    address: '',
    avt_url: '',
    role_id: 0, // 0: Người thuê, 1: Chủ trọ, 2: Admin
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Hiển thị khi đang gửi request

  // Cập nhật giá trị của các ô nhập khi người dùng nhập
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Hàm xử lý đăng ký
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset lỗi trước đó
    setLoading(true); // Hiển thị trạng thái loading

    try {
      const response = await axios.post(
        'https://cdtnapi.lyhai.id.vn/api/v1/account',
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        alert('Đăng ký thành công!');
        navigate('/'); // Chuyển hướng về trang đăng nhập
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);

      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.detail
          .map((err) => `${err.loc.join(' -> ')}: ${err.msg}`)
          .join('\n');
        setErrorMessage(`Đăng ký thất bại:\n${validationErrors}`);
      } else {
        setErrorMessage('Đăng ký thất bại. Vui lòng kiểm tra thông tin và thử lại.');
      }
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Đăng Ký</h1>
      <form onSubmit={handleRegister} style={{ maxWidth: '400px', margin: 'auto' }}>
        <input
          type="text"
          name="full_name"
          placeholder="Họ và Tên"
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="text"
          name="nick_name"
          placeholder="Biệt danh"
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          type="email"
          name="email_address"
          placeholder="Email"
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="text"
          name="user_name"
          placeholder="Tên người dùng"
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="password"
          name="hashed_password"
          placeholder="Mật khẩu"
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Số điện thoại"
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          type="date"
          name="date_of_birth"
          onChange={handleChange}
          style={inputStyle}
        />
        <select name="gender" onChange={handleChange} style={inputStyle}>
          <option value={0}>Nam</option>
          <option value={1}>Nữ</option>
        </select>
        <input
          type="text"
          name="address"
          placeholder="Địa chỉ"
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          type="text"
          name="avt_url"
          placeholder="URL Ảnh đại diện"
          onChange={handleChange}
          style={inputStyle}
        />
        <select name="role_id" onChange={handleChange} style={inputStyle}>
          <option value={0}>Người thuê</option>
          <option value={1}>Chủ trọ</option>
          <option value={2}>Admin</option>
        </select>

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
        </button>
      </form>

      {errorMessage && <p style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{errorMessage}</p>}

      <p style={{ marginTop: '20px' }}>
        Đã có tài khoản? <a href="/">Đăng nhập ngay</a>
      </p>
    </div>
  );
};

// CSS inline cho các input và button
const inputStyle = {
  width: '100%',
  padding: '10px',
  margin: '8px 0',
  boxSizing: 'border-box',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const buttonStyle = {
  width: '100%',
  padding: '10px',
  margin: '8px 0',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default Register;
