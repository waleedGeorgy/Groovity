import { useEffect } from "react";
import AdminDashboard from "@/components/admin-components/AdminDashboard";
import AdminHeader from "@/components/admin-components/AdminHeader";
import AdminMusicControls from "@/components/admin-components/AdminMusicControls";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMusicStore } from "@/stores/useMusicStore";

const AdminPage = () => {
    const { isAdmin } = useAuthStore();
    const { getAllSongs, getAllAlbums, getAllStats } = useMusicStore();

    useEffect(() => {
        void getAllSongs();
        void getAllAlbums();
        void getAllStats();

    }, [getAllSongs, getAllAlbums, getAllStats]);

    if (!isAdmin) return <div><h1>Unauthorized Access</h1></div>

    return (
        <div className="min-h-screen py-6 px-6 sm:px-12 space-y-8">
            <AdminHeader />
            <AdminDashboard />
            <AdminMusicControls />
        </div>
    )
}

export default AdminPage