// src/pages/profile/OrderDetails.jsx
import React, { useState, useEffect } from 'react';
import { 
  Card, Box, Typography, Divider, Grid, List, Paper, Avatar, Button, 
  CircularProgress, useMediaQuery, useTheme 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

const OrderDetails = ({ orderId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axiosInstance.get(`/Orders/${orderId}`);
        setOrder(response.data);
        setError(null);
      } catch (error) {
        toast.error("Failed to load order details");
        setError("Failed to load order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          onClick={() => navigate(-1)} 
          variant="outlined" 
          sx={{ mt: 2 }}
        >
          Back to Orders
        </Button>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Order not found</Typography>
        <Button 
          onClick={() => navigate(-1)} 
          variant="outlined" 
          sx={{ mt: 2 }}
        >
          Back to Orders
        </Button>
      </Box>
    );
  }

  return (
    <Card sx={{ p: isMobile ? 2 : 3, borderRadius: '12px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant={isMobile ? "h6" : "h5"}>Order Details</Typography>
        <Button 
          variant="outlined" 
          onClick={() => navigate(-1)}
          size={isMobile ? "small" : "medium"}
        >
          Back to Orders
        </Button>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom fontWeight="500">
            Order Information
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: 1 }}>
            <Typography fontWeight="500">Order ID:</Typography>
            <Typography>{order.id}</Typography>
            
            <Typography fontWeight="500">Date:</Typography>
            <Typography>{new Date(order.orderDate).toLocaleString()}</Typography>
            
            <Typography fontWeight="500">Status:</Typography>
            <Typography sx={{ 
              color: order.status === 'Completed' ? 'success.main' : 
                    order.status === 'Processing' ? 'warning.main' : 
                    'text.primary'
            }}>
              {order.status}
            </Typography>
            
            <Typography fontWeight="500">Total:</Typography>
            <Typography fontWeight="500">${order.totalAmount?.toFixed(2)}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom fontWeight="500">
            Shipping Information
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: 1 }}>
            <Typography fontWeight="500">Address:</Typography>
            <Typography>{order.shippingAddress?.street}</Typography>
            
            <Typography fontWeight="500">City:</Typography>
            <Typography>{order.shippingAddress?.city}</Typography>
            
            <Typography fontWeight="500">ZIP Code:</Typography>
            <Typography>{order.shippingAddress?.zipCode}</Typography>
            
            <Typography fontWeight="500">Country:</Typography>
            <Typography>{order.shippingAddress?.country}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom fontWeight="500">
            Order Items
          </Typography>
          <List disablePadding>
            {order.orderItems?.map((item) => (
              <Paper 
                key={item.productId} 
                elevation={1} 
                sx={{ 
                  p: isMobile ? 1 : 2, 
                  mb: 1,
                  borderRadius: '8px'
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4} sm={2}>
                    <Avatar 
                      src={item.imageUrl} 
                      variant="square" 
                      sx={{ 
                        width: isMobile ? 40 : 60, 
                        height: isMobile ? 40 : 60,
                        borderRadius: '4px'
                      }} 
                    />
                  </Grid>
                  <Grid item xs={8} sm={4}>
                    <Typography variant="subtitle2" noWrap>
                      {item.productName}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <Typography>Qty: {item.quantity}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <Typography>Price: ${item.price?.toFixed(2)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography fontWeight="500">
                      Total: ${(item.price * item.quantity)?.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </List>
        </Grid>
      </Grid>
    </Card>
  );
};

export default OrderDetails;