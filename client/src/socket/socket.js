import { io } from "socket.io-client";
import useRoomStore from "../store/roomStore.js";

let storedUserId = localStorage.getItem("userId");
if (!storedUserId) {
    storedUserId = crypto.randomUUID();
    localStorage.setItem("userId", storedUserId);
}

useRoomStore.getState().setUserId(storedUserId);

export const socket = io(`${import.meta.env.VITE_SERVER_URL}`, {
    auth: { userId: storedUserId },
    transports: ["websocket", "polling"],
});
