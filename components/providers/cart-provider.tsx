"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variantSku?: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (productId: string, variantSku?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    variantSku?: string
  ) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize cart from localStorage on client side
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, isLoading]);

  // Add item to cart
  const addItem = (item: Omit<CartItem, "id">) => {
    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (i) =>
          i.productId === item.productId && i.variantSku === item.variantSku
      );

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += item.quantity;
        return newItems;
      } else {
        // Add new item with generated id
        return [...prevItems, { ...item, id: generateCartItemId() }];
      }
    });
  };

  // Remove item from cart
  const removeItem = (productId: string, variantSku?: string) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(item.productId === productId && item.variantSku === variantSku)
      )
    );
  };

  // Update item quantity
  const updateQuantity = (
    productId: string,
    quantity: number,
    variantSku?: string
  ) => {
    if (quantity < 1) {
      removeItem(productId, variantSku);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId && item.variantSku === variantSku
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
  };

  // Calculate item count
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  // Calculate subtotal
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Helper function to generate unique IDs for cart items
  const generateCartItemId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
