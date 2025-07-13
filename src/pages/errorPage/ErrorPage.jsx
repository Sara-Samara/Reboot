import React from 'react';
import { Link as RouterLink } from 'react-router-dom'; // إذا كنت تستخدم react-router
import { Box, Typography, Button, Container } from '@mui/material'; // استخدام مكونات Material-UI

// استخدام خطافات مخصصة للحفاظ على نظافة المكون الرئيسي
// يمكنك استيراد حالة الخطأ من مكان مركزي أو تمريرها كـ props
// هنا، سأفترض أننا نعرض رسالة خطأ عامة أو يمكن تخصيصها إذا تم تمريرها

// مثال لـ hook يمكن أن يعالج حالات الخطأ المختلفة
// const useErrorHandling = () => {
//   // منطق استرداد معلومات الخطأ هنا
//   // ...
//   return { errorMessage: "حدث خطأ غير متوقع.", errorType: "general" };
// };

export default function ErrorPage() {
  // const { errorMessage, errorType } = useErrorHandling(); // إذا كنت تستخدم hook لجلبل معلومات الخطأ

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // تأكد من أن الصفحة تملأ الشاشة بالكامل
        backgroundColor: '#f4f6f8', // خلفية لطيفة
        py: 8, // هوامش علوية وسفلية
        px: 2, // هوامش أفقية للشاشات الصغيرة
      }}
    >
      <Container maxWidth="sm"> {/* Container لتوسيط المحتوى والتحكم في عرضه */}
        <Box
          sx={{
            textAlign: 'center',
            padding: 4,
            borderRadius: '12px', // زوايا دائرية للمربع
            backgroundColor: 'white', // خلفية بيضاء للمربع
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)', // ظل ناعم
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h2" // حجم خط كبير للرقم
            fontWeight="bold"
            sx={{ color: '#f18c08', mb: 1 }} // لون برتقالي مميز للخطأ
          >
            404
          </Typography>
          <Typography variant="h5" gutterBottom fontWeight="600" sx={{ mb: 2 }}>
            Oops! Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {/* الرسالة الافتراضية أو الرسالة المستلمة */}
            It seems like you've stumbled upon a page that doesn't exist. Don't worry, it happens!
            {/* يمكن تعديل هذه الرسالة بناءً على نوع الخطأ إذا كان متاحًا */}
            {/* {errorMessage} */}
          </Typography>
          <Button
            component={RouterLink}
            to="/" // الرابط إلى الصفحة الرئيسية
            variant="contained"
            sx={{
              bgcolor: '#f18c08', // لون الزر
              color: 'white',
              '&:hover': { bgcolor: '#d87e07' }, // تأثير عند تمرير الماوس
              textTransform: 'none', // منع تحويل النص إلى أحرف كبيرة
              borderRadius: '8px', // زوايا دائرية للزر
              padding: '10px 25px', // هوامش داخلية للزر
            }}
            aria-label="Go to Homepage" // لتحسين إمكانية الوصول
          >
            Go to Homepage
          </Button>
        </Box>
      </Container>
    </Box>
  );
}