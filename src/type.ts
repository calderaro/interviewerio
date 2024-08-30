export interface Question {
  id: string;
  label: string;
  answer: string;
  explanation: string;
  options: Option[];
}

export interface Option {
  id: string;
  label: string;
}
