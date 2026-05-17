export interface TransactionT {
  id: number;
  date: Date;
  amount: number;
  description: string;
  category_type_id: number;
  category_type_name: string;
  category_id: number;
  category_name: string;
  subject_id: number;
  subject_name: string;
  income: boolean;
  important: boolean;
  user_id: number;
  wallet_id: number;
  method_id: number;
  method_name: string;
  transaction_type_id: number;
  loan_id?: number | null;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface TransactionTypeT {
  id: number;
  name: string;
  updated_at: Date;
  deleted_at: Date | null;
}
