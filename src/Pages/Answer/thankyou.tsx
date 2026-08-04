import UILayout from "@/UI/Elements/Layout";
import { useLocation, useNavigate } from "react-router-dom";

const ThankYouPage = () => {
  const location = useLocation();
  const AnswerURL = `/auth/result/${location.state}`;
  const navigate = useNavigate();
  return (
    <UILayout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h1 className="text-2xl font-bold text-green-600">Thank You!</h1>
          <p className="mt-4 text-gray-700">
            Your answers have been submitted successfully. We appreciate your
            time and effort.
          </p>
          <button
            className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            type="button"
            onClick={() => navigate(AnswerURL)}
          >
            See Result
          </button>
        </div>
      </div>
    </UILayout>
  );
};

export default ThankYouPage;
