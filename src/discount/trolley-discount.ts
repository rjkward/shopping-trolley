import { TrolleyItem } from "../types";
import { DiscountInstance, DiscountRule } from "./discount-rule";

/**
 * Trolley discount will discount all eligible items in the trolley by a given percentage.
 */
export class TrolleyDiscount implements DiscountRule {
    id: string;
    discountPercentage: number;

    constructor(id: string, discountPercentage: number) {
        if (discountPercentage > 100 || discountPercentage < 0) {
            throw new Error(
                "discountPercentage must be between 0 and 100 inclusive",
            );
        }

        ((this.id = id), (this.discountPercentage = discountPercentage));
    }

    apply(
        items: TrolleyItem[],
        ineligible: Map<string, number>,
    ): DiscountInstance[] | null {
        let discountMultiplier = this.discountPercentage / 100;
        const discountedItems = new Map<string, number>();
        let discountAmount = 0;
        items.forEach((item) => {
            let ineligibleCount = ineligible.get(item.id) ?? 0;
            let eligibleCount = item.quantity - ineligibleCount;
            if (eligibleCount < 1) {
                return;
            }

            discountAmount += item.price * discountMultiplier * eligibleCount;
            discountedItems.set(item.id, eligibleCount);
        });

        if (discountAmount === 0) {
            return null;
        }

        return [
            {
                discountId: this.id,
                discountedItems,
                discountAmount,
            },
        ];
    }
}
