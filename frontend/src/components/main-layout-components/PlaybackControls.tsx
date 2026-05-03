import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume1, Volume, Volume2, VolumeX } from "lucide-react";
import { durationInMinutes } from "@/functions";
import { usePlaybackStore } from "@/stores/usePlaybackStore"
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";

const PlaybackControls = () => {
  const { currentSong, isSongPlaying, toggleSongPlay, playNextSong, playPrevSong } = usePlaybackStore(useShallow(state => ({
    currentSong: state.currentSong,
    isSongPlaying: state.isSongPlaying,
    toggleSongPlay: state.toggleSongPlay,
    playNextSong: state.playNextSong,
    playPrevSong: state.playPrevSong
  })));

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = document.querySelector("audio");

    const audio = audioRef.current;
    if (!audio) return;

    const updateSongTime = () => setCurrentTime(audio.currentTime)
    const updateSongDuration = () => setDuration(audio.duration)
    const handleSongEnd = () => usePlaybackStore.setState({ isSongPlaying: false })

    audio.addEventListener("timeupdate", updateSongTime);
    audio.addEventListener("loadedmetadata", updateSongDuration);
    audio.addEventListener("ended", handleSongEnd);

    return () => {
      audio.removeEventListener("timeupdate", updateSongTime);
      audio.removeEventListener("loadedmetadata", updateSongDuration);
      audio.removeEventListener("ended", handleSongEnd);
    }
  }, [currentSong]);

  const handleSeekControls = (values: number[]) => {
    if (audioRef.current) audioRef.current.currentTime = values[0]
  }

  return (
    <footer className='py-3 bg-card border-t px-8'>
      <div className='flex flex-wrap gap-6 justify-between items-center h-full'>
        {/* currently playing song info */}
        <div className='flex items-center gap-3 flex-1'>
          {currentSong && (
            <>
              <img
                src={currentSong.imageURL}
                alt={currentSong.title}
                className='size-10 sm:size-14 object-cover aspect-square rounded-md border'
              />
              <div className='flex-1 min-w-0 inline-block'>
                <h2 className='truncate text-sm sm:text-base'>
                  {currentSong.title}
                </h2>
                <h3 className='opacity-60 truncate text-xs sm:text-sm'>
                  {currentSong.artist}
                </h3>
              </div>
            </>
          )}
        </div>
        {/* playback controls*/}
        <div className='flex flex-col items-center gap-2 flex-1'>
          <div className='flex items-center gap-4 sm:gap-6'>
            <Button
              size='icon'
              variant='ghost'
              className='hidden sm:inline-flex hover:text-white text-zinc-400 cursor-pointer'
            >
              <Shuffle className='size-4' />
            </Button>
            <Button
              size='icon'
              variant='ghost'
              className='hover:text-white text-zinc-400 cursor-pointer'
              onClick={playPrevSong}
              disabled={!currentSong}
            >
              <SkipBack className='size-4' />
            </Button>
            <Button
              size='icon'
              className='bg-indigo-500 hover:bg-indigo-400 cursor-pointer rounded-full size-9'
              onClick={toggleSongPlay}
              disabled={!currentSong}
            >
              {isSongPlaying ? <Pause className='size-4' /> : <Play className='size-4' />}
            </Button>
            <Button
              size='icon'
              variant='ghost'
              className='hover:text-white text-zinc-400 cursor-pointer'
              onClick={playNextSong}
              disabled={!currentSong}
            >
              <SkipForward className='size-4' />
            </Button>
            <Button
              size='icon'
              variant='ghost'
              className='hidden sm:inline-flex hover:text-white text-zinc-400 cursor-pointer'
            >
              <Repeat className='size-4' />
            </Button>
          </div>
          <div className='hidden sm:flex items-center gap-2 w-full'>
            <div className='text-xs text-zinc-400'>{durationInMinutes(currentTime)}</div>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              className='w-full hover:cursor-grab active:cursor-grabbing'
              onValueChange={handleSeekControls}
            />
            <div className='text-xs text-zinc-400'>{durationInMinutes(duration)}</div>
          </div>
        </div>
        {/* volume controls */}
        <div className='flex items-center justify-end flex-1'>
          <div className='flex items-center gap-1'>
            <Button size='icon' variant='ghost' className='hover:text-white text-zinc-400 cursor-pointer' onClick={() => {
              if (volume != 0) {
                setVolume(0);
                if (audioRef.current) {
                  audioRef.current.volume = 0;
                }
              }
            }}>
              {volume === 0 && (<VolumeX className='size-4' />)}
              {volume > 0 && volume <= 33 && (<Volume className='size-4' />)}
              {volume > 33 && volume <= 66 && (<Volume1 className='size-4' />)}
              {volume > 66 && volume <= 100 && (<Volume2 className='size-4' />)}
            </Button>
            <Slider
              value={[volume]}
              max={100}
              step={1}
              className='w-28 hover:cursor-grab active:cursor-grabbing'
              onValueChange={(value) => {
                setVolume(value[0]);
                if (audioRef.current) audioRef.current.volume = value[0] / 100;
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default PlaybackControls