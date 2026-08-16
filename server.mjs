import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const projectDirectory = process.cwd();
const publicDirectory = join(projectDirectory, "public");
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8"
};

const server = createServer((request, response) => {
  const requestPath = request.url === "/" ? "/index.html" : request.url;
  const rootDirectory = requestPath.startsWith("/src/") ? projectDirectory : publicDirectory;
  const filePath = normalize(join(rootDirectory, requestPath));

  if (!filePath.startsWith(rootDirectory) || !existsSync(filePath)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "Content-Type": contentTypes[extname(filePath)] ?? "application/octet-stream"
  });
  createReadStream(filePath).pipe(response);
});

const port = Number(process.argv[2] ?? 3000);
server.listen(port, () => {
  console.log(`SIC Trainer is running at http://localhost:${port}`);
});
