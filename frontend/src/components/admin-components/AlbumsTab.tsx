import { Disc3, Library, Settings, Trash2, UserStar, Calendar1, Music, Loader2 } from "lucide-react"
import { useMusicStore } from "@/stores/useMusicStore"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader } from "../ui/card"
import { ScrollArea } from "../ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import AddAlbumButton from "./AddAlbumButton"
import { useShallow } from "zustand/react/shallow"

const AlbumsTab = () => {
    const { albums, isAlbumsLoading, error, deleteAlbum, isDeleting } = useMusicStore(useShallow(state => ({
        albums: state.albums,
        isAlbumsLoading: state.isAlbumsLoading,
        error: state.error,
        deleteAlbum: state.deleteAlbum,
        isDeleting: state.isDeleting
    })));

    if (isAlbumsLoading) {
        return (
            <Card className="py-48">
                <Table>
                    <TableBody>
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={5} className="text-center flex items-center justify-center gap-2 opacity-65">
                                <h2 className="text-2xl font-roboto">Loading data</h2>
                                <Loader2 className="size-7 animate-spin" />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="py-40">
                <Table>
                    <TableBody>
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={4} className="text-center flex items-center flex-col justify-center gap-2">
                                <h2 className="text-3xl font-medium font-roboto mt-4 ">Error fetching albums</h2>
                                <p className="text-lg">{error}</p>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-row items-center justify-between gap-1">
                    <h2 className="flex items-center gap-1 sm:text-2xl text-xl font-roboto">
                        <Library className="sm:inline hidden size-6 text-indigo-500" />Albums library
                    </h2>
                    <AddAlbumButton />
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-80">
                    <Table>
                        <TableHeader className="sticky">
                            <TableRow className="font-roboto text-base opacity-60">
                                <TableHead><p className="flex items-center gap-1"><Disc3 className="size-4 sm:inline hidden" />Title</p></TableHead>
                                <TableHead><p className="flex items-center gap-1"><UserStar className="size-4 sm:inline hidden" />Artist</p></TableHead>
                                <TableHead><p className="flex items-center gap-1"><Music className="size-4 sm:inline hidden" />Tracks</p></TableHead>
                                <TableHead><p className="flex items-center gap-1"><Calendar1 className="size-4 sm:inline hidden" />Release Year</p></TableHead>
                                <TableHead><p className="flex justify-end items-center gap-1"><Settings className="size-4 sm:inline hidden" />Actions</p></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {albums.length === 0 ?
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={5} className="text-center pt-20">
                                        <span className="text-xl font-semibold">No albums found. Create one from the button above.</span>
                                    </TableCell>
                                </TableRow>
                                :
                                albums.map(album => (
                                    <TableRow key={album._id}>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-row items-center gap-2">
                                                <img src={album.imageURL} alt={album.title} className="size-10 aspect-square rounded-md object-cover hidden sm:inline" />
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
                                                disabled={isDeleting}
                                            >
                                                <Trash2 className="ml-auto size-4 transition-all duration-300 text-red-400 cursor-pointer" />
                                                <span className="hidden sm:inline-block font-xs">Delete</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

export default AlbumsTab