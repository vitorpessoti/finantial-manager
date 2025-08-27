export interface Transaction {
    id?: string;
    userId: string;
    type: 'credit' | 'debit';
    description: string;
    value: number;
    category: string;
    date: string;
    createdAt?: string;
}
