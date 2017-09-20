'use strict';

class User {
	constructor(name) {
		this.name = name;
	}

	greetings() {
		console.log('My name is', this.name);
	}
}

exports.User = User;

//log user module in this way?
//console.log(module);