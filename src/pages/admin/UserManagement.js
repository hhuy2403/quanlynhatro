import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  IconButton,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RestartAltIcon from '@mui/icons-material/RestartAlt';


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState({ name: '', description: '' });
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // Lưu thông tin người dùng được chọn để sửa
  const [newUser, setNewUser] = useState({
    full_name: '',
    nick_name: '',
    email_address: '',
    user_name: '',
    hashed_password: '',
    phone_number: '',
    date_of_birth: '',
    gender: 0,
    address: '',
    avt_url: '',
    role_id: '',
  });
  const [error, setError] = useState('');
  const [showUserInfo, setShowUserInfo] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Lấy danh sách người dùng
  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://cdtnapi.lyhai.id.vn/api/v1/account', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.data);
    } catch (error) {
      setError('Lỗi khi lấy danh sách tài khoản.');
      console.error(error);
    }
  };

  // Đặt lại mật khẩu
  const handleResetPassword = async (cd_code) => {
    try {
      const response = await axios.put(
        `https://cdtnapi.lyhai.id.vn/api/v1/account/rs/reset-password/${cd_code}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 200) {
        alert('Đặt lại mật khẩu thành công!');
      } else {
        alert('Lỗi khi đặt lại mật khẩu.');
      }
    } catch (error) {
      console.error('Lỗi khi đặt lại mật khẩu:', error);
      alert('Lỗi khi đặt lại mật khẩu.');
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get('https://cdtnapi.lyhai.id.vn/api/v1/role', {
        params: {
          filter_str: '',
          page_size: 10,
          page: 1,
          sort_by: 'id',
          order: 'desc'
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoles(response.data.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách vai trò:', error);
    }
  };


  const fetchUserDetail = async (cd_code) => {
    try {
      const response = await axios.get(`https://cdtnapi.lyhai.id.vn/api/v1/account/${cd_code}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = response?.data?.data;

      if (userData) {
        setNewUser({
          full_name: userData.full_name || '',
          nick_name: userData.nick_name || '',
          email_address: userData.email_address || '',
          user_name: userData.user_name || '',
          phone_number: userData.phone_number || '',
          date_of_birth: userData.date_of_birth || '',
          gender: userData.gender || 0,
          address: userData.address || '',
          avt_url: userData.avt_url || '',
          role_id: userData.role ? userData.role.id : '',
        });

        setSelectedUser(userData);
      } else {
        alert('Không tìm thấy thông tin người dùng.');
      }
    } catch (error) {
      setError('Lỗi khi lấy chi tiết người dùng.');
      console.error(error);
    }
  };

  // Hàm lưu người dùng (cập nhật hoặc tạo mới)
  const handleSaveUser = async () => {
    const isEditing = !!selectedUser; // Kiểm tra xem có đang sửa hay không
    const apiEndpoint = isEditing
      ? `https://cdtnapi.lyhai.id.vn/api/v1/account/${selectedUser.cd_code}` // Nếu sửa thì thêm cd_code vào URL
      : 'https://cdtnapi.lyhai.id.vn/api/v1/account';
    const method = isEditing ? 'put' : 'post';

    const userData = { ...newUser };
    if (isEditing) delete userData.hashed_password; // Không gửi mật khẩu khi cập nhật

    try {
      await axios[method](apiEndpoint, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(isEditing ? 'Cập nhật thành công!' : 'Tạo tài khoản thành công!');
      fetchUsers();
      resetForm();
    } catch (error) {
      setError('Lỗi khi lưu tài khoản.');
      console.error(error);
    }
  };

  const handleDeleteUser = async (cd_code) => {
    try {
      const response = await axios.delete('https://cdtnapi.lyhai.id.vn/api/v1/account', {
        headers: { Authorization: `Bearer ${token}` },
        data: [cd_code], // Gửi cd_code dưới dạng mảng
      });

      if (response.status === 200) {
        alert('Xóa tài khoản thành công!');
        fetchUsers(); // Tải lại danh sách người dùng
      } else {
        alert('Có lỗi xảy ra khi xóa tài khoản.');
      }
    } catch (error) {
      setError('Lỗi khi xóa tài khoản.');
      console.error(error);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
    setNewRole({ ...newRole, [name]: value });
  };

  // Hàm xoá vai trò
  const handleDeleteRole = async (cd_code) => {
    try {
      await axios.delete('https://cdtnapi.lyhai.id.vn/api/v1/role', {
        headers: { Authorization: `Bearer ${token}` },
        data: [cd_code], // Truyền mã vai trò cần xoá dưới dạng mảng
      });
      alert('Xóa vai trò thành công!');
      fetchRoles(); // Tải lại danh sách vai trò
    } catch (error) {
      console.error('Lỗi khi xóa vai trò:', error);
      setError('Lỗi khi xóa vai trò.');
    }
  };

  const resetForm = () => {
    setSelectedUser(null);
    setSelectedRole(null);
    setNewRole({ name: '', description: '' });
    setNewUser({
      full_name: '',
      nick_name: '',
      email_address: '',
      user_name: '',
      hashed_password: '',
      phone_number: '',
      date_of_birth: '',
      gender: 0,
      address: '',
      avt_url: '',
      role_id: '',
    });
  };

  // Khi nhấn sửa vai trò
  const handleEditRole = (role) => {
    setSelectedRole(role);
    setNewRole({ name: role.name, description: role.description });
  };


  // Hàm lưu hoặc cập nhật vai trò
  const handleSaveRole = async () => {
    const method = selectedRole ? 'put' : 'post';
    const url = selectedRole
      ? `https://cdtnapi.lyhai.id.vn/api/v1/role/${selectedRole.cd_code}`
      : 'https://cdtnapi.lyhai.id.vn/api/v1/role';

    try {
      await axios[method](url, newRole, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(selectedRole ? 'Cập nhật vai trò thành công!' : 'Thêm vai trò thành công!');
      fetchRoles(); // Cập nhật lại danh sách vai trò
      resetForm();
    } catch (error) {
      console.error('Lỗi khi lưu vai trò:', error);
      setError('Lỗi khi lưu vai trò.');
    }
  };

  const handleViewUserInfo = (user) => {
    setSelectedUser(user);
    setShowUserInfo(true);
  };

  const handleEditUser = (user) => {
    fetchUserDetail(user.cd_code); // Truyền cd_code thay vì id
    setShowUserInfo(false); // Đóng modal thông tin chi tiết (nếu đang mở)
  };

  const handleCloseUserInfo = () => {
    setSelectedUser(null);
    setShowUserInfo(false);
  };


  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleBack}
        sx={{ mb: 2 }}
      >
        Quay Về
      </Button>

      <Typography variant="h4" gutterBottom>
        Quản Lý Tài Khoản
      </Typography>

      {showUserInfo && selectedUser ? (
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
          <Typography variant="h5" gutterBottom>
            Thông Tin Người Dùng
          </Typography>
          <Grid container spacing={2}>
            {[
              { label: 'Họ và Tên', value: selectedUser.full_name },
              { label: 'Biệt Danh', value: selectedUser.nick_name },
              { label: 'Email', value: selectedUser.email_address },
              { label: 'Số Điện Thoại', value: selectedUser.phone_number },
              { label: 'Ngày Sinh', value: selectedUser.date_of_birth },
              { label: 'Giới Tính', value: selectedUser.gender === 0 ? 'Nam' : 'Nữ' },
              { label: 'Địa Chỉ', value: selectedUser.address },
              { label: 'Vai Trò', value: selectedUser.role ? selectedUser.role.name : 'Không có vai trò' },
            ].map(({ label, value }, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Typography><b>{label}:</b> {value}</Typography>
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={handleCloseUserInfo}
          >
            Đóng
          </Button>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
          <Typography variant="h5" gutterBottom>
            {selectedUser ? 'Cập Nhật Tài Khoản' : 'Tạo Tài Khoản Mới'}
          </Typography>
          <Grid container spacing={2}>
            {[
              { name: 'full_name', label: 'Họ và Tên' },
              { name: 'nick_name', label: 'Biệt Danh' },
              { name: 'email_address', label: 'Email' },
              { name: 'user_name', label: 'Tên Người Dùng' },
              { name: 'phone_number', label: 'Số Điện Thoại' },
              { name: 'address', label: 'Địa Chỉ' },
              { name: 'avt_url', label: 'URL Ảnh Đại Diện' },
            ].map(({ name, label }, index) => (
              <Grid item xs={12} md={6} key={index}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label={label}
                  name={name}
                  value={newUser[name]}
                  onChange={handleInputChange}
                />
              </Grid>
            ))}

            {!selectedUser && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  variant="outlined"
                  label="Mật Khẩu"
                  name="hashed_password"
                  value={newUser.hashed_password}
                  onChange={handleInputChange}
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                variant="outlined"
                name="date_of_birth"
                value={newUser.date_of_birth}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                label="Ngày Sinh"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Select
                fullWidth
                variant="outlined"
                name="gender"
                value={newUser.gender}
                onChange={handleInputChange}
              >
                <MenuItem value={0}>Nam</MenuItem>
                <MenuItem value={1}>Nữ</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12}>
              <Select
                fullWidth
                variant="outlined"
                name="role_id"
                value={newUser.role_id}
                onChange={handleInputChange}
              >
                <MenuItem value="">Chọn Vai Trò</MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSaveUser}
              >
                {selectedUser ? 'Cập Nhật' : 'Tạo Mới'}
              </Button>
              {selectedUser && (
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={resetForm}
                >
                  Hủy
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper>
      )}

      <Typography variant="h5" sx={{ mt: 4 }}>
        Danh Sách Tài Khoản
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>CD Code</TableCell>
              <TableCell>Họ và Tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Vai Trò</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.cd_code}>
                <TableCell>{user.cd_code}</TableCell>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.email_address}</TableCell>
                <TableCell>{user.role ? user.role.name : 'Không có vai trò'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleResetPassword(user.cd_code)}>
                    <RestartAltIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleViewUserInfo(user)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEditUser(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteUser(user.cd_code)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h5" sx={{ mt: 4 }}>
        Quản Lý Vai Trò
      </Typography>
      <Paper elevation={3} sx={{ padding: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          {selectedRole ? 'Cập Nhật Vai Trò' : 'Thêm Vai Trò'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Tên Vai Trò"
              name="name"
              value={newRole.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Mô Tả"
              name="description"
              value={newRole.description}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSaveRole}
            >
              {selectedRole ? 'Cập Nhật' : 'Thêm Mới'}
            </Button>
            {selectedRole && (
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={resetForm}
              >
                Hủy
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h5" sx={{ mt: 4 }}>
        Danh Sách Vai Trò
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã Vai Trò (CD Code)</TableCell>
              <TableCell>Tên Vai Trò</TableCell>
              <TableCell>Mô Tả</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.length > 0 ? (
              roles.map((role) => (
                <TableRow key={role.cd_code}>
                  <TableCell>{role.cd_code}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description || 'Không có mô tả'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditRole(role)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteRole(role.cd_code)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Không có vai trò nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>


      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );

};
const headerStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  backgroundColor: '#f2f2f2',
  textAlign: 'left',
};

const cellStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
};
const inputStyle = { margin: '5px 0', padding: '10px', width: '100%' };
const buttonStyle = { padding: '10px', marginTop: '10px', cursor: 'pointer' };

export default UserManagement;
