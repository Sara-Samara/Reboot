import React from 'react';
import { Box, Typography } from '@mui/material';

const marqueeAnimation = {
  '@keyframes scroll': {
    '0%': { transform: 'translateX(0%)' },
    '100%': { transform: 'translateX(-50%)' }, // لأنه فيه نسختين للنص
  },
};

const Marquee = () => {
  const message = "Free Delivery From $50";

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#eb6238',
        color: 'white',
        overflow: 'hidden',
        py: 1.2,
        ...marqueeAnimation,
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          animation: 'scroll 35s linear infinite',
          minWidth: '200%',
        }}
      >
        {/* نكرر الصندوق مرتين لتكرار النص بشكل دائري */}
        {[...Array(2)].map((_, i) => (
          <Box
            key={i}
            sx={{ display: 'flex' }}
          >
            {Array(15).fill(null).map((_, index) => (
              <Typography
                key={index}
                variant="body1"
                component="span"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: '0.95rem', sm: '1.05rem' },
                  mx: 2, // هذا هو المارجين اللي طلبتيه
                  whiteSpace: 'nowrap',
                }}
              >
                {message}
              </Typography>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Marquee;
