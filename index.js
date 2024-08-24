const express = require('express') ;
const app = express() ;
const http = require("http") ;
const { Server } = require("socket.io");
const cors = require("cors");
const { Socket } = require('dgram');

app.use(cors());

app.get('/', (req, res) => {
    res.send("Hello from Server") ;
})

const port = process.env.port || 8000 ;
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`) ;
})

// You require express and using express you create an application(app) using that app you are handling routing of your application
// 1. One way is to create a server using http module then use in socket io instance
// 2. Other way is to do app.listen() because app.listen() internally return a http server and you can just assign that to a variable 
//    use that to creating io instance.

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
})

// Client (Browser) ----(HTTP request)----> Express Server (Handles API routes)
//                               \----(WebSocket)----> Socket.io (Real-time communication)

// By passing your HTTP server (app.listen(...)) to Socket.io with new Server(server, {...}), you're effectively adding WebSocket capabilities to the existing HTTP server.
// This means that both regular HTTP requests (like GET and POST for web pages and APIs) and WebSocket connections (for real-time communication) can be handled by the same server instance.

io.on("connection", (socket) => {  
    console.log(`User Connected: ${socket.id}`) ;

    socket.on("join_room", (data) => {
        console.log("Room", data) ;
        socket.join(data);
    });

    socket.on("send_message", (data) => {
        console.log("Receiving data", data.message) ;
        // socket.broadcast.emit("receive_message", data) ;

        socket.to(data.room).emit("receive_message", data) ;
    })
})


