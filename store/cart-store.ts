import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variantSku?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  setCart: (items: CartItem[]) => void;
  initializeCart: () => Promise<void>;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(
          (i) =>
            i.productId === item.productId && i.variantSku === item.variantSku
        );

        if (existingItem) {
          // Update quantity of existing item
          const updatedItems = items.map((i) =>
            i.id === existingItem.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
          set({ items: updatedItems });
        } else {
          // Add new item with generated ID
          const newItem = {
            ...item,
            id: Date.now().toString(),
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateItemQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      totalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      setCart: (items) => set({ items }),

      // Initialize cart - would typically sync with server for logged in users
      initializeCart: async () => {
        try {
          // Example: If user is logged in, fetch their cart from API
          // const response = await fetch('/api/cart');
          // if (response.ok) {
          //   const data = await response.json();
          //   get().setCart(data.items);
          // }
        } catch (error) {
          console.error("Failed to initialize cart:", error);
        }
      },
    }),
    {
      name: "cart-storage", // unique name for localStorage
      skipHydration: true, // handle hydration manually in the CartProvider
    }
  )
);

export default useCartStore;
