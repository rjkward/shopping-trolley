import { ProductDiscount, DiscountInstance } from "../src/discount";
import { TrolleyItem } from "../src/types";

// Wrote this suite in a more go-like style to see how it felt in ts.
// It was a mistake: my ts tooling won't detect the individual cases!
describe("ProductDiscount", () => {
    let cases: {
        name: string;
        id: string;
        targetId: string;
        discountPercentage: number;
        items: TrolleyItem[];
        ineligible: Map<string, number> | null;
        want: DiscountInstance[] | null;
    }[] = [
        {
            name: "should return null with empty trolley",
            id: "percentage-off",
            targetId: "product-1",
            discountPercentage: 20,
            items: [],
            ineligible: null,
            want: null,
        },
        {
            name: "should return null with no targets",
            id: "percentage-off",
            targetId: "product-1",
            discountPercentage: 20,
            items: [
                {
                    id: "product-2",
                    quantity: 1,
                    price: 999,
                    category: "fruit",
                },
            ],
            ineligible: null,
            want: null,
        },
        {
            name: "should return discount with 1 target",
            id: "percentage-off",
            targetId: "product-1",
            discountPercentage: 20,
            items: [
                {
                    id: "product-1",
                    quantity: 1,
                    price: 10,
                    category: "fruit",
                },
                {
                    id: "product-2",
                    quantity: 1,
                    price: 999,
                    category: "fruit",
                },
            ],
            ineligible: null,
            want: [
                {
                    discountId: "percentage-off",
                    discountedItems: new Map<string, number>([
                        ["product-1", 1],
                    ]),
                    discountAmount: 2,
                },
            ],
        },
        {
            name: "should return discount with 7 targets",
            id: "percentage-off",
            targetId: "product-1",
            discountPercentage: 20,
            items: [
                {
                    id: "product-1",
                    quantity: 7,
                    price: 10,
                    category: "fruit",
                },
                {
                    id: "product-2",
                    quantity: 1,
                    price: 999,
                    category: "fruit",
                },
            ],
            ineligible: null,
            want: [
                {
                    discountId: "percentage-off",
                    discountedItems: new Map<string, number>([
                        ["product-1", 7],
                    ]),
                    discountAmount: 14,
                },
            ],
        },
        {
            name: "should return discount with 7 targets and 4 ineligible",
            id: "percentage-off",
            targetId: "product-1",
            discountPercentage: 20,
            items: [
                {
                    id: "product-1",
                    quantity: 7,
                    price: 10,
                    category: "fruit",
                },
                {
                    id: "product-2",
                    quantity: 1,
                    price: 999,
                    category: "fruit",
                },
            ],
            ineligible: new Map<string, number>([["product-1", 4]]),
            want: [
                {
                    discountId: "percentage-off",
                    discountedItems: new Map<string, number>([
                        ["product-1", 3],
                    ]),
                    discountAmount: 6,
                },
            ],
        },
    ];

    cases.forEach((c) => {
        test(c.name, () => {
            const dsct = new ProductDiscount(
                c.id,
                c.targetId,
                c.discountPercentage,
            );
            const items = c.items ?? [];
            const ineligible = c.ineligible ?? new Map<string, number>();
            expect(dsct.apply(items, ineligible)).toEqual(c.want);
        });
    });
});
