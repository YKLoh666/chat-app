import { io } from 'socket.io-client';
import { writable } from 'svelte/store';

const socket = io();

export const writableSocket = writable(socket);
