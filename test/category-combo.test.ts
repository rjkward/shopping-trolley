import { CategoryComboDeal, DiscountInstance } from "../src/discount";
import { TrolleyItem } from "../src/types";

describe("CategoryComboDeal", () => {
    test("should return null with empty trolley", () => {
        let dsct = new CategoryComboDeal(
            "mealdeal",
            5,
            "drink",
            "sandwich",
            "snack",
        );
        let items: TrolleyItem[] = [];
        let ineligible: Map<string, number> = new Map<string, number>();
        expect(dsct.apply(items, ineligible)).toBe(null);
    });
    test("should return null with no eligible items", () => {
        let dsct = new CategoryComboDeal(
            "mealdeal",
            5,
            "drink",
            "sandwich",
            "snack",
        );
        let items: TrolleyItem[] = [
            {
                id: "dr1",
                quantity: 3,
                price: 20,
                category: "drink",
            },
            {
                id: "sa1",
                quantity: 2,
                price: 20,
                category: "sandwich",
            },
            {
                id: "sn1",
                quantity: 10,
                price: 20,
                category: "snack",
            },
            {
                id: "o1",
                quantity: 10,
                price: 20,
                category: "other",
            },
        ];
        let ineligible: Map<string, number> = new Map<string, number>([
            ["dr1", 3],
            ["sa1", 2],
            ["sn1", 10],
        ]);
        expect(dsct.apply(items, ineligible)).toBe(null);
    });
    test("should return null with incomplete deal", () => {
        let dsct = new CategoryComboDeal(
            "mealdeal",
            5,
            "drink",
            "sandwich",
            "snack",
        );
        let items: TrolleyItem[] = [
            {
                id: "dr1",
                quantity: 1,
                price: 20,
                category: "drink",
            },
            {
                id: "sn1",
                quantity: 1,
                price: 20,
                category: "snack",
            },
            {
                id: "o1",
                quantity: 1,
                price: 20,
                category: "other",
            },
        ];
        let ineligible: Map<string, number> = new Map<string, number>();
        expect(dsct.apply(items, ineligible)).toEqual(null);
    });
    test("should return discount with complete combo", () => {
        let dsct = new CategoryComboDeal(
            "mealdeal",
            5,
            "drink",
            "sandwich",
            "snack",
        );
        let items: TrolleyItem[] = [
            {
                id: "dr1",
                quantity: 3,
                price: 2,
                category: "drink",
            },
            {
                id: "sa1",
                quantity: 3,
                price: 3,
                category: "sandwich",
            },
            {
                id: "sn1",
                quantity: 10,
                price: 2,
                category: "snack",
            },
            {
                id: "o1",
                quantity: 10,
                price: 20,
                category: "other",
            },
        ];
        let ineligible: Map<string, number> = new Map<string, number>([
            ["sa1", 2],
        ]);
        expect(dsct.apply(items, ineligible)).toEqual([
            {
                discountId: "mealdeal",
                discountedItems: new Map<string, number>([
                    ["dr1", 1],
                    ["sa1", 1],
                    ["sn1", 1],
                ]),
                discountAmount: 2,
            },
        ]);
    });
    test("should return multiple discounts with complete combos", () => {
        let dsct = new CategoryComboDeal(
            "mealdeal",
            5,
            "drink",
            "sandwich",
            "snack",
        );
        let items: TrolleyItem[] = [
            {
                id: "dr1",
                quantity: 3,
                price: 2,
                category: "drink",
            },
            {
                id: "sa1",
                quantity: 5,
                price: 3,
                category: "sandwich",
            },
            {
                id: "sn1",
                quantity: 10,
                price: 2,
                category: "snack",
            },
            {
                id: "o1",
                quantity: 10,
                price: 20,
                category: "other",
            },
        ];
        let ineligible: Map<string, number> = new Map<string, number>([
            ["sa1", 2],
        ]);
        expect(dsct.apply(items, ineligible)).toEqual([
            {
                discountId: "mealdeal",
                discountedItems: new Map<string, number>([
                    ["dr1", 1],
                    ["sa1", 1],
                    ["sn1", 1],
                ]),
                discountAmount: 2,
            },
            {
                discountId: "mealdeal",
                discountedItems: new Map<string, number>([
                    ["dr1", 1],
                    ["sa1", 1],
                    ["sn1", 1],
                ]),
                discountAmount: 2,
            },
            {
                discountId: "mealdeal",
                discountedItems: new Map<string, number>([
                    ["dr1", 1],
                    ["sa1", 1],
                    ["sn1", 1],
                ]),
                discountAmount: 2,
            },
        ]);
    });
    test("should return null if items are cheaper than the deal", () => {
        let dsct = new CategoryComboDeal(
            "mealdeal",
            100,
            "drink",
            "sandwich",
            "snack",
        );
        let items: TrolleyItem[] = [
            {
                id: "dr1",
                quantity: 3,
                price: 2,
                category: "drink",
            },
            {
                id: "sa1",
                quantity: 3,
                price: 3,
                category: "sandwich",
            },
            {
                id: "sn1",
                quantity: 10,
                price: 2,
                category: "snack",
            },
            {
                id: "o1",
                quantity: 10,
                price: 20,
                category: "other",
            },
        ];
        let ineligible: Map<string, number> = new Map<string, number>([
            ["sa1", 2],
        ]);
        expect(dsct.apply(items, ineligible)).toBe(null);
    });
    test("should return multiple discounts for the most expensive items", () => {
        let dsct = new CategoryComboDeal(
            "mealdeal",
            5,
            "drink",
            "sandwich",
            "snack",
        );
        let items: TrolleyItem[] = [
            {
                id: "dr",
                quantity: 10,
                price: 1,
                category: "drink",
            },
            {
                id: "dr-ex",
                quantity: 5,
                price: 100,
                category: "drink",
            },
            {
                id: "sa-ex",
                quantity: 2,
                price: 100,
                category: "sandwich",
            },
            {
                id: "sa",
                quantity: 10,
                price: 1,
                category: "sandwich",
            },
            {
                id: "sn",
                quantity: 10,
                price: 1,
                category: "snack",
            },
            {
                id: "sn-ex",
                quantity: 1,
                price: 100,
                category: "snack",
            },
        ];
        let ineligible: Map<string, number> = new Map<string, number>([
            ["dr-ex", 2],
        ]);
        expect(dsct.apply(items, ineligible)).toEqual([
            {
                discountId: "mealdeal",
                discountedItems: new Map<string, number>([
                    ["dr-ex", 1],
                    ["sa-ex", 1],
                    ["sn-ex", 1],
                ]),
                discountAmount: 295,
            },
            {
                discountId: "mealdeal",
                discountedItems: new Map<string, number>([
                    ["dr-ex", 1],
                    ["sa-ex", 1],
                    ["sn", 1],
                ]),
                discountAmount: 196,
            },
            {
                discountId: "mealdeal",
                discountedItems: new Map<string, number>([
                    ["dr-ex", 1],
                    ["sa", 1],
                    ["sn", 1],
                ]),
                discountAmount: 97,
            },
        ]);
    });
});
