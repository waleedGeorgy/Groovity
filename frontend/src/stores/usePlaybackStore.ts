import { create } from "zustand";
import type { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface playbackStoreProps {
  currentSong: Song | null;
  currentSongIndex: number;
  isSongPlaying: boolean;
  songsQueue: Song[];
  setCurrentSong: (song: Song | null) => void;
  initializeSongsQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex: number) => void;
  toggleSongPlay: () => void;
  playNextSong: () => void;
  playPrevSong: () => void;
  stopSong: () => void;
}

interface SocketAuth {
  userId: string;
}

export const usePlaybackStore = create<playbackStoreProps>((set, get) => ({
  currentSong: null,
  isSongPlaying: false,
  currentSongIndex: -1,
  songsQueue: [],

  initializeSongsQueue: (songs: Song[]) => {
    set({
      songsQueue: songs,
      currentSong: get().currentSong ?? songs[0],
      currentSongIndex:
        get().currentSongIndex === -1 ? 0 : get().currentSongIndex,
    });
  },

  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length <= 0) return;

    const song = songs[startIndex];

    const socket = useChatStore.getState().socket;
    const auth = socket?.auth as SocketAuth | undefined;

    if (socket?.auth) {
      socket.emit("update_activity", {
        userId: auth?.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    set({
      currentSong: song,
      isSongPlaying: true,
      currentSongIndex: startIndex,
      songsQueue: songs,
    });
  },

  setCurrentSong: (song) => {
    if (!song) return;

    const songIndex = get().songsQueue.findIndex((s) => s._id === song._id);

    const socket = useChatStore.getState().socket;
    const auth = socket?.auth as SocketAuth | undefined;

    if (socket?.auth) {
      socket.emit("update_activity", {
        userId: auth?.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    set({
      currentSong: song,
      isSongPlaying: true,
      currentSongIndex: songIndex === -1 ? get().currentSongIndex : songIndex,
    });
  },

  toggleSongPlay: () => {
    const currentSong = get().currentSong;

    const socket = useChatStore.getState().socket;
    const auth = socket?.auth as SocketAuth | undefined;

    if (socket?.auth) {
      socket.emit("update_activity", {
        userId: auth?.userId,
        activity:
          !get().isSongPlaying && currentSong
            ? `Playing ${currentSong.title} by ${currentSong.artist}`
            : "Idle",
      });
    }
    set({ isSongPlaying: !get().isSongPlaying });
  },

  playNextSong: () => {
    const { currentSongIndex, songsQueue } = get();
    const nextSongIndex = currentSongIndex + 1;
    if (nextSongIndex < songsQueue.length) {
      const nextSong = songsQueue[nextSongIndex];

      const socket = useChatStore.getState().socket;
      const auth = socket?.auth as SocketAuth | undefined;

      if (socket?.auth) {
        socket.emit("update_activity", {
          userId: auth?.userId,
          activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
        });
      }
      set({
        currentSong: nextSong,
        currentSongIndex: nextSongIndex,
        isSongPlaying: true,
      });
    } else {
      const socket = useChatStore.getState().socket;
      const auth = socket?.auth as SocketAuth | undefined;

      if (socket?.auth) {
        socket.emit("update_activity", {
          userId: auth?.userId,
          activity: `Idle`,
        });
      }
      set({ isSongPlaying: false });
    }
  },

  playPrevSong: () => {
    const { currentSongIndex, songsQueue } = get();

    const prevSongIndex = currentSongIndex - 1;
    if (prevSongIndex >= 0) {
      const prevSong = songsQueue[prevSongIndex];

      const socket = useChatStore.getState().socket;
      const auth = socket?.auth as SocketAuth | undefined;

      if (socket?.auth) {
        socket.emit("update_activity", {
          userId: auth?.userId,
          activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
        });
      }

      set({
        currentSong: prevSong,
        currentSongIndex: prevSongIndex,
        isSongPlaying: true,
      });
    } else {
      const socket = useChatStore.getState().socket;
      const auth = socket?.auth as SocketAuth | undefined;

      if (socket?.auth) {
        socket.emit("update_activity", {
          userId: auth?.userId,
          activity: `Idle`,
        });
      }
      set({ isSongPlaying: false });
    }
  },

  stopSong: () => {
    set({
      isSongPlaying: false,
      currentSong: null,
      currentSongIndex: -1,
    });
  },
}));
