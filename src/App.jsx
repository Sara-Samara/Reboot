import React from 'react';
import { ToastContainer } from 'react-toastify';
import { RouterProvider } from 'react-router-dom';
import router from './Routes';
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from './context/CartContext';



const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
       <CartProvider>
      <RouterProvider router={router} />
      <ToastContainer position="top-center" />
      </CartProvider>
    </QueryClientProvider>
  );
}
