import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

// 1. إنشاء الـ Context
const CartContext = createContext();

// 2. تعريف الإجراءات (Actions) التي يمكن تنفيذها
const ACTIONS = {
  ADD_ITEM: 'add-item',
  REMOVE_ITEM: 'remove-item',
  UPDATE_QUANTITY: 'update-quantity',
  CLEAR_CART: 'clear-cart',
  LOAD_CART: 'load-cart', // لتحميل السلة من localStorage
};

// 3. الـ Reducer: المنطق الفعلي لإدارة الحالة
const cartReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_ITEM: {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      let updatedItems;
      if (existingItem) {
        // إذا كان المنتج موجوداً، قم بزيادة الكمية فقط
        updatedItems = state.items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        // إذا كان المنتج جديداً، أضفه إلى السلة
        updatedItems = [...state.items, { ...product, quantity }];
      }
      toast.success(`${product.name} added to cart!`);
      return { ...state, items: updatedItems };
    }

    case ACTIONS.REMOVE_ITEM: {
      const updatedItems = state.items.filter((item) => item.id !== action.payload.id);
      toast.error(`Item removed from cart.`);
      return { ...state, items: updatedItems };
    }

    case ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      const updatedItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      ).filter(item => item.quantity > 0); // يمكن إزالة المنتج إذا أصبحت الكمية 0
      return { ...state, items: updatedItems };
    }
    
    case ACTIONS.CLEAR_CART:
      return { ...state, items: [] };

    case ACTIONS.LOAD_CART:
      return { ...state, items: action.payload.items || [] };

    default:
      return state;
  }
};

// 4. الـ Provider: المكون الذي سيغلف تطبيقك
export const CartProvider = ({ children }) => {
  // استخدام localStorage لحفظ السلة بين الجلسات
  const initialState = {
    items: [],
  };

  const [state, dispatch] = useReducer(cartReducer, initialState);

  // تحميل السلة من localStorage عند بدء تشغيل التطبيق
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        dispatch({ type: ACTIONS.LOAD_CART, payload: { items: JSON.parse(savedCart) } });
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
    }
  }, []);

  // حفظ السلة في localStorage كلما تغيرت
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(state.items));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [state.items]);


  // حساب الإجماليات
  const cartTotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  // القيم التي ستكون متاحة للمكونات الأخرى
  const value = {
    cartItems: state.items,
    dispatch,
    cartActions: ACTIONS,
    cartTotal,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// 5. Custom Hook: لتسهيل استخدام الـ Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};