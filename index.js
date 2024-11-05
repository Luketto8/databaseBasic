const http = require("http");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("basic");
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS lorem (info TEXT)");
  //   const stmt = db.prepare("INSERT INTO lorem VALUES (?)");

  //   for (let i = 0; i < 10; i++) {
  //     stmt.run("Ipsum" + i);
  //   }
  //   stmt.finalize();
  //   db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
  //     console.log(row.id + ": " + row.info);
  //   });
});
// const fs = require("fs");

// Define the server port
const PORT = 4000;

// Create the HTTP server
const server = http.createServer((req, res) => {
  // Set the response header content type
  res.setHeader("Content-Type", "text/plain");

  // Define the first route handler (for the root route "/")
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200);
    res.end("Hello, welcome to the home page!");
    // Define the second route handler (for "/about" route)
  } else if (req.url === "/about" && req.method === "GET") {
    res.writeHead(200);
    res.end("This is the about page.");
  } else if (req.url === "/write" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      db.serialize(() => {
        const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
        stmt.run(body);
        stmt.finalize();
        res.writeHead(200);
        res.end("Data written succesfully");
      });
    });
  } else if (req.url === "/read" && req.method === "GET") {
    db.serialize(() => {
      let str = "";
      db.each(
        "SELECT rowid AS id, info FROM lorem",
        (err, row) => {
          console.log(row.id + ": " + row.info);
          // res.write(row.id + ": " + row.info);
          str += row.id + ": " + row.info;
        },
        () => {
          res.writeHead(200);
          res.end(str);
        }
      );
    });
  }
  // Handle any other routes with a 404
  else {
    res.writeHead(404);
    res.end("404 Not Found");
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  //   db.close();
});
