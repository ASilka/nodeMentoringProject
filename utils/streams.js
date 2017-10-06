const yargs = require('yargs');
const fs = require('fs');
const through2 = require('through2');
const split = require('split2');

const argv = yargs
    .options({
        action: {
            demand: true,
            alias: 'a',
            describe: 'action to be done',
            string: true,
        },
        file: {
            demand: false,
            alias: 'f',
            describe: 'file to be processed',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

const action = argv.action;
const file = argv.file;

function inputOutput(filePath) {
    if (action === 'io') {
        if (file) {
            const fromFile = argv.file;
            const reader = fs.createReadStream(fromFile);
            reader.pipe(process.stdout)
        }
        else { console.log('please provide the path to the file to continue') }
    }
};
inputOutput();

function transformFile(filePath) {
    if (action === 'transform-file') {
        if (file) {
            //const data = fs.readFileSync(argv.file);
            const reader = fs.createReadStream(argv.file)
                .pipe(through2(function (data, enc, cb) {
                    cb(null, new Buffer(data.toString().toUpperCase()))
                }))
                .pipe(process.stdout);
        }
        else {
            console.log('please provide the path to the file to continue')
        }
    }
};
transformFile();

function transform() {
    if (action === 'transform') {
        const fromFile = './data/test-data-example.csv';
        const stream = fs.createReadStream(fromFile);

        const parseCSV = () => {
            let templateKeys = [];
            let parseHeadline = true;

            return through2.obj((data, enc, cb) => {
                if (parseHeadline) {
                    templateKeys = data.toString().split(',');
                    parseHeadline = false;
                    return cb(null, null);
                }
                const entries = data.toString().split(',');
                const obj = {};
                templateKeys.forEach((el, index) => {
                    obj[el] = entries[index];
                });
                return cb(null, obj);
            });
        };

        const toJSON = () => {
            let objs = [];
            return through2.obj(function (data, enc, cb) {
                objs.push(data);
                cb(null, null);
            }, function (cb) {
                this.push(JSON.stringify(objs));
                cb();
            });
        };

        stream
            .pipe(split())
            .pipe(parseCSV())
            .pipe(toJSON())
            .pipe(process.stdout);
    }
}

transform();

function transformAndSave() {
    if (action === 'transformAndSave') {
        const fromFile = './data/test-data-example.csv';
        const toFile = './data/test-data-example.json'
        const stream = fs.createReadStream(fromFile);

        const parseCSV = () => {
            let templateKeys = [];
            let parseHeadline = true;

            return through2.obj((data, enc, cb) => {
                if (parseHeadline) {
                    templateKeys = data.toString().split(',');
                    parseHeadline = false;
                    return cb(null, null);
                }
                const entries = data.toString().split(',');
                const obj = {};
                templateKeys.forEach((el, index) => {
                    obj[el] = entries[index];
                });
                return cb(null, obj);
            });
        };

        const toJSON = () => {
            let objs = [];
            return through2.obj(function (data, enc, cb) {
                objs.push(data);
                cb(null, null);
            }, function (cb) {
                this.push(JSON.stringify(objs));
                cb();
            });
        };

        stream
            .pipe(split())
            .pipe(parseCSV())
            .pipe(toJSON())
            .pipe(fs.createWriteStream(toFile))
    }
}

transformAndSave();

function cssBundler() {
    if (action === 'bundle-css') {
        const testFolder = './assets/css/';
        const toFile = './assets/css/bundle.css';

        fs.readdir(testFolder, (err, files) => {

            files.forEach(file => {
                const items = testFolder + file;
                console.log(items);
                const reader = fs.createReadStream(items);
                const writer = fs.createWriteStream(toFile);
                reader.pipe(writer);
            });
        });
    }
}
cssBundler();

function printHelpMessage() {
    if (action != 'io' || 'transform' || 'transformAndSave' || 'transformFile' || 'cssBundle') {console.log('unknown action. Available actions are: io, transform, transformAndSave, transformFile, cssBundle')}
}
printHelpMessage();

