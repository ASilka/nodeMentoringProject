import { User, Product } from './models';

const userName = new User('Alena');
const productBrand = new Product('Test project');

import * as config from './config/config';

//log app name to console
console.log('Hello! This is my first test application known as', config.appName);

userName.greetings();
productBrand.productChoice();


