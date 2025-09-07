import { Song } from "./../models/song.model.ts";

//todo: Implement a more advanced algorithm for featured, personalized and trending songs

export const getAllSongs = async (req, res, next) => {
  try {
    const songs = await Song.find().sort({ _id: -1 });
    if (!songs) return res.status(400).json({ message: "No songs found" });
    
    return res.status(200).json(songs);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getFeaturedSongs = async (req, res, next) => {
  try {
    const featuredSongs = await Song.aggregate([
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
    
    if (!featuredSongs)
      return res
        .status(400)
        .json({ message: "Could not fetch featured songs" });

    return res.status(200).json(featuredSongs);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getPersonalizedSongs = async (req, res, next) => {
  try {
    const personalizedSongs = await Song.aggregate([
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
    if (!personalizedSongs)
      return res
        .status(400)
        .json({ message: "Could not fetch personalized songs" });

    return res.status(200).json(personalizedSongs);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getTrendingSongs = async (req, res, next) => {
  try {
    const trendingSongs = await Song.aggregate([
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
    if (!trendingSongs)
      return res
        .status(400)
        .json({ message: "Could not fetch trending songs" });

    return res.status(200).json(trendingSongs);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
