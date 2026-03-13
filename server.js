const http = require("http");
const fs = require("fs");
const path = require("path");

const buildDir = path.join(__dirname, "build");
const port = Number(process.env.PORT) || 3000;
const host = "0.0.0.0";

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

function safeJoin(base, targetPath) {
  const safeTarget = targetPath.replace(/\\/g, "/");
  const resolvedPath = path.resolve(base, "." + safeTarget);
  if (!resolvedPath.startsWith(base)) return null;
  return resolvedPath;
}

function send(res, statusCode, headers, body) {
  res.writeHead(statusCode, headers);
  res.end(body);
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = contentTypes[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      send(res, 500, { "Content-Type": "text/plain; charset=utf-8" }, "Server error");
      return;
    }

    const cacheControl =
      filePath.includes(`${path.sep}static${path.sep}`) || /\.[a-f0-9]{8,}\./i.test(path.basename(filePath))
        ? "public, max-age=31536000, immutable"
        : "no-cache";

    send(res, 200, { "Content-Type": contentType, "Cache-Control": cacheControl }, data);
  });
}

const server = http.createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    send(res, 405, { "Content-Type": "text/plain; charset=utf-8" }, "Method Not Allowed");
    return;
  }

  fs.stat(buildDir, (err, stats) => {
    if (err || !stats.isDirectory()) {
      send(
        res,
        500,
        { "Content-Type": "text/plain; charset=utf-8" },
        'Build folder not found. Run "npm run build" first.'
      );
      return;
    }

    const urlObj = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const requestPath = decodeURIComponent(urlObj.pathname);

    const normalized = requestPath === "/" ? "/index.html" : requestPath;
    const filePath = safeJoin(buildDir, normalized);

    if (filePath) {
      fs.stat(filePath, (statErr, fileStat) => {
        if (!statErr && fileStat.isFile()) {
          if (req.method === "HEAD") {
            const ext = path.extname(filePath).toLowerCase();
            const contentType = contentTypes[ext] || "application/octet-stream";
            send(res, 200, { "Content-Type": contentType }, "");
            return;
          }
          sendFile(res, filePath);
          return;
        }

        // If the request looks like an asset (has an extension) and it's missing, return 404.
        if (path.extname(normalized)) {
          send(res, 404, { "Content-Type": "text/plain; charset=utf-8" }, "Not Found");
          return;
        }

        // SPA fallback: serve index.html for client-side routes
        const indexPath = path.join(buildDir, "index.html");
        if (req.method === "HEAD") {
          send(res, 200, { "Content-Type": contentTypes[".html"] }, "");
          return;
        }
        sendFile(res, indexPath);
      });
      return;
    }

    send(res, 400, { "Content-Type": "text/plain; charset=utf-8" }, "Bad Request");
  });
});

server.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`Serving CRA build on http://${host}:${port}`);
});
