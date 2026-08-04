import React from "react";

interface AuthWrapperProps {
  children: React.ReactNode;
  title: string;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children, title }) => {
  return (
    <div className="bg-blue-100 w-full min-h-screen grid place-items-center">
      <div className="w-full max-w-[70%] md:max-w-[40%] p-6 sm:p-8 py-8 bg-white m-auto rounded-lg text-center">
        <p className="text-2xl font-bold mb-[40px]">{title}</p>
        {children}
      </div>
    </div>
  );
};

export default AuthWrapper;
