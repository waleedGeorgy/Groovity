import { Library, Music2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import SongsTab from "./SongsTab"
import AlbumsTab from "./AlbumsTab"

const AdminMusicControls = () => {
    return (
        <Tabs defaultValue="songs">
            <TabsList className="bg-card">
                <TabsTrigger value="songs" className="cursor-pointer"><Music2 />Songs</TabsTrigger>
                <TabsTrigger value="albums" className="cursor-pointer"><Library />Albums</TabsTrigger>
            </TabsList>
            <TabsContent value="songs">
                <SongsTab />
            </TabsContent>
            <TabsContent value="albums">
                <AlbumsTab />
            </TabsContent>
        </Tabs>
    )
}

export default AdminMusicControls