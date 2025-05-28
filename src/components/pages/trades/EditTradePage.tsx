import React from 'react';
import EditTradeForm from '../../forms/trades/EditTradeForm';
import FormPageWrapper from '../../layouts/FormPageWrapper';

interface EditTradePageProps {
  userId: number;
  tradeId: number;
}

const EditTradePage: React.FC<EditTradePageProps> = ({ userId, tradeId }) => {
  return (
    <FormPageWrapper>
      <EditTradeForm userId={userId} tradeId={tradeId} />
    </FormPageWrapper>
  );
};

export default EditTradePage;