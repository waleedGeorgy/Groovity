import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import type { AxiosError } from "axios";
import { axiosInstance } from "@/lib/axios";
import type { ApiError, ApiResponse, Message, User } from "@/types";

interface chatStoreProps {
  users: User[];
  isLoading: boolean;
  error: string | null;
  socket: Socket | null;
  isUserConnected: boolean;
  onlineUsers: Set<string>;
  usersActivity: Map<string, string>;
  messages: Message[];
  isMessagesLoading: boolean;
  selectedUser: User | null;
  getAllUsers: () => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  connectSocket: (userId: string) => void;
  disconnectSocket: () => void;
  sendMessage: (senderID: string, receiverID: string, contents: string) => void;
  fetchMessages: (userId: string) => Promise<void>;
}

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

const socket = io(BASE_URL, {
  autoConnect: false,
  withCredentials: true,
});

export const useChatStore = create<chatStoreProps>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  socket: socket,
  isUserConnected: false,
  onlineUsers: new Set(),
  usersActivity: new Map(),
  messages: [],
  isMessagesLoading: false,
  selectedUser: null,

  getAllUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get<ApiResponse<User[]>>("/users");
      if (res.data.success) set({ users: res.data.data });

    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      if (axiosError.response?.data?.message) {
        set({ error: axiosError.response.data.message });
      } else if (axiosError.message) {
        set({ error: axiosError.message });
      } else {
        set({ error: "An unknown error occurred" });
      }
    } finally {
      set({ isLoading: false });
    }
  },
  connectSocket: (userId) => {
    if (!get().isUserConnected) {
      socket.auth = { userId };

      socket.connect();

      socket.emit("user_connected", userId);

      socket.on("online_users", (users: string[]) => {
        set({ onlineUsers: new Set(users) });
      });

      socket.on("user_activities", (activities: [string, string][]) => {
        set({ usersActivity: new Map(activities) });
      });

      socket.on("user_connected", (userId: string) => {
        set((state) => ({
          onlineUsers: new Set([...state.onlineUsers, userId]),
        }));
      });

      socket.on("user_disconnected", (userId: string) => {
        set((state) => {
          const newOnlineUsers = new Set(state.onlineUsers);
          newOnlineUsers.delete(userId);
          return { onlineUsers: newOnlineUsers };
        });
      });

      socket.on("receive_message", (newMessage: Message) => {
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      });

      socket.on("message_sent", (newMessage: Message) => {
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      });

      socket.on(
        "activity_updated",
        ({ userId, activity }: { userId: string; activity: string }) => {
          set((state) => {
            const newActivities = new Map(state.usersActivity);
            newActivities.set(userId, activity);
            return { usersActivity: newActivities };
          });
        },
      );

      set({ isUserConnected: true });
    }
  },

  disconnectSocket: () => {
    if (get().isUserConnected) {
      socket.disconnect();
      set({ isUserConnected: false });
    }
  },

  sendMessage: (senderID, receiverID, contents) => {
    if (!get().socket) return;

    socket.emit("send_message", { senderID, receiverID, contents });
  },

  fetchMessages: async (userId) => {
    set({ isMessagesLoading: true, error: null });
    try {
      const response = await axiosInstance.get<Message[]>(
        `/users/messages/${userId}`,
      );
      set({ messages: response.data });
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      if (axiosError.response?.data?.message) {
        set({ error: axiosError.response.data.message });
      } else if (axiosError.message) {
        set({ error: axiosError.message });
      } else {
        set({ error: "An unknown error occurred" });
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  setSelectedUser(user) {
    set({ selectedUser: user });
  },
}));
