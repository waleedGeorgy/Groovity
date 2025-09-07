import { Library, ListMusic, Users, UserStar } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore"
import StatsCard from "./StatsCard";
import StatsCardsSkeleton from "../skeletons/StatsCardsSkeleton";

const AdminDashboard = () => {
  const { stats, isStatsLoading } = useMusicStore();

  const statsArray = [
    {
      icon: ListMusic,
      label: "Total songs",
      stat: stats.totalSongs.toString(),
      bgColor: "bg-amber-500/10",
      iconColor: "text-amber-500",
    },
    {
      icon: Library,
      label: "Total albums",
      stat: stats.totalAlbums.toString(),
      bgColor: "bg-teal-500/10",
      iconColor: "text-teal-500"
    },
    {
      icon: UserStar,
      label: "Total artist",
      stat: stats.totalArtists.toString(),
      bgColor: "bg-rose-500/10",
      iconColor: "text-rose-500"
    },
    {
      icon: Users,
      label: "Total users",
      stat: stats.totalUsers.toString(),
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-500"
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {isStatsLoading ?
        (<StatsCardsSkeleton />)
        :
        ((statsArray.map((stat, id) => (
          <StatsCard key={id} {...stat} />
        ))))}
    </div>
  )
}

export default AdminDashboard