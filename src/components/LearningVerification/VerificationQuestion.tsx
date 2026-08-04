import React from "react";

interface VerificationQuestionProps {
  questionNumber: number;
  question: {
    question: string;
    options: string[];
  };
  selectedAnswer: string;
  onSelect: (answer: string) => void;
}

const optionLetters = ["A", "B", "C", "D"];

const VerificationQuestion: React.FC<VerificationQuestionProps> = ({
  questionNumber,
  question,
  selectedAnswer,
  onSelect,
}) => {
  return (
    <div className="space-y-6">

      <div className="text-center">
        <div className="text-sm text-gray-500">
          Question {questionNumber} of 3
        </div>

        <h2 className="text-xl font-semibold mt-2">
          {question.question}
        </h2>
      </div>

      <div className="space-y-3">

        {question.options.map((option, index) => {
          const value = optionLetters[index];

          return (
            <button
              key={value}
              type="button"
              onClick={() => onSelect(value)}
              className={`w-full text-left rounded-lg border p-4 transition-all duration-200

                ${
                  selectedAnswer === value
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                }`}
            >
              <div className="flex items-start gap-4">

                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold

                  ${
                    selectedAnswer === value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {value}
                </div>

                <div className="flex-1">
                  {option}
                </div>

              </div>
            </button>
          );
        })}

      </div>

    </div>
  );
};

export default VerificationQuestion;
