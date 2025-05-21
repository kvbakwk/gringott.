import React from 'react';

import EditSubjectForm from '../../forms/subjects/EditSubjectForm';
import FormPageWrapper from '../../layouts/FormPageWrapper';

interface EditSubjectPageProps {
  userId: number;
  subjectId: number;
}

const EditSubjectPage: React.FC<EditSubjectPageProps> = ({ userId, subjectId }) => {
  return (
    <FormPageWrapper>
      <EditSubjectForm userId={userId} subjectId={subjectId} />
    </FormPageWrapper>
  );
};

export default EditSubjectPage;