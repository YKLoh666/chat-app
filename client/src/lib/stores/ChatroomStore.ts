import { writable } from 'svelte/store';
import type { Chatroom } from './ContactListStore';

export const writableChatroom = writable<Chatroom | undefined>();
