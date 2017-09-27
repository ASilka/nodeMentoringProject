const EventEmitter = require('events');
const fs = require('fs');

export class DirWatcher extends EventEmitter {
  constructor(path) {
    super();
    this.path = path;
  }
  watch() {
    const watchDir = fs.watchFile(this.path, { persistent: true, interval: 1000 }, function (current, previous) {
      watchDir.emit('event', console.log('got event'));
    });
    watchDir.on('event', () => {
      console.log('an event occurred!')
    });
  }
}

const dirWatcher = new DirWatcher("./data/test-data-example.csv");

dirWatcher.watch();
