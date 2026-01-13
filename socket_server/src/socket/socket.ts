import {Server} from 'socket.io';
import http from 'http';
import app from '../app.js';

const server : http.Server = http.createServer(app);
const io : Server = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("join_room", (roomId: string) => {
        socket.join(roomId);
        socket.to(roomId).emit("user_joined", { userId: socket.id });
        console.log(`Client ${socket.id} joined room ${roomId}`);
    })

    socket.on("offer", ({offer, roomId}: {offer: RTCSessionDescriptionInit, roomId: string}) => {
        socket.to(roomId).emit("offer", { from: socket.id, offer });
        console.log(`Offer from ${socket.id} sent to room ${roomId}`);
    });

    socket.on("answer", ({answer, roomId}: {answer: RTCSessionDescriptionInit, roomId: string}) => {
        socket.to(roomId).emit("answer", { from: socket.id, answer });
        console.log(`Answer from ${socket.id} sent to room ${roomId}`);
    });

    socket.on("ice_candidate", ({candidate, roomId}: {candidate: RTCIceCandidateInit, roomId: string}) => {
        socket.to(roomId).emit("ice_candidate", { from: socket.id, candidate });
        console.log(`ICE candidate from ${socket.id} sent to room ${roomId}`);
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });

});

export { server, io };