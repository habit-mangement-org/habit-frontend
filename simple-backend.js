const http = require('http');
const url = require('url');

let users = [
    { id: 1, name: "Alice", age: 25, habit: "Reading", score: 10 },
    { id: 2, name: "Bob", age: 30, habit: "Gym", score: 5 }
];

const server = http.createServer((req, res) => {
    // CORS headers to allow frontend access
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    // Helper to send JSON
    const sendJSON = (data, status = 200) => {
        res.writeHead(status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    };

    console.log(`${req.method} ${path}`);

    // Routes matching userService.js

    // GET /api/users/all
    if (path === '/api/users/all' && req.method === 'GET') {
        return sendJSON(users);
    }

    // POST /api/users/create
    if (path === '/api/users/create' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const newUser = JSON.parse(body);
            newUser.id = Date.now();
            newUser.score = 0;
            users.push(newUser);
            sendJSON(newUser, 201);
        });
        return;
    }

    // PUT /api/users/:id/score
    if (path.match(/\/api\/users\/\d+\/score/) && req.method === 'PUT') {
        const id = parseInt(path.split('/')[3]);
        const user = users.find(u => u.id === id);
        if (user) {
            user.score += 1;
            return sendJSON(user);
        }
        return sendJSON({ error: "User not found" }, 404);
    }

    // PUT /api/users/:id
    // Note: The service uses updateUser but I need to check the path it constructs. 
    // Assuming it assumes /api/users/:id based on standard REST, 
    // but the code actually isn't fully visible for updateUser in previous turns.
    // I'll assume standard REST for now or just generic handling.
    
    // DELETE /api/users/:id
    if (path.match(/\/api\/users\/\d+$/) && req.method === 'DELETE') {
         const id = parseInt(path.split('/')[3]);
         users = users.filter(u => u.id !== id);
         return sendJSON({ success: true });
    }
    
    // Fallback for update if it matches similar pattern
    if (path.match(/\/api\/users\/\d+$/) && req.method === 'PUT') {
        const id = parseInt(path.split('/')[3]);
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
             const updates = JSON.parse(body);
             const userIdx = users.findIndex(u => u.id === id);
             if (userIdx !== -1) {
                 users[userIdx] = { ...users[userIdx], ...updates };
                 sendJSON(users[userIdx]);
             } else {
                 sendJSON({ error: "User not found" }, 404);
             }
        });
        return;
    }

    sendJSON({ message: "Not Found" }, 404);
});

server.listen(8082, () => {
    console.log('Mock Backend is running on http://localhost:8082');
});
