import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box, Button, Card, Grid, Zoom } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance'; // تأكد من صحة المسار
import CircularProgress from '@mui/material/CircularProgress';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { toast } from 'react-toastify';
import violetGradient from '../../assets/background/violet-gradient-group.svg'; // تأكد من صحة المسار

export default function Product() {
  const navigate = useNavigate();
  // استخدام useState لتتبع المنتجات المفضلة
  const [likedProducts, setLikedProducts] = React.useState([]);

  // دالة لتبديل حالة الإعجاب بالمنتج
  const toggleLike = (id) => {
    setLikedProducts((prev) => {
      const isLiked = prev.includes(id);
      const updated = isLiked ? prev.filter((pid) => pid !== id) : [...prev, id];

      // عرض إشعار للمستخدم
      toast.success(isLiked ? 'Removed from favorites ❤️‍🩹' : 'Added to favorites ❤️', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: 'dark',
        transition: Zoom,
      });

      return updated;
    });
  };

  // استدعاء البيانات باستخدام react-query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products'], // مفتاح الاستعلام لتخزين البيانات مؤقتًا
    queryFn: async () => {
      const res = await axiosInstance.get('/products');
      // تأكد من أن البيانات تأتي من res.data.data كما هو موضح في الكود الأصلي
      return res.data.data;
    },
  });

  // عرض مؤشر التحميل أثناء جلب البيانات
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'black' }}>
        <CircularProgress sx={{ color: '#f5925a' }} />
      </Box>
    );
  }

  // عرض رسالة خطأ في حالة فشل جلب البيانات
  if (isError) {
    return (
      <Box sx={{ textAlign: 'center', color: 'white', mt: 10, backgroundColor: 'black', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography>An error occurred while fetching products: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', backgroundColor: 'black', minHeight: '100vh', overflow: 'hidden', color: 'white' }}>
      {/* خلفية تدرجية */}
      <Box
        component="img"
        src={violetGradient}
        alt="Gradient Decoration"
        sx={{
          position: 'absolute',
          bottom: { xs: '-100px', sm: '-400px', md: '-650px' },
          right: { xs: '-150px', sm: '-400px', md: '-600px' },
          width: { xs: '300px', sm: '600px', md: '1300px' },
          height: 'auto',
          opacity: 0.6,
          zIndex: 0,
          pointerEvents: 'none',
          transform: 'rotate(120deg)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* قسم العنوان */}
        <Box component="div" sx={{ textAlign: 'center', py: 8 }}>
          <Typography
            component="h1"
            sx={{
              fontWeight: 400,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              lineHeight: 1.3,
              marginBottom: 1,
            }}
          >
            Popular{' '}
            <Box
              component="span"
              sx={{
                fontWeight: 400,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                lineHeight: 1.3,
                background: 'linear-gradient(#ec663b, #f5925a, #fec27a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              products
            </Box>
          </Typography>
          <Typography component="p" sx={{ color: '#c9cacc', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.
          </Typography>
        </Box>

        {/* شبكة عرض المنتجات */}
        <Grid container spacing={4} justifyContent="center">
          {data && data.length > 0 ? (
            data.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}> {/* تحكم أفضل في عدد الكاردات حسب الشاشة */}
                <Card
                  sx={{
                    p: 2, // Padding داخلي للكارد
                    my: 2, // Margins عمودية للكارد
                    boxShadow: 'none', // إزالة الظل لشفافية أفضل
                    backgroundColor: 'transparent', // خلفية شفافة للكارد
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer', // تغيير المؤشر للإشارة إلى أنه قابل للنقر
                    transition: 'transform 0.2s ease-in-out', // تأثير انتقالي عند التحويم
                    '&:hover': {
                      transform: 'scale(1.03)', // تكبير طفيف عند التحويم
                    },
                  }}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <Box sx={{ position: 'relative', width: '100%' }}>
                    <CardMedia
                      component="img"
                      sx={{
                        borderRadius: '10px',
                        width: '100%', // اجعل الصورة تمتد بعرض الكارد
                        height: '250px', // ارتفاع ثابت للصورة
                        objectFit: 'cover', // تأكد من أن الصورة تغطي المساحة بشكل جيد
                        marginBottom: 2,
                      }}
                      image={product.image || 'https://placehold.co/250x250'} // صورة افتراضية إذا لم تتوفر صورة
                      alt={product.name}
                    />
                    {/* زر الإعجاب */}
                    <IconButton
                      aria-label="add to favorites"
                      onClick={(e) => {
                        e.stopPropagation(); // منع انتقال النقر إلى الكارد بأكمله
                        toggleLike(product.id);
                      }}
                      sx={{
                        position: 'absolute',
                        top: 15,
                        right: 15,
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        borderRadius: '8px',
                        width: '35px',
                        height: '35px',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
                        padding: '5px',
                      }}
                    >
                      {likedProducts.includes(product.id) ? (
                        <FavoriteIcon sx={{ color: '#f5925a', fontSize: '1.2rem' }} /> // لون مميز للمفضلة
                      ) : (
                        <FavoriteBorderIcon sx={{ color: '#707070', fontSize: '1.2rem' }} />
                      )}
                    </IconButton>
                  </Box>
                  {/* محتوى الكارد (الاسم والسعر) */}
                  <CardContent sx={{ p: 0, width: '100%', textAlign: 'left' }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      sx={{ fontWeight: 500, color: 'white', mt: 1 }}
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="h6" component="div" color='#c9cacc' sx={{ fontWeight: 500 }}>
                      $ {product.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            // رسالة في حالة عدم وجود منتجات
            <Grid item xs={12}>
              <Typography sx={{ color: 'white', mt: 4, textAlign: 'center' }}>
                There are no products to display.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}