export interface MethodT {
  id: number;
  name: string;
  cash: boolean;
  bank: boolean;
  updated_at: Date;
  deleted_at: Date | null;
}
