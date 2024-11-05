const http = require("http");
const { Database } = require("@sqlitecloud/drivers");
// PR9j7ajN1j

const db = new Database(
  "sqlitecloud://ceykqhtwnk.sqlite.cloud:8860/my-index-database?apikey=d8tou2BSJSaG6ZxbZPptCRapy1DLqVDELcRFMn03lDo"
);

// app.get("/albums", async (req, res) => {
//   const result = await db.sql`
//     USE DATABASE chinook.sqlite; 
//     SELECT albums.AlbumId as id, albums.Title as title, artists.name as artist
//     FROM albums 
//     INNER JOIN artists 
//     WHERE artists.ArtistId = albums.ArtistId
//     LIMIT 20;`;
//   res.json(result);
// });

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
      db.sql`INSERT INTO lorem VALUES (${body})`.then(() => {
        res.writeHead(200);
        res.end("Data written succesfully");
      });
    });
  } else if (req.url === "/read" && req.method === "GET") {
    db.sql`SELECT rowid AS id, info FROM lorem`.then((result) => {
      res.writeHead(200);
      res.end(JSON.stringify(result));
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
