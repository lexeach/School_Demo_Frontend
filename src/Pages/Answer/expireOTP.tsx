import UILayout from "@/UI/Elements/Layout";

const OTPExpirePage = () => {
  return (
    <UILayout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600">Link Expired</h1>
          <p className="mt-4 text-gray-700">
            The link you are trying to access has expired. Please contact the concerned person for assistance.
          </p>
        </div>
      </div>
    </UILayout>

  );
};

export default OTPExpirePage;
