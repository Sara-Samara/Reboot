import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Grid,
  Link,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { AlternateEmail, ArrowBack } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';

export default function ForgetPassword() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [step, setStep] = useState('email');
  const [code, setCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    if (step === 'verify' && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

  useEffect(() => {
    let interval;
    if (step === 'verify' && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("Account/ForgotPassword", { email: data.email });
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success("A verification code has been sent to your email.");
      setEmail(variables.email);
      setStep('verify');
      setTimer(60);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send verification code");
    }
  });

  const resendCode = async () => {
    setIsResending(true);
    try {
      await axiosInstance.post("Account/SendCode", { email });
      toast.success("A new code has been sent successfully.");
      setTimer(60);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send code");
    } finally {
      setIsResending(false);
    }
  };

  const verifyCodeMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("Account/VerifyCode", { email, code: code.join('') });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Verified successfully!", {
        onClose: () => window.location.href = '/new-password'
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Invalid verification code");
    }
  });

  const handleCodeChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 3) inputRefs.current[index + 1].focus();
      if (index === 3 && value && !newCode.includes('')) verifyCodeMutation.mutate();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setCode(['', '', '', '']);
    setTimer(60);
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh', py: 4 }}>
      <Box component="form" onSubmit={handleSubmit(forgotPasswordMutation.mutate)} sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: isMobile ? 3 : 4, border: '1px solid', borderColor: 'divider', borderRadius: 2, backgroundColor: 'background.paper', boxShadow: theme.shadows[2] }}>
        {step === 'verify' && (
          <Button startIcon={<ArrowBack />} onClick={handleBackToEmail} sx={{ alignSelf: 'flex-start', color: 'text.secondary', mb: -2, '&:hover': { color: 'primary.main' } }}>Back</Button>
        )}

        <Typography variant="h5" align="center" sx={{ mb: 2, color: '#f18c08', fontWeight: 'bold' }}>
          {step === 'email' ? 'Forgot Your Password?' : 'Verify Your Email'}
        </Typography>

        {step === 'email' ? (
          <>
            <TextField label="Email Address" variant="outlined" fullWidth required error={!!errors.email} helperText={errors.email?.message} InputProps={{ startAdornment: <AlternateEmail sx={{ color: errors.email ? 'error.main' : 'action.active', mr: 1.5 }} /> }} {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Please enter a valid email address' } })} />

            <Button type="submit" variant="contained" size="large" fullWidth disabled={forgotPasswordMutation.isLoading} sx={{ height: 48, fontWeight: 'bold', backgroundColor: '#f18c08', '&:hover': { backgroundColor: '#d87e07' }, '&:disabled': { backgroundColor: '#f18c08', opacity: 0.6 } }}>
              {forgotPasswordMutation.isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send Verification Code'}
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              We sent a 4-digit code to <strong>{email}</strong>. Please enter it below.
            </Typography>

            <Grid container justifyContent="center" spacing={1} sx={{ mb: 3 }}>
              {code.map((digit, index) => (
                <Grid item key={index}>
                  <TextField inputRef={(el) => (inputRefs.current[index] = el)} value={digit} onChange={(e) => handleCodeChange(index, e.target.value)} onKeyDown={(e) => handleKeyDown(index, e)} inputProps={{ maxLength: 1, inputMode: 'numeric', style: { textAlign: 'center', fontSize: '1.5rem', padding: isMobile ? '8px' : '12px', width: isMobile ? '40px' : '50px' } }} sx={{ '& .MuiOutlinedInput-root': { height: isMobile ? '56px' : '64px', width: isMobile ? '56px' : '64px' } }} variant="outlined" autoComplete="one-time-code" />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Button onClick={resendCode} disabled={timer > 0 || isResending} variant="text" size="small" sx={{ minWidth: '120px', color: timer > 0 ? 'text.disabled' : '#f18c08', '&:disabled': { color: 'text.disabled' } }}>
                {isResending ? <CircularProgress size={20} /> : `Resend Code ${timer > 0 ? `(${timer}s)` : ''}`}
              </Button>
              <Typography variant="caption" color="text.secondary">Didn't receive code?</Typography>
            </Box>

            <Button variant="contained" size="large" fullWidth onClick={() => verifyCodeMutation.mutate()} disabled={code.some(d => d === '') || verifyCodeMutation.isLoading} sx={{ height: 48, fontWeight: 'bold', backgroundColor: '#f18c08', '&:hover': { backgroundColor: '#d87e07' }, '&:disabled': { backgroundColor: '#f18c08', opacity: 0.6 } }}>
              {verifyCodeMutation.isLoading ? <CircularProgress size={24} color="inherit" /> : 'Verify Code'}
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
}
