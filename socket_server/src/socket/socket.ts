import { Server, Socket } from 'socket.io';
import http from 'http';
import app from '../app.js';

const server: http.Server = http.createServer(app);
const io: Server = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

io.on('connection', (socket: Socket): void => {
    const userId: string = socket.handshake.auth?.userId;
    if (!userId) {
        socket.disconnect(true);
        return;
    }
    console.log(`New client connected: ${userId}`);
    socket.join(userId);

    socket.on("join_room", (roomId: string): void => {
        socket.join(roomId);
        socket.to(roomId).emit("user_joined", { userId });

        console.log(`Client ${userId} joined room ${roomId}`);
    })

    socket.on("offer", ({ offer, roomId }: { offer: RTCSessionDescriptionInit, roomId: string }): void => {
        socket.to(roomId).emit("offer", { from: userId, offer });

        console.log(`Offer from ${userId} sent to room ${roomId}`);
    });

    socket.on("answer", ({ answer, roomId }: { answer: RTCSessionDescriptionInit, roomId: string }): void => {
        socket.to(roomId).emit("answer", { from: userId, answer });
        console.log(`Answer from ${userId} sent to room ${roomId}`);
    });

    socket.on("ice_candidate", ({ candidate, roomId }: { candidate: RTCIceCandidateInit, roomId: string }): void => {
        socket.to(roomId).emit("ice_candidate", { from: userId, candidate });
        console.log(`ICE candidate from ${userId} sent to room ${roomId}`);
    });

    socket.on('disconnect', (): void => {
        console.log(`Client disconnected: ${userId}`);
    });

});

export { server, io };