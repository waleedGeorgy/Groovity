import { useState } from "react"
import { Loader, PlusCircle } from "lucide-react"
import { axiosInstance } from "@/lib/axios"
import { createToast } from "@/functions"
import type { ApiError, ApiResponse } from "@/types"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import type { AxiosError } from "axios"
import { useMusicStore } from "@/stores/useMusicStore"
import { useShallow } from "zustand/react/shallow"

const AddAlbumButton = () => {
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const [newAlbum, setNewAlbum] = useState<{ title: string; artist: string; releaseYear: number }>({
        title: "",
        artist: "",
        releaseYear: new Date().getFullYear(),
    });

    const [newAlbumImage, setNewAlbumImage] = useState<File | null>(null);

    const { getAllAlbums } = useMusicStore(useShallow(state => ({
        getAllAlbums: state.getAllAlbums,
    })));

    const handleAddNewAlbum = async () => {
        setIsFormSubmitting(true);

        try {
            const formData = new FormData();

            if (newAlbumImage) formData.append("imageFile", newAlbumImage);
            formData.append("title", newAlbum.title);
            formData.append("artist", newAlbum.artist);
            formData.append("releaseYear", newAlbum.releaseYear.toString());

            const res = await axiosInstance.post<ApiResponse>("/admin/albums", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data.success) {
                void getAllAlbums();
                createToast("success", res.data.message);
            } else {
                createToast("error", res.data.message);
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            if (axiosError.response?.data?.message) {
                createToast("error", axiosError.response?.data?.message);
            } else if (axiosError.message) {
                createToast("error", axiosError.message);
            } else {
                createToast("error", "Failed to create album");
            }
        } finally {
            setNewAlbum({
                title: "",
                artist: "",
                releaseYear: new Date().getFullYear()
            });
            setNewAlbumImage(null);

            setIsFormSubmitting(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" className="cursor-pointer bg-emerald-500 hover:bg-emerald-400">
                    <PlusCircle /><span className="hidden sm:inline-block">Create Album</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-2xl font-roboto font-medium">Create new album</DialogTitle>
                </DialogHeader>
                <div className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="image" className="opacity-60">Album cover*</Label>
                        <Input type="file" className="cursor-pointer" id="image" accept=".png, .jpg, .jpeg .webp" onChange={(e) => setNewAlbumImage(e.target.files![0])} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="title" className="opacity-60">Title*</Label>
                        <Input value={newAlbum.title} id="title" onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="artist" className="opacity-60">Artist*</Label>
                        <Input value={newAlbum.artist} id="artist" onChange={(e) => setNewAlbum({ ...newAlbum, artist: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="duration" className="opacity-60">Release year*</Label>
                        <Input value={newAlbum.releaseYear} id="duration" onChange={(e) => setNewAlbum({ ...newAlbum, releaseYear: parseInt(e.target.value) })} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isFormSubmitting} className="cursor-pointer">Cancel</Button>
                    </DialogClose>
                    <Button
                        onClick={() => void handleAddNewAlbum()}
                        disabled={isFormSubmitting || newAlbum.artist.trim() === "" || newAlbum.title.trim() === "" || !newAlbum.releaseYear || !newAlbumImage}
                        variant="secondary"
                        className="bg-indigo-500 hover:bg-indigo-600 transition-all duration-300 cursor-pointer"
                    >
                        {isFormSubmitting ?
                            <span className="flex flex-row items-center justify-center gap-2"><Loader className="animate-spin" />Creating</span>
                            :
                            <span>Create</span>
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddAlbumButton