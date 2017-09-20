'use strict';

const user = require('./user');
const product = require('./product');

//create instances of User and Product
var userName = new user.User('Alena');
var productBrand = new product.Product ('Test project');

exports.userName = userName;
exports.productBrand = productBrand;