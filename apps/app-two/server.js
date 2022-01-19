const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(`
    <!DOCTYPE html>
    <html>
      <head>
      <title>App two</title>
      </head>

      <body>
        <h1>This is app two</h1>
      </body>

    </html>
  `);
  res.end();
});

server.listen(8080, () => {
  console.log("listening at http://localhost:8080");
});
