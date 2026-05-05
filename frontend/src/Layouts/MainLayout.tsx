import { Outlet } from "react-router"
import PlaylistArea from "@/components/main-layout-components/PlaylistArea"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import AudioPlayback from "@/components/main-layout-components/AudioPlayback"
import PlaybackControls from "@/components/main-layout-components/PlaybackControls"
import UsersPanel from "@/components/main-layout-components/UsersPanel"
import RightNavbar from "@/components/main-layout-components/RightNavbar"

const MainLayout = () => {
    return (
        <div className="h-screen">
            <ResizablePanelGroup direction="vertical">
                <ResizablePanelGroup direction="horizontal" className="h-full overflow-hidden p-2">
                    <AudioPlayback />
                    <ResizablePanel defaultSize={15} minSize={0} maxSize={20} collapsedSize={0}>
                        <UsersPanel />
                    </ResizablePanel>
                    <ResizableHandle withHandle className="bg-background hover:bg-indigo-700 mx-0.5 px-0.5 rounded-lg transition duration-100" />
                    <ResizablePanel defaultSize={65}>
                        <Outlet />
                    </ResizablePanel>
                    <ResizableHandle withHandle className="bg-background hover:bg-indigo-700 mx-0.5 px-0.5 rounded-lg transition duration-100" />
                    <ResizablePanel defaultSize={20} minSize={0} maxSize={25}>
                        <RightNavbar />
                        <PlaylistArea />
                    </ResizablePanel>
                </ResizablePanelGroup>
                <PlaybackControls />
            </ResizablePanelGroup>
        </div>
    )
}

export default MainLayout