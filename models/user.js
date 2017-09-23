export class User {
	constructor(name) {
		this.name = name;
	}

	greetings() {
		console.log('My name is', this.name);
	}
}