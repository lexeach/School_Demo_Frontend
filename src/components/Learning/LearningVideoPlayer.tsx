import { useEffect } from "react";

interface Props {

    selectedVideo: string | null;

    iframeReady: boolean;

    setIframeReady: (value: boolean) => void;

    videoPlayerRef: React.RefObject<HTMLDivElement>;

}

export default function LearningVideoPlayer({

    selectedVideo,

    iframeReady,

    setIframeReady,

    videoPlayerRef,

}: Props) {

    useEffect(() => {

        setIframeReady(false);

    }, [selectedVideo]);

    if (!selectedVideo) return null;

    return (

        <div
            ref={videoPlayerRef}
            className="mb-6"
        >

            {!iframeReady && (

                <div className="relative">

                    <div className="absolute inset-0 z-20 rounded-xl bg-black/70 flex items-center justify-center">

                        <div className="text-center text-white">

                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto"></div>

                            <p className="mt-3">

                                Preparing Video...

                            </p>

                        </div>

                    </div>

                </div>

            )}

            <div

                className="
                    relative
                    w-full
                    aspect-video
                    rounded-xl
                    overflow-hidden
                    border
                    bg-black
                    shadow-lg
                "

            >

                <iframe

                    key={selectedVideo}

                   // src={`https://www.youtube-nocookie.com/embed/${selectedVideo}?autoplay=1&playsinline=1&controls=1&rel=0&modestbranding=1`}
                   //src={`https://www.youtube-nocookie.com/embed/${selectedVideo}?autoplay=1&playsinline=1&controls=1&fs=1&playsinline=0&rel=0&modestbranding=1`}
                    //title="Learning Video"

                    src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&controls=1&fs=1&playsinline=0&rel=0`}
                    className="absolute inset-0 w-full h-full"

                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share"

                    allowFullScreen

                    onLoad={() => {

                        setIframeReady(true);

                    }}

                />

            </div>

        </div>

    );

}
