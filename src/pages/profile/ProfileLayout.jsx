// src/pages/profile/ProfileLayout.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockResetIcon from '@mui/icons-material/LockReset';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const sidebarLinks = [
  { text: 'My Information', to: '/profile', icon: <PersonIcon />, end: true },
  { text: 'Change Password', to: '/profile/change-password', icon: <LockResetIcon /> },
  { text: 'My Orders', to: '/profile/orders', icon: <ReceiptLongIcon /> },
];

const ProfileLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const activeLinkStyle = {
    backgroundColor: 'rgba(241, 140, 8, 0.1)',
    color: '#f18c08',
    borderRight: '3px solid #f18c08',
    '& .MuiListItemIcon-root': {
      color: '#f18c08',
    },
  };

  return (
    <Box sx={{ 
      backgroundColor: '#f4f6f8', 
      py: isMobile ? 4 : 8, 
      pt: isMobile ? '90px' : '120px', 
      minHeight: '100vh' 
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          component="h1" 
          fontWeight="600" 
          sx={{ mb: isMobile ? 2 : 4 }}
        >
          My Profile
        </Typography>
        <Grid container spacing={isMobile ? 2 : 4}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: isMobile ? 1 : 2, 
                borderRadius: '12px',
                position: isMobile ? 'sticky' : 'static',
                top: isMobile ? '80px' : 0,
                zIndex: isMobile ? 1 : 'auto'
              }}
            >
              <List disablePadding>
                {sidebarLinks.map((link) => (
                  <ListItem key={link.text} disablePadding>
                    <ListItemButton
                      component={NavLink}
                      to={link.to}
                      end={link.end}
                      sx={{ 
                        borderRadius: '8px', 
                        '&.active': activeLinkStyle,
                        py: isMobile ? 1 : 1.5,
                        px: isMobile ? 1 : 2
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: '36px' }}>
                        {link.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={link.text} 
                        primaryTypographyProps={{
                          fontSize: isMobile ? '0.875rem' : '1rem'
                        }} 
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Content Area */}
          <Grid item xs={12} md={9}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: isMobile ? 2 : 4, 
                borderRadius: '12px', 
                minHeight: '60vh' 
              }}
            >
              <Outlet />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfileLayout;