import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  addCustomerCartItem,
  getCustomerCart,
  removeCustomerCartItem,
  updateCustomerCartItem,
} from "../services/backend";

import {
  useCustomerAuth,
} from "./CustomerAuthContext";


const CartContext = createContext(null);


const EMPTY_CART = {
  id: null,
  items: [],
  total_items: 0,
  total_quantity: 0,
};


export function CartProvider({ children }) {
  const {
    isAuthenticated,
    loading: authLoading,
  } = useCustomerAuth();

  const [cart, setCart] = useState(
    EMPTY_CART
  );

  const [isLoading, setIsLoading] =
    useState(false);

  const [isUpdating, setIsUpdating] =
    useState(false);

  const [error, setError] =
    useState("");


  const refreshCart = useCallback(
    async () => {
      setIsLoading(true);
      setError("");

      try {
        const data =
          await getCustomerCart();

        const normalizedCart = {
          id: data?.id ?? null,

          items: Array.isArray(
            data?.items
          )
            ? data.items
            : [],

          total_items:
            Number(
              data?.total_items
            ) || 0,

          total_quantity:
            Number(
              data?.total_quantity
            ) || 0,
        };

        setCart(normalizedCart);

        return normalizedCart;
      } catch (requestError) {
        setError(
          requestError?.message ||
            "Could not load your cart."
        );

        throw requestError;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );


  const addItem = useCallback(
    async (
      productId,
      quantity = 1
    ) => {
      setIsUpdating(true);
      setError("");

      try {
        await addCustomerCartItem(
          productId,
          quantity
        );

        return await refreshCart();
      } catch (requestError) {
        setError(
          requestError?.message ||
            "Could not add this product to your cart."
        );

        throw requestError;
      } finally {
        setIsUpdating(false);
      }
    },
    [refreshCart]
  );


  const updateItemQuantity =
    useCallback(
      async (
        itemId,
        quantity
      ) => {
        setIsUpdating(true);
        setError("");

        try {
          await updateCustomerCartItem(
            itemId,
            quantity
          );

          return await refreshCart();
        } catch (requestError) {
          setError(
            requestError?.message ||
              "Could not update this cart item."
          );

          throw requestError;
        } finally {
          setIsUpdating(false);
        }
      },
      [refreshCart]
    );


  const removeItem = useCallback(
    async (itemId) => {
      setIsUpdating(true);
      setError("");

      try {
        await removeCustomerCartItem(
          itemId
        );

        return await refreshCart();
      } catch (requestError) {
        setError(
          requestError?.message ||
            "Could not remove this item."
        );

        throw requestError;
      } finally {
        setIsUpdating(false);
      }
    },
    [refreshCart]
  );


  const resetCart = useCallback(
    () => {
      setCart({
        ...EMPTY_CART,
        items: [],
      });

      setError("");
      setIsLoading(false);
      setIsUpdating(false);
    },
    []
  );


  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      resetCart();
      return;
    }

    refreshCart().catch(() => {
      // The error is already stored
      // inside CartContext.
    });
  }, [
    authLoading,
    isAuthenticated,
    refreshCart,
    resetCart,
  ]);


  const value = useMemo(
    () => ({
      cart,

      items: cart.items,

      totalItems:
        cart.total_items,

      totalQuantity:
        cart.total_quantity,

      isLoading,
      isUpdating,
      error,

      refreshCart,
      addItem,
      updateItemQuantity,
      removeItem,
      resetCart,
    }),
    [
      cart,
      isLoading,
      isUpdating,
      error,
      refreshCart,
      addItem,
      updateItemQuantity,
      removeItem,
      resetCart,
    ]
  );


  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}


export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider."
    );
  }

  return context;
}