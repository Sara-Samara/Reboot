import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/errorPage/ErrorPage";
import MainLayout from "./layout/MainLayout";
import Product from "./components/product/Product";
import Home from "./pages/home/Home";
import LoginModal from "./modals/login/LoginModal";
import ForgetPassword from "./pages/forgetPassword/ForgetPassword";
import ProductDetails from "./pages/productDetails/ProductDetails";
import Cart from "./pages/cart/Cart";
import Shop from "./pages/shop/Shop";
import CategoryProducts from "./pages/categoryproducts/CategoryProducts";
import Categories from "./components/category/Categories";
import ProfileLayout from "./pages/profile/ProfileLayout";
import ProfileInfo from "./pages/profile/ProfileInfo";
import ChangePassword from "./pages/profile/ChangePassword";
import UserOrders from "./pages/profile/UserOrders";

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'product', element: <Product /> },
      { path: 'product/:id', element: <ProductDetails /> },
      { path: 'categories', element: <Categories /> },
      { path: 'cart', element: <Cart /> },
      { path: 'login', element: <LoginModal /> },
      { path:'forgot-password' , element:<ForgetPassword/>},
      { path: 'shop', element: <Shop/> },
      { path: "/categories/:categoryId/products", element: <CategoryProducts /> },
      {
        path: 'profile',
        element: <ProfileLayout />,
        children: [
          { index: true, element: <ProfileInfo /> }, 
          { path: 'change-password', element: <ChangePassword /> },
          { path: 'orders', element: <UserOrders /> },
        ]
      }
    ],
    errorElement: <ErrorPage />
  },
  {
    path: '*',
    element: <ErrorPage />
  }
])



export default router;