import React, { ReactNode } from 'react';

interface FormPageWrapperProps {
  children: ReactNode;
}

const FormPageWrapper: React.FC<FormPageWrapperProps> = ({ children }) => {
  return (
    <div className="flex justify-center items-center w-[calc(100%-50px)] h-[calc(100%-50px)] bg-surface rounded-2xl shadow-md">
      {children}
    </div>
  );
};

export default FormPageWrapper;