export type Category = 
  | 'Room Rent' 
  | 'Travel to Home' 
  | 'Daily Travelling' 
  | 'Extra Travelling' 
  | 'Vegetables' 
  | 'Outside Food'
  | 'Other';

export interface Expense {
  id: string;
  date: string;
  category: Category;
  amount: number;
  notes?: string;
}

export interface Budget {
  amount: number;
  month: string; // YYYY-MM format
}
