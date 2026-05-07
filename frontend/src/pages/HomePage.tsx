import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { Star, TrendingUp } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";
import FeaturedSongsSection from "@/components/FeaturedSongsSection";
import SongsGridSection from "@/components/SongsGridSection";
import TopBar from "@/components/TopBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlaybackStore } from "@/stores/usePlaybackStore";

const HomePage = () => {
    const { featuredSongs, personalizedSongs, trendingSongs, getPersonalizedSongs, getTrendingSongs, getFeaturedSongs, error, isLoading } = useMusicStore(useShallow(state => ({
        featuredSongs: state.featuredSongs,
        personalizedSongs: state.personalizedSongs,
        trendingSongs: state.trendingSongs,
        getPersonalizedSongs: state.getPersonalizedSongs,
        getTrendingSongs: state.getTrendingSongs,
        getFeaturedSongs: state.getFeaturedSongs,
        error: state.error,
        isLoading: state.isLoading
    })));

    const { initializeSongsQueue } = usePlaybackStore(useShallow(state => ({
        initializeSongsQueue: state.initializeSongsQueue
    })));

    useEffect(() => {
        void getFeaturedSongs();
        void getPersonalizedSongs();
        void getTrendingSongs();
    }, [getFeaturedSongs, getPersonalizedSongs, getTrendingSongs]);

    useEffect(() => {
        if (featuredSongs.length > 0 && personalizedSongs.length > 0 && trendingSongs.length > 0) {
            const allHomePageSongs = [...featuredSongs, ...personalizedSongs, ...trendingSongs];
            initializeSongsQueue(allHomePageSongs);
        }
    }, [featuredSongs, personalizedSongs, trendingSongs, initializeSongsQueue]);

    return (
        <div className="h-full border border-muted rounded-lg overflow-hidden bg-gradient-to-b from-card from-10% to-indigo-950">
            <TopBar />
            <ScrollArea className="h-[calc(100vh-(158px))]">
                <FeaturedSongsSection
                    loading={isLoading}
                    songs={featuredSongs}
                    error={error}
                />
                <SongsGridSection
                    loading={isLoading}
                    error={error}
                    title="For You"
                    icon={<Star className="size-6" />}
                    songs={personalizedSongs}
                />
                <SongsGridSection
                    loading={isLoading}
                    error={error}
                    title="Trending"
                    icon={<TrendingUp className="size-6" />}
                    songs={trendingSongs}
                />
            </ScrollArea>
        </div>
    )
}

export default HomePage