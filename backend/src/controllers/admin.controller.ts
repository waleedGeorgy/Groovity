import { Album } from "./../models/album.model.ts";
import { Song } from "./../models/song.model.ts";
import cloudinary from "../lib/cloudinary.ts";

interface UploadedFile {
  tempFilePath: string;
  name: string;
  mimetype: string;
  data: Buffer;
  size: number;
  md5: string;
}

const cloudinaryUploader = async (file: UploadedFile): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
      folder: "groovity",
    });
    return result.secure_url;
  } catch (error) {
    console.log(error);
    throw new Error("Error uploading file to Cloudinary.");
  }
};

export const createSong = async (
  req: any,
  res: any,
  next: any
): Promise<void> => {
  try {
    if (!req.files || !req.files.imageFile) {
      return res.status(400).json({ message: "Please provide an image." });
    }
    if (!req.files || !req.files.audioFile) {
      return res.status(400).json({ message: "Please provide an audio file." });
    }

    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const { title, artist, duration, albumID } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ message: "Please provide a song title." });
    }
    if (!artist || artist.trim().length === 0) {
      return res.status(400).json({ message: "Please provide a song artist." });
    }
    if (!duration || duration === 0) {
      return res
        .status(400)
        .json({ message: "Please provide a valid song duration." });
    }

    const [imageURL, audioURL] = await Promise.all([
      cloudinaryUploader(imageFile),
      cloudinaryUploader(audioFile),
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
      await Album.findByIdAndUpdate(albumID, {
        $push: { songs: song._id },
      });
    }
    res.status(201).json(song);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteSong = async (
  req: any,
  res: any,
  next: any
): Promise<void> => {
  try {
    const { songID } = req.params;
    if (!songID) return res.status(400).json({ message: "Invalid song ID" });

    const song = await Song.findById(songID);
    if (!song) return res.status(400).json({ message: "Song does not exist" });

    if (song.albumID) {
      await Album.findByIdAndUpdate(song.albumID, {
        $pull: { songs: song._id },
      });
    }

    await Song.findByIdAndDelete(songID);

    return res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const createAlbum = async (
  req: any,
  res: any,
  next: any
): Promise<void> => {
  try {
    if (!req.files || !req.files.imageFile) {
      return res.status(400).json({ message: "Please add an album image." });
    }
    const imageFile = req.files.imageFile;

    const { title, artist, releaseYear } = req.body;

    if (!title || title.trim().length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide an album title." });
    }
    if (!artist || artist.trim().length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide an album artist." });
    }
    if (!releaseYear || releaseYear === 0) {
      return res
        .status(400)
        .json({ message: "Please provide a valid album year." });
    }

    const imageURL = await cloudinaryUploader(imageFile);

    const album = Album.create({
      title,
      artist,
      releaseYear,
      imageURL,
    });

    (await album).save();

    return res.status(201).json(album);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteAlbum = async (
  req: any,
  res: any,
  next: any
): Promise<void> => {
  try {
    const { albumID } = req.params;
    if (!albumID) return res.status(400).json({ message: "Invalid album ID" });

    const album = await Album.findById(albumID);
    if (!album)
      return res.status(400).json({ message: "Album does not exist" });

    Song.deleteMany({ albumID: albumID });

    await Album.findByIdAndDelete(albumID);
    return res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAdminStatus = (req: any, res: any, next: any): void => {
  try {
    return res.status(200).json({ admin: true });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
