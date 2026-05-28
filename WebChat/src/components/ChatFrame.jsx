import { useEffect, useRef, useState } from "react";
import { useUserStore } from "../store/useStore";

export default function ChatFrame({
  open,
  selectedConversation,
  messages = [],
  onSend = () => {},
  onClose = () => {},
}) {
  const user = useUserStore((s) => s.user);
  const [text, setText] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    // scroll to bottom when messages change
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, selectedConversation]);

  if (!open) return null;

  function initials(name) {
    if (!name) return "?";
    return name
      .split(" ")
      .map((s) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function handleSend() {
    const trimmed = (text || "").trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  }

  return (
    <div className="w-96 h-[480px] rounded-lg bg-slate-900/95 border border-white/10 shadow-lg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-2 bg-slate-800 border-b border-white/5">
        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold text-white">
          {initials(
            selectedConversation?.name || selectedConversation?.username || "?",
          )}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-slate-100">
            {selectedConversation ? selectedConversation.name : "Chat"}
          </div>
          <div className="text-xs text-slate-400">Online</div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-300 px-2 py-1 rounded hover:bg-white/3"
        >
          ✕
        </button>
      </div>

      {/* Messages list */}
      <div
        ref={listRef}
        className="flex-1 px-3 py-3 overflow-y-auto space-y-3 bg-gradient-to-b from-transparent to-white/2"
      >
        {messages.length === 0 && (
          <div className="text-center text-slate-400">
            No messages yet. Say hi 👋
          </div>
        )}

        {messages.map((m) => {
          const isMine =
            String(m.senderId) === String(user?.id) ||
            String(m.senderId) === String(selectedConversation?.meId);
          return (
            <div
              key={m.id}
              className={`flex items-end ${isMine ? "justify-end" : "justify-start"}`}
            >
              {!isMine && (
                <div className="mr-2">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white">
                    {initials(m.senderUsername || m.senderName)}
                  </div>
                </div>
              )}

              <div
                className={`max-w-[70%] p-2 text-sm ${isMine ? "bg-blue-600 text-white rounded-lg rounded-br-none" : "bg-slate-700 text-slate-100 rounded-lg rounded-bl-none"}`}
              >
                <div className="text-xs text-slate-300 mb-1">
                  {!isMine ? m.senderUsername || m.senderName : "You"}
                </div>
                <div>{m.content}</div>
                <div className="text-xs text-slate-400 mt-1 text-right">
                  {m.createdAt
                    ? new Date(m.createdAt).toLocaleTimeString()
                    : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input bar */}
      <div className="px-3 py-3 bg-slate-800 border-t border-white/5 flex items-center gap-3">
        <button className="text-slate-300 p-2 rounded-full hover:bg-white/3">
          😊
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 rounded-full px-4 py-2 bg-slate-700 text-slate-100 focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}
