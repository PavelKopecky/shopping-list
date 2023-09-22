export class ShoppingListEntry {
	date : string;
	content : string[];

	constructor (date : string, content : string[]) {
		this.date = date;
		this.content = content;
	}
}
