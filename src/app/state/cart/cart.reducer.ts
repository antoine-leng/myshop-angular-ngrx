import { createReducer, on } from '@ngrx/store';
import * as CartActions from './cart.actions';
import { CartItem } from './cart.actions';

export interface CartState {
  items: CartItem[];
  totalPrice: number;
  count: number;
  // Pour la validation du panier
  validation: {
    itemsTotal: number;
    discount: number;
    shipping: number;
    taxes: number;
    grandTotal: number;
  } | null;
  validating: boolean;
  error: string | null;
}

export const initialCartState: CartState = {
  items: [],
  totalPrice: 0,
  count: 0,
  validation: null,
  validating: false,
  error: null,
};

// Helper pour calculer le total
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

// Helper pour calculer le nombre total d'items
function calculateCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export const cartReducer = createReducer(
  initialCartState,

  // Ajouter un item
  on(CartActions.addItem, (state, { product, quantity }) => {
    const existingItem = state.items.find((item) => item.product.id === product.id);

    let newItems: CartItem[];
    if (existingItem) {
      // Augmenter la quantité si le produit existe déjà
      newItems = state.items.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Ajouter un nouvel item
      newItems = [...state.items, { product, quantity }];
    }

    return {
      ...state,
      items: newItems,
      totalPrice: calculateTotal(newItems),
      count: calculateCount(newItems),
    };
  }),

  // Supprimer un item
  on(CartActions.removeItem, (state, { productId }) => {
    const newItems = state.items.filter((item) => item.product.id !== productId);
    return {
      ...state,
      items: newItems,
      totalPrice: calculateTotal(newItems),
      count: calculateCount(newItems),
    };
  }),

  // Mettre à jour la quantité
  on(CartActions.updateQuantity, (state, { productId, quantity }) => {
    if (quantity <= 0) {
      // Si la quantité est 0 ou négative, on supprime l'item
      const newItems = state.items.filter((item) => item.product.id !== productId);
      return {
        ...state,
        items: newItems,
        totalPrice: calculateTotal(newItems),
        count: calculateCount(newItems),
      };
    }

    const newItems = state.items.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );

    return {
      ...state,
      items: newItems,
      totalPrice: calculateTotal(newItems),
      count: calculateCount(newItems),
    };
  }),

  // Vider le panier
  on(CartActions.clearCart, () => initialCartState),

  // Restaurer depuis localStorage
  on(CartActions.loadCartFromStorage, (state, { items }) => ({
    ...state,
    items,
    totalPrice: calculateTotal(items),
    count: calculateCount(items),
  })),

  // Validation du panier
  on(CartActions.validateCart, (state) => ({
    ...state,
    validating: true,
    error: null,
  })),

  on(CartActions.validateCartSuccess, (state, validation) => ({
    ...state,
    validating: false,
    validation: {
      itemsTotal: validation.itemsTotal,
      discount: validation.discount,
      shipping: validation.shipping,
      taxes: validation.taxes,
      grandTotal: validation.grandTotal,
    },
  })),

  on(CartActions.validateCartFailure, (state, { error }) => ({
    ...state,
    validating: false,
    error,
  }))
);