// src/components/Header.js
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const isMobile = useMediaQuery('(max-width:600px)'); // Detect small screens

  // Get user name from localStorage or use default
  const userName = localStorage.getItem('user') || 'Admin';

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (route) => {
    handleClose();
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('role_id');
    localStorage.removeItem('role_name');
    navigate('/login', { replace: true });
    window.location.reload();
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const navItems = ['Home', 'Users', 'Contracts', 'Financials', 'Maintenance'];

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#6b73ff',
        padding: '0px 20px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 1300,
      }}
    >
      <Toolbar>
        {/* Logo CozyHome */}
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/dashboard-admin')}
        >
          CozyHome
        </Typography>

        {isMobile ? (
          // Hamburger menu for mobile view
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <List>
                  {navItems.map((text) => (
                    <ListItem
                      button
                      key={text}
                      onClick={() => navigate(`/${text.toLowerCase()}`)}
                    >
                      <ListItemText primary={text} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          // Full menu for desktop view
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mr: 3 }}>
            {navItems.map((item) => (
              <Button
                key={item}
                color="inherit"
                sx={{ fontWeight: 'bold' }}
                onClick={() => navigate(`/${item.toLowerCase()}`)}
              >
                {item}
              </Button>
            ))}
          </Box>
        )}

        {/* User Account Menu */}
        <IconButton
          onClick={handleMenu}
          size="large"
          edge="end"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem disabled>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {userName}
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleMenuClick('/profile')}>
            Thông tin tài khoản
          </MenuItem>
          <MenuItem onClick={() => handleMenuClick('/change-password')}>
            Đổi mật khẩu
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
