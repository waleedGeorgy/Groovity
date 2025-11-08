import { Music2, Pause, Play } from "lucide-react"
import type { Song } from "@/types";
import { durationInMinutes } from "@/functions";
import { usePlaybackStore } from "@/stores/usePlaybackStore";
import FeaturedSongsSkeleton from "./skeletons/FeaturedSongsSkeleton";
import { Button } from "./ui/button";

interface featuredSongsProps {
    loading: boolean,
    error: string | null,
    songs: Song[]
}

const FeaturedSongsSection = ({ songs, loading, error }: featuredSongsProps) => {
    const { currentSong, isSongPlaying, setCurrentSong, toggleSongPlay } = usePlaybackStore();

    const handleSongPlay = (isCurrentSong: boolean, song: Song) => {
        if (isCurrentSong) toggleSongPlay();
        else setCurrentSong(song);
    }

    if (error) return <h2>{error}</h2>

    return (
        <div className="w-full py-4 px-6">
            <h2 className="text-3xl font-bold font-roboto mt-5 mb-3 flex flex-row items-center gap-2"><Music2 className="size-6" />Featured Songs</h2>
            <div className="grid grid-cols-[repeat(auto-fill,16rem)] gap-3">
                {loading ? (<FeaturedSongsSkeleton />) : (
                    songs.map((featuredSong) => {
                        const isCurrentSong = featuredSong._id === currentSong?._id;

                        return (
                            <div key={featuredSong._id} className="flex flex-row gap-3 rounded hover:bg-muted/80 transition-all duration-300 relative group cursor-pointer" onClick={() => handleSongPlay(isCurrentSong, featuredSong)}>
                                <div className="relative">
                                    <img src={featuredSong.imageURL} alt={featuredSong.title} className="size-25 rounded object-cover shrink-0 aspect-square" />
                                    <small className="absolute top-0 text-xs bg-secondary/85 py-0.5 px-1 rounded-sm mt-0.5 ml-0.5">{durationInMinutes(featuredSong.duration)}</small>
                                </div>
                                <div className="mt-2">
                                    <h3 className="font-semibold truncate font-roboto">{featuredSong.title}</h3>
                                    <h4 className="opacity-60 text-sm truncate">{featuredSong.artist}</h4>
                                </div>
                                <Button className={`absolute bottom-2 right-2 size-9 cursor-pointer bg-indigo-500 hover:bg-indigo-400 transition-all opacity-0 translate-x-6 hover:opacity-100 group-hover:translate-x-0 duration-500 ${isCurrentSong ? "opacity-100 translate-x-0 animate-pulse" : "opacity-0 group-hover:opacity-100"}`} size="icon">
                                    {isCurrentSong && isSongPlaying ? (<Pause className="size-4" />) : (<Play className="size-4" />)}
                                </Button>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default FeaturedSongsSection