const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for dev
    },
});

let messages = [];

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Send current history
    socket.emit("init", messages);

    socket.on("message", (msg) => {
        // Validate or sanitize if real app
        // Add server-side timestamp
        const serverMsg = { ...msg, timestamp: Date.now() };
        messages.push(serverMsg);
        // Keep history limited
        if (messages.length > 50) messages.shift();

        io.emit("message", serverMsg);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Socket server running on port ${PORT}`);
});
