import { DiscountInstance, DiscountRule } from "../src/discount";
import { TrolleyItem } from "../src/types";
import { applyDiscounts, Trolley } from "../src/trolley";

class MockDiscountRule implements DiscountRule {
    id: string;
    out: DiscountInstance[] | null;

    constructor(out: DiscountInstance[] | null) {
        this.id = "mock-discount-rule";
        this.out = out;
    }

    apply(
        items: TrolleyItem[],
        ineligible: Map<string, number>,
    ): DiscountInstance[] | null {
        return this.out;
    }
}

describe("applyDiscounts", () => {
    const trolley: Trolley = {
        items: [
            {
                id: "dmm_dragon_5",
                quantity: 1,
                price: 70,
                category: "cams/friends",
            },
            {
                id: "beal_accessory_cord_5mm_1mtr",
                quantity: 20,
                price: 1,
                category: "rope/cord",
            },
        ],
    };
    test("should apply no discounts if no discounts are supplied", () => {
        expect(applyDiscounts(trolley)).toEqual({
            originalPrice: 90,
            totalDiscount: 0,
            newPrice: 90,
            discountInstances: [],
            discountedItems: new Map<string, number>(),
        });
    });
    test("should apply a single discount rule", () => {
        let rules: DiscountRule[] = [
            new MockDiscountRule([
                {
                    discountId: "241 on cord",
                    discountedItems: new Map<string, number>([
                        ["beal_accessory_cord_5mm_1mtr", 20],
                    ]),
                    discountAmount: 10,
                },
            ]),
        ];

        expect(applyDiscounts(trolley, ...rules)).toEqual({
            originalPrice: 90,
            totalDiscount: 10,
            newPrice: 80,
            discountInstances: [
                {
                    discountId: "241 on cord",
                    discountedItems: new Map<string, number>([
                        ["beal_accessory_cord_5mm_1mtr", 20],
                    ]),
                    discountAmount: 10,
                },
            ],
            discountedItems: new Map<string, number>([
                ["beal_accessory_cord_5mm_1mtr", 20],
            ]),
        });
    });
    test("should apply multiple discount rules", () => {
        let rules: DiscountRule[] = [
            new MockDiscountRule([
                {
                    discountId: "10% off cams",
                    discountedItems: new Map<string, number>([
                        ["dmm_dragon_5", 1],
                    ]),
                    discountAmount: 7,
                },
            ]),
            new MockDiscountRule(null), // simulate rule conditions not met
            new MockDiscountRule([
                {
                    discountId: "Buy 5 get 1 free",
                    discountedItems: new Map<string, number>([
                        ["beal_accessory_cord_5mm_1mtr", 6],
                    ]),
                    discountAmount: 1,
                },
                {
                    discountId: "Buy 5 get 1 free",
                    discountedItems: new Map<string, number>([
                        ["beal_accessory_cord_5mm_1mtr", 6],
                    ]),
                    discountAmount: 1,
                },
                {
                    discountId: "Buy 5 get 1 free",
                    discountedItems: new Map<string, number>([
                        ["beal_accessory_cord_5mm_1mtr", 6],
                    ]),
                    discountAmount: 1,
                },
            ]),
            new MockDiscountRule([
                {
                    discountId: "10% off",
                    discountedItems: new Map<string, number>([
                        ["beal_accessory_cord_5mm_1mtr", 2],
                    ]),
                    discountAmount: 0.2,
                },
            ]),
        ];

        expect(applyDiscounts(trolley, ...rules)).toEqual({
            originalPrice: 90,
            totalDiscount: 10.2,
            newPrice: 79.8,
            discountInstances: [
                {
                    discountId: "10% off cams",
                    discountedItems: new Map<string, number>([
                        ["dmm_dragon_5", 1],
                    ]),
                    discountAmount: 7,
                },
                {
                    discountId: "Buy 5 get 1 free",
                    discountedItems: new Map<string, number>([
                        ["beal_accessory_cord_5mm_1mtr", 6],
                    ]),
                    discountAmount: 1,
                },
                {
                    discountId: "Buy 5 get 1 free",
                    discountedItems: new Map<string, number>([
                        ["beal_accessory_cord_5mm_1mtr", 6],
                    ]),
                    discountAmount: 1,
                },
                {
                    discountId: "Buy 5 get 1 free",
                    discountedItems: new Map<string, number>([
                        ["beal_accessory_cord_5mm_1mtr", 6],
                    ]),
                    discountAmount: 1,
                },
                {
                    discountId: "10% off",
                    discountedItems: new Map<string, number>([
                        ["beal_accessory_cord_5mm_1mtr", 2],
                    ]),
                    discountAmount: 0.2,
                },
            ],
            discountedItems: new Map<string, number>([
                ["dmm_dragon_5", 1],
                ["beal_accessory_cord_5mm_1mtr", 20],
            ]),
        });
    });
});
