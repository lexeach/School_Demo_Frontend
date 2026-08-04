import UILayout from "@/UI/Elements/Layout";
import React, { useState } from "react";
import UIInput from "../../UI/Elements/Input";
import UIButton from "../../UI/Elements/Button";

const EnterOTPPage = ({ questionOTP, onVerify }) => {
  // console.log("question OTP", questionOTP);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", ""]);
  const [isWrongOTP, setIsWrongOTP] = useState(false);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // Allow only numbers
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1); // Limit to a single digit
    setOtp(newOtp);

    // Move to the next input if a number is entered
    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSubmit = () => {
    const otpValue = otp.join("");
    const isOTPVerified = otpValue === questionOTP.toString();
    if (isOTPVerified) {
      onVerify(true);
    } else {
      setIsWrongOTP(!isOTPVerified);
    }
  };
  return (
    <UILayout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-800">Enter OTP</h1>
          <p className="mt-4 text-gray-600">
            The OTP will be provided by the concerned person.
          </p>
          <p className="mt-2 text-sm text-red-500 font-semibold">
            If you face any issues, please contact your concerned person.
          </p>
          <div className="flex justify-center gap-3 mt-6">
            {otp.map((digit, index) => (
              <UIInput
                key={index}
                id={`otp-input-${index}`}
                type="tel" // Changed to "tel" to suggest numeric keyboard
                inputMode="numeric" // Added for broader support
                value={digit}
                maxLength={1}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e.target.value, index)
                }
                className="w-12 h-12 text-center text-xl font-semibold"
                wrapperClassName="w-auto"
                placeholder=""
              />
            ))}
          </div>
          <UIButton
            onClick={handleSubmit}
            disabled={otp.includes("")}
            variant={"sky"}
            size="lg"
            className="w-full py-3 mt-6"
          >
            Submit
          </UIButton>
          {isWrongOTP === true && (
            <p className="mt-4 text-sm text-red-500 font-semibold">
              Wrong OTP. Please try again.
            </p>
          )}
          <p className="mt-4 text-sm text-gray-500">
            Didn’t receive an OTP? Please reach out to your concerned person for
            assistance.
          </p>
        </div>
      </div>
    </UILayout>
  );
};

export default EnterOTPPage;
