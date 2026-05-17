export interface TransferT {
  id: number;
  date: Date;
  amount: number;
  user_id: number;
  method_id: number;
  method_name: string;
  from_wallet_id: number;
  to_wallet_id: number;
  updated_at: Date;
  deleted_at: Date | null;
}
