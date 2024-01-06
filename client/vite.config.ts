import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { type ViteDevServer } from 'vite';

import { Server } from 'socket.io';

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer);

		io.on('connection', (socket) => {
			console.log('user is connected');

			socket.on('send message', (message) => {
				console.log(`Received message from ${socket.id}: ${message}`);

				socket.broadcast.emit('received message', {
					sender: socket.id,
					message
				});
			});

			socket.on('disconnect', () => {
				console.log('user is disconnected');
			});

			socket.on('error', (err) => console.log(err));
		});
	}
};

export default defineConfig({
	plugins: [sveltekit(), webSocketServer],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
