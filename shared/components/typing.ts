export type ImportantType = "Loi" | "My" | "Important";

export interface Question {
  id?: number;
  question: string;
  loi: string;
  my: string;
  important?: ImportantType;
  category?: string;
}
