"use client";
import React from "react";
import { Button } from "./ui/button";
import { useState, useRef, useEffect } from "react";
import ChatComponent from "./ChatComponent";
import { useRouter } from "next/router";
import handleSignOut from "@/utils/HandleSignOut";
import Link from "next/link";

function Dashboard({ user }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [text, setText] = useState("");
  const sidebarRef = useRef();

  console.log(user);

  function handleSidebarClick() {
    setShowSidebar(!showSidebar);
  }

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setShowSidebar(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents the addition of a new line
      console.log(text); // Replace this with your function
      setText("");
    }
  };

  async function handleAddChat() {}

  const handleLogOut = async () => {
    const signOutSuccessful = await handleSignOut();

    if (signOutSuccessful) {
      window.location.reload();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="lg:flex">
      {showSidebar && (
        <div
          ref={sidebarRef}
          className="fixed top-0 left-0 h-full w-4/5 border-r bg-white z-50 shadow-md p-3 lg:hidden"
        >
          {/* Sidebar content goes here */}
          <div className="p-3 space-y-5">
            <div
              className="flex justify-between"
              onClick={() => handleSidebarClick()}
            >
              <div className="flex items-center space-x-1">
                <div className="h-4 w-4 rounded-full bg-green-600"></div>{" "}
                <span className="text-xl font-medium">Nina</span>
              </div>
              <div
                className="hover:bg-stone-100 cursor-pointer rounded-md p-2"
                onClick={() => handleSidebarClick()}
              >
                <img src="/img/sidebar.svg" className="w-5 h-5" />
              </div>
            </div>
            {/* <div
              onClick={() => handleAddChat()}
              className="rounded-full px-3 py-2 border hover:bg-stone-50 cursor-pointer"
            >
              + New Chat
            </div> */}
          </div>
        </div>
      )}
      <div className="flex justify-between items-center sticky top-0 py-5 bg-white lg:hidden">
        <div
          className="hover:bg-stone-100 cursor-pointer rounded-md p-2"
          onClick={() => handleSidebarClick()}
        >
          <img src="/img/sidebar.svg" className="w-5 h-5" />
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-4 w-4 rounded-full bg-green-600"></div>{" "}
          <span className="text-xl font-medium">Nina</span>
        </div>
        <div>
          <img src="/img/new.svg" className="w-5 h-5" />
        </div>
      </div>

      <div className="lg:block hidden">
        <div
          ref={sidebarRef}
          className="w-[250px] sticky top-0 h-screen w-1/6 border-r bg-white z-50 p-5"
        >
          {/* Sidebar content goes here */}
          <div className="space-y-5 sticky top-3">
            <div
              className="flex justify-between"
              onClick={() => handleSidebarClick()}
            >
              <div className="flex items-center space-x-1">
                <div className="h-4 w-4 rounded-full bg-green-600"></div>{" "}
                <span className="text-xl font-medium">Nina</span>
              </div>

              {/* <div
                className="hover:bg-stone-100 cursor-pointer rounded-md p-2"
                onClick={() => handleSidebarClick()}
              >
                <img src="/img/sidebar.svg" className="w-5 h-5" />
              </div> */}
            </div>
            {/* <div
              onClick={() => handleAddChat()}
              className="rounded-full px-3 py-2 border hover:bg-stone-50 cursor-pointer text-sm font-medium text-stone-600"
            >
              + New Chat
            </div> */}
          </div>
          <div className="mt-5 px-2 py-1 w-full hover:bg-stone-100 rounded-md cursor-pointer">
            <span className="text-sm  w-full truncate">
              {user && user.email}
            </span>
          </div>
          <div className="fixed bottom-0 left-0 w-[250px]">
            <div className="p-5">
              <Link href="https://tally.so/r/waGA22" target="_blank">
                <div className="px-2 w-full py-1 hover:bg-stone-100 rounded-md cursor-pointer">
                  <span className="text-sm  w-full  truncate font-medium text-stone-600">
                    Leave a message
                  </span>
                </div>
              </Link>

              <div
                onClick={() => handleLogOut()}
                className="px-2 w-full py-1 hover:bg-stone-100 rounded-md cursor-pointer"
              >
                <span className="text-sm  w-full  truncate font-medium text-stone-600">
                  Log out
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg-px-0 px-5">
        <div className="lg:max-w-3xl lg:mx-auto ">
          <ChatComponent />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
