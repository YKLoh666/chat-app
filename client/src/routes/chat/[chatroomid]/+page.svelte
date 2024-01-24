<script lang="ts">
	import Chatbox from '../../../components/Chatbox.svelte';
	import Messages from '../../../components/Messages.svelte';
	import type { PageData } from '../[chatroomid]/$types';
	import { writableMessages } from '$lib/stores/MessageStore';
	import { page } from '$app/stores';
	import { writableUsername } from '$lib/stores/UserStore';
	import { writableChatroom } from '$lib/stores/ChatroomStore';
	import { morphChatroom } from '$lib/stores/ContactListStore';

	export let data: PageData;

	$: if (data.chatroom && $writableUsername) {
		writableChatroom.set(morphChatroom(data.chatroom, $writableUsername));
	}

	let messageSet = false;
	$: if ($writableUsername && !messageSet) {
		writableMessages.setMessages($page.url.pathname.substring(6), $writableUsername, data.messages);
		messageSet = true;
	}
</script>

<Messages />
<Chatbox />
