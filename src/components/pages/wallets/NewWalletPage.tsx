import React from 'react';
import NewWalletForm from '../../forms/wallets/NewWalletForm';
import FormPageWrapper from '../../layouts/FormPageWrapper';

interface NewWalletPageProps {
  userId: number;
}

const NewWalletPage: React.FC<NewWalletPageProps> = ({ userId }) => {
  return (
    <FormPageWrapper>
      <NewWalletForm userId={userId} />
    </FormPageWrapper>
  );
};

export default NewWalletPage;