export type Question = {
  id: number;
  question_id: string;
  question_en: string;
  options: string[];
  correctIndex: number;
};