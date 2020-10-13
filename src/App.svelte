<script lang="ts">
  import { writable } from 'svelte/store';
  import type { ChatMessageData } from './types';
  import { PermittedEvents } from './types';
  import Event from './Event.svelte';

  const MAX_MESSAGE_COUNT = 7;

  const socket = new WebSocket(process.env.MAINFRAME_URL);

  let writeable = writable<ChatMessageData[]>([]);
  let messageQueue: ChatMessageData[] = [];

  writeable.update((storeValue) => [...storeValue]);

  //TODO use ryan's safe data thing
  socket.onmessage = (data) => {
	  const event = JSON.parse(data.data).event;
	  if (event === PermittedEvents.ChatMessage) {
		  const newMessage = JSON.parse(data.data).data;
		  if (newMessage) {
			  writeable.update((messageQueue) => {
				  // get only the last
				  const oldMessages = messageQueue.slice(
					  Math.max(messageQueue.length - MAX_MESSAGE_COUNT, 0)
				  );

				  // return the new array with last X items + the new one
				  return [...oldMessages, newMessage];
			  });
		  }
	  }
  };

  writeable.subscribe((storeValue: ChatMessageData[]) => {
    console.log(storeValue.length);

    messageQueue = storeValue;
  });
</script>

<style>
  .messageQueue {
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 400px;
  }
</style>

<main>
  <div class="messageQueue">
    {#each messageQueue as event, index (event.messageId)}
      <Event {event} />
    {/each}
  </div>
</main>
