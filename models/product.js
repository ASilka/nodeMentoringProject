export class Product {
	constructor(brand) {
		this.brand = brand;
	}

	productChoice() {
		console.log('That is just', this.brand);
	}
}