import type { AxiosError } from "axios";
import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import type { Album, ApiError, Song, Stats } from "@/types";
import { createToast } from "@/functions";

interface MusicStoreProps {
  songs: Song[];
  isSongsLoading: boolean;
  personalizedSongs: Song[];
  featuredSongs: Song[];
  trendingSongs: Song[];
  albums: Album[];
  isAlbumsLoading: boolean;
  currentAlbum: Album | null;
  isLoading: boolean;
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

export const useMusicStore = create<MusicStoreProps>()((set) => ({
  songs: [],
  isSongsLoading: false,
  featuredSongs: [],
  personalizedSongs: [],
  trendingSongs: [],
  albums: [],
  isAlbumsLoading: false,
  currentAlbum: null,
  isLoading: false,
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
      const res = await axiosInstance.get<Album[]>("/albums");
      set({ albums: res.data });
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
      const res = await axiosInstance.get<Album>(`/albums/${albumID}`);
      set({ currentAlbum: res.data });
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
      const res = await axiosInstance.get<Song[]>("/songs/personalized");
      set({ personalizedSongs: res.data });
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
      const res = await axiosInstance.get<Song[]>("/songs/featured");
      set({ featuredSongs: res.data });
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
      const res = await axiosInstance.get<Song[]>("/songs/trending");
      set({ trendingSongs: res.data });
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
    set({ isSongsLoading: true, error: null });
    try {
      const response = await axiosInstance.get<Song[]>("/songs");
      set({ songs: response.data });
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
      set({ isSongsLoading: false });
    }
  },
  getAllStats: async () => {
    set({ isStatsLoading: true, error: null });
    try {
      const response = await axiosInstance.get<Stats>("/stats");
      set({ stats: response.data });
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
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/songs/${songId}`);
      set((state) => ({
        songs: state.songs.filter((song) => song._id !== songId),
      }));
      createToast("success", "Song deleted successfully");
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
      set({ isLoading: false });
    }
  },
  deleteAlbum: async (albumId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/albums/${albumId}`);
      set((state) => ({
        albums: state.albums.filter((album) => album._id !== albumId),
        songs: state.songs.map((song) =>
          song.albumID === state.albums.find((a) => a._id === albumId)?.title
            ? { ...song, album: null }
            : song
        ),
      }));
      createToast("success", "Album deleted successfully");
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
      set({ isLoading: false });
    }
  },
}));
