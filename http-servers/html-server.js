const fs = require('fs');

require('http')
    .createServer()
    .on('request', (req, res) => {
        const { url, method } = req;
        if (method === 'GET') {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            fs.createReadStream('./data/index.html').pipe(res);
           // res.end();
        } else {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            });
            res.end('Page not found');
        }

    })
    .listen(3000);