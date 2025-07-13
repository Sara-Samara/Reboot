// src/pages/profile/ProfileInfo.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { 
  Box, Typography, CircularProgress, Alert, Avatar, 
  useMediaQuery, useTheme 
} from '@mui/material';

const fetchUserProfile = async () => {
  const { data } = await axiosInstance.get('/Account/userinfo'); 
  return data;
};

const ProfileInfo = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (isError) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error loading profile: {error.message}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        component="h2" 
        fontWeight="500" 
        gutterBottom
      >
        Personal Information
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 3, 
        mt: 3,
        flexDirection: isMobile ? 'column' : 'row',
        textAlign: isMobile ? 'center' : 'left'
      }}>
        <Avatar 
          sx={{ 
            width: isMobile ? 60 : 80, 
            height: isMobile ? 60 : 80, 
            bgcolor: '#f18c08', 
            fontSize: isMobile ? '1.5rem' : '2rem' 
          }}
        >
          {user?.userName?.charAt(0).toUpperCase() || 'U'}
        </Avatar>
        <Box>
          <Typography variant={isMobile ? "h6" : "h5"}>
            {user?.userName || "No username"}
          </Typography>
          <Typography color="text.secondary">
            {user?.email || "No email"}
          </Typography>
          {user?.phoneNumber && (
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Phone: {user.phoneNumber}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileInfo;