import { create } from "zustand";
import {
  authApi,
  authStorage,
  conversationApi,
  friendApi,
  messageApi,
  conversationMemberApi,
} from "../services/backendApi";

const authState = authStorage.load();

const normalizeUser = (user) =>
  user ? { ...user, name: user.username } : null;

export const useUserStore = create((set, get) => ({
  user: normalizeUser(authState.user),
  token: authState.token || null,
  friends: [],
  groups: [],
  messages: {},

  hydrateAuth: () => {
    const stored = authStorage.load();
    set({ user: normalizeUser(stored.user), token: stored.token || null });
    return stored;
  },

  register: async ({ username, email, password, avatar }) => {
    const response = await authApi.register({
      username,
      email,
      password,
      avatar,
    });
    const nextUser = normalizeUser(response.user);
    const nextToken = response.token || null;

    authStorage.save({ user: nextUser, token: nextToken });
    set({
      user: nextUser,
      token: nextToken,
      friends: [],
      groups: [],
      messages: {},
    });

    return response;
  },

  login: async ({ email, password }) => {
    const response = await authApi.login({ email, password });
    const nextUser = normalizeUser(response.user);
    const nextToken = response.token || null;

    authStorage.save({ user: nextUser, token: nextToken });
    set({
      user: nextUser,
      token: nextToken,
      friends: [],
      groups: [],
      messages: {},
    });

    return response;
  },

  logout: () => {
    authStorage.clear();
    set({ user: null, token: null, friends: [], groups: [], messages: {} });
  },

  loadFriends: async () => {
    const user = get().user;

    if (!user?.id) {
      set({ friends: [] });
      return [];
    }

    // backend only exposes findByUserId; fetch all and filter both directions
    const all = await friendApi.list();
    const friends = (all || []).filter(
      (f) => f?.user?.id === user.id || f?.friend?.id === user.id,
    );
    set({ friends });
    return friends;
  },

  addFriend: async ({ friendId, status = "PENDING" }) => {
    const user = get().user;

    if (!user?.id) {
      throw new Error("You must be logged in to add a friend.");
    }

    const created = await friendApi.create({
      user: { id: user.id },
      friend: { id: friendId },
      status,
      createdAt: new Date().toISOString(),
    });

    set((state) => ({ friends: [created, ...state.friends] }));
    return created;
  },

  acceptFriend: async (friendRecordId) => {
    const record = await friendApi.get(friendRecordId);
    if (!record) throw new Error("Friend record not found");
    const updated = await friendApi.update(friendRecordId, {
      ...record,
      status: "ACCEPTED",
    });
    await get().loadFriends();
    return updated;
  },

  declineFriend: async (friendRecordId) => {
    await friendApi.remove(friendRecordId);
    await get().loadFriends();
    return true;
  },

  loadGroups: async () => {
    const groups = await conversationApi.list();
    set({ groups });
    return groups;
  },

  createGroup: async ({ name, type = "GROUP" }) => {
    const created = await conversationApi.create({ name, type });
    set((state) => ({ groups: [created, ...state.groups] }));
    return created;
  },

  startPrivateConversation: async (otherUserId) => {
    const user = get().user;
    if (!user?.id)
      throw new Error("You must be logged in to start a conversation.");

    const [allConversations, allMemberships] = await Promise.all([
      conversationApi.list(),
      conversationMemberApi.list(),
    ]);

    const existingConversation = (allConversations || []).find(
      (conversation) => {
        if (conversation?.type !== "PRIVATE") return false;

        const conversationMembers = (allMemberships || []).filter(
          (member) =>
            String(member?.conversation?.id) === String(conversation?.id),
        );

        const hasCurrentUser = conversationMembers.some(
          (member) => String(member?.user?.id) === String(user.id),
        );
        const hasOtherUser = conversationMembers.some(
          (member) => String(member?.user?.id) === String(otherUserId),
        );

        return hasCurrentUser && hasOtherUser;
      },
    );

    if (existingConversation) {
      set((state) => {
        const alreadyPresent = (state.groups || []).some(
          (group) => String(group?.id) === String(existingConversation.id),
        );

        return alreadyPresent
          ? state
          : { groups: [existingConversation, ...state.groups] };
      });

      return existingConversation;
    }

    // create conversation only if no DM exists yet
    const conversation = await conversationApi.create({
      name: `DM ${user.id}-${otherUserId}`,
      type: "PRIVATE",
    });

    // add current user as member
    await conversationMemberApi.create({
      conversation: { id: conversation.id },
      user: { id: user.id },
      joinedAt: new Date().toISOString(),
    });

    // add other user as member
    await conversationMemberApi.create({
      conversation: { id: conversation.id },
      user: { id: otherUserId },
      joinedAt: new Date().toISOString(),
    });

    set((state) => ({ groups: [conversation, ...state.groups] }));
    return conversation;
  },

  loadMessages: async (conversationId) => {
    const list = await messageApi.byConversation(conversationId);
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: list,
      },
    }));
    return list;
  },

  sendMessage: async (conversationId, content) => {
    const user = get().user;

    if (!user?.id) {
      throw new Error("You must be logged in to send a message.");
    }

    const created = await messageApi.create({
      senderId: user.id,
      conversationId,
      content,
      type: "TEXT",
      isDeleted: false,
      isEdited: false,
    });

    set((state) => {
      const current = state.messages[conversationId] || [];

      return {
        messages: {
          ...state.messages,
          [conversationId]: [...current, created],
        },
      };
    });

    return created;
  },
}));
