require('http')
.createServer()
.on('request', (req, res) => {
    const {url, method} = req;
    res.writeHead(200, {
        'Content-Type':'text/plain'
    });
    res.end('Hello World')
})
.listen(3000);