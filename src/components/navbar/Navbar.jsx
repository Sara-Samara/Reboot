import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  AppBar, Box, Toolbar, IconButton, Typography, Menu,
  Container, Button, MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { toast } from 'react-toastify';

import LoginModal from "../../modals/login/LoginModal";
import logoWhite from '../../../public/logo/logo.webp';
import logoBlack from '../../../public/logo/logo-black.webp';

// Constants for pages to improve readability
const BASE_PAGES = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'Cart', path: '/cart' },
];

const ADMIN_PAGES = [
  { name: 'Dashboard', path: '/admin/dashboard' },
  { name: 'Products', path: '/admin/products' },
  { name: 'Orders', path: '/admin/orders' }
];

function Navbar({ position = "fixed" }) {
  const location = useLocation();
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // --- MEMOIZED VALUES ---
  // Memoize pages array to prevent recalculation on every render
  const pages = useMemo(() => {
    let pages = [...BASE_PAGES];
    if (isAdmin) {
      // Add admin pages after base pages but before profile
      pages.push(...ADMIN_PAGES);
    }
    if (isLoggedIn) {
      pages.push({ name: 'Profile', path: '/profile' });
    }
    return pages;
  }, [isAdmin, isLoggedIn]);

  // --- CALLBACKS ---
  const handleOpenNavMenu = useCallback((event) => setAnchorElNav(event.currentTarget), []);
  const handleCloseNavMenu = useCallback(() => setAnchorElNav(null), []);
  const handleOpenUserMenu = useCallback((event) => setAnchorElUser(event.currentTarget), []);
  const handleCloseUserMenu = useCallback(() => setAnchorElUser(null), []);
  const handleOpenLoginModal = useCallback(() => {
    setLoginModalOpen(true);
    handleCloseUserMenu(); // Close user menu if it's open
  }, [handleCloseUserMenu]);
  const handleCloseLoginModal = useCallback(() => setLoginModalOpen(false), []);
  
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setIsAdmin(false);
    handleCloseUserMenu();
    navigate('/');
    toast.success("Logged out successfully!");
  }, [navigate, handleCloseUserMenu]);

  // Memoize settings array for the user menu (mostly for desktop)
  const settings = useMemo(() => {
    if (isLoggedIn) {
      return [
        // Note: Admin Panel link is handled directly in mobile menu and potentially elsewhere.
        // Here we keep it simple for the user menu.
        { name: 'Profile', action: () => navigate('/profile') },
        { name: 'Logout', action: handleLogout }
      ];
    }
    return [
      { name: 'Login', action: handleOpenLoginModal },
    ];
  }, [isLoggedIn, navigate, handleLogout, handleOpenLoginModal]);

  const handleLoginSuccess = useCallback((token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setIsLoggedIn(true);
    setIsAdmin(!!role && role.toLowerCase().includes('admin'));
    handleCloseLoginModal();
    navigate('/');
    toast.success("Login successful!");
  }, [navigate, handleCloseLoginModal]);
  
  const isWhiteNavbarPage = useCallback(() => {
    const path = location.pathname;
    // Define paths that should have a white navbar regardless of scroll
    const alwaysWhitePaths = [
      '/cart', '/shop'
    ];
    // Regex for specific product pages or profile/admin
    const regexPaths = [
      /^\/product\/[^/]+$/, // e.g., /product/123
      /^\/profile/,
      /^\/admin/
    ];

    if (alwaysWhitePaths.includes(path)) {
      return true;
    }
    
    for (const regex of regexPaths) {
      if (regex.test(path)) {
        return true;
      }
    }
    
    return false;
  }, [location.pathname]);

  // --- SIDE EFFECTS ---
  // Check auth state only once on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setIsLoggedIn(!!token);
    setIsAdmin(!!role && role.toLowerCase().includes('admin'));
  }, []);

  // Effect for handling navbar style on scroll
  useEffect(() => {
    if (isWhiteNavbarPage()) {
      setScrolled(false); // Reset scroll state on pages that force white navbar
      return;
    }
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isWhiteNavbarPage]); // Dependency on the memoized function

  // --- RENDER LOGIC ---
  const isWhite = isWhiteNavbarPage() || scrolled;
  const navbarColor = isWhite ? 'black' : 'white'; // Text color for elements

  return (
    <>
      <AppBar
        position={position}
        elevation={0} // More subtle than boxShadow, relies on border/color change
        sx={{
          backgroundColor: isWhite ? 'white' : (scrolled ? 'rgba(0,0,0,0.8)' : 'transparent'),
          color: navbarColor,
          boxShadow: isWhite ? '0 2px 4px rgba(0,0,0,0.05)' : (scrolled ? '0 2px 10px rgba(0,0,0,0.3)' : 'none'),
          p: { xs: 1, md: isWhite ? 2 : (scrolled ? 1 : 3) }, // Responsive padding
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }} disableGutters>
            {/* Logo */}
            <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={isWhite ? logoBlack : logoWhite}
                alt="Logo"
                style={{ height: '40px', width: 'auto', transition: 'all 0.3s' }}
              />
            </Box>

            {/* Desktop Menu */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
              {pages.map((page) => {
                const isActive = location.pathname === page.path;
                const isAdminPage = ADMIN_PAGES.some(p => p.path === page.path);
                return (
                  <Button
                    key={page.name}
                    component={Link}
                    to={page.path}
                    onClick={handleCloseNavMenu}
                    sx={{
                      color: navbarColor,
                      fontWeight: 500,
                      borderBottom: isActive ? `2px solid ${isWhite ? '#f18c08' : 'white'}` : 'none',
                      borderRadius: 0,
                      py: 1,
                      textTransform: 'none', // Prevent uppercase transformation
                      '&:hover': {
                        borderBottom: `2px solid ${isWhite ? '#f18c08' : 'white'}`,
                        color: isWhite ? '#f18c08' : 'white',
                      }
                    }}
                  >
                    {page.name}
                    {isAdminPage && <AdminPanelSettingsIcon sx={{ ml: 0.5, fontSize: '1.1rem' }} />}
                  </Button>
                );
              })}
            </Box>

            {/* User & Mobile Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* User Icon (Desktop) */}
              <IconButton size="large" color="inherit" onClick={handleOpenUserMenu} sx={{ display: { xs: 'none', md: 'flex' } }}>
                <PersonOutlineIcon fontSize="large" />
              </IconButton>
              {/* Mobile Menu Icon */}
              <IconButton size="large" onClick={handleOpenNavMenu} color="inherit" sx={{ display: { xs: 'flex', md: 'none' } }}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Menu Dropdown (includes Auth options) */}
      <Menu
        id="menu-appbar"
        anchorEl={anchorElNav}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        sx={{ display: { xs: 'block', md: 'none' } }} // Ensure it's block for mobile
      >
        {/* Base Pages */}
        {BASE_PAGES.map((page) => (
          <MenuItem
            key={page.name}
            component={Link}
            to={page.path}
            onClick={() => { handleCloseNavMenu(); }} // Close mobile menu
            selected={location.pathname === page.path}
            sx={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography>{page.name}</Typography>
          </MenuItem>
        ))}

        {/* Admin Pages */}
        {isAdmin && ADMIN_PAGES.map((page) => (
          <MenuItem
            key={page.name}
            component={Link}
            to={page.path}
            onClick={() => { handleCloseNavMenu(); }} // Close mobile menu
            selected={location.pathname === page.path}
            sx={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography>{page.name}</Typography>
            <AdminPanelSettingsIcon sx={{ ml: 1, fontSize: '1.2rem' }} />
          </MenuItem>
        ))}

        {/* User-specific items */}
        <Box sx={{ borderTop: '1px solid #eee', mt: 1, pt: 1 }}> {/* Separator */}
          {!isLoggedIn ? (
            <>
              <MenuItem onClick={() => { handleOpenLoginModal(); handleCloseNavMenu(); }}>
                <Typography textAlign="center">Login</Typography>
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem onClick={() => { navigate('/profile'); handleCloseNavMenu(); }}>
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
              {isAdmin && (
                 <MenuItem onClick={() => { navigate('/admin'); handleCloseNavMenu(); }}>
                   <Typography textAlign="center">Admin Panel</Typography>
                 </MenuItem>
              )}
              <MenuItem onClick={() => { handleLogout(); handleCloseNavMenu(); }}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </>
          )}
        </Box>
      </Menu>

      {/* User Menu Dropdown (Primarily for Desktop) */}
      <Menu
        id="user-menu"
        anchorEl={anchorElUser}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        sx={{ mt: '45px' }} // Adjust margin-top to position correctly below the icon
      >
        {settings.map((setting) => (
          <MenuItem key={setting.name} onClick={() => {
            setting.action();
            handleCloseUserMenu(); // Close user menu after clicking an item
          }}>
            <Typography textAlign="center">{setting.name}</Typography>
          </MenuItem>
        ))}
      </Menu>

      {/* Login Modal */}
      <LoginModal
        open={loginModalOpen}
        handleClose={handleCloseLoginModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}

export default Navbar;