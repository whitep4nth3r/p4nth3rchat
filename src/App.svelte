<script lang="ts">
  import { writable } from 'svelte/store';
  import type { ChatMessageData, MessageQueue } from './types';
  import { fade } from 'svelte/transition';

  const MAX_MESSAGE_QUEUE_LENGTH = 6;

  import Event from './Event.svelte';
  const socket = new WebSocket('ws://localhost:8999');

  let writeable = writable<ChatMessageData[]>([]);
  let messageQueue: ChatMessageData[] = [];

  writeable.update((messageQueue) => [...messageQueue]);

  //TODO use ryan's safe data thing
  socket.addEventListener('message', (data) => {
    const newMessage = JSON.parse(data.data).data;
    if (newMessage) {
      if (messageQueue.length >= MAX_MESSAGE_QUEUE_LENGTH) {
        messageQueue.shift();
      }

      writeable.update((messageQueue) => [...messageQueue, newMessage]);
    }
  });

  writeable.subscribe((storeValue: ChatMessageData[]) => {
    messageQueue = storeValue;
  });
</script>

<style>
  .messageQueue {
    display: flex;
    flex-direction: column;
    flex-direction: column-reverse;
  }
</style>

<main>
  <div class="messageQueue">
    {#each messageQueue as event, index}
      <Event {event} />
    {/each}
  </div>
</main>
