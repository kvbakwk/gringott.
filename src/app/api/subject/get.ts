"use server";

import { SubjectT } from "@app/utils/db-actions/subject";

import {
  getSubjectById,
  getSubjectsByUserId,
} from "@app/utils/db-actions/subject";
import { verifySession } from "@app/utils/session";

export async function getSubject(subjectId: number): Promise<SubjectT> {
  if (!(await verifySession()).isAuth) return null;
  return await getSubjectById(subjectId);
}

export async function getSubjects(userId: number): Promise<SubjectT[]> {
  if (!(await verifySession()).isAuth) return null;
  return await getSubjectsByUserId(userId);
}
