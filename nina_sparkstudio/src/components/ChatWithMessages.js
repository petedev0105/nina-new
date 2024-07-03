import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useState } from "react";

function ChatWithMessages() {
  const [text, setText] = useState("");
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents the addition of a new line
      console.log(text); // Replace this with your function
      setText("");
    }
  };
  return (
    <div className="pt-12">
      <div className="space-y-3 py-5 border-b">
        <div>
          <p className="font-medium text-2xl">
            What should I eat before a basketball game with $24?
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded-full bg-green-600"></div>{" "}
            <span>Answer</span>
          </div>
          <div>
            <span>A banana bro lmfaooo.</span>
          </div>
        </div>
      </div>
      <div className="space-y-3 py-5 border-b">
        <div>
          <p className="font-medium text-2xl">
            What should I eat before a basketball game with $24?
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded-full bg-green-600"></div>{" "}
            <span>Answer</span>
          </div>
          <div>
            <span>A banana bro lmfaooo.</span>
          </div>
        </div>
      </div>
      <div className="space-y-3 py-5 border-b">
        <div>
          <p className="font-medium text-2xl">
            What should I eat before a basketball game with $24?
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded-full bg-green-600"></div>{" "}
            <span>Answer</span>
          </div>
          <div>
            <span>A banana bro lmfaooo.</span>
          </div>
        </div>
      </div>

      <div className="fixed w-full left-0 bottom-5 bg-white z-40">
        <div className="p-5">
          <div className="px-3 py-2 border rounded-full flex justify-center items-center shadow-md">
            <input
              className="w-full outline-none"
              placeholder="Ask anything..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <div className="flex justify-center items-center bg-green-600 rounded-full p-3 hover:opacity-85">
              <img src="/img/send.svg" className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatWithMessages;
