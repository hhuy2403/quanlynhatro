import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  Alert,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';

const Register = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

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
    role_id: 3, // 4: Người thuê, 3: Chủ trọ, 1: Admin
  });

  // Xử lý thay đổi dữ liệu nhập
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Hàm xử lý đăng ký người dùng mới
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await axios.post(
        'https://cdtnapi.lyhai.id.vn/api/v1/account',
        userData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 201 || response.status === 200) {
        alert('Đăng ký thành công!');
        navigate('/'); // Điều hướng về trang đăng nhập
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      if (error.response) {
        const validationErrors = error.response.data.detail
          .map((err) => `${err.loc.join(' -> ')}: ${err.msg}`)
          .join('\n');
        setErrorMessage(`Đăng ký thất bại:\n${validationErrors}`);
      } else {
        setErrorMessage('Không thể kết nối đến server. Vui lòng kiểm tra lại kết nối mạng.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      }}
    >
      <Grid item xs={11} sm={8} md={6} lg={4}>
        <Paper
          elevation={8}
          style={{
            padding: '40px',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.8)',
          }}
        >
          <Typography variant="h4" align="center" gutterBottom style={{ fontWeight: 700 }}>
            Đăng Ký
          </Typography>
          <form onSubmit={handleRegister}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Họ và Tên"
                name="full_name"
                value={userData.full_name}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Biệt danh"
                name="nick_name"
                value={userData.nick_name}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                name="email_address"
                value={userData.email_address}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Tên người dùng"
                name="user_name"
                value={userData.user_name}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Mật khẩu"
                type="password"
                name="hashed_password"
                value={userData.hashed_password}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Số điện thoại"
                name="phone_number"
                value={userData.phone_number}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                type="date"
                label="Ngày sinh"
                name="date_of_birth"
                value={userData.date_of_birth}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  name="gender"
                  value={userData.gender}
                  onChange={handleChange}
                >
                  <MenuItem value={0}>Nam</MenuItem>
                  <MenuItem value={1}>Nữ</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Địa chỉ"
                name="address"
                value={userData.address}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="URL Ảnh đại diện"
                name="avt_url"
                value={userData.avt_url}
                onChange={handleChange}
              />
              <FormControl fullWidth>
                <InputLabel>Vai trò</InputLabel>
                <Select
                  name="role_id"
                  value={userData.role_id}
                  onChange={handleChange}
                >
                  <MenuItem value={4}>Người thuê</MenuItem>
                  <MenuItem value={3}>Chủ trọ</MenuItem>
                  <MenuItem value={1}>Admin</MenuItem>
                </Select>
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                style={{
                  backgroundColor: '#8ec5fc',
                  color: 'white',
                  padding: '12px',
                  fontWeight: 'bold',
                }}
                disabled={loading}
              >
                {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
              </Button>
            </Stack>
          </form>
          {errorMessage && (
            <Box mt={2}>
              <Alert severity="error" style={{ whiteSpace: 'pre-wrap' }}>
                {errorMessage}
              </Alert>
            </Box>
          )}
          <Box mt={3} textAlign="center">
            <Typography>
              Đã có tài khoản?{' '}
              <Link href="/" underline="hover">
                Đăng nhập ngay
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Register;
