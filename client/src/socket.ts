import { io, type Socket } from "socket.io-client";
import type { ServerToClientEvents } from "./types/socket";

export const socket: Socket<ServerToClientEvents> = io(import.meta.env.VITE_API_URL);