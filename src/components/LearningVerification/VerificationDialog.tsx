import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import UIButton from "@/UI/Elements/Button";

import VerificationQuestion from "./VerificationQuestion";
import VerificationResult from "./VerificationResult";

import {
  useGenerateLearningVerificationMutation,
  useSubmitLearningVerificationMutation,
} from "@/service/learningVerification";

interface VerificationDialogProps {
  open: boolean;
  onClose: () => void;
  paperId: string;
  questionNumber: number;
  onCompleted?: () => void;
}

const VerificationDialog = ({
  open,
  onClose,
  paperId,
  questionNumber,
  onCompleted,
}: VerificationDialogProps) => {
  /**
   * APIs
   */

  const [
    generateVerification,
    {
      isLoading: generatingPaper,
    },
  ] = useGenerateLearningVerificationMutation();

  const [
    submitVerification,
    {
      isLoading: submittingPaper,
    },
  ] = useSubmitLearningVerificationMutation();

  /**
   * States
   */

  const [questions, setQuestions] = useState<any[]>([]);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] =
    useState<string[]>([]);

  

  const [showResult, setShowResult] =
    useState(false);

  const [result, setResult] =
    useState<any>(null);
  const [verificationId, setVerificationId] =
  useState<string>("");

  /**
   * Generate Verification Paper
   */

  useEffect(() => {

    if (!open) return;

    const generatePaper = async () => {

      try {

        const response: any =
          await generateVerification({
            paperId,
            questionNumber,
          }).unwrap();

        const data =
          response.data || response;

        setVerificationId(data._id);

        setQuestions(
          data.questions || []
        );

        setAnswers(
          new Array(
            data.questions?.length || 3
          ).fill("")
        );

        setCurrentQuestion(0);

        setShowResult(false);

        setResult(null);

      } catch (error) {

        console.error(
          "Unable to generate verification paper",
          error
        );

      }

    };

    generatePaper();

  }, [
    open,
    paperId,
    questionNumber,
    generateVerification,
  ]);

  /**
   * Reset Dialog
   */

  useEffect(() => {

    if (!open) {

      setQuestions([]);

      setAnswers([]);

      setCurrentQuestion(0);

      setVerificationId("");

      setShowResult(false);

      setResult(null);

    }

  }, [open]);

  /**
   * Loading
   */

  if (generatingPaper) {

    return (

      <Dialog
        open={open}
        onOpenChange={onClose}
      >

        <DialogContent className="sm:max-w-2xl">

          <DialogHeader>

            <DialogTitle>
              Learning Verification
            </DialogTitle>

          </DialogHeader>

          <div className="py-16 flex flex-col items-center">

            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />

            <p className="mt-6 text-gray-500">

              Preparing your verification questions...

            </p>

          </div>

        </DialogContent>

      </Dialog>

    );

  }

  /**
   * Select Answer
   */

  const handleSelectAnswer = (
    answer: string
  ) => {

    const updatedAnswers = [...answers];

    updatedAnswers[currentQuestion] = answer;

    setAnswers(updatedAnswers);

  };

  /**
   * Previous
   */

  const handlePrevious = () => {

    if (currentQuestion === 0) return;

    setCurrentQuestion((prev) => prev - 1);

  };

  /**
   * Next
   */

  const handleNext = () => {

    if (!answers[currentQuestion]) return;

    if (
      currentQuestion <
      questions.length - 1
    ) {

      setCurrentQuestion(
        (prev) => prev + 1
      );

    }

  };


    /**
   * Submit Verification
   */

  const handleSubmit = async () => {

    const unanswered =
      answers.some((answer) => !answer);

    if (unanswered) return;

    try {

      const response: any =
       await submitVerification({
    verificationId,
    answers,
}).unwrap();

      const data =
        response.data || response;

      setResult(data);

      setShowResult(true);

      if (data.status === "Completed") {

        onCompleted?.();

      }

    } catch (error) {

      console.error(
        "Unable to submit verification paper",
        error
      );

    }

  };

  /**
   * Retry
   */

  const handleRetry = async () => {

    try {

      setShowResult(false);

      setResult(null);

      const response: any =
        await generateVerification({
  paperId,
  questionNumber,
}).unwrap();

      const data =
        response.data || response;

      setVerificationId(data._id);

      setQuestions(
        data.questions || []
      );

      setAnswers(
        new Array(
          data.questions?.length || 3
        ).fill("")
      );

      setCurrentQuestion(0);

    } catch (error) {

      console.error(error);

    }

  };

  /**
   * Result Screen
   */

  if (showResult && result) {

    return (

      <Dialog
        open={open}
        onOpenChange={onClose}
      >

        <DialogContent className="sm:max-w-2xl">

          <DialogHeader>

            <DialogTitle>

              Learning Verification

            </DialogTitle>

          </DialogHeader>

          <VerificationResult
            score={result.score}
            totalQuestions={
              result.totalQuestions
            }
            isCompleted={
              result.status ===
              "Completed"
            }
            onClose={onClose}
            onRetry={handleRetry}
          />

        </DialogContent>

      </Dialog>

    );

  }

  /**
   * Main Dialog
   */

  return (

    <Dialog
      open={open}
      onOpenChange={onClose}
    >

      <DialogContent
    className="
        w-[95vw]
        max-w-3xl
        h-[92vh]
        p-0
        overflow-hidden
        flex
        flex-col
    "
>

        <DialogHeader className="px-6 pt-6 pb-3 border-b bg-white">

          <DialogTitle className="text-xl">

            Learning Verification

          </DialogTitle>

        </DialogHeader>

        <div
    className="
        flex-1
        overflow-y-auto
        px-6
        py-4
    "
>

          {questions.length >
            currentQuestion && (

            <VerificationQuestion
              question={
                questions[currentQuestion] ??
                {}
              }
              questionNumber={
                currentQuestion + 1
              }
              selectedAnswer={
                answers[currentQuestion]
              }
              onSelect={
                handleSelectAnswer
              }
            />

          )}

        </div>

        {/* Progress */}

        <div className="mt-6 px-6">

          
          <div className="flex justify-between items-center text-sm text-gray-500 mb-2">  

            <span>

              Progress

            </span>

            <span>

              {currentQuestion + 1}
              {" / "}
              {questions.length}

            </span>

          </div>

          
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">

              
                <div
    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                
              style={{
                width: `${
                  questions.length
                    ? ((currentQuestion + 1) /
                        questions.length) *
                      100
                    : 0
                }%`,
              }}
            />

          </div>

        </div>

        {/* Footer */}

<div
    className="
        sticky
        bottom-0
        bg-white
        border-t
        px-6
        py-4
        flex
        justify-between
        items-center
        gap-3
        z-50
        shadow-lg
    "
>

    <UIButton
        variant="secondary"
        onClick={handlePrevious}
        disabled={currentQuestion === 0}
    >
        Previous
    </UIButton>

    {currentQuestion === questions.length - 1 ? (

        <UIButton
            variant="success"
            onClick={handleSubmit}
            loading={submittingPaper}
            disabled={!answers[currentQuestion]}
        >
            Submit
        </UIButton>

    ) : (

        <UIButton
            variant="primary"
            onClick={handleNext}
            disabled={!answers[currentQuestion]}
        >
            Next
        </UIButton>

    )}

</div>

      </DialogContent>

    </Dialog>

  );

};

export default VerificationDialog;
