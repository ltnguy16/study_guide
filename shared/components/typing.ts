export type ImportantType = "Me" | "Partner" | "Important";

export interface Question {
  id?: number;
  question: string;
  me: string;
  partner: string;
  important?: ImportantType;
  category?: string;
}
