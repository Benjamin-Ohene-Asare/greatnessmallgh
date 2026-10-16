import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCurrentCustomer,
  loginCustomer,
  loginCustomerWithGoogle,
  logoutCustomer,
  registerCustomer,
  updateCustomerProfile,
} from "../services/backend";


const CustomerAuthContext =
  createContext(null);


export function CustomerAuthProvider({
  children,
}) {
  const [customer, setCustomer] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  const refreshCustomer =
    useCallback(async () => {
      try {
        const data =
          await getCurrentCustomer();

        const currentCustomer =
          data?.customer || null;

        setCustomer(
          currentCustomer
        );

        return currentCustomer;
      } catch {
        setCustomer(null);
        return null;
      }
    }, []);


  useEffect(() => {
    const loadCustomer = async () => {
      try {
        await refreshCustomer();
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [refreshCustomer]);


  const register =
    useCallback(async (formData) => {
      const data =
        await registerCustomer(
          formData
        );

      setCustomer(
        data?.customer || null
      );

      return data;
    }, []);


  const signIn =
    useCallback(
      async (
        identifier,
        password
      ) => {
        const data =
          await loginCustomer(
            identifier,
            password
          );

        setCustomer(
          data?.customer || null
        );

        return data;
      },
      []
    );


  const signInWithGoogle =
    useCallback(
      async (credential) => {
        const data =
          await loginCustomerWithGoogle(
            credential
          );

        setCustomer(
          data?.customer || null
        );

        return data;
      },
      []
    );


  const updateProfile =
    useCallback(
      async (profileData) => {
        const data =
          await updateCustomerProfile(
            profileData
          );

        setCustomer(
          data?.customer || null
        );

        return data;
      },
      []
    );


  const signOut =
    useCallback(async () => {
      await logoutCustomer();

      setCustomer(null);
    }, []);


  const value = useMemo(
    () => ({
      customer,
      loading,

      isAuthenticated:
        Boolean(customer),

      register,
      signIn,
      signInWithGoogle,
      updateProfile,
      signOut,
      refreshCustomer,
    }),
    [
      customer,
      loading,
      register,
      signIn,
      signInWithGoogle,
      updateProfile,
      signOut,
      refreshCustomer,
    ]
  );


  return (
    <CustomerAuthContext.Provider
      value={value}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}


export function useCustomerAuth() {
  const context =
    useContext(
      CustomerAuthContext
    );

  if (!context) {
    throw new Error(
      "useCustomerAuth must be used inside CustomerAuthProvider."
    );
  }

  return context;
}