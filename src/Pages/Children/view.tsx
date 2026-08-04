import UILayout from "@/UI/Elements/Layout";
import ViewHeader from "@/UI/Container/ViewHeader";
import { useGetSinglePaperQuery } from "@/service/paper";
import { useGetChildrenListQuery } from "@/service/children";
import { useParams } from "react-router-dom";
import { CheckCircleIcon, ClipboardPaste, XCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import UIButton from "@/UI/Elements/Button";
import UISelect from "@/UI/Elements/Select";
const PaperView = () => {
  const { id } = useParams();
  const { data: singlePaper } = useGetSinglePaperQuery(id, { skip: !id });
  const { data: children } = useGetChildrenListQuery({});
  const [toolTipText, setTooltip] = useState("Click to copy OTP");

  const questions = singlePaper?.data?.questions ?? [];
  const answers = singlePaper?.data?.answers ?? [];
  const OTP = singlePaper?.data?.otp || "";
  const totalMarks = questions.length;
  const obtainedMarks = answers.reduce((score, answer) => {
    const question = questions.find(
      (q) => q.questionNumber === answer.questionNumber
    );
    return question?.correctAnswer === answer.option ? score + 1 : score;
  }, 0);
  const percentage = ((obtainedMarks / totalMarks) * 100).toFixed(2);
  const renderQuestions = () => {
    const [selectedChild, setSelectedChild] = useState(""); // State to track selected child
    const [generatedLink, setGeneratedLink] = useState(""); // State for generated link
    const [selectedOption, setSelectedOption] = useState<string | string[]>("");
    const [childOptions, setChildOptions] = useState([]);

    useEffect(() => {
      const options = children?.data?.map((child) => ({
        label: child.name,
        value: child._id,
      }));

      setChildOptions(options);
    }, [children?.data]);

    const handleCopyOtp = () => {
      if (OTP) {
        navigator.clipboard.writeText(OTP);
        setTooltip("Copied!");
      } else {
        setTooltip("Not Copied!");
      }
      setTimeout(() => setTooltip("Click to copy OTP"), 5000);
    };

    const handleSelectChange = (value: string | string[]) => {
      setSelectedOption(value); // Update the state with the selected value
      setSelectedChild(value); // Update the selected child
    };

    const handleGenerateLink = () => {
      if (selectedChild) {
        setGeneratedLink(`https://example.com/link/${selectedChild}`);
      }
    };

    return (
      <div>
        {/* Generate Link and OTP Input before the questions */}
        <div className="items-center gap-4 mb-6">
          {/* Generate Link Button */}
          {answers.length === 0 && (
            <div className="p-4 space-y-4">
              {/* Select Dropdown and Generate Link */}
              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <UISelect
                      label="Select A Child"
                      options={childOptions}
                      placeholder="Choose an option"
                      value={selectedOption}
                      onChange={handleSelectChange}
                    />
                  </div>
                  <UIButton
                    variant="sky"
                    size="md"
                    onClick={handleGenerateLink}
                    tooltipContent={
                      selectedChild
                        ? "Assign the question to the selected child"
                        : "Select a child first"
                    }
                    disabled={!selectedChild} // Disable button if no child is selected
                  >
                    Assign Question to Child
                  </UIButton>
                </div>

                {/* Paste OTP Input */}
                <UIButton
                  variant="sky"
                  size="lg"
                  className="mt-1 px-6 flex items-center gap-2"
                  tooltipContent={toolTipText}
                  onClick={handleCopyOtp}
                >
                  Copy OTP!
                  <ClipboardPaste width={20} />
                </UIButton>
              </div>

              {/* Display Generated Link */}
              {generatedLink && (
                <div className="p-4 mt-4 border rounded-md bg-gray-50">
                  <p className="font-semibold text-gray-700">Generated Link:</p>
                  <p
                    className="text-blue-600 underline cursor-pointer"
                    onClick={() => navigator.clipboard.writeText(generatedLink)}
                  >
                    {generatedLink}
                  </p>
                  <span>
                    <ClipboardPaste width={20} />
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Render Questions */}
        {answers.length === 0
          ? questions.map((question) => (
              <div
                key={question.questionNumber}
                className="p-4 rounded-md my-4"
              >
                <h2 className="text-lg font-bold">
                  Question {question.questionNumber}: {question.question}
                </h2>
                <div className="mt-4 space-y-2">
                  {Object.entries(question.choices).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-3">
                      <span className="font-medium">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-blue-600 font-semibold">
                  Correct Answer: {question.correctAnswer}
                </div>
              </div>
            ))
          : questions.map((question) => {
              const userAnswer = answers.find(
                (answer) => answer.questionNumber === question.questionNumber
              );

              return (
                <div
                  key={question.questionNumber}
                  className="p-4 rounded-md my-4"
                >
                  <h2 className="text-lg font-bold">
                    Question {question.questionNumber}: {question.question}
                  </h2>
                  <div className="mt-4 space-y-2">
                    {Object.entries(question.choices).map(([key, value]) => {
                      const isCorrect = key === question.correctAnswer;
                      const isUserAnswer = userAnswer?.option === key;

                      return (
                        <div
                          key={key}
                          className={`flex items-center space-x-3 ${
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
                          <span>{value}</span>
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
                  <div className="mt-4 text-blue-600 font-semibold">
                    Correct Answer: {question.correctAnswer}
                  </div>
                </div>
              );
            })}
      </div>
    );
  };
  return (
    <UILayout>
      <div className="p-6">
        <ViewHeader heading="Question Detail" backUrl="/papers" />
      </div>
      <div className="flex px-12 py-4 space-x-8">
        {/* Left Section: Questions */}
        <div className="w-3/5 border border-dark p-6 rounded-lg shadow">
          {renderQuestions()}
        </div>

        {/* Right Section: Results Summary */}
        {answers.length > 0 && (
          <div className="w-1/3">
            <div className="border border-dark shadow rounded-lg  p-6">
              <h3 className="text-xl font-bold text-center text-gray-800 border-b pb-3 mb-4">
                Result Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Children Name:</span>
                  <span className="font-semibold text-gray-800">
                    {"studentName"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="font-semibold text-gray-800">
                    {totalMarks}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Marks Obtained:</span>
                  <span className="font-semibold text-green-600">
                    {obtainedMarks}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Percentage:</span>
                  <span className="font-semibold text-blue-600">
                    {percentage}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Grade:</span>
                  <span className="font-semibold text-purple-600">
                    {"grade"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </UILayout>
  );
};

export default PaperView;
