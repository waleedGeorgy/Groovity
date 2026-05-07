import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { UserStar, Disc3, Calendar1, Play, Clock4, FilePlus, Hash, Music, Pause } from "lucide-react"
import { useMusicStore } from "@/stores/useMusicStore"
import { usePlaybackStore } from "@/stores/usePlaybackStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlbumHeaderSkeleton, AlbumTableSkeleton } from "@/components/skeletons/AlbumSkeleton";
import { durationInMinutes } from "@/functions";

const AlbumPage = () => {
    const { currentAlbum, isLoading, getAlbumByID } = useMusicStore(useShallow(state => ({
        currentAlbum: state.currentAlbum,
        isLoading: state.isLoading,
        getAlbumByID: state.getAlbumByID
    })));
    
    const { isSongPlaying, currentSong, toggleSongPlay, playAlbum, stopSong } = usePlaybackStore(useShallow(state => ({
        isSongPlaying: state.isSongPlaying,
        currentSong: state.currentSong,
        toggleSongPlay: state.toggleSongPlay,
        playAlbum: state.playAlbum,
        stopSong: state.stopSong
    })));

    const { albumID } = useParams();

    const [backgroundColor, setBackgroundColor] = useState("#1e1b4b");

    const getColorValue = () => {
        const bgColor = ["indigo-900", "rose-900", "violet-900", "blue-900", "sky-900", "cyan-900", "teal-900", "emerald-900", "green-900", "lime-900", "yellow-900", "amber-900", "orange-900", "red-900", "purple-900"];

        const colorMap: Record<string, string> = {
            "indigo-900": "oklch(0.359 0.144 278.697)",
            "purple-900": "oklch(0.381 0.176 304.987)",
            "rose-900": "oklch(0.41 0.159 10.272)",
            "violet-900": "oklch(0.38 0.189 293.745)",
            "blue-900": "oklch(0.379 0.146 265.522)",
            "sky-900": "oklch(0.391 0.09 240.876)",
            "cyan-900": "oklch(0.398 0.07 227.392)",
            "teal-900": "oklch(0.386 0.063 188.416)",
            "emerald-900": "oklch(0.378 0.077 168.94)",
            "green-900": "oklch(0.393 0.095 152.535)",
            "lime-900": "oklch(0.405 0.101 131.063)",
            "yellow-900": "oklch(0.421 0.095 57.708)",
            "amber-900": "oklch(0.414 0.112 45.904)",
            "orange-900": "oklch(0.408 0.123 38.172)",
            "red-900": "oklch(0.396 0.141 25.723)",
        };

        const randomColor = bgColor[Math.floor(bgColor.length * Math.random())];

        return colorMap[randomColor] ?? "#1e1b4b";
    };

    const albumDuration = () => {
        let totalDuration = 0;
        currentAlbum?.songs.map(song => {
            totalDuration += song.duration;
        });

        const duration = durationInMinutes(totalDuration);

        return duration;
    }

    const handleSongPlay = (index: number) => {
        if (!currentAlbum) return;

        if (currentSong?._id === currentAlbum.songs[index]._id) {
            toggleSongPlay();
        } else if (currentSong && isSongPlaying) {
            stopSong();
            setTimeout(() => playAlbum(currentAlbum.songs, index), 100);
        } else {
            playAlbum(currentAlbum.songs, index);
        }
    }

    const handleAlbumPlay = () => {
        if (!currentAlbum) return;

        const isCurrentAlbumPlaying = currentAlbum?.songs.some(song => song._id === currentSong?._id);

        if (isCurrentAlbumPlaying) toggleSongPlay();
        else {
            if (currentSong && isSongPlaying) {
                stopSong();
                setTimeout(() => playAlbum(currentAlbum.songs, 0), 100);
            } else {
                playAlbum(currentAlbum.songs, 0);
            }
        }
    }

    useEffect(() => {
        setBackgroundColor(getColorValue());
    }, [albumID]);

    useEffect(() => {
        if (albumID) void getAlbumByID(albumID);
    }, [getAlbumByID, albumID]);

    return (
        <div className="h-full rounded-lg border">
            <ScrollArea className="h-full">
                <div
                    className="p-6 rounded-lg flex flex-row items-end justify-start gap-4"
                    style={{
                        background: `linear-gradient(to bottom, ${backgroundColor}, var(--color-background))`
                    }}
                >
                    {!isLoading ?
                        <>
                            <img className="size-60 rounded border object-cover" src={currentAlbum?.imageURL} alt={currentAlbum?.title} />
                            <div className="flex flex-col justify-center gap-1">
                                <h3 className="flex items-center gap-1 truncate text-xl"><UserStar className="size-5" />{currentAlbum?.artist}</h3>
                                <h2 className="text-7xl font-roboto font-bold tracking-tight py-1">{currentAlbum?.title}</h2>
                                <div className="flex flex-row gap-x-5 items-center ml-1 text-sm">
                                    <span className="flex items-center gap-1 opacity-60 truncate"><Disc3 className="size-4" />{currentAlbum?.songs.length} Songs</span>
                                    <span className="flex items-center gap-1 opacity-60 truncate"><Clock4 className="size-4" />{albumDuration()}</span>
                                    <span className="flex items-center gap-1 opacity-60 truncate"><Calendar1 className="size-4" />{currentAlbum?.releaseYear}</span>
                                    <span className="flex items-center gap-1 opacity-60 truncate"><FilePlus className="size-4" />{new Date(currentAlbum?.createdAt.split("T")[0] ?? new Date()).toLocaleString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                                </div>
                            </div>
                        </>
                        :
                        <AlbumHeaderSkeleton />
                    }
                </div>
                <div className="mb-4 ml-6">
                    <Button
                        size='icon'
                        onClick={handleAlbumPlay}
                        className='size-10 rounded-full bg-emerald-500 hover:bg-emerald-400 hover:scale-110 transition-all duration-200 cursor-pointer'
                        disabled={isLoading || currentAlbum?.songs.length === 0}
                    >
                        {isSongPlaying && currentAlbum?.songs.some((song) => song._id === currentSong?._id) ?
                            <Pause className="size-4" /> : <Play className='size-4' />
                        }
                    </Button>
                </div>
                {isLoading ?
                    <AlbumTableSkeleton />
                    :
                    currentAlbum?.songs.length === 0 ?
                        <div className="h-full flex flex-col items-center justify-center gap-2 mt-8">
                            <h2 className="font-roboto text-3xl">This album is empty!</h2>
                            <p className="opacity-60 text-lg font-semibold">If authorized, please add songs to this album.</p>
                        </div>
                        :
                        <Table>
                            <TableHeader>
                                <TableRow className="font-roboto text-base p-4 opacity-60">
                                    <TableHead><span className="flex items-center gap-1"><Hash className="size-4 inline" /></span></TableHead>
                                    <TableHead><span className="flex items-center gap-1"><Disc3 className="size-4 inline" />Title</span></TableHead>
                                    <TableHead><span className="flex items-center gap-1"><UserStar className="size-4 inline" />Artist</span></TableHead>
                                    <TableHead><span className="flex justify-end items-center gap-1"><Clock4 className="size-4 inline" />Duration</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentAlbum?.songs.map((song, id) => {
                                    const isCurrentSong = song._id === currentSong?._id;
                                    return (
                                        <TableRow
                                            key={song._id}
                                            className={`cursor-pointer group ${isCurrentSong && "bg-gradient-to-r from-background  to-indigo-900"}`}
                                            onClick={() => handleSongPlay(id)}
                                        >
                                            <TableCell className="w-14">
                                                {isCurrentSong && isSongPlaying && <Music className="size-4 text-indigo-500 animate-bounce" />}
                                                {isCurrentSong && !isSongPlaying && <Pause className="size-4 text-emerald-500" />}
                                                {!isCurrentSong &&
                                                    <>
                                                        <Play className="hidden group-hover:inline-block size-4 text-emerald-500" />
                                                        <span className="group-hover:hidden">{id + 1}</span>
                                                    </>
                                                }
                                            </TableCell>
                                            <TableCell className="flex flex-row items-center gap-3">
                                                <img src={song.imageURL} alt={song.title} className="size-11 rounded object-cover" />
                                                <h3 className="truncate">{song.title}</h3>
                                            </TableCell>
                                            <TableCell><span className="truncate">{song.artist}</span></TableCell>
                                            <TableCell className="text-right">{durationInMinutes(song.duration)}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={3} className="font-bold">Total duration</TableCell>
                                    <TableCell className="text-right font-bold">{albumDuration()}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                }
            </ScrollArea>
        </div>
    )
}

export default AlbumPage;