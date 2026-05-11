"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  email: string;
  name: string;
  tier: "free" | "pro" | "elite";
  isAdmin: boolean;
  hasPaidRegistration: boolean;
  hasPassedTest: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<boolean>;

  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<boolean>;

  logout: () => Promise<void>;

  isAuthenticated: boolean;
}

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  // LOAD USER
  useEffect(() => {
    const loadSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const supaUser = session.user;

          setUser({
            id: supaUser.id,
            email: supaUser.email || "",
            name:
              supaUser.user_metadata?.name ||
              "User",

            tier: "free",
            isAdmin: false,
            hasPaidRegistration: true,
            hasPassedTest: false,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          const supaUser = session.user;

          setUser({
            id: supaUser.id,
            email: supaUser.email || "",
            name:
              supaUser.user_metadata?.name ||
              "User",

            tier: "free",
            isAdmin: false,
            hasPaidRegistration: true,
            hasPassedTest: false,
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // REGISTER
  const register = async (
  name: string,
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

    if (error) {
      console.error(error.message);
      return false;
    }

    if (!data.user) {
      return false;
    }

    // CREATE PROFILE
    const { error: profileError } =
      await supabase
        .from("profiles")
        .insert([
          {
            id: data.user.id,
            name,
            email,
            tier: "free",
            balance: 0,
            streak: 0,
            has_passed_test: false,
            is_admin: false,
          },
        ]);

    if (profileError) {
      console.error(profileError.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

  // LOGIN
  const login = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        console.error(error.message);
        return false;
      }

      if (!data.user) {
        return false;
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}