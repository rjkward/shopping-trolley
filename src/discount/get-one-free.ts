import { TrolleyItem } from "../types";
import { DiscountInstance, DiscountRule } from "./discount-rule";

/**
 * BuyXGet1Free will discount 1 item to zero if X of that item are also included in the same trolley.
 * Can apply multiple times.
 */
export class BuyXGet1Free implements DiscountRule {
    id: string;
    X: number;
    targetId: string;

    constructor(id: string, targetId: string, x: number) {
        if (!Number.isInteger(x)) {
            throw new Error("BuyXGet1Free: X must be an integer");
        }

        if (x < 1) {
            throw new Error("BuyXGet1Free: X must be 1 or more");
        }

        this.id = id;
        this.targetId = targetId;
        this.X = x;
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
        const freebies = Math.floor(
            (target.quantity - ineligibleCount) / (this.X + 1),
        );
        if (freebies < 1) {
            return null;
        }

        const out: DiscountInstance[] = [];
        for (let i = 0; i < freebies; i++) {
            out.push({
                discountId: this.id,
                discountedItems: new Map<string, number>([
                    [this.targetId, this.X + 1],
                ]),
                discountAmount: target.price,
            });
        }

        return out;
    }
}
