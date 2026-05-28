import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useStore";
import { useState, useEffect } from "react";
import { notificationApi, messageApi } from "../services/backendApi";
import ChatPanel from "./ChatPanel";
import ChatFrame from "./ChatFrame";
import { useConversationSocket } from "../hooks/useConversationSocket";

function mergeMessages(existing = [], incoming = []) {
  const seen = new Set();
  const merged = [];

  [...existing, ...incoming].forEach((message) => {
    if (!message) return;
    const key =
      message.id ??
      `${message.senderId}-${message.createdAt}-${message.content}`;

    if (seen.has(key)) return;

    seen.add(key);
    merged.push(message);
  });

  return merged;
}

export default function Layout() {
  const user = useUserStore((s) => s.user);
  const loadFriends = useUserStore((s) => s.loadFriends);
  const logout = useUserStore((s) => s.logout);
  const navigate = useNavigate();
  const displayName = user?.username || user?.name || user?.email || "Guest";
  const [showNotifications, setShowNotifications] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatFrameOpen, setChatFrameOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  // conversations list no longer shown in dropdown; ChatPanel handles friends
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [convMessages, setConvMessages] = useState([]);
  const { sendMessage: sendChatMessage } = useConversationSocket(
    selectedConversation?.id,
    (incomingMessage) => {
      setConvMessages((current) => mergeMessages(current, [incomingMessage]));
    },
  );

  useEffect(() => {
    if (showNotifications && user?.id) {
      notificationApi
        .byUser(user.id)
        .then((list) => setNotifications(list || []))
        .catch((err) => console.error(err));
    }
  }, [showNotifications, user]);

  useEffect(() => {
    if (!user?.id) return;

    loadFriends().catch((err) => console.error(err));
  }, [user?.id, loadFriends]);

  // load messages when selectedConversation changes
  useEffect(() => {
    if (!selectedConversation?.id) {
      const t = setTimeout(() => setConvMessages([]), 0);
      return () => clearTimeout(t);
    }

    const clearTimer = setTimeout(() => setConvMessages([]), 0);
    let mounted = true;
    messageApi
      .byConversation(selectedConversation.id)
      .then(
        (list) =>
          mounted &&
          setConvMessages((current) => mergeMessages(current, list || [])),
      )
      .catch((err) => console.error(err));

    return () => {
      mounted = false;
      clearTimeout(clearTimer);
    };
  }, [selectedConversation]);

  async function handleSendMessage(text) {
    if (!selectedConversation?.id || !text) return;

    const payload = {
      senderId: user.id,
      conversationId: selectedConversation.id,
      content: text,
      type: "TEXT",
      isDeleted: false,
      isEdited: false,
    };

    try {
      const published = sendChatMessage(payload);

      if (!published) {
        const created = await messageApi.create(payload);
        setConvMessages((current) => mergeMessages(current, [created]));
      }
    } catch (err) {
      console.error(err);
      alert("Unable to send message");
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.1),_transparent_28%),linear-gradient(180deg,_#07111f_0%,_#0b1f2e_55%,_#10253a_100%)] text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/55 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-semibold text-cyan-300">
              ChatEveryWhere
            </h1>
            <nav className="hidden md:flex items-center gap-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-cyan-300 font-medium"
                    : "text-slate-300 hover:text-cyan-300"
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/friends"
                className={({ isActive }) =>
                  isActive
                    ? "text-cyan-300 font-medium"
                    : "text-slate-300 hover:text-cyan-300"
                }
              >
                Friends
              </NavLink>
              <NavLink
                to="/groups"
                className={({ isActive }) =>
                  isActive
                    ? "text-cyan-300 font-medium"
                    : "text-slate-300 hover:text-cyan-300"
                }
              >
                Groups
              </NavLink>
              <NavLink
                to="/websocket-test"
                className={({ isActive }) =>
                  isActive
                    ? "text-cyan-300 font-medium"
                    : "text-slate-300 hover:text-cyan-300"
                }
              >
                WebSocket Test
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-3 relative">
            {/* Notifications icon */}
            <button
              onClick={() => {
                setShowNotifications((s) => !s);
              }}
              aria-label="Notifications"
              className="p-2 rounded-md hover:bg-white/5"
            >
              <svg
                className="w-5 h-5 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            {/* Messages icon: open chat panel */}
            <button
              onClick={() => {
                // toggle the chat panel (friends list). Opening panel closes chat frame.
                setChatOpen((s) => !s);
                setChatFrameOpen(false);
                setShowNotifications(false);
              }}
              aria-label="Messages"
              className="p-2 rounded-md hover:bg-white/5"
            >
              <svg
                className="w-5 h-5 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.21 0-2.36-.18-3.43-.52L3 20l1.52-4.57C3.96 14.3 3 13.19 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>

            <span className="text-sm text-slate-300">{displayName}</span>
            <button
              onClick={handleLogout}
              className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-sm text-emerald-100 transition hover:bg-emerald-500/25"
            >
              Logout
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-3 w-80 rounded-lg bg-slate-900/95 border border-white/10 shadow-lg p-3 z-50">
                <div className="text-sm font-semibold text-slate-200 mb-2">
                  Notifications
                </div>
                <ul className="space-y-2 max-h-56 overflow-auto">
                  {notifications.length === 0 && (
                    <li className="text-sm text-slate-300">
                      No notifications yet
                    </li>
                  )}
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className="text-sm text-slate-300 border-b pb-2"
                    >
                      <div className="font-medium">
                        {n.title || "Notification"}
                      </div>
                      <div className="text-xs text-slate-400">
                        {n.message || n.content}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Messages dropdown removed in favor of chat panel */}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 p-6">
        <Outlet />
      </main>

      {/* Chat panel (rendered near header) */}
      <div className="absolute right-16 top-[72px] z-50">
        <ChatPanel
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          selectedConversation={selectedConversation}
          onOpenConversation={(conv) => {
            // when a friend is selected, close the panel and open the chat frame
            setSelectedConversation(conv);
            setChatOpen(false);
            setChatFrameOpen(true);
          }}
        />
      </div>

      {/* Bottom-right chat frame shown after selecting a friend in ChatPanel */}
      <div className="fixed right-6 bottom-6 z-40">
        <ChatFrame
          open={chatFrameOpen && !!selectedConversation}
          selectedConversation={selectedConversation}
          messages={convMessages}
          onSend={(text) => handleSendMessage(text)}
          onClose={() => setChatFrameOpen(false)}
        />
      </div>
    </div>
  );
}
