import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./ChatPage.css";

const THEME = {
  primary: "#6B6F1D",
  accent: "#FCE023",
};

const SYSTEM_INSTRUCTIONS = `
You are "SAMS Assistant", a concise, friendly farm management chatbot.
- Default tone: practical, clear, brief, no jagons and helpful.
- Always prefer answers grounded in the user's question and previously provided API outputs.
- If the user asks about tasks, farms, workers, weather, or alerts, give actionable steps.
- If you are unsure, ask a short, focused follow-up.
- Use short paragraphs or lists. Avoid unnecessary fluff.
`;

const STORAGE_KEY = "sams_chat_history_v1";

export default function ChatPage() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [
        {
          role: "assistant",
          text: "Hi! I’m SAMS Assistant. Ask me anything about your farm tasks, alerts, or workers.",
          ts: Date.now(),
        },
      ];
    } catch {
      return [
        {
          role: "assistant",
          text: "Hi! I’m SAMS Assistant. Ask me anything about your farm tasks, alerts, or workers.",
          ts: Date.now(),
        },
      ];
    }
  });

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  // Prefer CRA env, fallback to Vite
  const apiKey = 'AIzaSyBXin8pDJMctEWr5MqcSZpoR1OgiXKpK3o'
  
  // Prepare Gemini client + model
  const genAI = useMemo(() => {
    try {
      if (!apiKey) return null;
      return new GoogleGenerativeAI(apiKey);
    } catch {
      return null;
    }
  }, [apiKey]);

  const chatRef = useRef(null);

  // Persist chat
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Auto scroll to bottom
  useEffect(() => {
    if (!chatRef.current) return;
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, sending]);

  const makeModel = () => {
    if (!genAI) return null;
    try {
      return genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_INSTRUCTIONS,
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const send = async () => {
    const question = input.trim();
    if (!question) return;

    if (!apiKey) {
      Swal.fire("Missing API Key", "Please set your Gemini API key in env.", "warning");
      return;
    }

    setSending(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: question, ts: Date.now() },
    ]);
    setInput("");

    try {
      const model = makeModel();
      if (!model) throw new Error("Gemini model not available");

     
     // Build chat history but skip leading assistant-only messages
     const history = messages
       .filter((m, i) => !(i === 0 && m.role === "assistant"))
       .map((m) => ({
         role: m.role === "assistant" ? "model" : "user",
         parts: [{ text: m.text }],
       }));

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(question);
      const response = await result.response.text();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: response, ts: Date.now() },
      ]);
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Oops",
        err?.message || "Failed to get a response from the chatbot.",
        "error"
      );
    } finally {
      setSending(false);
    }
  };


  const clearChat = async () => {
    const res = await Swal.fire({
      title: "Clear conversation?",
      text: "This will remove the current chat history.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, clear",
      confirmButtonColor: THEME.primary,
      cancelButtonColor: "#999",
    });
    if (res.isConfirmed) {
      setMessages([
        {
          role: "assistant",
          text: "Chat cleared. How can I help you now?",
          ts: Date.now(),
        },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      send();
    }
  };

  return (
    <div className="chat-root">
      <header className="chat-header">
        <div className="chat-title">
          <span className="dot" />
          <h2>SAMS Assistant</h2>
        </div>
        <div className="header-actions">
          <button className="ghost-btn" onClick={clearChat} aria-label="Clear chat">
            Clear
          </button>
        </div>
      </header>

      {!apiKey && (
        <div className="api-warning">
          <strong>Heads up:</strong> No API key found. Add
          <code> REACT_APP_GEMINI_API_KEY</code> (or <code>VITE_GEMINI_API_KEY</code>)
          to your environment to enable responses.
        </div>
      )}

      <div className="chat-body" ref={chatRef}>
        {messages.map((m) => (
          <div
            key={m.ts}
            className={`bubble ${m.role === "assistant" ? "bot" : "user"}`}
          >
            {m.role === "assistant" ? (
              <div className="avatar bot-avatar">🤖</div>
            ) : (
              <div className="avatar user-avatar">🧑</div>
            )}
            <div className="bubble-content">
              <div className="bubble-text">{m.text}</div>
              <div className="bubble-meta">
                {new Date(m.ts).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}

        {sending && (
          <div className="bubble bot">
            <div className="avatar bot-avatar">🤖</div>
            <div className="bubble-content">
              <div className="typing">
                <span className="dot-anim" />
                <span className="dot-anim" />
                <span className="dot-anim" />
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="chat-inputbar">
        <textarea
          placeholder="Ask about tasks, alerts, farms, or workers... (Ctrl/Cmd + Enter to send)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={sending}
        />
        <button
          className="send-btn"
          onClick={send}
          disabled={sending || !input.trim()}
          aria-label="Send message"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </footer>
    </div>
  );
}
