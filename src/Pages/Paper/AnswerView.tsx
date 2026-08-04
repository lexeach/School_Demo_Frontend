import UILayout from "@/UI/Elements/Layout";
import { useGetSinglePaperQuery } from "@/service/paper";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import Logo from "@/UI/Container/Logo";

const PaperView = () => {
  const { id } = useParams();

  const {
    data: singlePaper,
    refetch: refetchSinglePaper,
    isLoading
  } = useGetSinglePaperQuery(id, { skip: !id });
  
  useEffect(() => {
    if (id) {
      refetchSinglePaper();
    }
  }, [id, refetchSinglePaper]);
  const questions = singlePaper?.data?.questions ?? [];
  const answers = singlePaper?.data?.answers ?? [];
  const childName = singlePaper?.data?.children?.name || "";
  const childGrade = singlePaper?.data?.children?.grade || "";
  const totalMarks = questions.length;
  const obtainedMarks = answers.reduce((score, answer) => {
    const question = questions.find(
      (q) => q.questionNumber === answer.questionNumber
    );
    
    // If answer is "E" (no answer/skip), don't add or subtract marks
    if (answer.option === "E") {
      return score;
    }
    
    // If answer is correct, add 1 mark
    if (question?.correctAnswer === answer.option) {
      return score + 1;
    }
    
    // If answer is wrong, subtract 1 mark (negative marking)
    return score - 2;
  }, 0);
  // Calculate percentage, ensuring it doesn't go below 0
  const percentage = Math.max(0, (obtainedMarks / totalMarks) * 100).toFixed(2);

  const renderQuestions = () => {
    return (
      <div className="flex flex-col gap-4">
        {answers.length !== 0 &&
          questions.map((question) => {
            const userAnswer = answers.find(
              (answer) => answer.questionNumber === question.questionNumber
            );

            return (
              <div
                key={question.questionNumber}
                className="p-4 rounded-md bg-white"
              >
                <h2 className="text-base md:text-lg font-bold break-words">
                  Question {question.questionNumber}: {question.question}
                </h2>
                <div className="mt-2 md:mt-4 space-y-2">
                  {Object.entries(question.choices).map(([key, value]) => {
                    const isCorrect = key === question.correctAnswer;
                    const isUserAnswer = userAnswer?.option === key;
                    const isNoAnswer = userAnswer?.option === "E";

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
                          className={`h-4 w-4 flex-shrink-0 ${
                            isNoAnswer ? 'accent-gray-400' : 'accent-blue-600'
                          }`}
                        />
                        <span className="font-medium">{key}:</span>
                        <span className="text-sm md:text-base break-words">{String(value)}</span>
                        {isUserAnswer &&
                          (isCorrect ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0" />
                          ))}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 md:mt-4 text-blue-600 font-semibold text-sm md:text-base">
                  Correct Answer: {question.correctAnswer}
                </div>
              </div>
            );
          })}
      </div>
    );
  };

  if(isLoading) {
     return <Logo />;
  }

  return (
    <UILayout>
      <div className="max-h-[100vh] overflow-y-auto px-4 md:px-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 md:p-6 gap-4">
          <Link
            to="/papers"
            className="inline-flex items-center justify-center rounded-md border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to Papers
          </Link>
          <p className="text-center md:text-right font-semibold text-2xl md:text-4xl text-content leading-tight md:leading-[70px] flex-1">
            Result Detail
          </p>
        </div>
        <div className="flex flex-col md:flex-row px-0 md:px-12 py-4 space-y-6 md:space-y-0 md:space-x-8 mb-10 md:mb-40">
          <div className="w-full md:w-3/5">
            <div className="border border-dark p-4 md:p-6 rounded-lg shadow">
              {renderQuestions()}
            </div>
          </div>

          {answers?.length > 0 && (
            <div className="w-full md:w-1/3">
              <div className="border border-dark shadow rounded-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-center text-gray-800 border-b pb-2 md:pb-3 mb-3 md:mb-4">
                  Result Summary
                </h3>
                <div className="space-y-3 md:space-y-4 text-sm md:text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Children Name:</span>
                    <span className="font-semibold text-gray-800 break-words max-w-[60%]">
                      {childName || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Questions:</span>
                    <span className="font-semibold text-gray-800">{totalMarks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Marks Obtained:</span>
                    <span className={`font-semibold ${obtainedMarks >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {obtainedMarks}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Percentage:</span>
                    <span className="font-semibold text-blue-600">{percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Grade:</span>
                    <span className="font-semibold text-purple-600">
                      {childGrade || "NA"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </UILayout>
  );
};

export default PaperView;
