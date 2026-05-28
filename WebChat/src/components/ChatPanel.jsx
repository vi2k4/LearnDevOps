import { useEffect, useState } from "react";
import { useUserStore } from "../store/useStore";

export default function ChatPanel({
  open,
  onClose,
  selectedConversation: propConversation,
  onOpenConversation,
}) {
  const friends = useUserStore((s) => s.friends || []);
  const startPrivateConversation = useUserStore(
    (s) => s.startPrivateConversation,
  );
  const currentUser = useUserStore((s) => s.user);

  const [selectedConversation, setSelectedConversation] =
    useState(propConversation);

  // when opening the panel without a conversation prop, default to friends list
  useEffect(() => {
    if (open && !propConversation && selectedConversation) {
      const t = setTimeout(() => setSelectedConversation(null), 0);
      return () => clearTimeout(t);
    }
  }, [open, propConversation, selectedConversation]);

  // when propConversation changes, update local selectedConversation (deferred)
  useEffect(() => {
    if (!propConversation) return;
    if (propConversation.id !== selectedConversation?.id) {
      const t = setTimeout(() => setSelectedConversation(propConversation), 0);
      return () => clearTimeout(t);
    }
  }, [propConversation, selectedConversation]);

  function getUserLabel(user) {
    if (!user) return "Unknown user";
    return (
      user.username ||
      user.email ||
      `User #${user.id ?? user.friendId ?? user.userId}`
    );
  }

  function getOtherUser(friendRecord) {
    if (!friendRecord) return null;

    const userSide = friendRecord.user;
    const friendSide = friendRecord.friend;
    const currentUserId = currentUser?.id;

    if (userSide?.id && friendSide?.id) {
      if (String(userSide.id) === String(currentUserId)) return friendSide;
      if (String(friendSide.id) === String(currentUserId)) return userSide;
    }

    return friendSide || userSide || null;
  }

  const acceptedFriends = friends.filter((f) => f.status === "ACCEPTED");

  async function openWithFriend(friend) {
    if (!friend?.id) return;

    try {
      const conv = await startPrivateConversation(friend.id);
      // if backend didn't return a conversation (new or missing), create a minimal one so the frame still opens
      const resolvedConv =
        conv ||
        (selectedConversation && selectedConversation.id
          ? selectedConversation
          : {
              id: `dm-${friend.id}`,
              name:
                friend.username ||
                friend.email ||
                friend.name ||
                "Direct Message",
              meId: useUserStore.getState().user?.id,
              members: [friend],
            });

      // inform parent layout to open the conversation (ChatFrame)
      if (onOpenConversation) onOpenConversation(resolvedConv);
    } catch (err) {
      console.error(err);
      alert("Unable to open conversation");
    }
  }

  if (!open) return null;

  return (
    <div className="w-80 max-h-[60vh] rounded-lg bg-slate-900/95 border border-white/10 shadow-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-slate-100">
          {selectedConversation ? selectedConversation.name : "Chat"}
        </div>
        <button onClick={onClose} className="text-sm text-slate-300">
          ✕
        </button>
      </div>

      <div className="mb-3">
        <div className="text-sm font-semibold text-slate-200 mb-2">Friends</div>
        <ul className="space-y-2 max-h-32 overflow-auto">
          {acceptedFriends.length === 0 && (
            <li className="text-sm text-slate-300">No friends</li>
          )}
          {acceptedFriends.map((f) => {
            const friendUser = getOtherUser(f);

            return (
              <li key={f.id} className="flex items-center justify-between">
                <div className="text-sm text-slate-200">
                  {getUserLabel(friendUser)}
                </div>
                <button
                  onClick={() => openWithFriend(friendUser)}
                  className="px-2 py-1 bg-sky-600 text-white rounded-md text-sm"
                >
                  Chat
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ChatWidget handles messages; this panel only shows friends to start chats */}
    </div>
  );
}
