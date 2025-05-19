import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  variantSku?: string;
};

export type CartState = {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "id">) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;

  // Derived state
  totalItems: () => number;
  totalPrice: () => number;

  // Sync with backend
  syncCart: () => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  setCart: (items: CartItem[]) => void;
};

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,

      // Cart drawer actions
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // Item management
      addItem: (newItem) => {
        set((state) => {
          // Check if item already exists in cart
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.productId === newItem.productId &&
              ((!item.variantSku && !newItem.variantSku) ||
                item.variantSku === newItem.variantSku)
          );

          if (existingItemIndex !== -1) {
            // Update quantity if item exists
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            return { items: updatedItems, isOpen: true };
          } else {
            // Add new item with unique id
            const id = Date.now().toString();
            return {
              items: [...state.items, { ...newItem, id }],
              isOpen: true,
            };
          }
        });

        // Sync with backend
        get().syncCart();
      },

      updateItemQuantity: (id, quantity) => {
        if (quantity <= 0) return get().removeItem(id);

        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );
          return { items: updatedItems };
        });

        // Sync with backend
        get().syncCart();
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));

        // Sync with backend
        get().syncCart();
      },

      clearCart: () => {
        set({ items: [] });
        get().syncCart();
      },

      // Derived state calculations
      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      totalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      // Backend synchronization
      syncCart: async () => {
        try {
          const state = get();

          // Skip sync if no items
          if (state.items.length === 0) return;

          state.setLoading(true);

          // Send cart to backend for registered users
          const response = await fetch("/api/cart/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: state.items }),
          });

          if (!response.ok) {
            throw new Error("Failed to sync cart with server");
          }

          // If we get updated cart data from server, use it
          const data = await response.json();
          if (data.items) {
            state.setCart(data.items);
          }
        } catch (error) {
          console.error("Error syncing cart with server:", error);
        } finally {
          get().setLoading(false);
        }
      },

      setLoading: (isLoading) => set({ isLoading }),
      setCart: (items) => set({ items }),
    }),
    {
      name: "blackvault-cart",
      // Don't persist the open state or loading state
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;
