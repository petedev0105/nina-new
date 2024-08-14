"use client";
import React from "react";
import Dashboard from "@/components/Dashboard";
import readUserSession from "../../lib/actions";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { userAtom, userInformationAtom } from "../jotai/user/atoms";
import { userOnboardedAtom } from "../jotai/user/atoms";
import axios from "axios";

function DashboardPage() {
  const [user, setUser] = useAtom(userAtom);
  const [userOnboarded, setUserOnboarded] = useAtom(userOnboardedAtom);
  const router = useRouter();
  const [userInformation, setUserInformation] = useAtom(userInformationAtom);

  async function handleCheckUser() {
    const { data } = await readUserSession();
    if (data.session) {
      setUser(data.session.user);
    } else {
      router.push("/");
    }
  }

  async function handleCheckUserOnboarded() {
    const { data } = await readUserSession();
    const userId = data.session.user.id;
    const { data: userData } = await axios.post("/api/get-user-information", {
      userId,
    });

    console.log("user data from dashboard page", userData);

    setUserInformation(userData);

    // if(userData)

    setUserOnboarded(true);
  }

  useEffect(() => {
    handleCheckUser();
    handleCheckUserOnboarded();
  }, [router.isReady]);

  if (user) return <Dashboard />;
}

export default DashboardPage;
