import React from 'react';
import NewTransactionForm from '../../forms/transactions/NewTransactionForm';
import FormPageWrapper from '../../layouts/FormPageWrapper';

interface NewTransactionPageProps {
  userId: number; 
}

const NewTransactionPage: React.FC<NewTransactionPageProps> = ({ userId }) => {
  return (
    <FormPageWrapper>
      <NewTransactionForm userId={userId} />
    </FormPageWrapper>
  );
};

export default NewTransactionPage;