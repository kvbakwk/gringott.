export type LoanStatus = "active" | "paid";

export type LoanT = {
  id: number;
  user_id: number;
  subject_id: number;
  name: string | null;
  total_amount: number;
  paid_amount: number;
  is_given: boolean;
  currency: string;
  status: LoanStatus;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};
