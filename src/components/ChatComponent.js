import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import TextareaAutosize from "react-textarea-autosize";
import rehypeRaw from "rehype-raw";
import axios from "axios";
import { userInformationAtom } from "@/app/jotai/user/atoms";
import { useAtom } from "jotai";
import { ErrorBoundary } from 'react-error-boundary';
import remarkGfm from "remark-gfm";

function ChatComponent({ user }) {
  const [text, setText] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const [userInformation] = useAtom(userInformationAtom);

  async function handleFetchChatMessages() {}

  function mergeSelectionMessages(messages) {
    const mergedMessages = [];
    let i = 0;
    while (i < messages.length) {
      if (messages[i].sender === "selection") {
        // Find the next user message
        let j = i + 1;
        while (j < messages.length && messages[j].sender !== "user") {
          j++;
        }

        // Merge content if found
        if (j < messages.length) {
          const mergedContent =
            messages[j].content + " : " + messages[i].content;
          mergedMessages.push({ sender: "user", content: mergedContent });
          i = j + 1; // Skip the user message since it's merged
        } else {
          mergedMessages.push(messages[i]); // Add the selection message if no user found
          i++;
        }
      } else {
        mergedMessages.push(messages[i]); // Add non-selection messages directly
        i++;
      }
    }
    return mergedMessages;
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleChat = useCallback(async () => {
    if (text.trim() !== "") {
      const newUserMessage = { sender: "user", content: text };
      setChatMessages((prevMessages) => [...prevMessages, newUserMessage]);
      const prompt = text;
      const mergedChatMessages = mergeSelectionMessages([
        ...chatMessages,
        newUserMessage,
      ]);

      setText("");

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt,
            history: mergedChatMessages,
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let assistantMessage = "";

        // Add a new bot message to the state
        setChatMessages((prev) => [...prev, { sender: "bot", content: "" }]);

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            assistantMessage += decoder.decode(value);
            const messageSegments = assistantMessage
              .split("\n")
              .filter(Boolean);
            const messages = messageSegments
              .map((segment) => {
                const [index, content] = segment.split(":");
                return content.replace(/^"/, "").replace(/"$/, "");
              })
              .join("");

            // Update the last bot message with the new content
            setChatMessages((prev) => {
              const lastIndex = prev.length - 1;
              const updatedMessages = [...prev];
              updatedMessages[lastIndex] = { sender: "bot", content: messages };
              return updatedMessages;
            });

            console.log(chatMessages);
          }
        }
      } catch (error) {
        console.error("Error in streaming chat response:", error);
        setChatMessages((prev) => [
          ...prev,
          { sender: "bot", content: "Sorry, an error occurred. Please try again." }
        ]);
      }
    }
  }, [text, chatMessages]);

  const handleChatRag = useCallback(async () => {
    if (text.trim() !== "") {
      const newUserMessage = { sender: "user", content: text };

      // Create a local copy of chat history
      const updatedChatMessages = [...chatMessages, newUserMessage];
      setChatMessages(updatedChatMessages); // Update state

      console.log(updatedChatMessages);

      // const userInfo = userInformation;

      // console.log(requestBody);

      try {
        console.log("calling chat endpoint...");
        setChatLoading(true);
        const requestBody = {
          user_info: userInformation,
          chat_history: updatedChatMessages.map((entry) => ({
            role: entry.role || "user", // Default to "user" if role is not provided
            content: entry.content,
          })),
        };

        const response = await axios.post(
          "https://nina-render.onrender.com/chat/",
          requestBody,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (response) {
          // console.log(response.data.content);

          const text = response.data.content;

          setChatMessages((prev) => [
            ...prev,
            { sender: "bot", content: text },
          ]);
          // console.log("response from chat rag: ", response);
          setChatLoading(false);
        }
      } catch (error) {
        console.error("Error in chat RAG response:", error);
        setChatMessages((prev) => [
          ...prev,
          { sender: "bot", content: "Sorry, an error occurred. Please try again." }
        ]);
      } finally {
        setChatLoading(false);
      }
      setText(""); // Clear input text
    }
  }, [text, chatMessages, userInformation]);

  async function handleChatNoStream() {
    if (text.trim() !== "") {
      const newUserMessage = { sender: "user", content: text };
      setChatMessages((prevMessages) => [...prevMessages, newUserMessage]);
      setText("");

      try {
        const response = await fetch("/api/chat-no-stream", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: text,
            history: chatMessages.concat(newUserMessage),
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        console.log(response.body);

        // Add bot's messages to the chat
        // setChatMessages((prevMessages) => [
        //   ...prevMessages,
        //   ...messages.map((msg) => ({ sender: "bot", content: msg })),
        // ]);
      } catch (error) {
        console.error("Error in streaming chat response:", error);
      }
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents the addition of a new line
      handleChatRag();
    }
  };

  const handleFirstChatKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents the addition of a new line
      handleChat();
    }
  };

  if (chatMessages.length > 0)
    return (
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // Reset the state of your app so the error doesn't happen again
          setChatMessages([]);
          setText("");
        }}
      >
        <div className="w-full" ref={chatContainerRef}>
          <div className="chat-messages space-y-3 overflow-auto h-full pb-48 pt-10">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className="space-y-3">
                {msg.sender === "user" ? (
                  <div>
                    <p className=" text-3xl">{msg.content}</p>
                  </div>
                ) : (
                  <div className="space-y-2 border-b pb-5 mb-5">
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 rounded-full bg-green-600"></div>{" "}
                      <span>Answer</span>
                    </div>
                    <div>
                      {/* <ReactMarkdown>{msg.content}</ReactMarkdown> */}
                      <ReactMarkdown
                        className="prose w-full max-w-screen-lg break-words pr-5 text-sm dark:prose-invert prose-p:leading-relaxed"
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: (props) => (
                            <a
                              {...props}
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {chatLoading && (
              <div>
                <span className="text-stone-500">NINA is thinking...</span>
              </div>
            )}
          </div>

          <div className="fixed w-full left-0 bottom-0 bg-white z-40 lg:hidden block">
            <div className="p-5 ">
              <div className="px-3 py-2 border rounded-full flex justify-center items-center shadow-md">
                <input
                  className="w-full outline-none"
                  placeholder="Ask anything..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <div
                  className="cursor-pointer flex justify-center items-center bg-green-600 rounded-full p-3 hover:opacity-85"
                  onClick={handleChat}
                >
                  <img src="/img/send.svg" className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>

          <div className="fixed w-full bottom-0 max-w-3xl bg-white z-40 lg:block hidden">
            <div className="py-5">
              <div className="px-3 py-2 border rounded-full flex justify-center items-center shadow-md">
                <input
                  className="w-full outline-none"
                  placeholder="Ask anything..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <div
                  className="cursor-pointer flex justify-center items-center bg-green-600 rounded-full p-3 hover:opacity-85"
                  onClick={handleChat}
                >
                  <img src="/img/send.svg" className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app so the error doesn't happen again
        setChatMessages([]);
        setText("");
      }}
    >
      <div className="pt-48 space-y-5 w-full">
        <div className="flex justify-center text-center lg: px-10 px-0">
          <p className="text-3xl font-medium">
            Ask your personal health expert anything.
          </p>
        </div>
        <div className="p-5 border rounded-xl space-y-10 shadow-xl">
          <div>
            <TextareaAutosize
              className=" w-full outline-none"
              placeholder="Ask anything..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="flex justify-end items-center">
            <div
              className="h-10 w-10 flex justify-center items-center bg-green-600 rounded-full p-3 hover:opacity-85"
              onClick={handleChat}
            >
              <img src="/img/send.svg" className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

export default ChatComponent;