import { type NextFunction, type Request, type Response } from "express";
import { clerkClient, getAuth } from "@clerk/express";
import { type UploadedFile } from "express-fileupload";
import { Album } from "../models/album.model.ts";
import { Song } from "../models/song.model.ts";
import { User } from "../models/user.model.ts";
import { cloudinaryUploader } from "../lib/cloudinary.ts";
import mongoose from "mongoose";

export const createSong = async (
  req: Request<
    {},
    {},
    { title: string; artist: string; duration: number; albumID: string }
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.files || !req.files.imageFile)
      return res
        .status(400)
        .json({ success: false, message: "Please provide an image." });

    if (!req.files || !req.files.audioFile)
      return res
        .status(400)
        .json({ success: false, message: "Please provide an audio file." });

    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const { title, artist, duration, albumID } = req.body;

    if (!title || title.trim().length === 0)
      return res
        .status(400)
        .json({ success: false, message: "Please provide a song title." });

    if (!artist || artist.trim().length === 0)
      return res
        .status(400)
        .json({ success: false, message: "Please provide a song artist." });

    if (!duration || duration === 0)
      return res.status(400).json({
        success: false,
        message: "Please provide a valid song duration.",
      });

    const [imageURL, audioURL] = await Promise.all([
      cloudinaryUploader(imageFile as UploadedFile),
      cloudinaryUploader(audioFile as UploadedFile),
    ]);

    const song = new Song({
      title,
      artist,
      duration,
      imageURL,
      audioURL,
      albumID: albumID || null,
    });

    await song.save();

    if (albumID) {
      if (!mongoose.Types.ObjectId.isValid(albumID)) {
        return res.status(400).json({
          success: false,
          message: "Invalid album ID format",
        });
      }

      await Album.findOneAndUpdate(
        { _id: { $eq: albumID } },
        { $push: { songs: song._id } },
      );
    }

    res.status(201).json({ success: true, message: "Song added successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteSong = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { songID } = req.params;
    if (!songID)
      return res
        .status(400)
        .json({ success: false, message: "Invalid song ID" });

    const song = await Song.findById(songID);
    if (!song)
      return res
        .status(400)
        .json({ success: false, message: "Song does not exist" });

    if (song.albumID) {
      await Album.findOneAndUpdate(
        { _id: { $eq: song.albumID } },
        { $pull: { songs: song._id } },
      );
    }

    await Song.findByIdAndDelete(songID);

    return res
      .status(200)
      .json({ success: true, message: "Song deleted successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const createAlbum = async (
  req: Request<{}, {}, { title: string; artist: string; releaseYear: number }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.files || !req.files.imageFile)
      return res
        .status(400)
        .json({ success: false, message: "Please add an album image." });

    const imageFile = req.files.imageFile;

    const { title, artist, releaseYear } = req.body;

    if (!title || title.trim().length === 0)
      return res
        .status(400)
        .json({ success: false, message: "Please provide an album title." });

    if (!artist || artist.trim().length === 0)
      return res
        .status(400)
        .json({ success: false, message: "Please provide an album artist." });

    if (!releaseYear || releaseYear === 0)
      return res.status(400).json({
        success: false,
        message: "Please provide a valid album year.",
      });

    const imageURL = await cloudinaryUploader(imageFile as UploadedFile);

    const album = Album.create({
      title,
      artist,
      releaseYear,
      imageURL,
    });

    (await album).save();

    return res
      .status(201)
      .json({ success: true, message: "Album created successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteAlbum = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { albumID } = req.params;
    if (!albumID)
      return res
        .status(400)
        .json({ success: false, message: "Invalid album ID" });

    const album = await Album.findById(albumID);
    if (!album)
      return res
        .status(400)
        .json({ success: false, message: "Album does not exist" });

    await Song.deleteMany({ albumID: albumID });

    await Album.findByIdAndDelete(albumID);

    return res
      .status(200)
      .json({ success: true, message: "Album deleted successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAdminStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = getAuth(req);

    const user = await clerkClient.users.getUser(userId!);
    const isAdmin =
      user.primaryEmailAddress?.emailAddress === process.env.ADMIN_EMAIL;

    return res.status(200).json({ admin: isAdmin });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [totalSongs, totalAlbums, totalUsers, totalArtists] =
      await Promise.all([
        Song.countDocuments(),
        Album.countDocuments(),
        User.countDocuments(),
        Song.aggregate([
          {
            $unionWith: {
              coll: "albums",
              pipeline: [],
            },
          },
          {
            $group: {
              _id: "$artist",
            },
          },
          {
            $count: "count",
          },
        ]),
      ]);

    if (
      (!totalSongs && !totalAlbums && !totalUsers) ||
      totalArtists.length === 0
    ) {
      return res.json(404).json({ success: false, message: "No stats found" });
    }

    return res.status(200).json({
      success: true,
      message: "Stats fetched successfully",
      data: {
        totalSongs,
        totalUsers,
        totalAlbums,
        totalArtists: totalArtists[0].count || 0,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
