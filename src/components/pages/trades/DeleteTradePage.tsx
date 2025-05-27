import React from 'react';

import FormPageWrapper from '../../layouts/FormPageWrapper';
import DeleteTradeForm from '@components/forms/trades/DeleteTradeForm';

interface DeleteTradePageProps {
  userId: number;
  tradeId: number;
}

const DeleteTradePage: React.FC<DeleteTradePageProps> = ({ userId, tradeId }) => {
  return (
    <FormPageWrapper>
      <DeleteTradeForm userId={userId} tradeId={tradeId} />
    </FormPageWrapper>
  );
};

export default DeleteTradePage;