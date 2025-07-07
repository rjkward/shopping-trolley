import { BuyXGet1Free } from "../src/discount";
import { TrolleyItem } from "../src/types";

describe("BuyXGet1Free", () => {
    test("should return null with empty trolley", () => {
        let dsct = new BuyXGet1Free("241", "product-1", 1);
        let items: TrolleyItem[] = [];
        let ineligible: Map<string, number> = new Map<string, number>();
        expect(dsct.apply(items, ineligible)).toBe(null);
    });
    test("should return null with no targets in trolley", () => {
        let dsct = new BuyXGet1Free("241", "product-1", 1);
        let items: TrolleyItem[] = [
            {
                id: "product-2",
                quantity: 1,
                price: 999,
                category: "fruit",
            },
        ];
        let ineligible: Map<string, number> = new Map<string, number>();
        expect(dsct.apply(items, ineligible)).toBe(null);
    });
    test("should return 1 discount with 1 pair", () => {
        let dsct = new BuyXGet1Free("241", "product-1", 1);
        let items: TrolleyItem[] = [
            {
                id: "product-1",
                quantity: 2,
                price: 10,
                category: "vegetable",
            },
            {
                id: "product-2",
                quantity: 1,
                price: 999,
                category: "fruit",
            },
        ];
        let ineligible: Map<string, number> = new Map<string, number>();
        expect(dsct.apply(items, ineligible)).toEqual([
            {
                discountId: "241",
                discountedItems: new Map<string, number>([["product-1", 2]]),
                discountAmount: 10,
            },
        ]);
    });
    test("should return 3 discounts with 7 items", () => {
        let dsct = new BuyXGet1Free("241", "product-1", 1);
        let items: TrolleyItem[] = [
            {
                id: "product-1",
                quantity: 7,
                price: 10,
                category: "vegetable",
            },
            {
                id: "product-2",
                quantity: 1,
                price: 999,
                category: "fruit",
            },
        ];
        let ineligible: Map<string, number> = new Map<string, number>();
        expect(dsct.apply(items, ineligible)).toEqual([
            {
                discountId: "241",
                discountedItems: new Map<string, number>([["product-1", 2]]),
                discountAmount: 10,
            },
            {
                discountId: "241",
                discountedItems: new Map<string, number>([["product-1", 2]]),
                discountAmount: 10,
            },
            {
                discountId: "241",
                discountedItems: new Map<string, number>([["product-1", 2]]),
                discountAmount: 10,
            },
        ]);
    });
    test("should return 1 discount with 7 items and 4 ineligible", () => {
        let dsct = new BuyXGet1Free("241", "product-1", 1);
        let items: TrolleyItem[] = [
            {
                id: "product-1",
                quantity: 7,
                price: 10,
                category: "vegetable",
            },
            {
                id: "product-2",
                quantity: 1,
                price: 999,
                category: "fruit",
            },
        ];
        let ineligible: Map<string, number> = new Map<string, number>([
            ["product-1", 4],
        ]);
        expect(dsct.apply(items, ineligible)).toEqual([
            {
                discountId: "241",
                discountedItems: new Map<string, number>([["product-1", 2]]),
                discountAmount: 10,
            },
        ]);
    });
    test("should work for higher values of X", () => {
        let dsct = new BuyXGet1Free("buy39get1", "product-1", 39);
        let items: TrolleyItem[] = [
            {
                id: "product-1",
                quantity: 100,
                price: 10,
                category: "vegetable",
            },
            {
                id: "product-2",
                quantity: 1,
                price: 999,
                category: "fruit",
            },
        ];
        let ineligible: Map<string, number> = new Map<string, number>([
            ["product-1", 4],
        ]);
        expect(dsct.apply(items, ineligible)).toEqual([
            {
                discountId: "buy39get1",
                discountedItems: new Map<string, number>([["product-1", 40]]),
                discountAmount: 10,
            },
            {
                discountId: "buy39get1",
                discountedItems: new Map<string, number>([["product-1", 40]]),
                discountAmount: 10,
            },
        ]);
    });
});
