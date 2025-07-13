import * as React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import {
  Box, Button, Container, Typography, Grid, IconButton,
  CircularProgress, Breadcrumbs, Link as MuiLink, Tabs, Tab,
  Rating, TextField, Avatar, Divider, useMediaQuery, useTheme
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import StarIcon from '@mui/icons-material/Star';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MAX_QUANTITY = 10;
const MIN_QUANTITY = 1;
const DEFAULT_IMAGE = 'https://placehold.co/500x600?text=Product+Image';

const originalColors = {
  primary: '#f18c08',
  primaryDark: '#e07d00',
  background: '#fff',
  textPrimary: 'black',
  textSecondary: '#666',
  divider: '#eee',
  wishlist: '#ff3d00'
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, md: 3 } }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const ReviewItem = ({ review }) => (
  <Box sx={{ 
    mb: 3, 
    p: 2, 
    border: '1px solid #eee', 
    borderRadius: 2,
    backgroundColor: '#fff'
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Avatar sx={{ 
        mr: 2, 
        bgcolor: originalColors.primary,
        color: '#fff'
      }}>
        {review.author?.charAt(0) || 'U'}
      </Avatar>
      <Box>
        <Typography fontWeight="bold">{review.author || 'Anonymous User'}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Rating
            value={review.rate || review.Rate || 0}
            readOnly
            precision={0.5}
            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
          <Typography variant="caption" sx={{ ml: 1, color: originalColors.textSecondary }}>
            {new Date(review.date || review.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>
    </Box>
    <Typography>{review.content || review.comment || review.Comment}</Typography>
  </Box>
);

ReviewItem.propTypes = {
  review: PropTypes.object.isRequired,
};

export default function ProductDetails() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [likedProducts, setLikedProducts] = React.useState([]);
  const [quantity, setQuantity] = React.useState(1);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [tabValue, setTabValue] = React.useState(0);
  const [reviewRate, setReviewRate] = React.useState(5);
  const [reviewComment, setReviewComment] = React.useState('');

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }) => {
      const response = await axiosInstance.post(`/Carts/${productId}`, {
        count: quantity
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Product added to cart successfully ✅');
      queryClient.invalidateQueries(['cart']);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.title || 
                         'Failed to add product to cart';
      toast.error(errorMessage);
    }
  });

  const addReviewMutation = useMutation({
    mutationFn: async ({ productId, review }) => {
      return axiosInstance.post(`/products/${productId}/Reviews/Create`, review);
    },
    onSuccess: () => {
      toast.success('Review added successfully!');
      queryClient.invalidateQueries(['product', id]);
      setReviewRate(5);
      setReviewComment('');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 
                         'Failed to submit review';
      toast.error(errorMessage);
    }
  });

  const { data: product, isLoading, isError, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/products/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.images?.length) {
        setSelectedImage(data.images[0]);
      } else if (data?.image) {
        setSelectedImage(data.image);
      }
    },
    enabled: !!id,
    retry: 2,
    staleTime: 1000 * 60 * 5
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleQuantityChange = (amount) => {
    setQuantity(prev => {
      const newQuantity = prev + amount;
      return Math.max(MIN_QUANTITY, Math.min(newQuantity, MAX_QUANTITY));
    });
  };

  const toggleLike = (productId) => {
    setLikedProducts(prev => {
      const isLiked = prev.includes(productId);
      toast.success(isLiked ? 'Removed from wishlist' : 'Added to wishlist');
      return isLiked ? prev.filter(id => id !== productId) : [...prev, productId];
    });
  };

  const handleAddToCart = () => {
    addToCartMutation.mutate({
      productId: product.id,
      quantity: quantity
    });
  };

  const handleAddReview = () => {
    addReviewMutation.mutate({
      productId: id,
      review: {
        Rate: reviewRate,
        Comment: reviewComment
      }
    });
  };

  const images = product?.images?.length ? product.images : 
    (product?.image ? [product.image] : [DEFAULT_IMAGE]);

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh',
        pt: '120px',
        backgroundColor: originalColors.background
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        color: 'red', 
        pt: '120px',
        padding: 4,
        backgroundColor: originalColors.background
      }}>
        <Typography variant="h6" gutterBottom>
          Error loading product
        </Typography>
        <Typography sx={{ mb: 2 }}>
          {error.response?.data?.message || error.message}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ 
            mt: 2,
            backgroundColor: originalColors.primary,
            '&:hover': {
              backgroundColor: originalColors.primaryDark
            }
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: originalColors.background, 
      color: originalColors.textPrimary, 
      paddingTop: '96px', 
      pb: 8,
      minHeight: '100vh'
    }}>
      <Container maxWidth="lg">
        {product && (
          <>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: { xs: 2, md: 3 } }}>
              <MuiLink underline="hover" color="inherit" href="/">
                Home
              </MuiLink>
              <MuiLink underline="hover" color="inherit" href="/products">
                Shop
              </MuiLink>
              <Typography color="text.primary" noWrap>
                {product.name}
              </Typography>
            </Breadcrumbs>
            
            <Grid container spacing={{ xs: 2, md: 6 }} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Box 
                    component="img" 
                    src={selectedImage || images[0]} 
                    alt={product.name} 
                    sx={{ 
                      width: '100%', 
                      height: { xs: '350px', sm: '450px', md: '500px' },
                      objectFit: 'contain',
                      borderRadius: '8px', 
                      mb: 2, 
                      border: '1px solid',
                      borderColor: originalColors.divider,
                      backgroundColor: '#f9f9f9'
                    }} 
                  />
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1,
                    overflowX: 'auto',
                    py: 1
                  }}>
                    {images.map((img, index) => (
                      <Box 
                        key={index} 
                        component="img" 
                        src={img} 
                        alt={`thumbnail ${index + 1}`} 
                        onClick={() => setSelectedImage(img)} 
                        sx={{ 
                          width: '80px', 
                          height: '80px', 
                          borderRadius: '4px', 
                          cursor: 'pointer', 
                          border: selectedImage === img ? '2px solid' : '1px solid',
                          borderColor: selectedImage === img ? originalColors.primary : originalColors.divider,
                          objectFit: 'cover',
                          flexShrink: 0
                        }} 
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography 
                  variant={isMobile ? 'h4' : 'h3'} 
                  component="h1" 
                  fontWeight="600" 
                  gutterBottom
                >
                  {product.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating
                    value={product.averageRating || 0}
                    precision={0.5}
                    readOnly
                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                  />
                  <Typography variant="body2" sx={{ ml: 1, color: originalColors.textSecondary }}>
                    ({product.reviews?.length || 0} reviews)
                  </Typography>
                </Box>
                
                <Typography 
                  variant={isMobile ? 'h5' : 'h4'} 
                  color={originalColors.textPrimary} 
                  fontWeight="bold" 
                  sx={{ mb: 2 }}
                >
                  ${product.price?.toFixed(2)}
                </Typography>
                
                <Typography 
                  variant="body1" 
                  color={originalColors.textSecondary} 
                  paragraph 
                  sx={{ mb: 3 }}
                >
                  {product.description || 'No description available.'}
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  mb: 3,
                  flexWrap: 'wrap'
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    border: '1px solid', 
                    borderColor: originalColors.divider,
                    borderRadius: '4px',
                    height: '48px'
                  }}>
                    <IconButton 
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= MIN_QUANTITY}
                      size={isMobile ? 'small' : 'medium'}
                    >
                      <RemoveIcon fontSize={isMobile ? 'small' : 'medium'} />
                    </IconButton>
                    <Typography fontWeight="bold" sx={{ px: 2 }}>
                      {quantity}
                    </Typography>
                    <IconButton 
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= MAX_QUANTITY}
                      size={isMobile ? 'small' : 'medium'}
                    >
                      <AddIcon fontSize={isMobile ? 'small' : 'medium'} />
                    </IconButton>
                  </Box>
                  
                  <Button 
                    variant="contained" 
                    size={isMobile ? 'medium' : 'large'}
                    sx={{
                      gap: 1, 
                      fontWeight: 'light',
                      bgcolor: originalColors.primary,
                      '&:hover': {
                        bgcolor: originalColors.primaryDark
                      },
                      fontSize: '14px',
                      height: '48px',
                      minWidth: { xs: '140px', sm: '180px' }
                    }}
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isLoading}
                    fullWidth={isMobile}
                  >
                    {addToCartMutation.isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <>
                        <ShoppingBagOutlinedIcon />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </Box>

                <Button 
                  startIcon={
                    likedProducts.includes(product.id) ? 
                      <FavoriteIcon color="error" /> : 
                      <FavoriteBorderIcon />
                  } 
                  onClick={() => toggleLike(product.id)} 
                  sx={{ 
                    color: originalColors.textSecondary,
                    mb: 3
                  }}
                >
                  {likedProducts.includes(product.id) ? 
                    'In Wishlist' : 
                    'Add to Wishlist'
                  }
                </Button>
                
                <Box sx={{ 
                  mt: 3, 
                  borderTop: '1px solid', 
                  borderColor: originalColors.divider,
                  pt: 3
                }}>
                  <Typography variant="body2">
                    <strong>SKU:</strong> {product.sku || 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Category:</strong> {product.category?.name || 'Uncategorized'}
                  </Typography>
                  {product.stock !== undefined && (
                    <Typography variant="body2">
                      <strong>Availability:</strong> 
                      <Box 
                        component="span" 
                        sx={{ 
                          color: product.stock > 0 ? 'success.main' : 'error.main',
                          ml: 1
                        }}
                      >
                        {product.stock > 0 ? 
                          `${product.stock} in stock` : 
                          'Out of stock'}
                      </Box>
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ 
              width: '100%', 
              mt: 6,
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <Box sx={{ borderBottom: 1, borderColor: originalColors.divider }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange} 
                  variant={isMobile ? 'scrollable' : 'standard'}
                  scrollButtons={isMobile ? 'auto' : false}
                  allowScrollButtonsMobile
                >
                  <Tab label="Description" />
                  <Tab label="Specifications" />
                  <Tab label={`Reviews (${product.reviews?.length || 0})`} />
                </Tabs>
              </Box>
              
              <TabPanel value={tabValue} index={0}>
                <Typography variant="body1" paragraph>
                  {product.longDescription || "No detailed description available."}
                </Typography>
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                {product.specifications ? (
                  <Box component="ul" sx={{ pl: 3 }}>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <li key={key}>
                        <Typography variant="body1">
                          <strong>{key}:</strong> {value}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body1">
                    No additional information available.
                  </Typography>
                )}
              </TabPanel>
              
              <TabPanel value={tabValue} index={2}>
                <Box>
                  {product.reviews?.length > 0 ? (
                    product.reviews.map((review, index) => (
                      <React.Fragment key={index}>
                        <ReviewItem review={review} />
                        {index < product.reviews.length - 1 && <Divider />}
                      </React.Fragment>
                    ))
                  ) : (
                    <Typography mb={2}>No reviews yet.</Typography>
                  )}

                  <Box sx={{ 
                    mt: 4, 
                    p: 2, 
                    border: '1px solid', 
                    borderColor: originalColors.divider, 
                    borderRadius: 2,
                    backgroundColor: '#fff'
                  }}>
                    <Typography variant="h6" gutterBottom>Add Your Review</Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography component="legend">Rating</Typography>
                      <Rating
                        value={reviewRate}
                        onChange={(event, newValue) => setReviewRate(newValue)}
                        precision={1}
                        size="large"
                      />
                    </Box>
                    
                    <TextField
                      multiline
                      rows={4}
                      fullWidth
                      variant="outlined"
                      label="Your Review"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    
                    <Button 
                      variant="contained" 
                      onClick={handleAddReview} 
                      disabled={addReviewMutation.isLoading}
                      sx={{ 
                        bgcolor: originalColors.primary,
                        '&:hover': {
                          bgcolor: originalColors.primaryDark
                        }
                      }}
                    >
                      {addReviewMutation.isLoading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : 'Submit Review'}
                    </Button>
                  </Box>
                </Box>
              </TabPanel>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}