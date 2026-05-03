import { Trash2, Disc3, UserStar, Settings, Music2, Clock4 } from "lucide-react"
import { useMusicStore } from "@/stores/useMusicStore"
import { durationInMinutes } from "@/functions"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { ScrollArea } from "../ui/scroll-area"
import AddSongButton from "./AddSongButton"

const SongsTab = () => {
  const { songs, isSongsLoading, error, deleteSong } = useMusicStore();

  if (isSongsLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <h1 className="text-3xl font-semibold font-roboto mt-4 animate-pulse">Loading data...</h1>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center flex-col justify-center p-6 gap-2">
        <h1 className="text-4xl font-semibold font-roboto mt-4 ">Error fetching songs</h1>
        <p className="text-lg font-light">{error}</p>
      </div>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-card from-60% to to-amber-950 to-100%">
      <CardHeader>
        <div className="flex flex-row items-center justify-between gap-1">
          <h3 className="flex items-center gap-1 text-2xl font-roboto"><Music2 className="size-6 text-indigo-500" />Songs Library</h3>
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
              {songs.map((song) => {
                return (<TableRow key={song._id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-row items-center gap-2">
                      <img src={song.imageURL} alt={song.title} className="size-10 aspect-square rounded-md object-cover" />
                      <h2>{song.title}</h2>
                    </div>
                  </TableCell>
                  <TableCell>{song.artist}</TableCell>
                  <TableCell>{durationInMinutes(song.duration)}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" className="cursor-pointer" onClick={() => void deleteSong(song._id)}>
                      <Trash2 className="ml-auto size-4 transition-all duration-300 text-red-400 cursor-pointer" />
                      <span className="font-xs">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default SongsTab