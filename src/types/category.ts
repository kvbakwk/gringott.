export interface CategoryT {
  id: number;
  name: string;
  income: boolean;
  outcome: boolean;
  category_type_id: number;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface CategoryTypeT {
  id: number;
  name: string;
  updated_at: Date;
  deleted_at: Date | null;
}
