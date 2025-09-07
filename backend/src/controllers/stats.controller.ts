import { User } from "./../models/user.model.ts";
import { Album } from "./../models/album.model.ts";
import { Song } from "./../models/song.model.ts";

export const getAllStats = async (req, res, next) => {
  try {
    const [totalSongs, totalAlbums, totalUsers, uniqueArtists] =
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

    return res
      .status(200)
      .json({
        totalSongs,
        totalUsers,
        totalAlbums,
        totalArtists: uniqueArtists[0]?.count || 0,
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
