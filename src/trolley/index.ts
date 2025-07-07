import { DiscountInstance, DiscountRule } from "../discount";
import { Datastore } from "../datastore";
import { TrolleyItem } from "../types";

export type Trolley = {
    items: TrolleyItem[];
};

export function applyDiscounts(
    trolley: Trolley,
    ...discountRules: DiscountRule[]
): ApplyDiscountsResult {
    let originalPrice = 0;
    trolley.items.forEach(
        (item) => (originalPrice += item.price * item.quantity),
    );

    const ineligible = new Map<string, number>();
    const discountInstances: DiscountInstance[] = [];
    discountRules.forEach((rule) => {
        const discounts = rule.apply(trolley.items, ineligible);
        if (!discounts) {
            return;
        }

        discountInstances.push(...discounts);
        markDiscountedItemsIneligible(discounts, ineligible);
    });

    const totalDiscount = getTotalDiscount(discountInstances);
    return {
        originalPrice,
        totalDiscount,
        newPrice: originalPrice - totalDiscount,
        discountInstances,
        discountedItems: ineligible,
    };
}

export function addItem(
    trolley: Trolley,
    id: string,
    quantity: number,
    store: Datastore,
) {
    if (!Number.isInteger(quantity)) {
        throw new Error("addItemToTrolley: quantity must be an integer");
    }

    if (quantity < 1) {
        throw new Error("addItemToTrolley: quantity must be positive");
    }

    const product = store.getProductById(id);
    if (product === undefined) {
        throw new Error("addItemToTrolley: could not find product by id");
    }

    const item = trolley.items.find((item) => item.id === id);
    if (item !== undefined) {
        item.quantity += quantity;
        // Might as well refresh these cached values:
        item.price = product.price;
        item.category = item.category;
        return;
    }

    trolley.items.push({
        id,
        quantity,
        price: product.price,
        category: product.category,
    });
}

export function removeItem(trolley: Trolley, id: string, quantity: number) {
    if (!Number.isInteger(quantity)) {
        throw new Error("addItemToTrolley: quantity must be an integer");
    }

    if (quantity < 1) {
        throw new Error("addItemToTrolley: quantity must be positive");
    }

    const index = trolley.items.findIndex((item) => item.id === id);
    if (index === -1) {
        return;
    }

    const newQuantity = trolley.items[index].quantity - quantity;
    if (newQuantity < 1) {
        trolley.items.splice(index, index);
        return;
    }

    trolley.items[index].quantity = newQuantity;
}

function markDiscountedItemsIneligible(
    discounts: DiscountInstance[],
    ineligible: Map<string, number>,
) {
    discounts.forEach((discount) => {
        discount.discountedItems.forEach((quantity, id) => {
            ineligible.set(id, (ineligible.get(id) ?? 0) + quantity);
        });
    });
}

function getTotalDiscount(discounts: DiscountInstance[]): number {
    let total = 0;
    discounts.forEach((discount) => (total += discount.discountAmount));
    return total;
}

export type ApplyDiscountsResult = {
    originalPrice: number;
    totalDiscount: number;
    newPrice: number;
    discountInstances: DiscountInstance[];
    discountedItems: Map<string, number>;
};

export function logResult(result: ApplyDiscountsResult) {
    // We have to log the discountInstances prop directly or the Maps don't get stringified
    console.log({
        originalPrice: result.originalPrice,
        totalDiscount: result.totalDiscount,
        newPrice: result.newPrice,
        discountedItems: result.discountedItems,
    });

    console.log("discountInstances:");
    console.log(result.discountInstances);
}
