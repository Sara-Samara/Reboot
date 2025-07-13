import React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Link,
    TextField,
    IconButton,
    Checkbox,
    FormControlLabel,
    Divider
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import newFooterBg from '../../assets/background/new-footer-bg.png';

const Footer = () => {
    return (
        <Box
          component="footer"
          sx={{
            position: 'relative',
            background: '#141414',
            color: 'rgba(255, 255, 255, 0.7)',
            py: { xs: 6, md: 8 },
            px: 2,
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '60%',
              height: '100%',
              background: `url(${newFooterBg}) no-repeat`,
              backgroundSize: 'contain',
              backgroundPosition: 'right bottom',
              opacity: 0.5,
              zIndex: 0,
              transform: 'rotate(0deg)',
              maxWidth: '2000px'
            }
          }}
        >
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                {/* باقي محتوى الفوتر يبقى كما هو */}
                <Grid container spacing={{ xs: 4, sm: 5, md: 7 }} justifyContent="space-between">

                    <Grid item xs={12} sm={6} md={3} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                            Office
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1.5 }}>
                            Germany — <br />
                            785 15h Street, Office 478 <br />
                            Berlin, De 81566
                        </Typography>
                        <Link href="mailto:info@email.com" color="inherit" sx={linkStyles}>
                            info@email.com
                        </Link>
                        <Link href="tel:+18005552569" color="inherit" sx={linkStyles}>
                            +1 800 555 25 69
                        </Link>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                            Links
                        </Typography>
                        {['Home', 'About Us', 'Our Services', 'Shop', 'Contact Us'].map((text) => (
                            <Link href="#" key={text} color="inherit" sx={linkStyles}>
                                {text}
                            </Link>
                        ))}
                    </Grid>

                    <Grid item xs={12} sm={6} md={2} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                            Socials
                        </Typography>
                        {['Facebook', 'Twitter', 'Dribble', 'Instagram'].map((text) => (
                            <Link href="#" key={text} color="inherit" sx={linkStyles}>
                                {text}
                            </Link>
                        ))}
                    </Grid>

                    <Grid item xs={12} sm={6} md={5} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                            Newsletter
                        </Typography>
                        <Box
                            component="form"
                            sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}
                        >
                            <TextField
                                variant="outlined"
                                placeholder="Enter Your Email Address"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <EmailOutlinedIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', mr: 1 }} />
                                    ),
                                    sx: {
                                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                                        color: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(255, 255, 255, 0.2)',
                                            borderRight: 'none',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(255, 255, 255, 0.5)',
                                            borderRight: 'none',
                                        },
                                        borderRadius: '4px 0 0 4px',
                                    },
                                }}
                            />
                            <IconButton
                                type="submit"
                                aria-label="subscribe"
                                sx={{
                                    bgcolor: '#ff9900',
                                    color: 'black',
                                    borderRadius: '0 4px 4px 0',
                                    p: '14px',
                                    '&:hover': {
                                        bgcolor: '#e68a00',
                                    },
                                    '& svg': {
                                        fontSize: '1.2rem'
                                    }
                                }}
                            >
                                <ArrowForwardIcon />
                            </IconButton>
                        </Box>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    sx={checkboxStyles}
                                />
                            }
                            label={
                                <Typography variant="body2">
                                    I agree to the <Link href="#" color="inherit" sx={privacyLinkStyles}>Privacy Policy</Link>
                                </Typography>
                            }
                            sx={{ mt: 1 }}
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: { xs: 4, md: 6 }, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                    <Grid item xs={12} md="auto" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography variant="body2">
                            AxiomThemes © {new Date().getFullYear()}. All rights reserved.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md="auto" sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem', lg: '6rem' },
                                fontWeight: 300,
                                color: 'white',
                                lineHeight: 1,
                                fontFamily: 'Helvetica, Arial, sans-serif',
                                letterSpacing: '-0.05em',
                            }}
                        >
                            Reboot
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

const linkStyles = {
    display: 'block',
    mb: 1.5,
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
        color: 'white',
        textDecoration: 'underline',
    },
    transition: 'color 0.3s ease, text-decoration 0.3s ease',
};

const checkboxStyles = {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-checked': {
        color: '#ff9900',
    }
};

const privacyLinkStyles = {
    color: 'white',
    fontWeight: 'bold',
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline',
    }
};

export default Footer;