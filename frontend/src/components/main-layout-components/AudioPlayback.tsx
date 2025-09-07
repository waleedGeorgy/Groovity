import { useEffect, useRef } from "react";
import { usePlaybackStore } from "@/stores/usePlaybackStore";

const AudioPlayback = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const prevSongRef = useRef<string | null>(null);

    const { currentSong, isSongPlaying, playNextSong } = usePlaybackStore();

    // Handle song play/pause
    useEffect(() => {
        if (isSongPlaying) void audioRef.current?.play();
        else audioRef.current?.pause();
    }, [isSongPlaying]);

    // Handle playing next song when the current one ends
    useEffect(() => {
        const audio = audioRef.current;

        const handleSongEnd = () => {
            playNextSong();
        }

        audio?.addEventListener("ended", handleSongEnd);

        return () => { audio?.removeEventListener("ended", handleSongEnd) };
    }, [playNextSong]);

    // Handle playing a different song and not resetting its play time
    useEffect(() => {
        if (!prevSongRef || !currentSong || !audioRef.current) return;

        const audio = audioRef.current;

        const isSongChanged = prevSongRef.current !== currentSong?.audioURL;
        if (isSongChanged) {
            audio.src = currentSong?.audioURL;
            audio.currentTime = 0;
            prevSongRef.current = currentSong.audioURL;

            if (isSongPlaying) void audio.play();
        }
    }, [currentSong, isSongPlaying]);

    return <audio ref={audioRef} />
}

export default AudioPlayback