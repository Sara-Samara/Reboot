import React from 'react';
import {
  Modal, Box, Stack, Button, TextField, FormControl, InputLabel,
  InputAdornment, Input, IconButton, Typography,
  FormHelperText, useMediaQuery, useTheme
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import { useForm, Controller } from 'react-hook-form';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Link, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

const LoginModal = ({ open, handleClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const navigate = useNavigate();

  const getModalWidth = () => {
    if (isMobile) return '90%';
    if (isTablet) return '70%';
    return '30%';
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: getModalWidth(),
    bgcolor: '#1d1d1d',
    boxShadow: 0,
    borderRadius: 0,
    border: '0.2px solid #3c3f47',
    transition: 'all 0.3s ease-in-out',
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('login');

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      userName: '',
      confirmPassword: '',
      birthOfDate: null
    }
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleTabChange = (tab) => {
    reset();
    setActiveTab(tab);
  };

  // ------------------ LOGIN ------------------
  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/Account/login", {
        email: data.email,
        password: data.password,
      });
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      toast.success("You have successfully logged in!");
      handleClose();
      window.location.reload();
    },
    onError: () => {
      toast.error("Login failed");
    },
  });

  const onLoginSubmit = (data) => {
    loginMutation.mutate(data);
  };

  // ------------------ REGISTER ------------------
  const registerMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/Account/register", {
        firstName: data.firstName,
        lastName: data.lastName,
        userName: data.userName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        birthOfDate: data.birthOfDate,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Account created successfully!");
      handleTabChange("login");
    },
    onError: () => {
      toast.error("Account creation failed");
    },
  });

  const onRegisterSubmit = (data) => {
    registerMutation.mutate(data);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Stack direction="row" spacing={0} sx={{ m: 0, borderRadius: 0 }}>
          <Button
            variant={activeTab === 'login' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('login')}
            fullWidth
            sx={{
              borderRadius: 0,
              boxShadow: 0,
              borderColor: '#3c3f47',
              borderWidth: '0.1px',
              background: '#1d1d1d',
              color: activeTab === 'login' ? 'white' : '#888',
              '& .MuiSvgIcon-root': {
                color: activeTab === 'login' ? 'white' : '#888',
              },
              fontSize: isMobile ? '0.8rem' : '1rem',
              minWidth: isMobile ? 'auto' : undefined,
              px: isMobile ? 1 : 2,
            }}
          >
            <LockRoundedIcon sx={{ p: isMobile ? 0.5 : 1 }} />
            {!isMobile && 'Login'}
          </Button>
          <Button
            variant={activeTab === 'register' ? 'contained' : 'outlined'}
            onClick={() => handleTabChange('register')}
            fullWidth
            sx={{
              borderRadius: 0,
              boxShadow: 0,
              borderColor: '#3c3f47',
              borderWidth: '0.1px',
              background: '#1d1d1d',
              color: activeTab === 'register' ? 'white' : '#888',
              '& .MuiSvgIcon-root': {
                color: activeTab === 'register' ? 'white' : '#888',
              },
              fontSize: isMobile ? '0.8rem' : '1rem',
              minWidth: isMobile ? 'auto' : undefined,
              px: isMobile ? 1 : 2,
            }}
          >
            <PersonAddIcon sx={{ p: isMobile ? 0.5 : 1 }} />
            {!isMobile && 'Register'}
          </Button>
          <Button
            onClick={handleClose}
            sx={{
              borderRadius: 0,
              border: '0.05px solid #3c3f47',
              color: '#888',
              backgroundColor: '#1d1d1d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 'auto',
              px: 1,
              '& svg': {
                transform: 'rotate(0deg)',
                transition: 'transform 0.6s ease-in-out',
              },
              '&:hover svg': {
                transform: 'rotate(180deg)',
                color: 'white'
              },
            }}
          >
            <CloseIcon fontSize={isMobile ? 'medium' : 'large'} />
          </Button>
        </Stack>

        {activeTab === 'login' ? (
          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              p: isMobile ? 2 : 4,
              input: { color: 'white' },
              label: { color: '#aaa' },
              '& .MuiInput-underline:before': {
                borderBottomColor: '#555',
              },
              '& .MuiInput-underline:hover:before': {
                borderBottomColor: '#f18c08',
              },
              '& .MuiInput-underline:after': {
                borderBottomColor: '#f18c08',
              },
              '& .Mui-focused': {
                color: 'white',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#f18c08',
              },
              '& .MuiSvgIcon-root': { color: '#aaa' },
            }}
            onSubmit={handleSubmit(onLoginSubmit)}
          >
            <Controller
              name="email"
              control={control}
              rules={{ required: 'Email is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  variant="standard"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{ required: 'Password is required' }}
              render={({ field }) => (
                <FormControl fullWidth variant="standard" error={!!errors.password}>
                  <InputLabel htmlFor="login-password">Password</InputLabel>
                  <Input
                    {...field}
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {errors.password && (
                    <FormHelperText>{errors.password.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Box sx={{ my: 1.5 }}>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: isMobile ? '0.7rem' : '0.8rem',
                  color: '#f18c08',
                  textDecoration: 'none',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleClose();
                  navigate('/forgot-password');
                }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={loginMutation.isLoading}
              sx={{
                px: 8,
                py: 1.5,
                backgroundColor: '#f18c08',
                width: isMobile ? '100%' : '25%',
                borderRadius: '10px',
                alignSelf: isMobile ? 'center' : 'flex-start',
                fontSize: isMobile ? '0.9rem' : '1rem',
              }}
            >
              {loginMutation.isLoading ? "Logging in..." : "LogIn"}
            </Button>
          </Box>
        ) : (
          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              p: isMobile ? 2 : 4,
              label: { color: '#aaa' },
              '& .MuiInput-underline:before': {
                borderBottomColor: '#555',
              },
              '& .MuiInput-underline:hover:before': {
                borderBottomColor: '#f18c08',
              },
              '& .MuiInput-underline:after': {
                borderBottomColor: '#f18c08',
              },
              '& .Mui-focused': {
                color: 'white',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#f18c08',
              },
              '& .MuiSvgIcon-root': { color: '#aaa' },
            }}
            onSubmit={handleSubmit(onRegisterSubmit)}
          >
            <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
              <Controller
                name="firstName"
                control={control}
                rules={{
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'Must be at least 2 characters'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    variant="standard"
                    fullWidth
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />

              <Controller
                name="lastName"
                control={control}
                rules={{
                  required: 'Last name is required',
                  minLength: {
                    value: 2,
                    message: 'Must be at least 2 characters'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    variant="standard"
                    fullWidth
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Stack>

            <Controller
              name="userName"
              control={control}
              rules={{
                required: 'Username is required',
                minLength: {
                  value: 4,
                  message: 'Must be at least 4 characters'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Username"
                  variant="standard"
                  fullWidth
                  error={!!errors.userName}
                  helperText={errors.userName?.message}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  variant="standard"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Must be at least 6 characters'
                }
              }}
              render={({ field }) => (
                <FormControl fullWidth variant="standard" error={!!errors.password}>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input
                    {...field}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {errors.password && (
                    <FormHelperText>{errors.password.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: 'Please confirm your password',
                validate: value =>
                  value === watch('password') || 'Passwords do not match'
              }}
              render={({ field }) => (
                <FormControl fullWidth variant="standard" error={!!errors.confirmPassword}>
                  <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                  <Input
                    {...field}
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {errors.confirmPassword && (
                    <FormHelperText>{errors.confirmPassword.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Controller
                name="birthOfDate"
                control={control}
                rules={{ required: 'Date of birth is required' }}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    label="Date of Birth"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                    components={{
                      OpenPickerIcon: CalendarMonthIcon,
                    }}
                    inputFormat="MM/dd/yyyy"
                  />
                )}
              />
            </LocalizationProvider>

            <Button
              type="submit"
              variant="contained"
              disabled={registerMutation.isLoading}
              sx={{
                height: 48,
                mt: 2,
                bgcolor: '#f18c08',
                fontSize: isMobile ? '0.9rem' : '1rem',
              }}
            >
              {registerMutation.isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Register'
              )}
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default LoginModal;