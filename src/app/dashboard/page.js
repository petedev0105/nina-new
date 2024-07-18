"use client";
import React from "react";
import Dashboard from "@/components/Dashboard";
import readUserSession from "../../lib/actions";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function DashboardPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  async function handleCheckUser() {
    const { data } = await readUserSession();
    if (data.session) {
      setUser(data.session.user);
    } else {
      router.push("/");
    }
  }

  useEffect(() => {
    handleCheckUser();
  }, [router.isReady]);

  if (user) return <Dashboard user={user} />;
}

export default DashboardPage;
