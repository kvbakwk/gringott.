import React, { ReactNode } from 'react';

interface FormPageWrapperProps {
  children: ReactNode;
}

const FormPageWrapper: React.FC<FormPageWrapperProps> = ({ children }) => {
  return (
    <div className="flex justify-center items-center w-[calc(100%-50px)] h-full">
      {children}
    </div>
  );
};

export default FormPageWrapper;