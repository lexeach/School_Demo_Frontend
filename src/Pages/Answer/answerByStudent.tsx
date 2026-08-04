import UILayout from "@/UI/Elements/Layout";
import { useGetSinglePaperQuery } from "@/service/paper";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { CheckCircleIcon } from "lucide-react";
import { ErrorToaster } from "@/UI/Elements/Toast";
import { useAnswerPaperMutation } from "@/service/paper";
import { BaseURL } from "../../config";

const Answer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [answerQuestion] = useAnswerPaperMutation();

  const { data: singlePaper, isLoading: paperLoading } = useGetSinglePaperQuery(
    id,
    { skip: !id }
  );

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // <--- Added loading state for submit button

  const questions = singlePaper?.data?.questions ?? [];
  const parentId = singlePaper?.data?.author?._id;

  useEffect(() => {
    if (!paperLoading && questions.length > 0) {
      console.log("Total Questions:", questions.length);
      console.log("Answers Recorded:", Object.keys(answers).length, answers);
      console.log("Is Submit Button Disabled?", Object.keys(answers).length < questions.length);
    }
  }, [answers, questions.length, paperLoading]);

  const handleOptionChange = (
    questionNumber: number,
    selectedOption: string
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionNumber]: selectedOption,
    }));
    console.log(`Q${questionNumber} selected: ${selectedOption}`);

    if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
    }
  };

  const renderQuestions = () => {
    return (
      <div>
        {questions.map((question) => (
          <div
            key={question.questionNumber}
            className="p-4 rounded-md my-4 bg-white"
          >
            <h2 className="text-lg font-bold">
              Question {question.questionNumber}: {question.question}
            </h2>
            <div className="mt-4 space-y-2">
              {Object.entries(question.choices).map(([key, value]) => (
                <div key={key} className="relative flex items-center">
                  <label
                    htmlFor={`question-${question.questionNumber}-option-${key}`}
                    className="flex items-center space-x-2 cursor-pointer w-full p-3 rounded-md hover:bg-gray-100 transition-colors duration-150 select-none"
                  >
                    <input
                      type="radio"
                      name={`question-${question.questionNumber}`}
                      id={`question-${question.questionNumber}-option-${key}`}
                      value={key}
                      checked={answers[question.questionNumber] === key}
                      onChange={() =>
                        handleOptionChange(question.questionNumber, key)
                      }
                      className="
                        absolute 
                        z-10 
                        left-0 top-0 
                        w-full h-full 
                        opacity-0 
                        cursor-pointer 
                      "
                      aria-hidden="true"
                    />
                    <span className={`
                        w-5 h-5 border-2 rounded-full flex items-center justify-center flex-shrink-0
                        ${answers[question.questionNumber] === key
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-400' 
                        }
                    `}>
                      {answers[question.questionNumber] === key && (
                        <CheckCircleIcon
                          width={16} 
                          height={16}
                          className="text-white" 
                        />
                      )}
                    </span>
                    <span className="font-medium text-gray-800 break-words">{value}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleSubmit = async () => {
    console.log("Submit button clicked!");
    console.log("Current answers length:", Object.keys(answers).length);
    console.log("Total questions length:", questions.length);

    if (Object.keys(answers).length === questions.length) {
      console.log("All questions answered. Proceeding with submission.");
      setIsLoading(true); // <--- Start loader when submission process starts

      const formattedAnswers = Object.entries(answers).map(
        ([questionNumber, option]) => ({
          questionNumber: Number(questionNumber),
          option,
        })
      );

      try {
        await answerQuestion({
          questionId: id,
          answers: formattedAnswers,
          userId: parentId,
        }).unwrap();

        setIsSubmitted(true);

        setTimeout(() => {
          navigate("/auth/thankyou", { state: id }); 
        }, 1000);
      } catch (error) {
        console.error("Submission Error:", error); 
        ErrorToaster(error?.data?.message || "Issue in submitting answers");
        setIsLoading(false); // <--- Stop loader only if error occurs (so user can retry)
      }
    } else {
      console.log("Not all questions answered yet. Button remains disabled.");
      ErrorToaster(`Please answer all ${questions.length} questions.`); 
    }
  };

  if (paperLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pb-12">
      <UILayout>
        <div className="p-6 text-center">
          <p className="font-semibold text-4xl text-content leading-[70px]">
            Question Paper
          </p>
        </div>
        <div
          className="flex justify-center px-4"
          style={{ maxHeight: "calc(100vh - 150px)" }}
        >
          <div className="w-full max-w-4xl border border-dark p-6 rounded-lg shadow overflow-y-auto">
            {renderQuestions()}
            <div className="text-right relative z-20">
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < questions.length || isLoading} // <--- Disable when loading
                className={`mt-6 px-6 py-2 rounded-lg text-white transition-colors duration-200 flex items-center justify-center ml-auto ${
                  Object.keys(answers).length === questions.length && !isLoading
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  // <--- Loader Spinner markup inside button
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Submitting...</span>
                  </span>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
            {isSubmitted && (
              <div className="mt-4 text-green-600 font-semibold">
                Answers submitted successfully!
              </div>
            )}
          </div>
        </div>
      </UILayout>
    </div>
  );
};

export default Answer;
