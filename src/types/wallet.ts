export interface WalletT {
  id: number;
  name: string;
  balance: number;
  wallet_type_id: number;
  icon: string | null;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface WalletBankDetailsT {
  wallet_id: number;
  bank_name: string | null;
  account_number: string | null;
  bic_swift: string | null;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface WalletGoalDetailsT {
  wallet_id: number;
  target_amount: number;
  status: string;
  deadline: Date | null;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface WalletTypeT {
  id: number;
  name: string;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface WalletIdT {
  id: number;
}
