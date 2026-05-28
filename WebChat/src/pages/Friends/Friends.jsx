import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useStore";
import { userApi } from "../../services/backendApi";

export default function Friends() {
  const addFriend = useUserStore((s) => s.addFriend);
  const startPrivateConversation = useUserStore(
    (s) => s.startPrivateConversation,
  );
  const loadFriends = useUserStore((s) => s.loadFriends);
  const friends = useUserStore((s) => s.friends);
  const currentUser = useUserStore((s) => s.user);
  const [friendId, setFriendId] = useState("");
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const acceptFriend = useUserStore((s) => s.acceptFriend);
  const declineFriend = useUserStore((s) => s.declineFriend);

  function getUserLabel(user) {
    if (!user) return "Unknown user";
    return user.username || user.email || `User #${user.id ?? user.friendId ?? user.userId}`;
  }

  function getOtherUser(friendRecord) {
    if (!friendRecord) return null;

    const currentUserId = currentUser?.id;
    const userSide = friendRecord.user;
    const friendSide = friendRecord.friend;

    if (userSide?.id && friendSide?.id) {
      if (String(userSide.id) === String(currentUserId)) return friendSide;
      if (String(friendSide.id) === String(currentUserId)) return userSide;
    }

    return friendSide || userSide || null;
  }

  useEffect(() => {
    loadFriends().catch((error) => console.error(error));
  }, [loadFriends]);

  useEffect(() => {
    userApi
      .list()
      .then((list) => setUsers(list || []))
      .catch((err) => console.error(err));
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!friendId) return;

    try {
      await addFriend({ friendId: Number(friendId) });
      setFriendId("");
      await loadFriends();
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          error.message ||
          "Unable to add friend",
      );
    }
  }

  const incoming = friends.filter(
    (f) => f.friend?.id === currentUser?.id && f.status === "PENDING",
  );
  const accepted = friends.filter((f) => f.status === "ACCEPTED");
  const outgoing = friends.filter(
    (f) => f.user?.id === currentUser?.id && f.status === "PENDING",
  );

  const [tab, setTab] = useState("suggested");

  function renderTabContent() {
    if (tab === "suggested") {
      return (
        <section>
          <h3 className="mb-2 text-sm font-semibold text-black">
            All users (Suggestions)
          </h3>
          <ul className="mt-2 divide-y">
            {users.map((u) => {
              const isMe = currentUser && u.id === currentUser.id;
              const isFriend = friends.some(
                (f) =>
                  (f.friend && f.friend.id === u.id) ||
                  (f.user && f.user.id === u.id),
              );

              return (
                <li
                  key={u.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-black">
                      {u.username || u.email}
                      {isMe ? " (you)" : ""}
                    </div>
                    <div className="text-sm text-black">{u.email}</div>
                  </div>
                  <div className="actions flex items-center gap-2">
                    {!isMe && !isFriend && (
                      <button
                        onClick={async () => {
                          await addFriend({ friendId: u.id });
                          await loadFriends();
                        }}
                        className="px-3 py-1 bg-emerald-500 text-white rounded-md text-sm"
                      >
                        Add
                      </button>
                    )}

                    {!isMe && isFriend && (
                      <button
                        onClick={async () => {
                          const conv = await startPrivateConversation(u.id);
                          navigate(`/chat/conversation/${conv.id}`);
                        }}
                        className="px-3 py-1 bg-sky-600 text-white rounded-md text-sm"
                      >
                        Chat
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      );
    }

    if (tab === "friends") {
      return (
        <section>
          <h3 className="mb-2 text-sm font-semibold text-black">
            Your friends
          </h3>
          <ul className="divide-y">
            {accepted.length === 0 && (
              <li className="py-2 text-sm text-black">
                You have no friends yet.
              </li>
            )}
            {accepted.map((f) => (
              <li key={f.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    {getUserLabel(getOtherUser(f))}
                  </div>
                  <div className="text-sm text-black">status: {f.status}</div>
                </div>
                <div>
                  <button
                    onClick={() =>
                      startPrivateConversation(getOtherUser(f)?.id).then((c) =>
                        navigate(`/chat/conversation/${c.id}`),
                      )
                    }
                    className="px-3 py-1 bg-sky-600 text-white rounded-md text-sm"
                  >
                    Chat
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      );
    }

    // requests: show outgoing (sent) and incoming
    return (
      <section>
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-semibold text-black">
            Lời mời đã gửi
          </h3>
          <ul className="divide-y">
            {outgoing.length === 0 && (
              <li className="py-2 text-sm text-black">
                Bạn chưa gửi lời mời nào
              </li>
            )}
            {outgoing.map((r) => (
              <li key={r.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    {getUserLabel(r.friend)}
                  </div>
                  <div className="text-sm text-black">
                    Sent at: {new Date(r.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      try {
                        await declineFriend(r.id);
                      } catch (err) {
                        console.error(err);
                        alert("Unable to cancel request");
                      }
                    }}
                    className="px-3 py-1 bg-rose-500 text-white rounded-md text-sm"
                  >
                    Hủy
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-black">Lời mời đến</h3>
          <ul className="divide-y">
            {incoming.length === 0 && (
              <li className="py-2 text-sm text-black">No incoming requests</li>
            )}
            {incoming.map((r) => (
              <li key={r.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    {getUserLabel(r.user)}
                  </div>
                  <div className="text-sm text-black">
                    Requested at: {new Date(r.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      await acceptFriend(r.id);
                    }}
                    className="px-3 py-1 bg-emerald-500 text-white rounded-md text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={async () => {
                      await declineFriend(r.id);
                    }}
                    className="px-3 py-1 bg-rose-500 text-white rounded-md text-sm"
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold">Friends & People</h2>
      <form onSubmit={handleAdd} className="mt-3 flex gap-2">
        <input
          className="w-full border rounded-md px-3 py-2"
          placeholder="Friend user ID"
          value={friendId}
          onChange={(e) => setFriendId(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          type="submit"
        >
          Add
        </button>
      </form>

      <div className="mt-6">
        <div className="flex gap-2 border-b pb-3 mb-4">
          <button
            onClick={() => setTab("suggested")}
            className={`px-3 py-1 ${tab === "suggested" ? "bg-sky-600 text-white rounded" : "text-sky-600"}`}
          >
            Gợi ý
          </button>
          <button
            onClick={() => setTab("friends")}
            className={`px-3 py-1 ${tab === "friends" ? "bg-sky-600 text-white rounded" : "text-sky-600"}`}
          >
            Bạn bè
          </button>
          <button
            onClick={() => setTab("requests")}
            className={`px-3 py-1 ${tab === "requests" ? "bg-sky-600 text-white rounded" : "text-sky-600"}`}
          >
            Lời mời
          </button>
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
}
