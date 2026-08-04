import UILayout from "@/UI/Elements/Layout";
import { useGetSinglePaperQuery } from "@/service/paper";
import { useNavigate, useParams } from "react-router-dom";
// Import useEffect along with useState
import { useState, useEffect } from "react";
import { CheckCircleIcon } from "lucide-react";
import { ErrorToaster, SuccessToaster } from "@/UI/Elements/Toast";
import { useChildrenloginMutation } from "@/service/apiSlice";
import { useAnswerPaperMutation } from "@/service/paper";
import { loginSuccess, handleLogout } from "@/slice/authSlice";
import { useDispatch } from "react-redux";
import EnterOTP from "./enterOTP";

const Answer = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [childLogin] = useChildrenloginMutation();
  const [answerQuestion] = useAnswerPaperMutation();

  const { data: singlePaper, isLoading: paperLoading } = useGetSinglePaperQuery(
    id,
    { skip: !id }
  );

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  // START: Code to refresh on tab switch
  useEffect(() => {
    const handleVisibilityChange = () => {
      // The 'document.hidden' property is true when the page is not the active tab.
      if (document.hidden) {
        // Optional: Show a message to the user before reloading.
        ErrorToaster("Cheating is not allowed. The page will now refresh.");
        // Reload the page.
        window.location.reload();
      }
    };

    // Add an event listener that calls the function when tab visibility changes.
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // This is a cleanup function. It removes the event listener when the
    // component is unmounted to prevent memory leaks.
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []); // The empty dependency array [] ensures this effect runs only once.
  // END: Code to refresh on tab switch

  const questions = singlePaper?.data?.questions ?? [];
  const OTP = singlePaper?.data?.otp;
  const parentId = singlePaper?.data?.author?._id;
  const childID = singlePaper?.data?.children?._id;

  const handleOptionChange = (
    questionNumber: number,
    selectedOption: string
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionNumber]: selectedOption,
    }));
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
                <div key={key} className="flex items-center space-x-3">
                  <label
                    htmlFor={`question-${question.questionNumber}-option-${key}`}
                    className="flex items-center space-x-2 cursor-pointer"
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
                      className="hidden peer"
                    />
                    <span className="w-5 h-5 border-2 border-gray-400 rounded-md flex items-center justify-center peer-checked:border-0">
                      {answers[question.questionNumber] === key && (
                        <CheckCircleIcon
                          width={20}
                          height={20}
                          className="text-green-500"
                        />
                      )}
                    </span>
                    <span className="font-medium">{value}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const verifyOTP = async () => {
    setIsOTPVerified(true);
    try {
      const response = await childLogin({
        parentId,
        otp: OTP,
        questionId: id,
        id: childID,
      }).unwrap();
      dispatch(loginSuccess(response.token));
      SuccessToaster("Login Success");
    } catch (error) {
      ErrorToaster("You Cheated !!!");
      return;
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length === questions.length) {
      setIsSubmitted(true);
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

        setTimeout(() => {
          dispatch(handleLogout());
          SuccessToaster("Login Out");
          localStorage.removeItem("token");
          navigate("/auth/thankyou", { state: id });
          setIsAnswered(true);
        }, 1000);
      } catch (error) {
        ErrorToaster(error?.data?.message || "Login Failed");
      }
    }
  };

  if (paperLoading) {
    return <div>Loading...</div>;
  }

  if (!OTP) {
    navigate("/auth/otp-expire");
  }

  return (
    <div className="pb-12">
      {!isAnswered && !isOTPVerified ? (
        <EnterOTP questionOTP={OTP} onVerify={verifyOTP} />
      ) : (
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
              <div className="text-right">
                <button
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length < questions.length}
                  className={`mt-6 px-6 py-2 rounded-lg text-white transition-colors duration-200 ${
                    Object.keys(answers).length === questions.length
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Submit
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
      )}
    </div>
  );
};

export default Answer;
