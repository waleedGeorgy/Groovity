export interface Song {
  _id: string;
  title: string;
  artist: string;
  duration: number;
  albumID: string;
  imageURL: string;
  audioURL: string;
  createdAt: string;
  updatedAt: string;
}

export interface Album {
  _id: string;
  title: string;
  artist: string;
  releaseYear: number;
  imageURL: string;
  songs: Song[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  clerkID: string;
  name: string;
  imageURL: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface Stats {
  totalSongs: number;
  totalArtists: number;
  totalAlbums: number;
  totalUsers: number;
}

export interface Message {
  _id: string;
  senderID: string;
  receiverID: string;
  contents: string;
  createdAt: string;
  updatedAt: string;
}
