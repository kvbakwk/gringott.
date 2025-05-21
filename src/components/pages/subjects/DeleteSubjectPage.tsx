import React from 'react';

import DeleteSubjectForm from '../../forms/subjects/DeleteSubjectForm';
import FormPageWrapper from '../../layouts/FormPageWrapper';

interface DeleteSubjectPageProps {
  userId: number;
  subjectId: number;
}

const DeleteSubjectPage: React.FC<DeleteSubjectPageProps> = ({ userId, subjectId }) => {
  return (
    <FormPageWrapper>
      <DeleteSubjectForm userId={userId} subjectId={subjectId} />
    </FormPageWrapper>
  );
};

export default DeleteSubjectPage;