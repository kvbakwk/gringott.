import React from 'react';
import EditTransactionForm from '../../forms/transactions/EditTransactionForm';
import FormPageWrapper from '../../layouts/FormPageWrapper';

interface EditTransactionPageProps {
  userId: number;
  transactionId: number;
}

const EditTransactionPage: React.FC<EditTransactionPageProps> = ({ userId, transactionId }) => {
  return (
    <FormPageWrapper>
      <EditTransactionForm userId={userId} transactionId={transactionId} />
    </FormPageWrapper>
  );
};

export default EditTransactionPage;