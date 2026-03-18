const http = require("http");
const fs = require("fs");
const path = require("path");

const buildDir = path.join(__dirname, "build");
const port = process.env.PORT || 8080;

// ✅ YOUR BACKEND URL
const API_URL = "https://habit-backend-api-gzafhjcjcsf0fdfn.southeastasia-01.azurewebsites.net";

const contentTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml"
};

const server = http.createServer(async (req, res) => {

  // ✅ CORS FIX
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // ✅ API PROXY (NO CORS ERROR)
  if (req.url.startsWith("/api")) {
    const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));

    try {
      const apiRes = await fetch(API_URL + req.url.replace("/api", ""), {
        method: req.method,
        headers: { "Content-Type": "application/json" }
      });

      const data = await apiRes.text();
      res.writeHead(apiRes.status, { "Content-Type": "application/json" });
      res.end(data);
    } catch (err) {
      res.writeHead(500);
      res.end("API Error");
    }
    return;
  }

  // ✅ SERVE FRONTEND
  let filePath = path.join(buildDir, req.url === "/" ? "index.html" : req.url);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      fs.readFile(path.join(buildDir, "index.html"), (err2, content2) => {
        if (err2) {
          res.writeHead(500);
          res.end("Error loading app");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(content2);
        }
      });
    } else {
      const ext = path.extname(filePath);
      res.writeHead(200, { "Content-Type": contentTypes[ext] || "text/plain" });
      res.end(content);
    }
  });
});

server.listen(port, () => {
  console.log("Server running on port " + port);
});
