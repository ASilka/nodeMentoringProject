const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const csv = require('csvtojson');
//import DirWatcher from '../models';

export class Importer {
	constructor(oldFilePath, newFilePath) {
		this.oldFilePath = oldFilePath;
		this.newFilePath = newFilePath;
	}
	importSync() {
		try {
			const fileContent = fs.readFileSync(this.oldFilePath);
			console.log(fileContent.toString());
			const copyToJson = csv()
				.fromFile(this.oldFilePath)
				.on('json', (jsonObj) => {
					console.log(jsonObj);
					fs.writeFileSync(this.newFilePath, JSON.stringify(jsonObj));
				})
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	};

	import() {
		return readFileAsync(this.oldFilePath)
			.then((fileContent) => csv()
				.on('json', (jsonObj) => {
					fs.writeFileAsync(this.newFilePath, JSON.stringify(jsonObj));
				})
				.catch((error) => {
					console.error(error)
					throw error;
				}))
	}
}

const startExport = new Importer('./data/test-data-example.csv', './data/test-new-data-example.json');
const startExportAsync = new Importer('./data/test-data-example.csv', './data/test-new-data-exampleAsync.json');

/*
const dirWatcher = new DirWatcher("./data");
dirWatcher.watch();

function ImportSyncStart() {
	if (dirWatcher.on('event')) {
		letExport.importFileContentSync()
	}
	else {
		console.log("no event to handle");
	}
};
*/

startExport.importSync();
startExportAsync.import();