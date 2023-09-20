import {ShoppingListEntry} from "./ShoppingListEntry.js";

export class User {
    name : string;
    hashedPassword : string;
    shoppingList : ShoppingListEntry[] = [];
    inSession : boolean = false;

    constructor(name : string, hashedPassword : string) {
        this.name = name;
        this.hashedPassword = hashedPassword;
    }
}