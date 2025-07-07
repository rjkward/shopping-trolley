import { MockDatastore } from "./datastore";
import {
    BuyXGet1Free,
    CategoryComboDeal,
    DiscountRule,
    ProductDiscount,
    TrolleyDiscount,
} from "./discount";
import { addItem, applyDiscounts, logResult, Trolley } from "./trolley";

// Set up our catalogue "table" for our climbing shop for real sickos.
const store = new MockDatastore(
    { id: "rock_exotica_soloist", price: 1500, category: "belay/soloist" },
    {
        id: "rock_exotica_silent_partner",
        price: 2000,
        category: "belay/soloist",
    },
    { id: "camp_ball_nut_2", price: 70, category: "pro/active" },
    { id: "camp_ball_nut_3", price: 70, category: "pro/active" },
    { id: "fixe_alien_black_NOS", price: 200, category: "pro/active" },
    { id: "totem_cam_0.5", price: 90, category: "pro/active" },
    { id: "coyote_mountain_works_samson", price: 200, category: "pro/active" },
    { id: "camp_tricam_pink", price: 20, category: "pro/passive" },
    {
        id: "gear4rocks_plastic_stoppers_1-8",
        price: 40,
        category: "pro/passive",
    },
    {
        id: "chris_tan_death_quickdraw_mk2_self_assembly",
        price: 20,
        category: "screamers",
    },
);

// Set up our promotions.
const promotions: DiscountRule[] = [
    // 20% off Silent Partners!
    new ProductDiscount("20offSP", "rock_exotica_silent_partner", 20),
    // "Meal Deal" of 1 passive piece, 1 active piece, and 1 shock absorber for £100.
    new CategoryComboDeal(
        "YGDMealDeal",
        100,
        "pro/passive",
        "pro/active",
        "screamers",
    ),
    // Buy 1 tricam get 1 free!
    new BuyXGet1Free("241tricam", "camp_tricam_pink", 1),
    // 5% off everything else!
    new TrolleyDiscount("SummerSale5Off", 5),
];

// Take advantage.
const trolley: Trolley = { items: [] };
addItem(trolley, "rock_exotica_silent_partner", 1, store);
addItem(trolley, "camp_tricam_pink", 5, store);
addItem(trolley, "chris_tan_death_quickdraw_mk2_self_assembly", 10, store);
addItem(trolley, "camp_ball_nut_2", 1, store);
addItem(trolley, "gear4rocks_plastic_stoppers_1-8", 2, store);

const result = applyDiscounts(trolley, ...promotions);
logResult(result);
