// src/pages/profile/UserOrders.jsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import {
  Box, Typography, CircularProgress, Alert, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Button, Paper,
  Modal, Fade, Backdrop, useMediaQuery, useTheme
} from '@mui/material';

const fetchUserOrders = async () => {
  const { data } = await axiosInstance.get('/Orders');
  return Array.isArray(data) ? data : [];
};

const fetchOrderDetails = async (orderId) => {
  if (!orderId) return null;
  const { data } = await axiosInstance.get(`/Orders/${orderId}`);
  return data;
};

const OrderDetailsModal = ({ orderId, open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { data: details, isLoading, isError } = useQuery({
    queryKey: ['orderDetails', orderId],
    queryFn: () => fetchOrderDetails(orderId),
    enabled: !!orderId,
  });

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? '95%' : 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: isMobile ? 2 : 4,
    borderRadius: '12px',
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography variant="h5" component="h2" gutterBottom>
            Order Details
          </Typography>
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress />
            </Box>
          )}
          {isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Could not load order details.
            </Alert>
          )}
          {details && (
            <Box>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'max-content 1fr', 
                gap: 1,
                mb: 2
              }}>
                <Typography fontWeight="500">Order ID:</Typography>
                <Typography>#{details.id}</Typography>
                
                <Typography fontWeight="500">Date:</Typography>
                <Typography>{new Date(details.orderDate).toLocaleDateString()}</Typography>
                
                <Typography fontWeight="500">Status:</Typography>
                <Typography sx={{ 
                  color: details.status === 'Completed' ? 'success.main' : 
                        details.status === 'Processing' ? 'warning.main' : 
                        'text.primary'
                }}>
                  {details.status}
                </Typography>
                
                <Typography fontWeight="500">Total:</Typography>
                <Typography fontWeight="500">${details.total?.toFixed(2)}</Typography>
              </Box>
              
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Items:</Typography>
              {details.orderItems?.map(item => (
                <Paper 
                  key={item.id} 
                  sx={{ 
                    p: 1.5, 
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: '8px'
                  }}
                >
                  <Box>
                    <Typography fontWeight="500">{item.productName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Qty: {item.quantity} × ${item.price?.toFixed(2)}
                    </Typography>
                  </Box>
                  <Typography fontWeight="500">
                    ${(item.price * item.quantity)?.toFixed(2)}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button 
              onClick={onClose} 
              variant="contained"
              sx={{ bgcolor: '#f18c08', '&:hover': { bgcolor: '#d87e07' } }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

const UserOrders = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  
  const { data: orders, isLoading, isError, error } = useQuery({
    queryKey: ['userOrders'],
    queryFn: fetchUserOrders,
  });

  const handleOpenDetails = (orderId) => {
    setSelectedOrderId(orderId);
  };

  const handleCloseDetails = () => {
    setSelectedOrderId(null);
  };

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
        Error loading orders: {error.message}
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
        My Orders
      </Typography>
      {orders.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center', borderRadius: '12px' }}>
          <Typography>You have no orders yet.</Typography>
        </Paper>
      ) : (
        <TableContainer 
          component={Paper} 
          sx={{ 
            mt: 3,
            borderRadius: '12px',
            overflowX: 'auto'
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>
                    {new Date(order.orderDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        color: order.status === 'Completed' ? 'success.main' : 
                              order.status === 'Processing' ? 'warning.main' : 
                              'text.primary',
                        fontWeight: 500
                      }}
                    >
                      {order.status}
                    </Box>
                  </TableCell>
                  <TableCell>${order.total?.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenDetails(order.id)}
                      sx={{
                        color: '#f18c08',
                        borderColor: '#f18c08',
                        '&:hover': {
                          borderColor: '#d87e07',
                          backgroundColor: 'rgba(241, 140, 8, 0.04)'
                        }
                      }}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <OrderDetailsModal
        orderId={selectedOrderId}
        open={!!selectedOrderId}
        onClose={handleCloseDetails}
      />
    </Box>
  );
};

export default UserOrders;