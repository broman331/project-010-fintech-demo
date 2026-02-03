export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Account {
    id: number;
    user_id: number;
    account_number: string;
    balance: string; // Decimal comes as string often, or number
    currency: string;
}

export interface Transaction {
    id: number;
    amount: string;
    from_account?: Account;
    to_account?: Account;
    created_at: string;
}
