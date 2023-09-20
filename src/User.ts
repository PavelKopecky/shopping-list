import {ShoppingListEntry} from "./ShoppingListEntry.js";

export class User {
    id : string;
    name : string;
    hashedPassword : string;
    shoppingList : ShoppingListEntry[] = [];

    constructor(id : string, name : string, hashedPassword : string) {
        this.id = id;
        this.name = name;
        this.hashedPassword = hashedPassword;
    }
}