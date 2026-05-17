export interface AssetT {
  id: number;
  name: string;
  ticker: string | null;
  quantity: number;
  currency: string;
  avg_buy_price: number | null;
  current_price: number | null;
  icon: string | null;
  wallet_id: number;
  asset_type_id: number;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface AssetTypeT {
  id: number;
  name: string;
  updated_at: Date;
  deleted_at: Date | null;
}
