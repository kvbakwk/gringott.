export interface SubjectT {
  id: number;
  user_id: number;
  name: string;
  address: string;
  subject_type_id: number;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface SubjectTypeT {
  id: number;
  name: string;
  updated_at: Date;
  deleted_at: Date | null;
}
