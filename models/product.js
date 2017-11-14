/*export class Product {
	constructor(brand) {
		this.brand = brand;
	}

	productChoice() {
		console.log('That is just', this.brand);
	}
}*/

'use strict';
module.exports = (sequelize, DataTypes) => {
  var Product = sequelize.define('Product', {
    product: DataTypes.STRING,
    year: DataTypes.STRING,
    owner: DataTypes.STRING,
    reviews: DataTypes.STRING,
    id: DataTypes.INTEGER
  }, {
      classMethods: {
        associate: function (models) {
        }
      }
    });
  return Product;
};