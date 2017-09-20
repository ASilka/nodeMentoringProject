'use strict';

//one import for all created models
const models = require ('./models')

const config = require ('./config/config');

//log app name to console
console.log('Hello! This is my first test application known as', config.appName);

models.userName.greetings();
models.productBrand.productChoice();