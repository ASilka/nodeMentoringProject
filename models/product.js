'use strict';

class Product {
	constructor (brand) {
		this.brand = brand;
	}
	
	productChoice () {
		console.log('That is just', this.brand );
	}
}
	
exports.Product = Product;

//log product module
console.log(module);