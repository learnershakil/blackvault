"use client";

import {
  useEffect,
  createContext,
  useContext,
  ReactNode,
  useState,
} from "react";
import useCartStore from "@/store/cart-store";

interface CartProviderProps {
  children: ReactNode;
}

// Create a context to expose cart-related functions
export const CartContext = createContext<{
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
} | null>(null);

export default function CartProvider({ children }: CartProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { initializeCart } = useCartStore();

  // Initialize the cart on mount
  useEffect(() => {
    const initCart = async () => {
      await initializeCart();
      setIsInitialized(true);
    };

    initCart();
  }, [initializeCart]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartContext.Provider value={{ isOpen, openCart, closeCart }}>
      {children}

      {/* Optional: Add a cart drawer/sidebar here that uses isOpen state */}
    </CartContext.Provider>
  );
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
