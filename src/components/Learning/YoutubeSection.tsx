import VideoCard from "./VideoCard";
import { YoutubeVideo } from "./types";

interface Props {

    videos: YoutubeVideo[];

    selectedVideo: string | null;

    onPlay: (video: YoutubeVideo) => void;

}

export default function YoutubeSection({

    videos,

    selectedVideo,

    onPlay,

}: Props) {

    if (!videos.length) {

        return (

            <div className="text-center py-8 text-gray-500">

                No videos found.

            </div>

        );

    }

    return (

        <div className="space-y-4">

            {videos.map((video) => (

                <VideoCard

                    key={video.videoId}

                    video={video}

                    active={selectedVideo === video.videoId}

                    onPlay={onPlay}

                />

            ))}

        </div>

    );

}