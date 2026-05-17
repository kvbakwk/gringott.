import { SubjectT } from "@/types/subject";

export interface TradeT {
  id: number;
  date: Date;
  amount: number;
  deposit: boolean;
  user_id: number;
  wallet_id: number;
  user_method_id: number;
  user_method_name: string;
  subject_id: number;
  subject: SubjectT;
  subject_method_id: number;
  subject_method_name: string;
  updated_at: Date;
  deleted_at: Date | null;
}
