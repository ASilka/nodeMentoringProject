//import { User, Product } from './models';
import app from './app';  

/*
const userName = new User('Alena');
const productBrand = new Product('Test project');

import * as config from './config/config';

console.log('Hello! This is my first test application known as', config.appName);

userName.greetings();
productBrand.productChoice();
*/

const port = process.env.PORT || 8080; 
app.listen(port, () => console.log(`App listening on port ${port}!`)) 