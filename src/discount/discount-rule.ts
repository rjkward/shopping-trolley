import { TrolleyItem } from "../types";

export interface DiscountRule {
    id: string;
    apply(
        items: TrolleyItem[],
        ineligible: Map<string, number>,
    ): DiscountInstance[] | null;
}

export type DiscountInstance = {
    discountId: string;
    discountedItems: Map<string, number>;
    discountAmount: number;
};
