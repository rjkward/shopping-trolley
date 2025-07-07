import { Product } from "../types";

export interface Datastore {
    getProductById(id: string): Product | undefined;
}

export class MockDatastore implements Datastore {
    products: Map<string, Product>;

    constructor(...products: Product[]) {
        this.products = new Map<string, Product>();
        products.forEach((p) => {
            this.products.set(p.id, p);
        });
    }

    getProductById(id: string): Product | undefined {
        return this.products.get(id);
    }
}
