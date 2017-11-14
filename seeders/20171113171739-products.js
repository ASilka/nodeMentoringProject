'use strict';

const fs = require("fs");

let productsBase = fs.readFileSync("./data/products.json");
let products = JSON.parse(productsBase);
console.log(products);

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Products', products, {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Products')
  }
};
