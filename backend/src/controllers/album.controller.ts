import { type Request, type Response, type NextFunction } from "express";
import { Album } from "../models/album.model.ts";

export const getAllAlbums = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const albums = await Album.find().sort({ _id: -1 });

    return res.status(200).json({
      success: true,
      message:
        albums.length === 0 ? "No albums found" : "Albums fetched successfully",
      data: albums,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAlbumByID = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { albumID } = req.params;
    const album = await Album.findById(albumID).populate("songs");

    return res.status(200).json({
      success: true,
      message: album ? "Album fetched successfully" : "Album does not exist",
      data: album ?? null,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
