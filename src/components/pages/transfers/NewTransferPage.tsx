import React from "react";
import FormPageWrapper from "../../layouts/FormPageWrapper";
import NewTransferForm from "@components/forms/transfers/NewTransferForm";

interface NewTransferPageProps {
  userId: number;
}

const NewTransferPage: React.FC<NewTransferPageProps> = ({ userId }) => {
  return (
    <FormPageWrapper>
      <NewTransferForm userId={userId} />
    </FormPageWrapper>
  );
};

export default NewTransferPage;
