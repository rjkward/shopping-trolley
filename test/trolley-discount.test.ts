import { TrolleyDiscount } from "../src/discount";
import { TrolleyItem } from "../src/types";

describe("TrolleyDiscount", () => {
    let dsct: TrolleyDiscount;
    beforeEach(() => {
        dsct = new TrolleyDiscount("Trolley5", 5);
    });
    test("should return null with empty trolley", () => {
        let items: TrolleyItem[] = [];
        let ineligible: Map<string, number> = new Map<string, number>();
        expect(dsct.apply(items, ineligible)).toBe(null);
    });
    test("should return null with no eligible items", () => {
        let items: TrolleyItem[] = [
            {
                id: "p-1",
                quantity: 3,
                price: 20,
                category: "animal",
            },
            {
                id: "p-2",
                quantity: 2,
                price: 20,
                category: "vegetable",
            },
            {
                id: "p-3",
                quantity: 10,
                price: 20,
                category: "mineral",
            },
        ];
        let ineligible: Map<string, number> = new Map<string, number>([
            ["p-1", 3],
            ["p-2", 2],
            ["p-3", 10],
        ]);
        expect(dsct.apply(items, ineligible)).toBe(null);
    });
    test("should return correct discount", () => {
        let items: TrolleyItem[] = [
            {
                id: "p-1",
                quantity: 3,
                price: 20,
                category: "animal",
            },
            {
                id: "p-2",
                quantity: 2,
                price: 40,
                category: "vegetable",
            },
            {
                id: "p-3",
                quantity: 10,
                price: 100,
                category: "mineral",
            },
        ];
        let ineligible: Map<string, number> = new Map<string, number>();
        expect(dsct.apply(items, ineligible)).toEqual([
            {
                discountId: "Trolley5",
                discountedItems: new Map<string, number>([
                    ["p-1", 3],
                    ["p-2", 2],
                    ["p-3", 10],
                ]),
                discountAmount: 57,
            },
        ]);
    });
    test("should return correct discount with ineligible items", () => {
        let items: TrolleyItem[] = [
            {
                id: "p-1",
                quantity: 3,
                price: 20,
                category: "animal",
            },
            {
                id: "p-2",
                quantity: 2,
                price: 40,
                category: "vegetable",
            },
            {
                id: "p-3",
                quantity: 10,
                price: 100,
                category: "mineral",
            },
        ];
        let ineligible: Map<string, number> = new Map<string, number>([
            ["p-1", 2],
            ["p-2", 1],
            ["p-3", 5],
        ]);
        expect(dsct.apply(items, ineligible)).toEqual([
            {
                discountId: "Trolley5",
                discountedItems: new Map<string, number>([
                    ["p-1", 1],
                    ["p-2", 1],
                    ["p-3", 5],
                ]),
                discountAmount: 28,
            },
        ]);
    });
});
