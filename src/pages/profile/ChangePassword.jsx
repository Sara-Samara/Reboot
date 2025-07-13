// src/pages/profile/ChangePassword.jsx
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { Box, Typography, TextField, Button, CircularProgress, Alert, useMediaQuery } from '@mui/material';
import { toast } from 'react-toastify';

const changePassword = async (passwords) => {
  const { data } = await axiosInstance.post('/Auth/change-password', passwords);
  return data;
};

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const isMobile = useMediaQuery('(max-width:600px)');

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to change password.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    mutation.mutate({ oldPassword, newPassword, confirmPassword });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: isMobile ? '100%' : '500px' }}>
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        component="h2" 
        fontWeight="500" 
        gutterBottom
      >
        Change Password
      </Typography>
      
      <TextField
        label="Current Password"
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        fullWidth
        required
        margin="normal"
        size={isMobile ? 'small' : 'medium'}
      />
      <TextField
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        fullWidth
        required
        margin="normal"
        size={isMobile ? 'small' : 'medium'}
      />
      <TextField
        label="Confirm New Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        required
        margin="normal"
        size={isMobile ? 'small' : 'medium'}
      />
      
      <Button
        type="submit"
        variant="contained"
        disabled={mutation.isPending}
        sx={{ 
          mt: 2, 
          bgcolor: '#f18c08', 
          '&:hover': { bgcolor: '#d87e07' },
          width: isMobile ? '100%' : 'auto',
          py: isMobile ? 1 : 1.5
        }}
      >
        {mutation.isPending ? <CircularProgress size={24} /> : 'Update Password'}
      </Button>
    </Box>
  );
};

export default ChangePassword;