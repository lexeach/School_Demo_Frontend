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

import { useParams } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";

import { useEffect, useState, useRef, useCallback } from "react";
// import api from "@/service/apiSlice";
import {
    useYoutubePlayer
} from "@/components/Learning/hooks";
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

interface VerificationQuestionState {
    questionNumber: number;
    [key: string]: any;
}

const PaperView = () => {
  const param = useParams();
  const { id } = param;
  
  const [selectedQuestionForLearning, setSelectedQuestionForLearning] =
    useState<any>(null);

  const [pendingLearningQuestion, setPendingLearningQuestion] =
    useState<any>(null);

  const [openAccordion, setOpenAccordion] =
    useState("");

  const [verificationOpen, setVerificationOpen] =
    useState(false);

  const [verificationQuestion, setVerificationQuestion] =
    useState<VerificationQuestionState | null>(null);

  const [completedQuestions, setCompletedQuestions] =
    useState<CompletedQuestions>({});

  const [browserVideos] =
    useState<any[]>([]);

  const [browserPdfs] =
    useState<any[]>([]);

  // const resourceCache = sessionStorage;

  const {
      videoPlayerRef,
      selectedVideo,
      setSelectedVideo,
      // playingVideo,
      setPlayingVideo,
      iframeReady,
      setIframeReady,
  } = useYoutubePlayer();

  const [loadingResources] =
    useState(false);
  
  const [explanationLoading] = useState(false);

  const [waitingForExplanation, setWaitingForExplanation] =
    useState(false);
  
  const pollingTimer = useRef<NodeJS.Timeout | null>(null);

  const { data: singlePaper, refetch: DetailRefetch } = useGetSinglePaperQuery(id, {
      skip: !id,
  });

  const {
      data: allLearningResources,
      refetch: refetchAllLearningResources,
  } = useGetAllLearningResourcesQuery(id, {
      skip: !id,
  });

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

  const pollLearningUntilReady = useCallback((learningId: string) => {
      if (pollingTimer.current) {
          clearInterval(pollingTimer.current);
      }

      pollingTimer.current = setInterval(async () => {
          try {
              const result: any = await refetchAllLearningResources();
              const learningItem = result?.data?.data?.find((x: any) => x._id === learningId);

              if (learningItem?.status === "Completed") {
                  console.log("✅ STATUS COMPLETED");
                  if (pollingTimer.current) {
                      clearInterval(pollingTimer.current);
                      pollingTimer.current = null;
                  }

                  const freshData: any = await refetchLearningResources();
                  if (freshData?.data?.data) {
                      setWaitingForExplanation(false);
                      const updated = freshData.data.data;
                      const current = updated.find((x: any) => x._id === learningId);
                      if (current) {
                          setSelectedQuestionForLearning((prev: any) => ({
                              ...prev,
                              learningId: current._id,
                              updatedAt: Date.now()
                          }));
                      }
                  }
              }
          } catch (e) {
              console.log("Waiting...");
          }
      }, 3000);
  }, [refetchAllLearningResources, refetchLearningResources]);

  /*
  const loadBrowserResources = useCallback(async () => {
      if (!learningData?.data) return;

      try {
          setLoadingResources(true);
          const query = learningData.data.videoSearchQuery || "";

          if (browserVideos.length > 0 && selectedVideo) {
              setLoadingResources(false);
              return;
          }

          if (!query) {
              setBrowserVideos([]);
              setLoadingResources(false);
              return;
          }

          const cacheKey = `yt_${query}`;
          const cached = resourceCache.getItem(cacheKey);

          if (cached) {
              const videos = JSON.parse(cached);
              setBrowserVideos(videos);
              if (videos.length > 0) {
                  setIframeReady(false);
                  setSelectedVideo(videos[0].videoId);
                  setPlayingVideo(videos[0]);
              }
              setLoadingResources(false);
              return;
          }

          const response = await api.get("/api/youtube/search", {
              params: { q: query },
          });

          const videos = response.data.videos || [];
          resourceCache.setItem(cacheKey, JSON.stringify(videos));
          setBrowserVideos(videos);

          if (videos.length > 0) {
              setIframeReady(false);
              setSelectedVideo(videos[0].videoId);
              setPlayingVideo(videos[0]);
          }
      } catch (error) {
          console.error("Video Search Error", error);
          setBrowserVideos([]);
      } finally {
          setLoadingResources(false);
      }
  }, [learningData, browserVideos, selectedVideo, resourceCache, setIframeReady, setSelectedVideo, setPlayingVideo]);
  */

  useEffect(() => {
      if (!id) return;
      const timer = setInterval(async () => {
          const result: any = await refetchAllLearningResources();
          if (result?.data?.data?.length > 0) {
              if (pendingLearningQuestion) {
                  const item = result.data.data.find(
                      (x: any) => Number(x.questionIndex) === Number(pendingLearningQuestion.questionNumber)
                  );
                  if (item) {
                      setSelectedQuestionForLearning({
                          ...pendingLearningQuestion,
                          learningId: item._id
                      });
                  }
              }
              clearInterval(timer);
          }
      }, 3000);
      return () => clearInterval(timer);
  }, [id, pendingLearningQuestion, refetchAllLearningResources]);

  useEffect(() => {
      if (!learningData?.data) return;
      setWaitingForExplanation(false);
      // loadBrowserResources();
      setOpenAccordion(`question-${selectedQuestionForLearning?.questionNumber}`);
  }, [learningData, selectedQuestionForLearning]);

  useEffect(() => {
      if (!pendingLearningQuestion || !allLearningResources?.data || allLearningResources.data.length === 0) return;

      const learningItem = allLearningResources.data.find(
          (item: any) => Number(item.questionIndex) === Number(pendingLearningQuestion.questionNumber)
      );

      if (!learningItem) return;

      // setBrowserVideos([]);
      // setBrowserPdfs([]);
      setSelectedVideo(null);
      setWaitingForExplanation(true);

      const nextLearning = {
          ...pendingLearningQuestion,
          learningId: learningItem._id,
      };

      setSelectedQuestionForLearning(nextLearning);
      setOpenAccordion(`question-${pendingLearningQuestion.questionNumber}`);
      pollLearningUntilReady(learningItem._id);
      setPendingLearningQuestion(null);
  }, [allLearningResources, pendingLearningQuestion, pollLearningUntilReady, setSelectedVideo]);

  const questions = singlePaper?.data?.questions ?? [];
  const answers = singlePaper?.data?.answers ?? [];

  const wrongAnswers = answers.filter((answer: any) => {
    const question = questions.find((q: any) => q.questionNumber === answer.questionNumber);
    return question?.correctAnswer !== answer.option;
  });

  const [getVerificationStatus] = useLazyGetLearningVerificationQuery();

  useEffect(() => {
    if (!id || wrongAnswers.length === 0) return;

    const loadVerificationStatus = async () => {
      const completed: CompletedQuestions = {};
      for (const answer of wrongAnswers) {
        try {
          const response: any = await getVerificationStatus({
            paperId: id,
            questionNumber: answer.questionNumber,
          }).unwrap();

          if (response?.data?.status === "Completed") {
            completed[answer.questionNumber] = true;
          }
        } catch (error) {
          console.error("Verification status error", error);
        }
      }
      setCompletedQuestions(completed);
    };

    loadVerificationStatus();
  }, [id, wrongAnswers, getVerificationStatus]);

  useEffect(() => {
    if (wrongAnswers.length > 0 && !selectedQuestionForLearning && allLearningResources?.data) {
      const firstWrongQuestion = questions.find((q: any) => q.questionNumber === wrongAnswers[0].questionNumber);
      if (!firstWrongQuestion) return;

      const learningItem = allLearningResources.data.find((item: any) => item.questionIndex === firstWrongQuestion.questionNumber);
      setSelectedQuestionForLearning({
        ...firstWrongQuestion,
        learningId: learningItem?._id,
      });
    }
  }, [wrongAnswers, questions, selectedQuestionForLearning, allLearningResources]);

  /*
  useEffect(() => {
    if (!learningData?.data) return;
    loadBrowserResources();
  }, [learningData, loadBrowserResources]);
  */

  const handleLearning = useCallback(async (question: any, accordionValue: string) => {
      if (openAccordion === accordionValue) {
          setOpenAccordion("");
          return;
      }

      if (selectedQuestionForLearning?.questionNumber === question.questionNumber && learningData?.data) {
          setOpenAccordion(accordionValue);
          setWaitingForExplanation(false);
          return;
      }

      setOpenAccordion(accordionValue);

      if (selectedQuestionForLearning?.questionNumber !== question.questionNumber) {
          // setBrowserVideos([]);
          // setBrowserPdfs([]);
          setSelectedVideo(null);
          setWaitingForExplanation(true);
      }

      let learningItem = allLearningResources?.data?.find(
          (item: any) => Number(item.questionIndex) === Number(question.questionNumber)
      );

      if (!learningItem) {
          setPendingLearningQuestion(question);
          await refetchAllLearningResources();
          return;
      }

      const nextLearning = {
          ...question,
          learningId: learningItem._id,
      };

      setSelectedQuestionForLearning(nextLearning);

      if (learningItem.status === "Completed") {
          await refetchLearningResources();
          setWaitingForExplanation(false);
          return;
      }

      pollLearningUntilReady(learningItem._id);
  }, [openAccordion, selectedQuestionForLearning, learningData, allLearningResources, refetchAllLearningResources, refetchLearningResources, pollLearningUntilReady, setSelectedVideo]);

  const renderQuestions = () => {
    return (
      <div className="space-y-4">
        {answers.length === 0
          ? questions.map((question: any) => (
              <div key={question.questionNumber} className="p-4 rounded-md bg-white">
                <h2 className="text-base md:text-lg font-bold break-words">
                  Question {question.questionNumber}: {question.question}
                </h2>
                <div className="mt-2 md:mt-4 space-y-2">
                  {Object.entries(question.choices).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2 md:space-x-3">
                      <span className="font-medium">{key}:</span>
                      <span className="text-sm md:text-base break-words">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          : wrongAnswers.map((wrongAnswer: any) => {
              const question = questions.find((q: any) => q.questionNumber === wrongAnswer.questionNumber);
              if (!question) return null;

              return (
                <div key={question.questionNumber} className="p-4 rounded-md bg-white border-l-4 border-red-500">
                  <h2 className="text-base md:text-lg font-bold break-words">
                    Question {question.questionNumber}: {question.question}
                  </h2>
                  <div className="mt-2 md:mt-4 space-y-2">
                    {Object.entries(question.choices).map(([key, value]) => {
                      const isCorrect = key === question.correctAnswer;
                      const isUserAnswer = wrongAnswer?.option === key;
                      return (
                        <div key={key} className={`flex items-center space-x-2 md:space-x-3 ${isUserAnswer ? (isCorrect ? "text-green-600" : "text-red-600") : ""}`}>
                          <input type="checkbox" checked={isUserAnswer} readOnly className="h-4 w-4 accent-blue-600" />
                          <span className="font-medium">{key}:</span>
                          <span className="text-sm md:text-base break-words">{String(value)}</span>
                          {isUserAnswer && (isCorrect ? <CheckCircleIcon className="h-5 w-5 text-green-600" /> : <XCircleIcon className="h-5 w-5 text-red-600" />)}
                        </div>
                      );
                    })}
                  </div>

                  {(() => {
                    const isSelected = selectedQuestionForLearning?.questionNumber === question.questionNumber;
                    const showPendingMessage = isSelected && ((learningIsError && isExplanationGenerationPending(learningError)) || learningData?.code === 404);

                    if (showPendingMessage) {
                      return (
                        <div className="mt-4 rounded-md border border-yellow-200 bg-yellow-50 p-4">
                          <h4 className="font-semibold text-yellow-900 text-base">Explanation in progress</h4>
                          <p className="mt-2 text-sm text-yellow-800">Explanation generation in progress. Please try again later.</p>
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
                        // resourceCache={resourceCache}
                        // loadBrowserResources={loadBrowserResources}
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
        <ViewHeader heading="Question Detail" backUrl="/papers" />
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
          onClose={() => setVerificationOpen(false)}
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
