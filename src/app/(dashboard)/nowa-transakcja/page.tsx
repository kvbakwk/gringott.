import { getUser } from "@app/api/user/get";
import NewTransactionForm from "@components/forms/NewTransactionForm";

export default async function NewTransactionPage() {
  const user = await getUser();

  return (
    <div className="flex justify-center items-center w-full h-full bg-surface rounded-tl-2xl shadow-sm">
      <NewTransactionForm user_id={user.id} />
    </div>
  );
}
