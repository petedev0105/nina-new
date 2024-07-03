"use client";
import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "./ui/button";
import { useState, useRef, useEffect } from "react";
import ChatWithMessages from "./ChatWithMessages";

function Dashboard() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [text, setText] = useState('');
  const sidebarRef = useRef();

  function handleSidebarClick() {
    setShowSidebar(!showSidebar);
  }

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setShowSidebar(false);
    }
  };

  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      event.preventDefault(); // Prevents the addition of a new line
      console.log(text); // Replace this with your function
      setText("");
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-5">
      {showSidebar && (
        <div
          ref={sidebarRef}
          className="fixed top-0 left-0 h-full w-4/5 border-r bg-white z-50 shadow-md"
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
              <img src="/img/sidebar.svg" className="w-5 h-5" />
            </div>
            <div className="rounded-full px-3 py-2 border">+ New Chat</div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center sticky top-5">
        <div className="" onClick={() => handleSidebarClick()}>
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
      {/* <div className="flex justify-center pt-48">
        <div className="text-center">
          <span className="font-medium text-2xl">
            Ask your personal nutrition <br /> expert anything
          </span>
        </div>
      </div> */}
      {/* <div className="flex justify-center pt-5">
        <div className="border rounded-md w-full p-5 space-y-5">
          <TextareaAutosize
            className="w-full outline-none"
            placeholder="Ask anything..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div className="flex justify-end">
            <div className="flex justify-center items-center bg-green-600 rounded-full p-3 hover:opacity-85">
              <img src="/img/send.svg" className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div> */}
      <ChatWithMessages />
    </div>
  );
}

export default Dashboard;
