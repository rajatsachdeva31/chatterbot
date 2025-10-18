"use client";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState([
    {
      role: "assistant",
      content: "Hey, this is Alex! How may I help you?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message, loading]);

  const callGetResponse = async () => {
    if (!input.trim()) return; // Don't send empty messages

    setLoading(true);
    const userInput = input.trim();

    // Add user message to the conversation
    setMessage((prevMessages) => [
      ...prevMessages,
      { role: "user", content: userInput },
    ]);
    setInput("");
    console.log("Calling OpenAI...");

    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ message: userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.content);

    setMessage((prevMessages) => [...prevMessages, output]);
    setLoading(false);
  };

  const submit = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (input.trim()) {
        // Only submit if there's actual content
        callGetResponse();
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-24 py-5">
      <h1 className="text-5xl font-sans font-semibold">TechCorp Solutions</h1>

      <div className="flex  h-[35rem] w-[40rem] flex-col items-center bg-gray-500 rounded-xl">
        <div className=" h-full flex flex-col gap-2 overflow-y-auto py-8 px-3 w-full">
          {message.map((e, index) => {
            return (
              <div
                key={`${e.role}-${index}`}
                className={`w-max max-w-[18rem] rounded-md px-4 py-3 h-min ${
                  e.role === "assistant"
                    ? "self-start  bg-gray-200 text-gray-800"
                    : "self-end  bg-gray-800 text-gray-50"
                } `}
              >
                {e.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none text-gray-800">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="mb-2 ml-4 list-disc">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="mb-2 ml-4 list-decimal">{children}</ol>
                        ),
                        li: ({ children }) => (
                          <li className="mb-1">{children}</li>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold">{children}</strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic">{children}</em>
                        ),
                        h1: ({ children }) => (
                          <h1 className="text-lg font-bold mb-2">{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-md font-bold mb-2">{children}</h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-sm font-bold mb-1">{children}</h3>
                        ),
                        code: ({ children }) => (
                          <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {e.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  e.content
                )}
              </div>
            );
          })}
          {loading ? (
            <div className="self-start  bg-gray-200 text-gray-800 w-max max-w-[18rem] rounded-md px-4 py-3 h-min">
              typing...
            </div>
          ) : (
            ""
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="relative  w-[80%] bottom-4 flex justify-center">
          <textarea
            placeholder="Message Alex..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="w-[85%] h-10 px-3 py-2
          resize-none overflow-y-auto text-black bg-gray-100 rounded-l outline-none"
            onKeyDown={submit}
          />
          <button
            onClick={() => input.trim() && callGetResponse()}
            className="w-[15%] bg-gray-800 text-gray-50 px-4 py-2 rounded-r"
          >
            SEND
          </button>
        </div>
      </div>

      <div></div>
    </main>
  );
}
