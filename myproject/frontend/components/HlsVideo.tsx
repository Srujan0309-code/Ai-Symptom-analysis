"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface HlsVideoProps {
  src: string;
  poster?: string;
  className?: string;
  desaturated?: boolean;
}

export const HlsVideo = ({ 
  src, 
  poster, 
  className = "", 
  desaturated = false 
}: HlsVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(err => console.log("Video autoplay blocked:", err));
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // For Safari which has built-in HLS support
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(err => console.log("Video autoplay blocked:", err));
      });
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      poster={poster}
      className={`${className} ${desaturated ? "saturate-0" : ""}`}
      autoPlay
      loop
      muted
      playsInline
    />
  );
};
