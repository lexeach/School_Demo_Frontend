import { useRef, useState } from "react";

export function useYoutubePlayer() {

    const videoPlayerRef =
        useRef<HTMLDivElement>(null);

    const [selectedVideo,
        setSelectedVideo] =
        useState<string | null>(null);

    const [playingVideo,
        setPlayingVideo] =
        useState<any>(null);

    const [iframeReady,
        setIframeReady] =
        useState(false);

    return {

        videoPlayerRef,

        selectedVideo,
        setSelectedVideo,

        playingVideo,
        setPlayingVideo,

        iframeReady,
        setIframeReady,

    };

}