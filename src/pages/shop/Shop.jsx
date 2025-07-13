import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';

const fetchAllProducts = async () => {
  const { data } = await axiosInstance.get('/products');
  return Array.isArray(data) ? data : data.data || [];
};

const addToCart = async ({ productId }) => {
  const response = await axiosInstance.post(`/Carts/${productId}`, { count: 1 });
  return response.data;
};

export default function Shop() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [likedProducts, setLikedProducts] = React.useState([]);

  const { data: products, isLoading, isError, error } = useQuery({
    queryKey: ['allProducts'],
    queryFn: fetchAllProducts,
  });

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      toast.success('Product added to cart! ✅');
      queryClient.invalidateQueries(['cart']);
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || 'Failed to add product.';
      toast.error(errorMessage);
    },
  });

  const toggleLike = (id) => {
    setLikedProducts((prev) => {
      const isLiked = prev.includes(id);
      toast.info(isLiked ? 'Removed from favorites' : 'Added to favorites ❤️');
      return isLiked ? prev.filter((pid) => pid !== id) : [...prev, id];
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: 'center', pt: '120px', padding: 4 }}>
        <Typography variant="h6" color="error">Error: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f4f6f8', py: 8, pt: '120px', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Box component="div" sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" fontWeight="600">
            Our Shop
          </Typography>
          <Typography component="p" color="text.secondary" sx={{ mt: 1, maxWidth: '600px', mx: 'auto' }}>
            Discover our curated collection of products. Find everything you need, from the latest trends to timeless classics.
          </Typography>
        </Box>

        {products && products.length > 0 ? (
          <Grid container spacing={4} justifyContent="center" alignItems="stretch">
            {products.map((product) => (
              <Grid item key={product.id}>
                <Card
                  sx={{
                    width: 280,
                    height: 430,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: '12px',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                    },
                    position: 'relative',
                    p: 2,
                  }}
                >
                  <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>
                    <Tooltip title={likedProducts.includes(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}>
                      <IconButton
                        onClick={(e) => { e.stopPropagation(); toggleLike(product.id); }}
                        sx={{ backgroundColor: 'rgba(255,255,255,0.8)', '&:hover': { backgroundColor: 'rgba(255,255,255,1)' } }}
                      >
                        {likedProducts.includes(product.id) ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <CardMedia
                    component={RouterLink}
                    to={`/product/${product.id}`}
                    image={product.image || 'https://placehold.co/400x400?text=No+Image'}
                    title={product.name}
                    sx={{
                      width: '100%',
                      height: 180,
                      objectFit: 'contain',
                      cursor: 'pointer',
                      mb: 2,
                    }}
                  />

                  <CardContent sx={{ flexGrow: 1, px: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 500, minHeight: '48px' }} noWrap>
                      {product.name}
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#f18c08', fontWeight: 'bold', mt: 1 }}>
                      ${product.price?.toFixed(2)}
                    </Typography>
                  </CardContent>

                  <Box sx={{ width: '100%', mt: 'auto' }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<AddShoppingCartIcon />}
                      sx={{ bgcolor: '#f18c08', '&:hover': { bgcolor: '#d87e07' }, textTransform: 'none' }}
                      onClick={() => addToCartMutation.mutate({ productId: product.id })}
                      disabled={addToCartMutation.isLoading && addToCartMutation.variables?.productId === product.id}
                    >
                      {addToCartMutation.isLoading && addToCartMutation.variables?.productId === product.id ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        'Add to Cart'
                      )}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', textAlign: 'center' }}>
            <ProductionQuantityLimitsIcon sx={{ fontSize: '100px', color: 'grey.400' }} />
            <Typography variant="h4" gutterBottom sx={{ mt: 2, fontWeight: 500 }}>
              No Products Available
            </Typography>
            <Typography color="text.secondary">
              It seems our shop is currently empty. Please check back later!
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
