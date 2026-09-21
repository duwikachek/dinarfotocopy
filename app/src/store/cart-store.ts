"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { calculateBulkDiscount, calculateSubtotal } from "@/lib/utils";

// ============ TYPES ============
export interface CartServiceItem {
  id: string; // unique item id in cart
  type: "service";
  serviceId: string;
  serviceName: string;
  variantId?: string;
  variantLabel: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  discountPercent: number;
  isBulkEligible: boolean;
  // Banner specific
  bannerWidth?: number;
  bannerHeight?: number;
}

export interface CartProductItem {
  id: string; // unique item id in cart
  type: "product";
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  maxStock: number;
}

export type CartItem = CartServiceItem | CartProductItem;

interface CartStore {
  items: CartItem[];
  // Actions
  addServiceItem: (item: Omit<CartServiceItem, "id" | "subtotal" | "discountPercent">) => void;
  addProductItem: (item: Omit<CartProductItem, "id" | "subtotal">) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  // Computed
  getTotalItems: () => number;
  getTotalEstimate: () => number;
  getServiceItems: () => CartServiceItem[];
  getProductItems: () => CartProductItem[];
}

function generateId(): string {
  return `cart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addServiceItem: (item) => {
        const { items } = get();
        // Check if same service+variant already in cart
        const existing = items.find(
          (i) =>
            i.type === "service" &&
            (i as CartServiceItem).serviceId === item.serviceId &&
            (i as CartServiceItem).variantLabel === item.variantLabel
        );

        if (existing) {
          // Update quantity instead of adding duplicate
          get().updateQuantity(existing.id, (existing as CartServiceItem).quantity + item.quantity);
          return;
        }

        const discountPercent = item.isBulkEligible
          ? calculateBulkDiscount(item.quantity)
          : 0;
        const subtotal = calculateSubtotal(item.unitPrice, item.quantity, discountPercent);

        const newItem: CartServiceItem = {
          ...item,
          id: generateId(),
          discountPercent,
          subtotal,
        };
        set((state) => ({ items: [...state.items, newItem] }));
      },

      addProductItem: (item) => {
        const { items } = get();
        const existing = items.find(
          (i) =>
            i.type === "product" &&
            (i as CartProductItem).productId === item.productId
        );

        if (existing) {
          const newQty = Math.min(
            (existing as CartProductItem).quantity + item.quantity,
            item.maxStock
          );
          get().updateQuantity(existing.id, newQty);
          return;
        }

        const subtotal = item.unitPrice * item.quantity;
        const newItem: CartProductItem = {
          ...item,
          id: generateId(),
          subtotal,
        };
        set((state) => ({ items: [...state.items, newItem] }));
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== itemId) return item;

            if (item.type === "service") {
              const svcItem = item as CartServiceItem;
              const discountPercent = svcItem.isBulkEligible
                ? calculateBulkDiscount(quantity)
                : 0;
              const subtotal = calculateSubtotal(svcItem.unitPrice, quantity, discountPercent);
              return { ...svcItem, quantity, discountPercent, subtotal };
            } else {
              const prodItem = item as CartProductItem;
              const safeQty = Math.min(quantity, prodItem.maxStock);
              return {
                ...prodItem,
                quantity: safeQty,
                subtotal: prodItem.unitPrice * safeQty,
              };
            }
          }),
        }));
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getTotalEstimate: () => {
        return get().items.reduce((acc, item) => acc + item.subtotal, 0);
      },

      getServiceItems: () => {
        return get().items.filter(
          (i): i is CartServiceItem => i.type === "service"
        );
      },

      getProductItems: () => {
        return get().items.filter(
          (i): i is CartProductItem => i.type === "product"
        );
      },
    }),
    {
      name: "dinar-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
