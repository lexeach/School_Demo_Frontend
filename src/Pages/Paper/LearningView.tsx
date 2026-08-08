import UILayout from "@/UI/Elements/Layout";
import ViewHeader from "@/UI/Container/ViewHeader";

import {
  useGetSinglePaperQuery,
  useGetLearningResourcesQuery,
  useGetAllLearningResourcesQuery,
} from "@/service/paper";
import {
  useLazyGetLearningVerificationQuery,
} from "@/service/learningVerification";
import VerificationDialog from "@/components/LearningVerification/VerificationDialog";

import UIButton from "@/UI/Elements/Button";

import {  useParams } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon, BookOpen } from "lucide-react";

import { useEffect, useState, useRef } from "react";
//import axios from "axios";
import api from "@/service/api";
import {
    useYoutubePlayer
} from "@/components/Learning/hooks";
import LearningVideoPlayer
from "@/components/Learning/LearningVideoPlayer";
import YoutubeSection
from "@/components/Learning/YoutubeSection";
import PdfViewer
from "@/components/Learning/PdfViewer";
import ExplanationSection
from "@/components/Learning/ExplanationSection";

import LearningAccordion
from "@/components/Learning/LearningAccordion";




const isExplanationGenerationPending = (error: unknown): boolean => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const { status, data } = error as { status?: number; data?: unknown };

  if (status === 404) {
    return true;
  }

  if (data && typeof data === "object") {
    const { code } = data as { code?: number };
    if (code === 404) {
      return true;
    }
  }

  return false;
};
interface CompletedQuestions {
  [key: number]: boolean;
}
const PaperView = () => {
  const param = useParams();
  const { id } = param;
  
  const [selectedQuestionForLearning, setSelectedQuestionForLearning] =
  useState(null);

const [pendingLearningQuestion, setPendingLearningQuestion] =
  useState<any>(null);

const [openAccordion, setOpenAccordion] =
  useState("");

const [verificationOpen, setVerificationOpen] =
  useState(false);

interface VerificationQuestionState {
    questionNumber:number;
    [key:string]:any;
}

const [verificationQuestion,setVerificationQuestion]=
useState<VerificationQuestionState | null>(null);

const [completedQuestions, setCompletedQuestions] =
  useState<CompletedQuestions>({});

//====================================================
// Browser Learning Resources
//====================================================

const [browserVideos, setBrowserVideos] =
  useState<any[]>([]);

const [browserPdfs, setBrowserPdfs] =
  useState<any[]>([]);

const resourceCache =
    sessionStorage;

  const {

    videoPlayerRef,

    selectedVideo,
    setSelectedVideo,

    playingVideo,
    setPlayingVideo,

    iframeReady,
    setIframeReady,

} = useYoutubePlayer();

const [loadingResources, setLoadingResources] =
  useState(false);
  const [explanationLoading, setExplanationLoading] =
  useState(false);

const explanationTimer =
  useRef<NodeJS.Timeout | null>(null);
  
  const [waitingForExplanation, setWaitingForExplanation] =
useState(false);

const pollingTimer =
useRef<NodeJS.Timeout | null>(null);

const pollLearningUntilReady = (
    learningId: string,
    questionNumber: number
) => {

    if (pollingTimer.current) {
        clearInterval(pollingTimer.current);
    }

    pollingTimer.current = setInterval(async () => {

        try {

            const result: any =
                await refetchAllLearningResources();

            const learningItem =
                result?.data?.data?.find(
                    (x: any) => x._id === learningId
                );

            if (
                learningItem?.status === "Completed"
            ) {

              console.log("✅ STATUS COMPLETED");

                clearInterval(pollingTimer.current!);

pollingTimer.current = null;

// 👇 sabse important line
console.log("🔄 Calling refetchLearningResources");

const freshData: any = await refetchLearningResources();

console.log("✅ Refetch Completed", freshData);

if (freshData?.data?.data) {

    setWaitingForExplanation(false);

    const updated = freshData.data.data;

    const current = updated.find(
        (x: any) => x._id === learningId
    );

    if (current) {

        setSelectedQuestionForLearning((prev: any) => ({
            ...prev,
            learningId: current._id,
            updatedAt: Date.now()
        }));

    }

}            }

        } catch (e) {
            console.log("Waiting...");
        }

    }, 3000);

};

const [selectedPdf, setSelectedPdf] =
  useState<string | null>(null);


  const [getVerificationStatus] =
  useLazyGetLearningVerificationQuery();

const { data: singlePaper, refetch: DetailRefetch } =
  useGetSinglePaperQuery(id, {
    skip: !id,
  });

const {
    data: allLearningResources,
    refetch: refetchAllLearningResources,
} = useGetAllLearningResourcesQuery(id,{
    skip:!id,
});

useEffect(() => {

    if (!id) return;

    const timer = setInterval(async () => {

        const result: any = await refetchAllLearningResources();

        if (result?.data?.data?.length > 0) {

    console.log("Resources arrived");

    if (pendingLearningQuestion) {

        const item = result.data.data.find(
            (x:any)=>
            Number(x.questionIndex)===
            Number(pendingLearningQuestion.questionNumber)
        );

        if(item){

            setSelectedQuestionForLearning({

                ...pendingLearningQuestion,

                learningId:item._id

            });

        }

    }

    clearInterval(timer);

}

    }, 3000);

    return () => clearInterval(timer);

}, [
    id,
    refetchAllLearningResources,
]);  
const {
    data: learningData,
    error: learningError,
    isError: learningIsError,
    isLoading: loadingLearning,
    isFetching: fetchingLearning,
    refetch: refetchLearningResources,
} = useGetLearningResourcesQuery(
    selectedQuestionForLearning?.learningId,
    {
        skip: !selectedQuestionForLearning?.learningId,
    }
);

  useEffect(() => {

    if (!learningData?.data) return;

    console.log("✅ Fresh learning data received");

    setWaitingForExplanation(false);

    loadBrowserResources();

    setOpenAccordion(
        `question-${selectedQuestionForLearning?.questionNumber}`
    );

}, [
    learningData?.data?._id,
    learningData?.data?.updatedAt
]);

 useEffect(() => {

    if (!pendingLearningQuestion) return;

    if (!allLearningResources?.data) return;

    if (allLearningResources.data.length === 0) return;

    const learningItem = allLearningResources.data.find(
        (item: any) =>
            Number(item.questionIndex) ===
            Number(pendingLearningQuestion.questionNumber)
    );

    if (!learningItem) return;

    console.log("✅ Pending Learning Resource Found");

    setBrowserVideos([]);
    setBrowserPdfs([]);
    setSelectedVideo(null);
    setSelectedPdf(null);

    setWaitingForExplanation(true);

    const nextLearning = {
        ...pendingLearningQuestion,
        learningId: learningItem._id,
    };

    setSelectedQuestionForLearning(nextLearning);

    setOpenAccordion(
        `question-${pendingLearningQuestion.questionNumber}`
    );

    pollLearningUntilReady(
        learningItem._id,
        pendingLearningQuestion.questionNumber
    );

    setPendingLearningQuestion(null);

}, [
    allLearningResources?.data,
    pendingLearningQuestion,
]);
  useEffect(() => {

    console.log("========== LEARNING DATA ==========");

    console.log(learningData);

}, [learningData]);

  const questions = singlePaper?.data?.questions ?? [];
  const answers = singlePaper?.data?.answers ?? [];

  // Filter only wrong answers
  const wrongAnswers = answers.filter((answer) => {
    const question = questions.find(
      (q) => q.questionNumber === answer.questionNumber
    );
    return question?.correctAnswer !== answer.option;
  });
  useEffect(() => {

  if (!id || wrongAnswers.length === 0)
    return;

  const loadVerificationStatus =
    async () => {

      const completed = {};

      for (const answer of wrongAnswers) {

        try {

          const response: any =
            await getVerificationStatus({

              paperId: id,

              questionNumber:
                answer.questionNumber,

            }).unwrap();

          if (
            response?.data?.status ===
            "Completed"
          ) {

            completed[
              answer.questionNumber
            ] = true;

          }

        } catch (error) {

          console.error(
            "Verification status error",
            error
          );

        }

      }

      setCompletedQuestions(
        completed
      );

    };

  loadVerificationStatus();

}, [
  id,
  wrongAnswers,
  getVerificationStatus,
]);
  // Set default selected question to first wrong answer when answers exist
 // Set default selected question to first wrong answer when answers exist
useEffect(() => {
  if (
    wrongAnswers.length > 0 &&
    !selectedQuestionForLearning &&
    allLearningResources?.data
  ) {
    const firstWrongQuestion = questions.find(
      (q) => q.questionNumber === wrongAnswers[0].questionNumber
    );

    if (!firstWrongQuestion) return;

    const learningItem = allLearningResources.data.find(
      (item) =>
        item.questionIndex ===
        firstWrongQuestion.questionNumber
    );

    setSelectedQuestionForLearning({
      ...firstWrongQuestion,
      learningId: learningItem?._id,
    });
  }
}, [
  wrongAnswers,
  questions,
  selectedQuestionForLearning,
  allLearningResources,
]);
  //--------------------------------------------------
// Auto Load Browser Resources
//--------------------------------------------------

useEffect(() => {

    if (!learningData?.data) return;

    loadBrowserResources();

}, [
    learningData?.data?._id,
    learningData?.data?.updatedAt,
    learningData?.data?.videoSearchQuery,
    learningData?.data?.pdfSearchQuery
]);


 const handleLearning = async (
    question: any,
    accordionValue: string
) => {

    // Toggle accordion
if (openAccordion === accordionValue) {
    setOpenAccordion("");
    return;
}

// Agar accordion sirf reopen ho raha hai
if (
    selectedQuestionForLearning?.questionNumber === question.questionNumber &&
    learningData?.data
) {
    console.log("♻ Reopening existing learning content");

    setOpenAccordion(accordionValue);

    setWaitingForExplanation(false);

    return;
}

setOpenAccordion(accordionValue);

    // Already selected and already loaded
    if (
        selectedQuestionForLearning?.questionNumber === question.questionNumber &&
        learningData?.data
    ) {

        console.log("✅ Already Loaded");

        setWaitingForExplanation(false);

        return;
    }

    // Sirf new question par reset karna
if (
    selectedQuestionForLearning?.questionNumber !== question.questionNumber
) {
    setBrowserVideos([]);
    setBrowserPdfs([]);
    setSelectedVideo(null);
    setSelectedPdf(null);

    setWaitingForExplanation(true);
}

    console.log("Question No =", question.questionNumber);
    console.log(
        "All Learning Resources =",
        allLearningResources?.data
    );

    let learningItem =
        allLearningResources?.data?.find(
            (item: any) =>
                Number(item.questionIndex) ===
                Number(question.questionNumber)
        );

    // Resource not ready yet
    if (!learningItem) {

        console.log("⏳ Waiting for learning resource...");

        setPendingLearningQuestion(question);

        await refetchAllLearningResources();

        return;
    }

    console.log("✅ Learning Resource Found");

    const nextLearning = {
        ...question,
        learningId: learningItem._id,
    };

    setSelectedQuestionForLearning(nextLearning);

    // Already completed
    if (
        learningItem.status === "Completed"
    ) {

        console.log("✅ Already Completed");

        await refetchLearningResources();

        setWaitingForExplanation(false);

        return;
    }

    // Pending → Start Polling
    pollLearningUntilReady(
        learningItem._id,
        question.questionNumber
    );

};

  
  // Function to parse and render markdown-like content

  //====================================================
// Provider Placeholder
//====================================================

const loadBrowserResources = async () => {

    if (!learningData?.data) {

        console.log("Learning data not ready yet");

        return;

    }
console.log("========== loadBrowserResources ==========");
console.log("learningData =", learningData);
    if (!learningData?.data) {
    setLoadingResources(false);
    return;
}

    try {

        setLoadingResources(true);

       const query =
    learningData.data.videoSearchQuery || "";
      // Already loaded? Don't reload.
if (
    browserVideos.length > 0 &&
    selectedVideo
) {
    console.log("Using existing browser resources");

    setLoadingResources(false);

    return;
}
      console.log("Video Query =", query);
      if (!query) {

    setBrowserVideos([]);

    setLoadingResources(false);

    return;

}

const cacheKey =
    `yt_${query}`;

const cachedVideos =
    resourceCache.getItem(cacheKey);

const cachedPdfs =
    resourceCache.getItem(
        cacheKey + "_pdf"
    );

if (cachedVideos) {

    const videos =
        JSON.parse(cachedVideos);

    setBrowserVideos(videos);

    if (videos.length > 0) {

        setIframeReady(false);

        setSelectedVideo(
            videos[0].videoId
        );

        setPlayingVideo(
            videos[0]
        );

    }

}

if (cachedPdfs) {

    setBrowserPdfs(

        JSON.parse(cachedPdfs)

    );

}

if (
    cachedVideos ||
    cachedPdfs
) {

    setLoadingResources(false);

    return;

}
        if (!query) {

    setBrowserVideos([]);

    setLoadingResources(false);

    return;

}
        //--------------------------------------------------
        // Search first query
        //--------------------------------------------------


      //console.log("API URL =", import.meta.env.VITE_API_URL);
      //console.log("Calling =>",`${import.meta.env.VITE_API_URL}/youtube/search`);

      const response = await api.get("/api/youtube/search", {
  params: {
    q: query,
  },
});
      
       //--------------------------------------------------
// Parallel Search
//--------------------------------------------------

//--------------------------------------------------
// Video Search
//--------------------------------------------------

let videos: any[] = [];

try {

    const videoResponse = await api.get("/youtube/search", {
        params: {
            q: query,
        },
    });

    videos = videoResponse?.data?.videos || [];

} catch (err) {

    console.error("Video Search Error", err);

    videos = [];

}

//--------------------------------------------------
// PDF Search
//--------------------------------------------------

let pdfs: any[] = [];

try {

    const pdfResponse = await api.get("/pdf/search", {
        params: {
            query:
                learningData?.data?.pdfSearchQuery ||
                learningData?.data?.videoSearchQuery ||
                query,
        },
    });

    pdfs = pdfResponse?.data?.pdfs || [];

} catch (err) {

    console.error("PDF Search Error", err);

    pdfs = [];

}

//--------------------------------------------------
// Sort PDFs
//--------------------------------------------------

pdfs.sort((a: any, b: any) => (b.score || 0) - (a.score || 0));

//--------------------------------------------------
// Cache
//--------------------------------------------------

resourceCache.setItem(
    cacheKey,
    JSON.stringify(videos)
);

resourceCache.setItem(
    cacheKey + "_pdf",
    JSON.stringify(pdfs)
);

//--------------------------------------------------
// Update UI
//--------------------------------------------------

setBrowserVideos(videos);

setBrowserPdfs(pdfs);

if (videos.length > 0) {

    setIframeReady(false);

    setSelectedVideo(videos[0].videoId);

    setPlayingVideo(videos[0]);

}
if (videos.length > 0) {
setIframeReady(false);
    setSelectedVideo(videos[0].videoId);
setPlayingVideo(videos[0]);

}

    }

    catch (error) {

        console.error(

            "Video Search Error",

            error

        );

        setBrowserVideos([]);

    }

    finally {

        setLoadingResources(false);

    }

};
  
  const parseExplanationContent = (text) => {
    if (!text) return null;

    // Split text into lines
    const lines = text.split('\n');
    const elements = [];
    let currentParagraph = [];
    let listItems = [];

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const paragraphText = currentParagraph.join(' ');
        elements.push(
          <p key={`p-${elements.length}`} className="mb-3 leading-relaxed">
            {parseInlineFormatting(paragraphText)}
          </p>
        );
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="mb-3 ml-4 space-y-1">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {parseInlineFormatting(item)}
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    const parseInlineFormatting = (line) => {
      // Handle bold text (but not headings)
      const parts = [];
      let lastIndex = 0;
      const boldRegex = /\*\*(.+?)\*\*/g;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        // Add text before the bold
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        // Add bold text
        parts.push(<strong key={`bold-${match.index}`} className="font-semibold">{match[1]}</strong>);
        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      return parts.length > 0 ? parts : line;
    };

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      // Empty line - flush current paragraph or list
      if (!trimmedLine) {
        flushParagraph();
        flushList();
        return;
      }

      // Check for heading (bold text followed by colon or at start of line)
      const headingMatch = trimmedLine.match(/^\*\*(.+?)\*\*:?$/);
      if (headingMatch) {
        flushParagraph();
        flushList();
        elements.push(
          <h3 key={`h3-${elements.length}`} className="font-bold text-gray-900 text-base mb-2 mt-4">
            {headingMatch[1]}
          </h3>
        );
        return;
      }

      // Check for bullet point (starts with * or number.)
      const bulletMatch = trimmedLine.match(/^[*•]\s+(.+)$/);
      const numberedMatch = trimmedLine.match(/^\d+\.\s+(.+)$/);
      
      if (bulletMatch || numberedMatch) {
        flushParagraph();
        const content = bulletMatch ? bulletMatch[1] : numberedMatch[1];
        listItems.push(content);
        return;
      }

      // Regular text - add to current paragraph
      currentParagraph.push(trimmedLine);
    });

    // Flush any remaining content
    flushParagraph();
    flushList();

    return elements;
  };

  const renderQuestions = () => {
    return (
      <div className="space-y-4">
        {/* Questions */}
        {answers.length === 0
          ? questions.map((question) => (
              <div
                key={question.questionNumber}
                className="p-4 rounded-md bg-white"
              >
                <h2 className="text-base md:text-lg font-bold break-words">
                  Question {question.questionNumber}: {question.question}
                </h2>
                <div className="mt-2 md:mt-4 space-y-2">
                  {Object.entries(question.choices).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center space-x-2 md:space-x-3"
                    >
                      <span className="font-medium">{key}:</span>
                      <span className="text-sm md:text-base break-words">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          : wrongAnswers.map((wrongAnswer) => {
              const question = questions.find(
                (q) => q.questionNumber === wrongAnswer.questionNumber
              );

              if (!question) return null;

              return (
                <div
                  key={question.questionNumber}
                  className="p-4 rounded-md bg-white border-l-4 border-red-500"
                >
                  <h2 className="text-base md:text-lg font-bold break-words">
                    Question {question.questionNumber}: {question.question}
                  </h2>
                  <div className="mt-2 md:mt-4 space-y-2">
                    {Object.entries(question.choices).map(([key, value]) => {
                      const isCorrect = key === question.correctAnswer;
                      const isUserAnswer = wrongAnswer?.option === key;

                      return (
                        <div
                          key={key}
                          className={`flex items-center space-x-2 md:space-x-3 ${
                            isUserAnswer
                              ? isCorrect
                                ? "text-green-600"
                                : "text-red-600"
                              : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isUserAnswer}
                            readOnly
                            className="h-4 w-4 accent-blue-600"
                          />
                          <span className="font-medium">{key}:</span>
                          <span className="text-sm md:text-base break-words">
                            {String(value)}
                          </span>
                          {isUserAnswer &&
                            (isCorrect ? (
                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircleIcon className="h-5 w-5 text-red-600" />
                            ))}
                        </div>
                      );
                    })}
                  </div>

                  {/* Accordion for Learning Content */}
                  {(() => {
                    const isSelected =
                      selectedQuestionForLearning?.questionNumber === question.questionNumber;
                    const showPendingMessage =
                      isSelected &&
                      (
                        (learningIsError &&
                          isExplanationGenerationPending(learningError)) ||
                        learningData?.code === 404
                      );

                    if (showPendingMessage) {
                      return (
                        <div className="mt-4 rounded-md border border-yellow-200 bg-yellow-50 p-4">
                          <h4 className="font-semibold text-yellow-900 text-base">
                            Explanation in progress
                          </h4>
                          <p className="mt-2 text-sm text-yellow-800">
                            Explanation generation in progress. Please try again later.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <LearningAccordion

    question={question}

    openAccordion={openAccordion}

    setOpenAccordion={setOpenAccordion}

    handleLearning={handleLearning}

    loadingLearning={loadingLearning}

    fetchingLearning={fetchingLearning}

    waitingForExplanation={waitingForExplanation}

    learningData={learningData}

    browserVideos={browserVideos}

    browserPdfs={browserPdfs}

    loadingResources={loadingResources}

    iframeReady={iframeReady}

    setIframeReady={setIframeReady}

    selectedVideo={selectedVideo}

    setVerificationOpen={setVerificationOpen}                    

    setSelectedVideo={setSelectedVideo}

    setPlayingVideo={setPlayingVideo}

    videoPlayerRef={videoPlayerRef}

    explanationLoading={explanationLoading}

    completedQuestions={completedQuestions}

    verificationOpen={verificationOpen}

    setVerificationQuestion={setVerificationQuestion}

    resourceCache={resourceCache}

    loadBrowserResources={loadBrowserResources}

/>
                    );
                  })()}
                </div>
              );
            })}
        
      </div>
    );
  };


 return (
  <UILayout>
    <div className="p-4 md:p-6">
      <ViewHeader
        heading="Question Detail"
        backUrl="/papers"
      />
    </div>

    <div className="px-4 md:px-12 py-4">
      <div className="w-full">
        <div className="border border-dark p-4 md:p-6 rounded-lg shadow">
          {renderQuestions()}
        </div>
      </div>
    </div>

    {verificationQuestion && (
      <VerificationDialog
        open={verificationOpen}
        onClose={() => {
          setVerificationOpen(false);
        }}
        paperId={id as string}
        questionNumber={verificationQuestion.questionNumber}
        onCompleted={() => {
          setCompletedQuestions((prev) => ({
            ...prev,
            [verificationQuestion.questionNumber]: true,
          }));

          setVerificationOpen(false);

          DetailRefetch();
        }}
      />
    )}
  </UILayout>
);

};

export default PaperView;
