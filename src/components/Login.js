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
} from '@mui/material';

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
      navigate(
        `/${roleName === 'admin' ? 'dashboard-admin' : roleName === 'landlord' ? 'dashboard-landlord' : 'dashboard-tenant'}`
      );
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
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      }}
    >
      <Grid item xs={11} sm={8} md={5} lg={4}>
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
            Đăng Nhập
          </Typography>
          <Typography variant="body2" align="center" color="textSecondary" mb={2}>
            Vui lòng đăng nhập để tiếp tục
          </Typography>
          <form onSubmit={handleLogin}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Tên Người Dùng"
                variant="outlined"
                value={user_name}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Mật Khẩu"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                style={{
                  backgroundColor: '#6b73ff',
                  color: 'white',
                  padding: '12px',
                  fontWeight: 'bold',
                }}
              >
                Đăng Nhập
              </Button>
            </Stack>
          </form>
          {errorMessage && (
            <Box mt={2}>
              <Alert severity="error" style={{ textAlign: 'center' }}>
                {errorMessage}
              </Alert>
            </Box>
          )}
          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Link href="/forgot-password" underline="hover" variant="body2">
              Quên mật khẩu?
            </Link>
            <Link href="/register" underline="hover" variant="body2">
              Đăng ký ngay
            </Link>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
