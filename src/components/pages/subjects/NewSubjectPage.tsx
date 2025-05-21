import React from 'react';
import NewSubjectForm from '../../forms/subjects/NewSubjectForm';
import FormPageWrapper from '../../layouts/FormPageWrapper';

interface NewSubjectPageProps {
  userId: number; 
}

const NewSubjectPage: React.FC<NewSubjectPageProps> = ({ userId }) => {
  return (
    <FormPageWrapper>
      <NewSubjectForm userId={userId} />
    </FormPageWrapper>
  );
};

export default NewSubjectPage;