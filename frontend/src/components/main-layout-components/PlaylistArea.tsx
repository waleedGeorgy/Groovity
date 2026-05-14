import { useEffect } from "react";
import { Link } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { Library } from "lucide-react"
import { useUser } from "@clerk/clerk-react";
import { useMusicStore } from "@/stores/useMusicStore";
import { ScrollArea } from "../ui/scroll-area"
import PlaylistSkeleton from "../skeletons/PlaylistSkeleton";

const PlaylistArea = () => {
    const { user } = useUser();
    const { albums, getAllAlbums, isLoading } = useMusicStore(useShallow(state => ({
        albums: state.albums,
        getAllAlbums: state.getAllAlbums,
        isLoading: state.isLoading
    })));

    useEffect(() => {
        void getAllAlbums();
    }, [getAllAlbums]);

    return (
        <div className="flex flex-1 flex-col sm:items-stretch items-center p-3 px-3 bg-popover rounded-xl mt-2 border">
            <h2 className="flex flex-row items-center px-2 gap-1 mb-2"><Library className="size-6 shrink-0" />
                <span className="truncate">Albums</span>
            </h2>
            <ScrollArea className={user ? `h-[calc(100vh-256px)]` : `h-[calc(100vh-220px)] min-w-full`}>
                <div className="space-y-1">
                    {isLoading ?
                        <PlaylistSkeleton />
                        :
                        albums.length === 0 ?
                            <span className="min-h-screen opacity-60 flex items-center justify-center-safe md:text-base text-sm truncate -mt-40">No albums yet.</span>
                            :
                            albums.map(album => (
                                <Link viewTransition to={`/albums/${album._id}`} key={album._id} className="flex flex-row items-center gap-3 hover:bg-indigo-900 rounded-md p-2 cursor-pointer transition-colors duration-300">
                                    <img src={album.imageURL} alt={album.title} className="sm:size-12 size-14 rounded-md object-cover shrink-0 hover:scale-110 sm:hover:scale-none transition-all duration-300" />
                                    <div className="hidden sm:block">
                                        <h2 className="truncate font-roboto">{album.title}</h2>
                                        <p className="text-sm font-light truncate opacity-60">{album.artist}</p>
                                    </div>
                                </Link>
                            ))
                    }
                </div>
            </ScrollArea>
        </div>
    )
}

export default PlaylistArea