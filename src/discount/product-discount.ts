import { TrolleyItem } from "../types";
import { DiscountInstance, DiscountRule } from "./discount-rule";

/**
 * Product discount will discount all eligible instances of a specific product by a given percentage.
 */
export class ProductDiscount implements DiscountRule {
    id: string;
    targetId: string;
    discountPercentage: number;

    constructor(id: string, targetId: string, discountPercentage: number) {
        if (discountPercentage > 100 || discountPercentage < 0) {
            throw new Error(
                "discountPercentage must be between 0 and 100 inclusive",
            );
        }

        ((this.id = id), (this.targetId = targetId));
        this.discountPercentage = discountPercentage;
    }

    apply(
        items: TrolleyItem[],
        ineligible: Map<string, number>,
    ): DiscountInstance[] | null {
        const target = items.find((item) => item.id === this.targetId);
        if (target === undefined) {
            return null;
        }

        const ineligibleCount = ineligible.get(target.id) ?? 0;
        const eligibleCount = target.quantity - ineligibleCount;
        if (eligibleCount < 1) {
            return null;
        }

        const discountAmount =
            target.price * eligibleCount * (this.discountPercentage / 100);
        return [
            {
                discountId: this.id,
                discountedItems: new Map<string, number>([
                    [this.targetId, eligibleCount],
                ]),
                discountAmount,
            },
        ];
    }
}
