import { getUser } from "@app/api/user/get";
import NewWalletForm from "@components/forms/NewWalletForm";

export default async function NewWalletPage() {
  const user = await getUser();
  
  return (
    <div className="flex justify-center items-center w-full h-full bg-surface rounded-tl-2xl shadow-sm">
      <NewWalletForm user_id={user.id} />
    </div>
  );
}
