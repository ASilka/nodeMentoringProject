/*export class User {
	constructor(name) {
		this.name = name;
	}

	greetings() {
		console.log('My name is', this.name);
	}
}*/

'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    userName: DataTypes.STRING,
    id: DataTypes.UUID,
    eMail: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });
  return User;
};