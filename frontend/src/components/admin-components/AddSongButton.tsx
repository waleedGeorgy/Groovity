import { useState } from "react"
import { Loader, PlusCircle } from "lucide-react"
import type { AxiosError } from "axios"
import { axiosInstance } from "@/lib/axios"
import { useMusicStore } from "@/stores/useMusicStore"
import type { ApiError } from "@/types"
import { createToast } from "@/functions"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"

const AddSongButton = () => {
    const { albums } = useMusicStore();

    const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);

    const [newSong, setNewSong] = useState<{ title: string; artist: string; duration: string; album: string }>({
        title: "",
        artist: "",
        duration: "0",
        album: "",
    });
    const [newSongFiles, setNewSongFiles] = useState<{ image: File | null; audio: File | null }>({
        image: null,
        audio: null
    });

    const handleAddNewSong = async () => {
        setIsFormSubmitting(true);

        try {
            const formData = new FormData();

            if (newSongFiles.image) formData.append("imageFile", newSongFiles.image);
            if (newSongFiles.audio) formData.append("audioFile", newSongFiles.audio);

            formData.append("title", newSong.title);
            formData.append("artist", newSong.artist);
            formData.append("duration", newSong.duration);
            if (newSong.album && newSong.album !== "none") {
                formData.append("albumID", newSong.album);
            }

            await axiosInstance.post("/admin/songs", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setNewSong({
                title: "",
                artist: "",
                duration: "0",
                album: ""
            });

            setNewSongFiles({
                audio: null,
                image: null
            });

            createToast("success", "Song added successfully")
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            if (axiosError.response?.data?.message) {
                createToast("error", axiosError.response?.data?.message);
            } else if (axiosError.message) {
                createToast("error", axiosError.message);
            } else {
                createToast("error", "Failed to add song");
            }
        } finally {
            setIsFormSubmitting(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" className="cursor-pointer bg-emerald-500 hover:bg-emerald-400">
                    <PlusCircle /><span>Add Song</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90%]">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-2xl font-roboto font-medium">Add New Song</DialogTitle>
                </DialogHeader>
                <div className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="image" className="opacity-60">Image File*</Label>
                        <Input type="file" className="cursor-pointer" id="image" accept=".png, .jpg, .jpeg .webp" onChange={(e) => setNewSongFiles((prev) => ({ ...prev, image: e.target.files![0] }))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="audio" className="opacity-60">Audio File*</Label>
                        <Input type="file" className="cursor-pointer" id="audio" accept="audio/*" onChange={(e) => setNewSongFiles((prev) => ({ ...prev, audio: e.target.files![0] }))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="title" className="opacity-60">Title*</Label>
                        <Input value={newSong.title} id="title" onChange={(e) => setNewSong({ ...newSong, title: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="artist" className="opacity-60">Artist*</Label>
                        <Input value={newSong.artist} id="artist" onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="duration" className="opacity-60">Duration* (in seconds)</Label>
                        <Input value={newSong.duration} type="number" min="0" id="duration" onChange={(e) => setNewSong({ ...newSong, duration: e.target.value || "0" })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="album" className="opacity-60">Album</Label>
                        <Select value={newSong.album} onValueChange={(value) => setNewSong({ ...newSong, album: value })}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select an album" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>No album</SelectLabel>
                                    <SelectItem value="none">Single</SelectItem>
                                    <SelectLabel>Available albums</SelectLabel>
                                    {albums.map((album) => (
                                        <SelectItem value={album._id} key={album._id}>
                                            {album.title}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isFormSubmitting} className="cursor-pointer">Cancel</Button>
                    </DialogClose>
                    <Button onClick={() => void handleAddNewSong()} disabled={isFormSubmitting} variant="secondary" className="bg-indigo-500 hover:bg-indigo-600 transition-all duration-300 cursor-pointer">
                        {isFormSubmitting ? (<span className="flex flex-row items-center justify-center gap-2"><Loader className="animate-spin" />Adding</span>) : (<span>Add</span>)}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}

export default AddSongButton