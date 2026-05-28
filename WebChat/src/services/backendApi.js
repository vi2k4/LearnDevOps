import axios from "axios";
import { load, save } from "./storage";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const AUTH_STORAGE_KEY = "webchat_auth_v1";

export const authStorage = {
  load() {
    return load(AUTH_STORAGE_KEY, { user: null, token: null });
  },

  save(auth) {
    save(AUTH_STORAGE_KEY, auth);
  },

  clear() {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      return;
    }
  },
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const authApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const { token } = authStorage.load();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

async function request(path, options = {}) {
  const response = await api.request({
    url: path,
    method: options.method || "get",
    data: options.data,
    params: options.params,
  });

  return response.data;
}

async function authRequest(path, options = {}) {
  const response = await authApiClient.request({
    url: path,
    method: options.method || "get",
    data: options.data,
    params: options.params,
  });

  return response.data;
}

function createCrudApi(basePath) {
  return {
    list: () => request(basePath),
    get: (id) => request(`${basePath}/${id}`),
    create: (data) => request(basePath, { method: "post", data }),
    update: (id, data) => request(`${basePath}/${id}`, { method: "put", data }),
    remove: (id) => request(`${basePath}/${id}`, { method: "delete" }),
  };
}

export const authApi = {
  register: (payload) =>
    authRequest("/auth/register", { method: "post", data: payload }),
  login: (payload) =>
    authRequest("/auth/login", { method: "post", data: payload }),
  me: () => request("/users/me"),
};

export const userApi = {
  list: () => request("/users"),
  get: (id) => request(`/users/${id}`),
};

export const conversationApi = createCrudApi("/conversations");

export const messageApi = {
  ...createCrudApi("/messages"),
  byConversation: (conversationId) =>
    request(`/messages/conversation/${conversationId}`),
  bySender: (senderId) => request(`/messages/sender/${senderId}`),
};
export const friendApi = {
  ...createCrudApi("/friends"),
  byUser: (userId) => request(`/friends/user/${userId}`),
};
export const conversationMemberApi = createCrudApi("/conversation-members");

export const mediaApi = createCrudApi("/media");

export const notificationApi = {
  ...createCrudApi("/notifications"),
  byUser: (userId) => request(`/notifications/user/${userId}`),
};
export const userBlockApi = createCrudApi("/user-blocks");

export const reportApi = createCrudApi("/reports");

export const websocketConfig = {
  socketUrl: `${API_BASE_URL.replace(/\/$/, "")}/ws`,
  sendDestination: "/app/chat",
  topic: "/topic/messages",
  conversationTopic: (conversationId) =>
    `/topic/conversations/${conversationId}`,
};
