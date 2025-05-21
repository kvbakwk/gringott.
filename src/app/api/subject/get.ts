"use server";

import { SubjectT } from "@app/utils/db-actions/subject";

import { getSubjectById, getSubjectsByUserId } from "@app/utils/db-actions/subject";

export async function getSubject(subjectId: number): Promise<SubjectT> {
  return await getSubjectById(subjectId);
}

export async function getSubjects(userId: number): Promise<SubjectT[]> {
  return await getSubjectsByUserId(userId);
}
