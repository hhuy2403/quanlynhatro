import { useEffect, useState } from 'react';
import axios from 'axios';

const RoleCreation = ({ onRoleCreated }) => {
  const [permissions, setPermissions] = useState([]); // Lưu danh sách quyền
  const [selectedPermissions, setSelectedPermissions] = useState([]); // Các quyền được chọn
  const [roleName, setRoleName] = useState(''); // Tên vai trò
  const [loading, setLoading] = useState(false); // Trạng thái gửi yêu cầu
  const [errorMessage, setErrorMessage] = useState('');

  // Lấy danh sách quyền từ API
  useEffect(() => {
    const fetchPermissions = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('https://cdtnapi.lyhai.id.vn/api/v1/permission', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPermissions(response.data.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách quyền:', error);
        setErrorMessage('Không thể lấy danh sách quyền.');
      }
    };

    fetchPermissions();
  }, []);

  // Xử lý khi người dùng chọn quyền
  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId) // Bỏ chọn nếu đã chọn trước đó
        : [...prev, permissionId] // Thêm vào danh sách được chọn
    );
  };

  // Xử lý tạo vai trò mới
  const handleCreateRole = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'https://cdtnapi.lyhai.id.vn/api/v1/role',
        {
          name: roleName,
          permission_id: selectedPermissions,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('Tạo vai trò thành công!');
      onRoleCreated(); // Gọi lại hàm sau khi tạo vai trò thành công
    } catch (error) {
      console.error('Lỗi khi tạo vai trò:', error);
      setErrorMessage('Không thể tạo vai trò mới.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Tạo Vai Trò Mới</h2>

      <input
        type="text"
        placeholder="Tên vai trò"
        value={roleName}
        onChange={(e) => setRoleName(e.target.value)}
        style={inputStyle}
      />

      <h3>Chọn Quyền:</h3>
      <div style={{ marginBottom: '20px' }}>
        {permissions.map((permission) => (
          <label key={permission.id} style={{ display: 'block', marginBottom: '5px' }}>
            <input
              type="checkbox"
              value={permission.id}
              onChange={() => handlePermissionChange(permission.id)}
              checked={selectedPermissions.includes(permission.id)}
            />
            {permission.name}
          </label>
        ))}
      </div>

      <button onClick={handleCreateRole} style={buttonStyle} disabled={loading}>
        {loading ? 'Đang tạo...' : 'Tạo Vai Trò'}
      </button>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

const inputStyle = {
  marginBottom: '10px',
  padding: '10px',
  width: '100%',
  boxSizing: 'border-box',
};

const buttonStyle = {
  padding: '10px',
  margin: '5px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default RoleCreation;
