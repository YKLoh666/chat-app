import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
// import { type ViteDevServer } from 'vite';

// import { Server } from 'socket.io';

// const webSocketServer = {
// 	name: 'webSocketServer',
// 	configureServer(server: ViteDevServer) {
// 		if (!server.httpServer) return;

// 		const io = new Server(server.httpServer, {
// 			cookie: true
// 		});

// 		io.on('connection', (socket): void => {
// 			console.log('user is connected');

// 			socket.on('authenticated', async (username) => {
// 				socket.join('auth');
// 				socket.emit('join room', username);
// 			});

// 			socket.on('send message', (message) => {
// 				console.log(`Received message from ${socket.id}: ${message}`);

// 				socket.broadcast.emit('received message', {
// 					sender: socket.id,
// 					message
// 				});
// 			});

// 			socket.on('disconnect', async () => {});

// 			socket.on('error', (err) => console.log(err));
// 		});
// 	}
// };

export default defineConfig({
	// plugins: [sveltekit(), webSocketServer],
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
