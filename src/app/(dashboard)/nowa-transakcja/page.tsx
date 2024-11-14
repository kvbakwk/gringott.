import { getUser } from "@app/api/user/get";

import NewTransactionForm from "@components/NewTransactionForm";

export default async function NewTransactionPage() {
  const user = await getUser();

  return (
    <div>
      <NewTransactionForm user_id={user.id} />
    </div>
  );
}
