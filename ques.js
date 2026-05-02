//  create an http server using only node.js core modules
//  (no express no npm packages).The server must run on port 3000
//  and support the following routes:
//  GET/UpdateUser append a new visitor entry with the current 
//  timestamp to visitors.log
//  get/savelog read and return the full content of visitors.log
//  post/backup copy the content of visitors.log into a file 
//  called backup.log
//  get/clearlog clear the contents of visitors.log 
//  get/serverinfo return system information in JSON format

const http = require("http");
const fs = require("fs");
const os = require("os");

const PORT = 3000;

// create server
const server = http.createServer((req, res) => {

    // GET /updateUser
    if (req.method === "GET" && req.url === "/updateUser") {
        const time = new Date().toISOString() + "\n";

        fs.appendFile("visitors.log", time, (err) => {
            if (err) {
                res.end("Error writing file");
            } else {
                res.end("Visitor added");
            }
        });
    }

    // GET /saveLog
    else if (req.method === "GET" && req.url === "/saveLog") {
        fs.readFile("visitors.log", "utf-8", (err, data) => {
            if (err) {
                res.end("Error reading file");
            } else {
                res.end(data);
            }
        });
    }

    // POST /backup
    else if (req.method === "POST" && req.url === "/backup") {
        fs.readFile("visitors.log", "utf-8", (err, data) => {
            if (err) {
                res.end("Error reading file");
            } else {
                fs.writeFile("backup.log", data, (err) => {
                    if (err) {
                        res.end("Error creating backup");
                    } else {
                        res.end("Backup created");
                    }
                });
            }
        });
    }

    // GET /clearLog
    else if (req.method === "GET" && req.url === "/clearLog") {
        fs.writeFile("visitors.log", "", (err) => {
            if (err) {
                res.end("Error clearing file");
            } else {
                res.end("Log cleared");
            }
        });
    }

    // GET /serverInfo
    else if (req.method === "GET" && req.url === "/serverInfo") {
        const info = {
            hostname: os.hostname(),
            platform: os.platform(),
            totalMemory: os.totalmem(),
            freeMemory: os.freemem(),
            cpu: os.cpus().length
        };

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(info));
    }

    // default route
    else {
        res.end("Route not found");
    }

});

// start server
server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});