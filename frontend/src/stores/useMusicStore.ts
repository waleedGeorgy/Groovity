import { AxiosError } from "axios";
import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import {
  type ApiResponse,
  type Album,
  type ApiError,
  type Song,
  type Stats,
} from "@/types";
import { createToast } from "@/functions";

interface MusicStoreProps {
  songs: Song[];
  isAllSongsLoading: boolean;
  personalizedSongs: Song[];
  featuredSongs: Song[];
  trendingSongs: Song[];
  albums: Album[];
  isAlbumsLoading: boolean;
  currentAlbum: Album | null;
  isLoading: boolean;
  isDeleting: boolean;
  error: string | null;
  stats: Stats;
  isStatsLoading: boolean;
  getAllAlbums: () => Promise<void>;
  getPersonalizedSongs: () => Promise<void>;
  getFeaturedSongs: () => Promise<void>;
  getTrendingSongs: () => Promise<void>;
  getAlbumByID: (albumID: string) => Promise<void>;
  getAllStats: () => Promise<void>;
  getAllSongs: () => Promise<void>;
  deleteSong: (songId: string) => Promise<void>;
  deleteAlbum: (albumId: string) => Promise<void>;
}

export const useMusicStore = create<MusicStoreProps>((set) => ({
  songs: [],
  isAllSongsLoading: false,
  featuredSongs: [],
  personalizedSongs: [],
  trendingSongs: [],
  albums: [],
  isAlbumsLoading: false,
  currentAlbum: null,
  isLoading: false,
  isDeleting: false,
  error: null,
  stats: {
    totalSongs: 0,
    totalArtists: 0,
    totalAlbums: 0,
    totalUsers: 0,
  },
  isStatsLoading: false,

  getAllAlbums: async () => {
    set({ isAlbumsLoading: true, error: null });

    try {
      const res = await axiosInstance.get<ApiResponse<Album[]>>("/albums");

      if (res.data.success) set({ albums: res.data.data });
      else set({ error: res.data.message });
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
      set({ isAlbumsLoading: false });
    }
  },

  getAlbumByID: async (albumID) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axiosInstance.get<ApiResponse<Album>>(
        `/albums/${albumID}`,
      );

      if (res.data.success) set({ currentAlbum: res.data.data });
      else set({ error: res.data.message });
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

  getPersonalizedSongs: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await axiosInstance.get<ApiResponse<Song[]>>(
        "/songs/personalized",
      );

      if (res.data.success) set({ personalizedSongs: res.data.data });
      else set({ error: res.data.message });
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

  getFeaturedSongs: async () => {
    set({ isLoading: true, error: null });

    try {
      const res =
        await axiosInstance.get<ApiResponse<Song[]>>("/songs/featured");

      if (res.data.success) set({ featuredSongs: res.data.data });
      else set({ error: res.data.message });
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

  getTrendingSongs: async () => {
    set({ isLoading: true, error: null });

    try {
      const res =
        await axiosInstance.get<ApiResponse<Song[]>>("/songs/trending");

      if (res.data.success) set({ trendingSongs: res.data.data });
      else set({ error: res.data.message });
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

  getAllSongs: async () => {
    set({ isAllSongsLoading: true, error: null });
    try {
      const res = await axiosInstance.get<ApiResponse<Song[]>>("/songs");

      if (res.data.success) set({ songs: res.data.data });
      else set({ error: res.data.message });
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
      set({ isAllSongsLoading: false });
    }
  },

  getAllStats: async () => {
    set({ isStatsLoading: true, error: null });
    try {
      const res = await axiosInstance.get<ApiResponse<Stats>>("/admin/stats");

      if (res.data.success) set({ stats: res.data.data });
      else set({ error: res.data.message });
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
      set({ isStatsLoading: false });
    }
  },

  deleteSong: async (songId) => {
    set({ isDeleting: true, error: null });

    try {
      const res = await axiosInstance.delete<ApiResponse>(
        `/admin/songs/${songId}`,
      );

      if (res.data.success) {
        set((state) => ({
          songs: state.songs.filter((song) => song._id !== songId),
        }));

        createToast("success", res.data.message);
      } else {
        set({ error: res.data.message });

        createToast("error", res.data.message);
      }
    } catch (error) {
      createToast("error", "Failed to delete song");
      const axiosError = error as AxiosError<ApiError>;
      if (axiosError.response?.data?.message) {
        set({ error: axiosError.response.data.message });
      } else if (axiosError.message) {
        set({ error: axiosError.message });
      } else {
        set({ error: "An unknown error occurred" });
      }
    } finally {
      set({ isDeleting: false });
    }
  },

  deleteAlbum: async (albumId) => {
    set({ isDeleting: true, error: null });

    try {
      const res = await axiosInstance.delete<ApiResponse>(
        `/admin/albums/${albumId}`,
      );

      if (res.data.success) {
        set((state) => ({
          albums: state.albums.filter((album) => album._id !== albumId),
          songs: state.songs.map((song) =>
            song.albumID === state.albums.find((a) => a._id === albumId)?.title
              ? { ...song, album: null }
              : song,
          ),
        }));
        createToast("success", res.data.message);
      } else {
        set({ error: res.data.message });

        createToast("error", res.data.message);
      }
    } catch (error) {
      createToast("error", "Failed to delete album");
      const axiosError = error as AxiosError<ApiError>;
      if (axiosError.response?.data?.message) {
        set({ error: axiosError.response.data.message });
      } else if (axiosError.message) {
        set({ error: axiosError.message });
      } else {
        set({ error: "An unknown error occurred" });
      }
    } finally {
      set({ isDeleting: false });
    }
  },
}));
