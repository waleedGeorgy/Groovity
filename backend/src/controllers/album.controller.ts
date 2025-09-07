import { Album } from "./../models/album.model.ts";

export const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find().sort({ _id: -1 });
    if (!albums) return res.status(400).json({ message: "No albums" });

    return res.status(200).json(albums);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAlbumByID = async (req, res, next) => {
  try {
    const { albumID } = req.params;
    const album = await Album.findById(albumID).populate("songs");
    if (!album)
      return res.status(400).json({ message: "Album does not exist" });

    return res.status(200).json(album);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
