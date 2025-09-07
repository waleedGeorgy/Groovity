import { Loader, PlusCircle } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useState } from "react"
import { axiosInstance } from "@/lib/axios"
import { createToast } from "@/functions"
import type { AxiosError } from "axios"
import type { ApiError } from "@/types"

const AddAlbumButton = () => {
    const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
    const [newAlbum, setNewAlbum] = useState<{ title: string; artist: string; releaseYear: number }>({
        title: "",
        artist: "",
        releaseYear: new Date().getFullYear(),
    });

    const [newAlbumImage, setNewAlbumImage] = useState<File | null>(null);


    const handleAddNewAlbum = async () => {
        setIsFormSubmitting(true);

        try {
            const formData = new FormData();

            if (newAlbumImage) formData.append("imageFile", newAlbumImage);
            formData.append("title", newAlbum.title);
            formData.append("artist", newAlbum.artist);
            formData.append("releaseYear", newAlbum.releaseYear.toString());

            await axiosInstance.post("/admin/albums", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setNewAlbum({
                title: "",
                artist: "",
                releaseYear: new Date().getFullYear()
            });
            setNewAlbumImage(null);

            createToast("success", "Album created successfully");
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
            setIsFormSubmitting(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" className="cursor-pointer bg-emerald-500 hover:bg-emerald-400">
                    <PlusCircle /><span>Create Album</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90%]">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-2xl font-roboto font-medium">Add New Album</DialogTitle>
                </DialogHeader>
                <div className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="image" className="opacity-60">Image File*</Label>
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
                        <Label htmlFor="duration" className="opacity-60">Release Year*</Label>
                        <Input value={newAlbum.releaseYear} id="duration" onChange={(e) => setNewAlbum({ ...newAlbum, releaseYear: parseInt(e.target.value) })} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isFormSubmitting} className="cursor-pointer">Cancel</Button>
                    </DialogClose>
                    <Button onClick={() => void handleAddNewAlbum()} disabled={isFormSubmitting} variant="secondary" className="bg-indigo-500 hover:bg-indigo-600 transition-all duration-300 cursor-pointer">
                        {isFormSubmitting ? (<span className="flex flex-row items-center justify-center gap-2"><Loader className="animate-spin" />Adding</span>) : (<span>Create</span>)}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}

export default AddAlbumButton