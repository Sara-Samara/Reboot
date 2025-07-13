import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Container,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Button,
  Breadcrumbs,
  Link as MuiLink,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const fetchCategoryDetails = async ({ queryKey }) => {
  const [, categoryId] = queryKey;
  if (!categoryId) return null;
  const { data } = await axiosInstance.get(`/categories/${categoryId}`);
  return data;
};

const fetchProductsByCategoryId = async ({ queryKey }) => {
  const [, categoryId] = queryKey;
  if (!categoryId) return [];

  try {
    const { data } = await axiosInstance.get(`/categories/${categoryId}/products`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error.response?.status === 404) return [];
    throw new Error('Failed to load products from server');
  }
};

const addToCart = async ({ productId }) => {
  const response = await axiosInstance.post(`/Carts/${productId}`, { count: 1 });
  return response.data;
};

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data: category, isLoading: isCategoryLoading, error: categoryError } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: fetchCategoryDetails,
    enabled: !!categoryId,
  });

  const {
    data: products = [],
    isLoading: areProductsLoading,
    error: productsError,
    isFetched: areProductsFetched,
  } = useQuery({
    queryKey: ['products', categoryId],
    queryFn: fetchProductsByCategoryId,
    enabled: !!categoryId,
    retry: false,
  });

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      toast.success('Product added to cart! ✅', {
        position: isMobile ? "top-center" : "top-right",
        autoClose: 3000,
      });
      queryClient.invalidateQueries(['cart']);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to add product to cart';
      toast.error(errorMessage, {
        position: isMobile ? "top-center" : "top-right",
        autoClose: 5000,
      });
    },
  });

  if (isCategoryLoading || areProductsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (categoryError || (productsError && productsError.message !== 'Failed to load products from server')) {
    const error = categoryError || productsError;
    return (
      <Box sx={{ textAlign: 'center', color: 'red', pt: '120px', padding: 4 }}>
        <Typography variant="h6" gutterBottom>Error loading data</Typography>
        <Typography sx={{ mb: 2 }}>{error.response?.data?.message || error.message}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f4f6f8', py: 8, pt: '120px', minHeight: '100vh' }}>
      <ToastContainer rtl={true} />
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, px: isMobile ? 2 : 0 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink component={RouterLink} underline="hover" color="inherit" to="/">Home</MuiLink>
            <MuiLink component={RouterLink} underline="hover" color="inherit" to="/shop">Shop</MuiLink>
            <Typography color="text.primary">
              {category?.name || 'Category'}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h4" component="h1" fontWeight="600" sx={{ mt: 1 }}>
            {category?.name || 'Products'}
          </Typography>
        </Box>

        {areProductsFetched && products.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h5" gutterBottom>No products found</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              There are currently no items available in "{category?.name}".
            </Typography>
            <Button component={RouterLink} to="/shop" variant="contained" sx={{
              bgcolor: '#f18c08', '&:hover': { bgcolor: '#d87e07' }
            }}>
              Back to Shop
            </Button>
          </Box>
        ) : (
          <Grid container spacing={isMobile ? 2 : 3} justifyContent="center">
            {products.map((product) => (
              <Grid key={product.id} item xs={12} sm={6} md={4} lg={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card sx={{
                  width: isMobile ? 200 : 260,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-5px)' }
                }}>
                  <RouterLink to={`/product/${product.id}`} style={{ textDecoration: 'none', width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 0 }}>
                      <CardMedia
                        component="img"
                        height={isMobile ? 200 : 300}   // زوّد ارتفاع الصورة
                        image={product.image || 'https://placehold.co/400x400?text=No+Image'}
                        alt={product.name}
                        sx={{
                            objectFit: 'contain',
                            maxHeight: isMobile ? 200 : 300,  // لازم يكون مطابق للارتفاع
                            maxWidth: '90%',                  // زوّد العرض النسبي لو حابب
                        }}
                        />


                    </Box>
                  </RouterLink>

                   <CardContent
                    sx={{
                        flexGrow: 1,
                        pt: isMobile ? 1 : 2,   // padding-top بس
                        pb: isMobile ? 1 : 2,
                        px: isMobile ? 1 : 2,
                        width: '100%',
                    }}
                    >

                    <Typography
                      gutterBottom
                      variant="subtitle1"
                      component="h2"
                      sx={{
                        color: 'text.primary',
                        fontWeight: 500,
                        minHeight: '48px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#f18c08', fontWeight: 'bold', mt: 1 }}>
                      ${product.price?.toFixed(2)}
                    </Typography>
                  </CardContent>

                  <Box sx={{ pb: 2, width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddShoppingCartIcon />}
                        onClick={() => addToCartMutation.mutate({ productId: product.id })}
                        disabled={
                          addToCartMutation.isLoading &&
                          addToCartMutation.variables?.productId === product.id
                        }
                        sx={{
                          bgcolor: '#f18c08',
                          '&:hover': { bgcolor: '#d87e07' },
                          fontSize: '0.875rem',
                          textTransform: 'none',
                          px: 3,
                          minWidth: '140px'
                        }}
                      >
                        {addToCartMutation.isLoading &&
                          addToCartMutation.variables?.productId === product.id
                          ? <CircularProgress size={20} color="inherit" />
                          : 'Add to Cart'}
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default CategoryProducts;
