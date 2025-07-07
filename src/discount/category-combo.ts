import { TrolleyItem } from "../types";
import { DiscountInstance, DiscountRule } from "./discount-rule";

/**
 * CategoryComboDeal will charge a set price if the trolley contains 1 item from each specified category
 * (in lieu of the what the items would have notmally cost). Much like the classic Boots meal deal.
 * Only applied if it will save the customer money. Can apply multiple times.
 */
export class CategoryComboDeal implements DiscountRule {
    id: string;
    categoryTargets: string[];
    price: number;

    constructor(id: string, price: number, ...categoryTargets: string[]) {
        if (categoryTargets.length === 0) {
            throw new Error("CategoryComboDeal requires at least one category");
        }

        const allUnique =
            new Set(categoryTargets).size === categoryTargets.length;
        if (!allUnique) {
            throw new Error(
                "CategoryComboDeal does not allow duplicate categories",
            );
        }

        this.id = id;
        this.price = price;
        this.categoryTargets = categoryTargets;
    }

    apply(
        items: TrolleyItem[],
        ineligible: Map<string, number>,
    ): DiscountInstance[] | null {
        // Build 2D array of all eligible items by category.
        let data: Helper[][] = new Array(this.categoryTargets.length);
        this.categoryTargets.forEach((category, index) => {
            data[index] = [];
            const filtered = items.filter((item) => item.category === category);
            filtered.forEach((item) => {
                const ineligibleCount = ineligible.get(item.id) ?? 0;
                const eligibleCount = item.quantity - ineligibleCount;
                for (let i = 0; i < eligibleCount; i++) {
                    data[index].push({
                        id: item.id,
                        price: item.price,
                    });
                }
            });
        });

        // Figure out how many times we can apply the discount.
        let count = Number.MAX_VALUE;
        data.forEach((category) => {
            count = Math.min(category.length, count);
        });

        if (count === 0) {
            return null;
        }

        // Sort arrays so we will group the most expensive products from each category together when iterating.
        // Customers will then receive the biggest discount possible.
        data.forEach((category) => {
            category.sort((a, b) => b.price - a.price);
        });

        let discounts: DiscountInstance[] | null = null;
        // Take horizontal slices accross category columns as many times as we can.
        for (let y = 0; y < count; y++) {
            let originalPrice = 0;
            const discountedItems = new Map<string, number>();
            for (let x = 0; x < data.length; x++) {
                let item = data[x][y];
                originalPrice += item.price;
                discountedItems.set(item.id, 1);
            }

            if (originalPrice <= this.price) {
                // Because of the sort we did further iterations will be pointless.
                break;
            }

            if (!discounts) {
                discounts = [];
            }

            discounts.push({
                discountId: this.id,
                discountedItems,
                discountAmount: originalPrice - this.price,
            });
        }

        return discounts;
    }
}

type Helper = {
    id: string;
    price: number;
};
