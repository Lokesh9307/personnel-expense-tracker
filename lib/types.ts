export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: Date | undefined;
}
