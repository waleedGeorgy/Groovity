import { useEffect } from "react";
import { redirect } from "react-router";
import { useShallow } from "zustand/react/shallow";
import AdminDashboard from "@/components/admin-components/AdminDashboard";
import AdminHeader from "@/components/admin-components/AdminHeader";
import AdminMusicControls from "@/components/admin-components/AdminMusicControls";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMusicStore } from "@/stores/useMusicStore";

const AdminPage = () => {
    const { isAdmin } = useAuthStore();

    const { getAllSongs, getAllAlbums, getAllStats } = useMusicStore(useShallow(state => ({
        getAllSongs: state.getAllSongs,
        getAllAlbums: state.getAllAlbums,
        getAllStats: state.getAllStats
    })));

    useEffect(() => {
        void getAllSongs();
        void getAllAlbums();
        void getAllStats();
    }, [getAllSongs, getAllAlbums, getAllStats]);

    if (!isAdmin) redirect("/");

    return (
        <div className="min-h-screen p-6 sm:px-12 space-y-8">
            <AdminHeader />
            <AdminDashboard />
            <AdminMusicControls />
        </div>
    )
}

export default AdminPage