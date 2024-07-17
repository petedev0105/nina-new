"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import readUserSession from "../lib/actions";

function LandingPage() {
  const [user, setUser] = useState(null);
  const items = [
    {
      key: "1",
      label: (
        <Link href="/dashboard" className="">
          Dashboard
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <span className="text-red-500" onClick={() => handleSignOut()}>
          Log out
        </span>
      ),
    },
  ];

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  function loginWithGoogle() {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth-server-action/callback`,
      },
    });
  }

  async function handleSignOut() {
    try {
      const { error } = await supabase.auth.signOut();

      if (!error) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleCheckUser() {
    const { data } = await readUserSession();
    if (data.session) {
      console.log(data);
      console.log(data.session.user);
      setUser(data.session.user);
    } else {
      // router.push("/");
    }
  }

  useEffect(() => {
    handleCheckUser();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <header className="py-5 flex justify-center items-center">
        <div className="flex items-center space-x-2">
          <div className="h-5 w-5 rounded-full bg-green-500"></div>
          <span className="text-xl font-medium">Nina</span>
        </div>
      </header>

      <section className="text-center py-24">
        <h1 className="text-5xl md:text-7xl font-semibold text-gray-900">
          Your Personal <br className="hidden md:block" /> Health Companion
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          Our AI-powered platform is designed to provide personalized guidance
          tailored to your unique needs and achieve your health goals.
        </p>
        <div className="flex justify-center pt-10">
          {user ? (
            <Link href="/dashboard">
              <button className="text-lg px-5 py-3 rounded-xl bg-black text-white hover:opacity-85">
                Go to dashboard
              </button>
            </Link>
          ) : (
            <button
              onClick={() => loginWithGoogle()}
              className="text-lg px-5 py-3 rounded-xl bg-black text-white hover:opacity-85"
            >
              Get started today
            </button>
          )}
        </div>
      </section>

      <div className="space-y-3">
        <div className="flex flex-col md:flex-row items-center md:space-x-3 space-y-3 md:space-y-0">
          <div className="border rounded-xl p-5 w-full md:w-2/3 pt-[80px] h-48 shadow-sm">
            <div>
              <span className="font-medium text-xl">
                Personalized nutrition expert
              </span>
            </div>
            <div>
              <p className="text-stone-600 text-sm">
                Receive customized meal plans and dietary advice tailored to
                your unique preferences and health objectives.
              </p>
            </div>
          </div>
          <div className="border rounded-xl p-5 w-full md:w-1/3 pt-[80px] h-48 shadow-sm">
            <div>
              <span className="font-medium text-xl">
                Up-to-date data sources
              </span>
            </div>
            <div>
              <p className="text-stone-600 text-sm">
                Access the latest nutritional information to make informed
                decisions about your diet.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center md:space-x-3 space-y-3 md:space-y-0">
          <div className="border rounded-xl p-5 w-full md:w-1/3 pt-[80px] h-48 shadow-sm">
            <div>
              <span className="font-medium text-xl">
                Excellent customer support
              </span>
            </div>
            <div>
              <p className="text-stone-600 text-sm">
                Our support team is ready to assist you with any questions or
                concerns.
              </p>
            </div>
          </div>
          <div className="border rounded-xl p-5 w-full md:w-2/3 pt-[80px] h-48 shadow-sm">
            <div>
              <span className="font-medium text-xl">
                Intuitive chat interface
              </span>
            </div>
            <div>
              <p className="text-stone-600 text-sm">
                Enjoy seamless interactions with our AI chatbot, available via
                text and voice for your convenience. Nina is your personal
                health coach available 24/7.
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="pt-48 space-y-5">
        <div>
          <span className="font-medium text-3xl">Our Mission</span>
        </div>
        <div>
          <p className="text-lg text-stone-600">
            NINA is your dedicated nutrition companion, designed to make healthy
            eating choices simple through advanced AI technology and an
            intuitive interface. Whether you need tailored dietary advice, meal
            suggestions, or to track your nutrition journey, NINA empowers your
            decisions every step of the way.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-48 items-center">
        <div className="space-y-5 order-2 lg:order-1">
          <div>
            <span className="font-medium text-2xl">Our Mission</span>
          </div>
          <div>
            <p>
              NINA is your personalized nutrition companion, designed to
              simplify healthy eating choices through advanced AI technology and
              intuitive design. Whether you&apos;re looking for tailored dietary
              advice, meal suggestions, or simply tracking your nutrition
              journey, NINA is here to empower your decisions.
            </p>
          </div>
        </div>
        <div className="rounded-md w-full h-72 bg-stone-200 order-1 lg:order-2"></div>

        <div className="rounded-md w-full h-72 bg-stone-200 order-3"></div>
        <div className="space-y-5 order-4">
          <div>
            <span className="font-medium text-2xl">Our Mission</span>
          </div>
          <div>
            <p>
              NINA is your personalized nutrition companion, designed to
              simplify healthy eating choices through advanced AI technology and
              intuitive design. Whether you&apos;re looking for tailored dietary
              advice, meal suggestions, or simply tracking your nutrition
              journey, NINA is here to empower your decisions.
            </p>
          </div>
        </div>
      </section>

      <section className="py-48 text-center space-y-5">
        <div>
          <span className="text-4xl font-medium">
            Ready to take your health to the next level?
          </span>
        </div>
        <div>
          <span className="text-lg text-stone-600">
            Lead a better life, starting today.
          </span>
        </div>
        <div className="flex justify-center">
          {user ? (
            <Link href="/dashboard">
              <button className="text-lg px-5 py-3 rounded-xl bg-black text-white hover:opacity-85">
                Go to dashboard
              </button>
            </Link>
          ) : (
            <button
              onClick={() => loginWithGoogle()}
              className="text-lg px-5 py-3 rounded-xl bg-black text-white hover:opacity-85"
            >
              Get started today
            </button>
          )}
        </div>
      </section>

      <footer className="py-10">
        <p className="text-center text-gray-400 text-sm">
          © 2024 NINA. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
