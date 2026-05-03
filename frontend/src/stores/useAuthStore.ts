import { create } from "zustand";
import { type AxiosError } from "axios";
import type { ApiError } from "@/types";
import { axiosInstance } from "@/lib/axios";

interface authStoreProps {
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  checkAdmin: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<authStoreProps>((set) => ({
  isAdmin: false,
  isLoading: false,
  error: null,

  checkAdmin: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get<{ admin: boolean }>(
        "/admin/check-admin",
      );
      set({ isAdmin: res.data.admin });
    } catch (error) {
      set({ isAdmin: false });
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

  reset: () => {
    set({ isAdmin: false, isLoading: false, error: null });
  },
}));
