import { Trash2, Disc3, UserStar, Settings, Music2, Clock4, Loader2 } from "lucide-react"
import { useMusicStore } from "@/stores/useMusicStore"
import { durationInMinutes } from "@/functions"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { ScrollArea } from "../ui/scroll-area"
import AddSongButton from "./AddSongButton"
import { useShallow } from "zustand/react/shallow"

const SongsTab = () => {
  const { songs, isAllSongsLoading, error, deleteSong, isDeleting } = useMusicStore(useShallow(state => ({
    songs: state.songs,
    isAllSongsLoading: state.isAllSongsLoading,
    error: state.error,
    deleteSong: state.deleteSong,
    isDeleting: state.isDeleting
  })));

  if (isAllSongsLoading) {
    return (
      <Card className="py-48">
        <Table>
          <TableBody>
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={4} className="text-center flex items-center justify-center gap-2 opacity-65">
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
                <h2 className="text-3xl font-medium font-roboto mt-4 ">Error fetching songs</h2>
                <p className="text-lg">{error}</p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-card from-60% to to-amber-950 to-100%">
      <CardHeader>
        <div className="flex flex-row items-center justify-between gap-1">
          <h2 className="flex items-center gap-1 text-2xl font-roboto">
            <Music2 className="size-6 text-indigo-500" />Songs library
          </h2>
          <AddSongButton />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <Table>
            <TableHeader className="sticky">
              <TableRow className="font-roboto text-base p-4 opacity-60">
                <TableHead><span className="flex items-center gap-1"><Disc3 className="size-4 inline" />Title</span></TableHead>
                <TableHead><span className="flex items-center gap-1"><UserStar className="size-4 inline" />Artist</span></TableHead>
                <TableHead><span className="flex items-center gap-1"><Clock4 className="size-4 inline" />Duration</span></TableHead>
                <TableHead><span className="flex justify-end items-center gap-1"><Settings className="size-4 inline" />Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {songs.length === 0 ?
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={4} className="text-center pt-20">
                    <span className="text-xl font-semibold">No songs found. Add one from the button above.</span>
                  </TableCell>
                </TableRow>
                :
                songs.map(song => (
                  <TableRow key={song._id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-row items-center gap-2">
                        <img src={song.imageURL} alt={song.title} className="size-10 aspect-square rounded-md object-cover" />
                        <h3>{song.title}</h3>
                      </div>
                    </TableCell>
                    <TableCell>{song.artist}</TableCell>
                    <TableCell>{durationInMinutes(song.duration)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => void deleteSong(song._id)}
                        disabled={isDeleting}
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

export default SongsTab