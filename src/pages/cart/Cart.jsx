// src/pages/cart/Cart.jsx

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import {
  Box, Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Button, Divider, CircularProgress,
  Link as MuiLink, useMediaQuery, useTheme, Tooltip, Stack , Grid
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// API Functions
const fetchCart = async () => {
  try {
    const response = await axiosInstance.get('/Carts');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch cart');
  }
};

const updateQuantity = async (productId, operation) => {
  if (!productId) throw new Error("Product ID is required");
  try {
    await axiosInstance.patch(`/Carts/${operation}Count/${productId}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to ${operation} quantity`);
  }
};

const deleteCartItem = async (productId) => {
  if (!productId) throw new Error("Product ID is required");
  try {
    await axiosInstance.delete(`/Carts/${productId}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to remove item');
  }
};

const clearCart = async () => {
  try {
    await axiosInstance.delete('/Carts/clearCart');
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to clear cart');
  }
};

const proceedToCheckout = async () => {
  try {
    const response = await axiosInstance.post('/CheckOuts/Pay', {
      PaymentMethod: "Visa"
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Checkout failed');
  }
};

// Helper Components
const LoadingState = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
    <CircularProgress />
  </Box>
);

const ErrorState = ({ error }) => (
  <Box sx={{ textAlign: 'center', pt: '120px', color: 'error.main' }}>
    <Typography variant="h6">Error: {error.message}</Typography>
    <Button 
      variant="outlined" 
      sx={{ mt: 2 }} 
      onClick={() => window.location.reload()}
    >
      Retry
    </Button>
  </Box>
);

const EmptyCartState = () => (
  <Box sx={{ textAlign: 'center', py: 10, pt: '120px', minHeight: '80vh' }}>
    <ProductionQuantityLimitsIcon sx={{ fontSize: '100px', color: 'grey.400' }} />
    <Typography variant="h4" gutterBottom sx={{ mt: 2, fontWeight: 500 }}>
      Your Shopping Cart is Empty
    </Typography>
    <Typography color="text.secondary">
      Add items to your cart to see them here.
    </Typography>
    <Button 
      component={RouterLink} 
      to="/shop" 
      variant="contained" 
      sx={{ 
        mt: 3, 
        bgcolor: '#f18c08', 
        '&:hover': { bgcolor: '#d87e07' } 
      }}
    >
      Continue Shopping
    </Button>
  </Box>
);

// ... (keep all previous imports and other code the same)

const QuantityControl = ({ quantity, onIncrease, onDecrease, disabled }) => (
  <Stack direction="row" alignItems="center" spacing={1}>
    <IconButton 
      size="small" 
      onClick={onDecrease} 
      disabled={disabled || quantity <= 1}
      sx={{ 
        color: disabled ? 'text.disabled' : 'black' ,
        '&:hover': { 
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          color: '#a1a1a1'
        }
      }}
    >
      <RemoveCircleOutlineIcon fontSize="small" />
    </IconButton>
    <Typography sx={{ 
      minWidth: '24px', 
      textAlign: 'center',
      color: 'black',
      fontWeight: 'bold'
    }}>
      {quantity}
    </Typography>
    <IconButton 
      size="small" 
      onClick={onIncrease} 
      disabled={disabled}
      sx={{ 
        color: disabled ? 'text.disabled' : '#d32f2f',
        '&:hover': { 
          backgroundColor: 'rgba(25, 118, 210, 0.04)',
          color: '#f4cbcb'
        }
      }}
    >
      <AddCircleOutlineIcon fontSize="small" />
    </IconButton>
  </Stack>
);

// ... (keep all other code the same)

export default function Cart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const queryClient = useQueryClient();

  // Cart data query
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
    retry: 2,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  // Mutation handlers
  const handleMutationSuccess = (message) => {
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    if (message) toast.success(message);
  };
  
  const handleMutationError = (error) => {
    const errorMessage = error.response?.data?.message || error.message || "An error occurred";
    toast.error(errorMessage);
    console.error('API Error:', error);
  };

  // Mutations
  const increaseMutation = useMutation({
    mutationFn: (productId) => updateQuantity(productId, 'increase'),
    onSuccess: () => handleMutationSuccess(),
    onError: handleMutationError
  });

  const decreaseMutation = useMutation({
    mutationFn: (productId) => updateQuantity(productId, 'decrease'),
    onSuccess: () => handleMutationSuccess(),
    onError: handleMutationError
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => handleMutationSuccess("Item removed from cart 🗑️"),
    onError: handleMutationError
  });

  const clearCartMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => handleMutationSuccess("Your cart has been cleared!"),
    onError: handleMutationError
  });

  const checkoutMutation = useMutation({
    mutationFn: proceedToCheckout,
    onSuccess: (data) => {
      const paymentUrl = data?.url || data?.sessionUrl || data?.redirectUrl;
      if (paymentUrl) {
        toast.info("Redirecting to payment page...");
        window.location.href = paymentUrl;
      } else {
        toast.error("Payment URL not found");
        console.error("Payment URL missing in response:", data);
      }
    },
    onError: handleMutationError,
  });

  // Derived states
  const isQuantityMutating = increaseMutation.isPending || decreaseMutation.isPending;
  const cartItems = data?.cartResponse || [];
  const total = data?.totalPrice || 0;
  const itemCount = cartItems.length;

  // Loading and error states
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState error={error} />;
  if (cartItems.length === 0) return <EmptyCartState />;

  return (
    <Box sx={{ 
      backgroundColor: '#f4f6f8', 
      py: 8, 
      pt: '120px', 
      minHeight: '100vh' 
    }}>
      <Container maxWidth="xl">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0
        }}>
          <Typography variant="h3" component="h1" fontWeight="600">
            My Cart
          </Typography>
          <Tooltip title="Clear entire cart">
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<RemoveShoppingCartIcon />} 
              onClick={() => clearCartMutation.mutate()} 
              disabled={clearCartMutation.isPending}
              size={isMobile ? 'small' : 'medium'}
            >
              Clear Cart
            </Button>
          </Tooltip>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <TableContainer component={Paper} sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Table sx={{ minWidth: 650 }} aria-label="shopping cart">
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Price</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => {
                    const currentProductId = item.id || item.productId;
                    const itemTotal = (item.price * item.count).toFixed(2);

                    return (
                      <TableRow
                        key={`${currentProductId}-${item.name}`}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Box
                              component="img"
                              src={item.image || 'https://placehold.co/80x80'}
                              alt={item.name}
                              sx={{ 
                                width: 80, 
                                height: 80, 
                                objectFit: 'contain',
                                borderRadius: 1
                              }}
                            />
                            <MuiLink 
                              component={RouterLink} 
                              to={`/product/${currentProductId}`} 
                              color="inherit" 
                              underline="hover"
                              sx={{ fontWeight: 500 }}
                            >
                              {item.name}
                            </MuiLink>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          ${item.price?.toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          <QuantityControl
                            quantity={item.count}
                            onIncrease={() => increaseMutation.mutate(currentProductId)}
                            onDecrease={() => decreaseMutation.mutate(currentProductId)}
                            disabled={isQuantityMutating}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          ${itemTotal}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Remove item">
                            <IconButton 
                              color="error" 
                              onClick={() => deleteMutation.mutate(currentProductId)} 
                              disabled={deleteMutation.isPending}
                            >
                              <DeleteForeverIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          
          <Grid item xs={12} lg={4}>
            <Paper elevation={3} sx={{ 
              p: 3, 
              borderRadius: '12px', 
              position: { xs: 'static', lg: 'sticky' }, 
              top: '120px' 
            }}>
              <Typography variant="h5" gutterBottom fontWeight="500">
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">
                  Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </Typography>
                <Typography fontWeight="bold">${total.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography fontWeight="bold" color="green">Free</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">Total</Typography>
                <Typography variant="h5" fontWeight="bold" color="#f18c08">
                  ${total.toFixed(2)}
                </Typography>
              </Box>
              
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={checkoutMutation.isPending ? 
                  <CircularProgress size={24} color="inherit" /> : 
                  <ShoppingCartCheckoutIcon />}
                sx={{ 
                  mt: 3, 
                  py: 1.5, 
                  bgcolor: '#f18c08', 
                  '&:hover': { bgcolor: '#d87e07' }, 
                  fontWeight: 'bold' 
                }}
                onClick={() => checkoutMutation.mutate()}
                disabled={checkoutMutation.isPending || itemCount === 0}
              >
                {checkoutMutation.isPending ? 'Processing...' : 'Proceed to Checkout'}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}