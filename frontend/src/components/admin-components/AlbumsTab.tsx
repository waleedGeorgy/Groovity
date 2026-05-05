import { Disc3, Library, Settings, Trash2, UserStar, Calendar1, Music, Loader2 } from "lucide-react"
import { useMusicStore } from "@/stores/useMusicStore"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader } from "../ui/card"
import { ScrollArea } from "../ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import AddAlbumButton from "./AddAlbumButton"
import { useShallow } from "zustand/react/shallow"

const AlbumsTab = () => {
    const { albums, isAlbumsLoading, error, deleteAlbum } = useMusicStore(useShallow(state => ({
        albums: state.albums,
        isAlbumsLoading: state.isAlbumsLoading,
        error: state.error,
        deleteAlbum: state.deleteAlbum
    })));

    if (isAlbumsLoading) {
        return (
            <div className="flex items-center justify-center gap-2 mt-10 opacity-65">
                <h2 className="text-3xl font-roboto">Loading data</h2>
                <Loader2 className="size-8 animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center flex-col justify-center mt-10 gap-2">
                <h2 className="text-4xl font-semibold font-roboto mt-4">Error fetching albums</h2>
                <p className="text-lg font-light">{error}</p>
            </div>
        )
    }

    return (
        <Card className="bg-gradient-to-br from-card from-60% to to-teal-950 to-100%">
            <CardHeader>
                <div className="flex flex-row items-center justify-between gap-1">
                    <h2 className="flex items-center gap-1 text-2xl font-roboto">
                        <Library className="size-7 text-indigo-500" />Albums Library
                    </h2>
                    <AddAlbumButton />
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-80">
                    <Table>
                        <TableHeader className="sticky">
                            <TableRow className="font-roboto text-base p-4 opacity-60">
                                <TableHead><span className="flex items-center gap-1"><Disc3 className="size-4 inline" />Title</span></TableHead>
                                <TableHead><span className="flex items-center gap-1"><UserStar className="size-4 inline" />Artist</span></TableHead>
                                <TableHead><span className="flex items-center gap-1"><Music className="size-4 inline" />Tracks</span></TableHead>
                                <TableHead><span className="flex items-center gap-1"><Calendar1 className="size-4 inline" />Release Year</span></TableHead>
                                <TableHead><span className="flex justify-end items-center gap-1"><Settings className="size-4 inline" />Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {albums.map(album => (
                                <TableRow key={album._id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-row items-center gap-2">
                                            <img src={album.imageURL} alt={album.title} className="size-10 aspect-square rounded-md object-cover" />
                                            <h3>{album.title}</h3>
                                        </div>
                                    </TableCell>
                                    <TableCell>{album.artist}</TableCell>
                                    <TableCell>{album.songs.length} {album.songs.length > 1 ? "Tracks" : "Track"}</TableCell>
                                    <TableCell>{album.releaseYear}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="cursor-pointer"
                                            onClick={() => void deleteAlbum(album._id)}
                                        >
                                            <Trash2 className="ml-auto size-4 transition-all duration-300 text-red-400 cursor-pointer" />
                                            <span className="font-xs">Delete</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

export default AlbumsTab