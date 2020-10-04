<script lang="ts">
	import { writable } from 'svelte/store';
	import type { ChatMessageData, MessageQueue } from './types'

	import Event from './Event.svelte'
	const socket = new WebSocket('ws://localhost:8999');
	
	let writeable = writable<ChatMessageData[]>([]);
	let messageQueue: ChatMessageData[] = [];
	
	//TODO use ryan's safe data thing
	socket.addEventListener("message", (data) => {
		const eventData = JSON.parse(data.data).data;
		if(eventData) {
			writeable.update(messageQueue => [...messageQueue, eventData])
		}
	});

	writeable.subscribe((storeValue: ChatMessageData[]) => {
		messageQueue = storeValue;
	});
</script>

<main>
	{#each messageQueue.reverse() as event}
		<Event {event} />
	{/each}
</main>

<style>

</style>