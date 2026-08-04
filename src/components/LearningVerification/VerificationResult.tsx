import React from "react";
import UIButton from "@/UI/Elements/Button";
import { CheckCircle2, XCircle } from "lucide-react";

interface VerificationResultProps {
  score: number;
  totalQuestions: number;
  isCompleted: boolean;
  onClose: () => void;
  onRetry: () => void;
}

const VerificationResult: React.FC<VerificationResultProps> = ({
  score,
  totalQuestions,
  isCompleted,
  onClose,
  onRetry,
}) => {
  return (
    <div className="py-8">

      <div className="flex flex-col items-center">

        {isCompleted ? (
          <>
            <CheckCircle2
              className="text-green-600"
              size={72}
            />

            <h2 className="mt-6 text-2xl font-bold text-green-700">
              Congratulations!
            </h2>

            <p className="mt-2 text-gray-600">
              You have mastered this concept.
            </p>
          </>
        ) : (
          <>
            <XCircle
              className="text-red-500"
              size={72}
            />

            <h2 className="mt-6 text-2xl font-bold text-red-600">
              Keep Learning
            </h2>

            <p className="mt-2 text-gray-600">
              Study the explanation once again and retry.
            </p>
          </>
        )}

        <div className="mt-8 rounded-xl bg-gray-100 px-8 py-6">

          <div className="text-gray-500 text-sm text-center">
            Your Score
          </div>

          <div className="mt-2 text-4xl font-bold text-center">
            {score} / {totalQuestions}
          </div>

          <div className="mt-2 text-center text-sm text-gray-600">
            {Math.round((score / totalQuestions) * 100)}%
          </div>

        </div>

        <div className="mt-10 flex gap-4">

          {isCompleted ? (
            <UIButton
              variant="success"
              onClick={onClose}
            >
              Continue
            </UIButton>
          ) : (
            <>
              <UIButton
                variant="secondary"
                onClick={onClose}
              >
                Close
              </UIButton>

              <UIButton
                variant="danger"
                onClick={onRetry}
              >
                Try Again
              </UIButton>
            </>
          )}

        </div>

      </div>

    </div>
  );
};

export default VerificationResult;
