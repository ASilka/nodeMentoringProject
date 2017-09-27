const EventEmitter = require('events');
const fs = require('fs');

export default class DirWatcher extends EventEmitter {
  constructor(path) {
    super();
    this.path = path;
  }
  watch() {
        this.interval = setInterval(() => {
    const watchDir = fs.watch(this.path, { persistent: true }, function (event, fileName) {
      console.log("Event: " + event);
      console.log(fileName + "\n");
      if (watchDir.event == 'change') {
        watchDir.emit('change', console.log('got change'));
      };
      this.on('change', () => {
        console.log('an event occurred!')
      });
    });
        }, 1000);
  }
}

const dirWatcher = new DirWatcher("./data");

dirWatcher.watch();





