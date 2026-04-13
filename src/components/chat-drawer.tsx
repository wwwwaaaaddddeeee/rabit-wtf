"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { isToolUIPart } from "ai";

export function ChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shadow-lg cursor-pointer active:scale-95 transition-transform duration-150"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Drawer */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-6 z-40 w-[min(380px,calc(100vw-48px))] h-[min(520px,calc(100vh-120px))] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              the rabbit hole
            </h3>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              AI &middot; ask me anything or just talk
            </p>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
          >
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center max-w-[240px] leading-relaxed">
                  Ask me to find something, or just say hi. I don&apos;t
                  bite.
                </p>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${
                    message.role === "user"
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-br-md"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-bl-md"
                  }`}
                >
                  {message.parts.map((part, i) => {
                    if (part.type === "text") {
                      return <span key={i}>{part.text}</span>;
                    }
                    if (isToolUIPart(part)) {
                      if (part.state === "output-available" && part.output) {
                        const results = part.output as {
                          title: string;
                          url: string;
                          domain: string;
                        }[];
                        if (Array.isArray(results) && results.length > 0) {
                          return (
                            <div
                              key={i}
                              className="mt-2 space-y-1.5"
                            >
                              {results.slice(0, 5).map((r, j) => (
                                <a
                                  key={j}
                                  href={r.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-xs bg-white/60 dark:bg-zinc-700/60 rounded-lg px-2.5 py-1.5 hover:bg-white dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                                >
                                  <span className="font-medium text-zinc-800 dark:text-zinc-200 line-clamp-1">
                                    {r.title}
                                  </span>
                                  <span className="text-zinc-400 dark:text-zinc-500 block">
                                    {r.domain}
                                  </span>
                                </a>
                              ))}
                            </div>
                          );
                        }
                      }
                      return null;
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-bl-md px-3.5 py-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="px-3 py-3 border-t border-zinc-100 dark:border-zinc-800"
          >
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Say something..."
                disabled={isLoading}
                className="flex-1 text-[13px] px-3.5 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600 transition-shadow duration-150 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shrink-0 disabled:opacity-30 cursor-pointer transition-opacity duration-150"
                aria-label="Send message"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
