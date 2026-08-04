export interface YoutubeVideo {
    videoId: string;
    title: string;
    thumbnail: string;
    duration: string;
    channelTitle: string;
    videoUrl?: string;
}

export interface PdfItem {
    title: string;
    url: string;
}

export interface LearningData {
    topic: string;
    learningObjective: string;
    explanation: string;
    keywords: string[];
    videoSearchQuery: string;
}