import type { Song } from "@/types";
import SongsGridSkeleton from "./skeletons/SongsGridSkeleton";
import { durationInMinutes } from "@/functions";
import { usePlaybackStore } from "@/stores/usePlaybackStore";
import { Button } from "./ui/button";
import { Pause, Play } from "lucide-react";

interface songsGridProps {
  songs: Song[],
  title: string,
  loading: boolean,
  error: string | null,
  icon: React.ReactNode,
}

const SongsGridSection = ({ songs, title, icon, loading, error }: songsGridProps) => {
  const { currentSong, isSongPlaying, setCurrentSong, toggleSongPlay } = usePlaybackStore();

  const handleSongPlay = (isCurrentSong: boolean, song: Song) => {
    if (isCurrentSong) toggleSongPlay();
    else setCurrentSong(song);
  }

  // todo: Fix error fallback
  if (error) return <h1>{error}</h1>

  return (
    <div className="w-full p-4">
      <h2 className="text-3xl font-bold font-roboto mt-5 mb-3 ml-2 flex flex-row items-center gap-2">{icon}{title}</h2>
      <div className="grid grid-cols-[repeat(auto-fill,14rem)] gap-2 place-items-center">
        {loading ? (<SongsGridSkeleton />) :
          (songs.map((song) => {
            const isCurrentSong = song._id === currentSong?._id;

            return (
              <div key={song._id} className="flex flex-col gap-3 rounded-md bg-background/75 transition-all duration-300 cursor-pointer p-3 group relative" onClick={() => handleSongPlay(isCurrentSong, song)}>
                <div className="relative overflow-hidden aspect-square">
                  <img src={song.imageURL} alt={song.title} className="size-48 rounded shrink-0 group-hover:scale-105 transition-all duration-500 object-cover" />
                  <small className="absolute top-0 text-xs bg-secondary/85 py-1 px-2 rounded-sm mt-1 ml-1">{durationInMinutes(song.duration)}</small>
                </div>
                <div className="pb-1">
                  <h3 className="font-semibold truncate font-roboto">{song.title}</h3>
                  <h4 className="opacity-60 text-sm truncate">{song.artist}</h4>
                </div>
                <Button className={`absolute bottom-2 right-2 size-9 cursor-pointer bg-indigo-500 hover:bg-indigo-400 transition-all opacity-0 translate-x-6 hover:opacity-100 group-hover:translate-x-0 duration-500 ${isCurrentSong ? "opacity-100 translate-x-0 animate-pulse" : "opacity-0 group-hover:opacity-100"}`} size="icon">
                  {isCurrentSong && isSongPlaying ? (<Pause className="size-4" />) : (<Play className="size-4" />)}
                </Button>
              </div>)
          }))}
      </div>
    </div>
  )
}

export default SongsGridSection