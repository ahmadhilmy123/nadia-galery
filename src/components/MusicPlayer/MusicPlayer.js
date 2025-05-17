// src/components/MusicPlayer/MusicPlayer.js
import React, { useRef, useState, useEffect } from 'react';
import styles from './MusicPlayer.module.css';

const MusicPlayer = ({ songs, currentSong, setCurrentSong, isPlaying, setIsPlaying }) => {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isExpanded, setIsExpanded] = useState(false);
  const [autoplayAttempted, setAutoplayAttempted] = useState(false);

  // Effect untuk mengatur autoplay saat komponen dimuat pertama kali
  useEffect(() => {
    if (!autoplayAttempted && songs && songs.length > 0) {
      setAutoplayAttempted(true);
      setIsPlaying(true); // Mencoba memulai autoplay
      
      // Atur tampilan player agar terbuka
      setIsExpanded(true);
    }
  }, [songs, autoplayAttempted, setIsPlaying]);

  // Effect untuk mengatur volume audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Effect untuk mengatur pemutaran dan jeda
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.error("Gagal memutar audio:", error);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong, setIsPlaying]);

  // Fungsi untuk memutarkan atau menjeda lagu
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Fungsi untuk mengganti lagu berikutnya
  const playNextSong = () => {
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
    if (isPlaying) {
      setIsPlaying(true);
    }
  };

  // Fungsi untuk mengganti lagu sebelumnya
  const playPrevSong = () => {
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
    if (isPlaying) {
      setIsPlaying(true);
    }
  };

  // Handler untuk updateData saat pemutaran
  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const durationTime = e.target.duration;
    setCurrentTime(current);
    setDuration(durationTime);
  };

  // Handler untuk mengganti lagu saat selesai
  const songEndHandler = () => {
    playNextSong();
  };

  // Fungsi untuk mengubah posisi waktu pemutaran
  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value;
    setCurrentTime(e.target.value);
  };

  // Fungsi untuk mengubah volume
  const volumeHandler = (e) => {
    const value = e.target.value;
    setVolume(value);
    audioRef.current.volume = value;
  };

  // Fungsi untuk format waktu dalam format mm:ss
  const getTime = (time) => {
    if (isNaN(time)) return "0:00";
    return Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2);
  };

  // Toggle tampilan player
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`${styles.musicPlayer} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.playerToggle} onClick={toggleExpand}>
        <span>{isExpanded ? "▼" : "▲"} Music Player</span>
      </div>

      <div className={styles.playerContent}>
        <div className={styles.songInfo}>
          <h3>{currentSong.title}</h3>
          <p>{currentSong.artist}</p>
        </div>

        <div className={styles.controls}>
          <button onClick={playPrevSong} className={styles.controlButton}>
            <span className={styles.prevIcon}>⏮</span>
          </button>
          <button onClick={togglePlay} className={`${styles.controlButton} ${styles.playButton}`}>
            <span>{isPlaying ? "⏸" : "▶"}</span>
          </button>
          <button onClick={playNextSong} className={styles.controlButton}>
            <span className={styles.nextIcon}>⏭</span>
          </button>
        </div>

        <div className={styles.timeline}>
          <span className={styles.timeDisplay}>{getTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={dragHandler}
            className={styles.progressBar}
          />
          <span className={styles.timeDisplay}>{getTime(duration)}</span>
        </div>

        <div className={styles.volumeControl}>
          <span className={styles.volumeIcon}>🔈</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={volumeHandler}
            className={styles.volumeSlider}
          />
        </div>

        <audio
          onTimeUpdate={timeUpdateHandler}
          onLoadedMetadata={timeUpdateHandler}
          ref={audioRef}
          src={currentSong.src}
          onEnded={songEndHandler}
        ></audio>
      </div>
    </div>
  );
};

export default MusicPlayer;