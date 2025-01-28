// socketClient.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (): Socket => {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_BACKEND || "http://localhost:3001");
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = (): Socket | null => {
    return socket;
};
