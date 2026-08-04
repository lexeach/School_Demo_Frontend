import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import UIButton from "@/UI/Elements/Button";

import {

    BookOpen,

} from "lucide-react";

import ExplanationSection
from "./ExplanationSection";

import YoutubeSection
from "./YoutubeSection";

import PdfViewer
from "./PdfViewer";

import LearningVideoPlayer
from "./LearningVideoPlayer";


interface Props {

    question:any;

    openAccordion:string;

    setOpenAccordion:(v:string)=>void;

    handleLearning:any;

    loadingLearning:boolean;

    fetchingLearning:boolean;

    waitingForExplanation:boolean;

    learningData:any;

    browserVideos:any[];

    browserPdfs:any[];

    loadingResources:boolean;

    iframeReady:boolean;

    setIframeReady:any;

    selectedVideo:string|null;

    setSelectedVideo:any;

    setPlayingVideo:any;

    videoPlayerRef:any;

    explanationLoading:boolean;

    completedQuestions:any;

    setVerificationOpen:any;

    setVerificationQuestion:any;

    resourceCache:any;

    loadBrowserResources:any;

}


export default function LearningAccordion({

    question,

    openAccordion,

    setOpenAccordion,

    handleLearning,

    loadingLearning,

    fetchingLearning,

    waitingForExplanation,

    learningData,

    browserVideos,

    browserPdfs,

    loadingResources,

    iframeReady,

    setIframeReady,

    selectedVideo,

    setSelectedVideo,

    setPlayingVideo,

    videoPlayerRef,

    explanationLoading,

    completedQuestions,

    setVerificationOpen,
    
    setVerificationQuestion,

    resourceCache,

    loadBrowserResources,

}:Props){

return(

<Accordion

type="single"

collapsible

value={openAccordion}

onValueChange={(value) => {

    setOpenAccordion(value);

    if (value) {

        handleLearning(
            question,
            value
        );

    }

}}

className="mt-4"

>

<AccordionItem

value={`question-${question.questionNumber}`}

className="border-none"

>

<AccordionTrigger

className="

text-sm

font-semibold

text-blue-600

hover:text-blue-800

hover:no-underline

py-2

justify-start

gap-2

"

disabled={

(loadingLearning||fetchingLearning)

}

>

{(loadingLearning||fetchingLearning)?(

<>

<div

className="

animate-spin

rounded-full

h-4

w-4

border-b-2

border-blue-600

"

/>

<span>

Loading Learning Content...

</span>

</>

):(

<>

<BookOpen size={16}/>

<span>

Learning Content

</span>

</>

)}

</AccordionTrigger>

<AccordionContent>


{waitingForExplanation ||
!learningData?.data ? (

<div className="py-10 text-center">

<div

className="

animate-spin

rounded-full

h-10

w-10

border-b-2

border-blue-600

mx-auto

"

/>

<h3

className="

mt-4

font-semibold

text-blue-700

"

>

Explanation Loading...

</h3>

<p

className="

text-gray-500

mt-2

"

>

Please wait...

</p>

</div>

):(

<div className="space-y-6">

    <ExplanationSection

        explanation={
            learningData?.data?.explanation ??
            ""
        }

        loading={
            explanationLoading
        }

    />

    <LearningVideoPlayer

        selectedVideo={selectedVideo}

        iframeReady={iframeReady}

        setIframeReady={setIframeReady}

        videoPlayerRef={videoPlayerRef}

    />

    <YoutubeSection

        videos={browserVideos}

        selectedVideo={selectedVideo}

        onPlay={(video)=>{

            setIframeReady(false);

            setSelectedVideo(video.videoId);

            setPlayingVideo(video);

            setTimeout(()=>{

                videoPlayerRef.current?.scrollIntoView({

                    behavior:"smooth",

                    block:"start",

                });

            },150);

        }}

    />

    <PdfViewer

        pdfs={browserPdfs}

    />


{!waitingForExplanation && (

    <div className="pt-3">

        <UIButton
    variant="sky"
    className="w-full md:w-auto"
    onClick={() => {
        setVerificationQuestion(question);
        setVerificationOpen(true);
    }}
>
    I Learnt
</UIButton>

    </div>

)}

{loadingResources && (

<div

className="

rounded-xl

border

bg-blue-50

p-4

text-center

"

>

<div

className="

animate-spin

rounded-full

h-8

w-8

border-b-2

border-blue-600

mx-auto

"

/>

<p

className="mt-3"

>

Searching Videos & PDFs...

</p>

</div>

)}


{completedQuestions?.[question.questionNumber] && (

<div

className="

rounded-lg

bg-green-100

text-green-700

px-3

py-2

text-sm

"

>

Learning Completed

</div>

)}
    </div>

)}

</AccordionContent>

</AccordionItem>

</Accordion>

);

}
    


