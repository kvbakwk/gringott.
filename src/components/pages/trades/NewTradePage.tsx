import React from "react";
import FormPageWrapper from "../../layouts/FormPageWrapper";
import NewTradeForm from "@components/forms/trades/NewTradeForm";

interface NewTradePageProps {
  userId: number;
}

const NewTradePage: React.FC<NewTradePageProps> = ({ userId }) => {
  return (
    <FormPageWrapper>
      <NewTradeForm userId={userId} />
    </FormPageWrapper>
  );
};

export default NewTradePage;
