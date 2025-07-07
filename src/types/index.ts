export type TrolleyItem = {
    id: string;
    quantity: number;
    /** Cached from Product. Per unit. */
    price: number;
    /** Cached from Product. */
    category: string;
};

export type Product = {
    id: string;
    price: number;
    category: string;
};
