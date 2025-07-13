// src/components/Categories.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { Grid, Box, Typography, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';

const fetchCategories = async () => {
  try {
    const response = await axiosInstance.get('/categories');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch categories');
  }
};

const CategoryItem = ({ category, isLarge = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const imageUrl = `https://placehold.co/${isLarge ? '600x800' : '600x400'}?text=${encodeURIComponent(category.name)}`;
  const variant = isLarge ? 'h4' : 'h6';
  const position = isMobile ? { bottom: 8, left: 8 } : { bottom: 12, left: 12 };

  return (
    <Link to={`/categories/${category.id}/products`} style={{ textDecoration: 'none' }}>
      <Box sx={{ 
        position: 'relative', 
        width: '100%', 
        height: isLarge 
          ? { xs: 300, md: '100%' } 
          : { xs: 200, md: '100%' },
        overflow: 'hidden',
        '&:hover img': { 
          transform: isLarge ? 'scale(1.05)' : 'scale(1.1)' 
        }
      }}>
        <Box 
          component="img" 
          src={imageUrl} 
          alt={category.name} 
          sx={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            transition: 'transform 0.5s ease' 
          }} 
        />
        <Typography 
          variant={variant}
          sx={{ 
            position: 'absolute', 
            ...position, 
            color: '#fff', 
            fontWeight: 'bold', 
            textShadow: '0 0 10px rgba(0,0,0,0.7)',
            fontSize: {
              xs: isLarge ? '1.5rem' : '1.1rem',
              md: isLarge ? '2rem' : '1.25rem'
            }
          }}
        >
          {category.name}
        </Typography>
      </Box>
    </Link>
  );
};

const Categories = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '50vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        color: 'error.main', 
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '50vh'
      }}>
        <Typography variant="h6">Error loading categories</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {error.message}
        </Typography>
      </Box>
    );
  }

  const activeCategories = data
    ?.filter((cat) => cat.status)
    ?.map((cat) => ({
      ...cat,
      name: cat.name.trim() // Ensure no extra whitespace
    })) || [];

  if (activeCategories.length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '50vh'
      }}>
        <Typography variant="h6">No categories available</Typography>
      </Box>
    );
  }

  const [mainCategory, ...subCategories] = activeCategories;

  return (
    <Box sx={{ 
      width: '100%',
      overflow: 'hidden',
      minHeight: isMobile ? 'auto' : '100vh'
    }}>
      <Grid 
        container 
        spacing={0} 
        sx={{ 
          height: { xs: 'auto', md: '100vh' },
          flexWrap: { xs: 'wrap', md: 'nowrap' }
        }}
      >
        {/* Main category (large) */}
        <Grid 
          item 
          sx={{ 
            width: { xs: '100%', md: '50%' }, 
            height: { xs: 300, md: '100%' } 
          }}
        >
          <CategoryItem category={mainCategory} isLarge />
        </Grid>

        {/* Subcategories grid */}
        <Grid 
          item 
          sx={{ 
            width: { xs: '100%', md: '50%' },
            display: 'grid',
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: '1fr 1fr' 
            },
            gridTemplateRows: { 
              xs: `repeat(${Math.min(subCategories.length, 4)}, 200px)`,
              md: '1fr 1fr' 
            },
            height: { xs: 'auto', md: '100%' }
          }}
        >
          {subCategories.slice(0, 4).map((cat) => (
            <CategoryItem key={cat.id} category={cat} />
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Categories;