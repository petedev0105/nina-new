"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { createClient } from "@supabase/supabase-js";

const SupabaseContext = createContext(undefined);

const SupabaseProvider = ({ children }) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const [user, setUser] = useState(null);
  const [packageType, setPackageType] = useState(0);

  async function fetchUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      localStorage.setItem("userId", user.id);
      setUser(user);
    }
  }

  async function signInWithSupabase() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) {
        throw new Error(error.message);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function checkUserPackage() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const userEmail = user.email;
      console.log(userEmail);
      const { data, error } = await supabase
        .from("user_packages")
        .select("*")
        .eq("email", userEmail);

      if (data) {
        console.log("user package data", data);

        if (data[0]) {
          switch (data[0].package_type) {
            case 0:
              setPackageType(0);
              break;
            case 1:
              setPackageType(1);
              break;
            default:
              break;
          }
        }
      }
    }
  }

  useEffect(() => {
    fetchUser();
    checkUserPackage();
  }, []);

  return (
    <SupabaseContext.Provider
      value={{ supabase, user, signInWithSupabase, packageType }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};

const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};

export { SupabaseProvider, useSupabase };
