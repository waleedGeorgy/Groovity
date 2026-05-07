import { type NextFunction, type Request, type Response } from "express";
import { Song, type SongType } from "../models/song.model.ts";

//todo: Implement a more advanced algorithm for suggesting songs
export const getAllSongs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const songs = await Song.find().sort({ _id: -1 });
    if (!songs || songs.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "No songs found" });

    return res.status(200).json({
      success: true,
      message: "Songs fetched successfully",
      data: songs,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getFeaturedSongs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const featuredSongs = await Song.aggregate<SongType[]>([
      {
        $sample: { size: 6 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageURL: 1,
          audioURL: 1,
          duration: 1,
        },
      },
    ]);
    if (!featuredSongs || featuredSongs.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "No featured songs found" });

    return res.status(200).json({
      success: true,
      message: "Featured songs fetched successfully",
      data: featuredSongs,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getPersonalizedSongs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const personalizedSongs = await Song.aggregate<SongType[]>([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageURL: 1,
          audioURL: 1,
          duration: 1,
        },
      },
    ]);
    if (!personalizedSongs || personalizedSongs.length === 0)
      return res.status(404).json({
        success: false,
        message: "No personalized songs found",
      });

    return res.status(200).json({
      success: true,
      message: "Personalized songs fetched successfully",
      data: personalizedSongs,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getTrendingSongs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const trendingSongs = await Song.aggregate<SongType[]>([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageURL: 1,
          audioURL: 1,
          duration: 1,
        },
      },
    ]);
    if (!trendingSongs || trendingSongs.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "No trending songs found" });

    return res.status(200).json({
      success: true,
      message: "Trending songs fetched successfully",
      data: trendingSongs,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
