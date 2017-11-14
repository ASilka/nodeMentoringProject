'use strict';

const fs = require("fs");

let usersBase = fs.readFileSync("./data/employees.json");
let users = JSON.parse(usersBase);
console.log(users);

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', users, {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Users')
  }
};
