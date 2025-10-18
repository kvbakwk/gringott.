"use server";

import { getTransactionsIdsBySubjectId } from "@app/utils/db-actions/transaction";
import { getTradesIdsBySubjectId } from "@app/utils/db-actions/trade";
import { deleteSubject, getSubjectById } from "@app/utils/db-actions/subject";
import { verifySession } from "@app/utils/session";

export async function deleteSubjectAPI(
  subjectId: number,
  userId: number
): Promise<{
  success: boolean;
  transactionErr: boolean;
  tradeErr: boolean;
  userIdErr: boolean;
}> {
  if (!(await verifySession()).isAuth) return null;
  const transactionErr =
    (await getTransactionsIdsBySubjectId(subjectId)).length !== 0;
  const tradeErr = (await getTradesIdsBySubjectId(subjectId)).length !== 0;
  const userIdErr =
    isNaN(userId) || userId !== (await getSubjectById(subjectId)).user_id;

  const isValid = !transactionErr && !tradeErr && !userIdErr;

  if (isValid) await deleteSubject(subjectId);

  return {
    success: isValid,
    transactionErr: transactionErr,
    tradeErr: tradeErr,
    userIdErr: userIdErr,
  };
}
