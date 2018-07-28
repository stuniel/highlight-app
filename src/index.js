const http = require('http')
const fs = require('fs')

const port = process.env.PORT || 9000

http.createServer((req, res) => {
  // Set CORS headers
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'})
    res.end()
    return
  }

  const path = req.url.split('/')

  if (path[1] === 'documents') {
    fs.readFile('data.json', 'utf8', (err, data) => {
      let document = JSON.parse(data)
      const { url } = req
      const { documents: { length } } = document
      const index = path[2] - 1
      const inRange = index >= 0 && index < length

      if (!inRange) {
        res.writeHead(404, {'Content-Type': 'text/plain'})
        res.write('404 - Not Found')
        res.end()
        return
      }

      const paragraph = document.documents[index]

      res.writeHead(200, {'Content-Type': 'text/plain'})
      res.write(paragraph)
      res.end()
    })
  } else {
    res.end()
  }

}).listen(port)
