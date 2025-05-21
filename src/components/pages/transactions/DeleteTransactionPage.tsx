import React from 'react';

import DeleteTransactionForm from '../../forms/transactions/DeleteTransactionForm';
import FormPageWrapper from '../../layouts/FormPageWrapper';

interface DeleteTransactionPageProps {
  userId: number;
  transactionId: number;
}

const DeleteTransactionPage: React.FC<DeleteTransactionPageProps> = ({ userId, transactionId }) => {
  return (
    <FormPageWrapper>
      <DeleteTransactionForm userId={userId} transactionId={transactionId} />
    </FormPageWrapper>
  );
};

export default DeleteTransactionPage;