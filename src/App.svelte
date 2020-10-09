<script lang="ts">
  import { writable } from 'svelte/store';
  import { dummyMessage3 } from './dummyData';
  import type { ChatMessageData, MessageQueue } from './types';
  import { PermittedEvents } from './types';
  import { fade } from 'svelte/transition';

  const MAX_MESSAGE_QUEUE_LENGTH = 6;

  import Event from './Event.svelte';
  const socket = new WebSocket('ws://localhost:8999');

  let writeable = writable<ChatMessageData[]>([]);
  let messageQueue: ChatMessageData[] = [];

  writeable.update((messageQueue) => [...messageQueue]);

  //TODO use ryan's safe data thing
  socket.addEventListener('message', (data) => {
    const event = JSON.parse(data.data).event;

    if (event === PermittedEvents.ChatMessage) {
      const newMessage = JSON.parse(data.data).data;

      if (newMessage) {
        writeable.update((messageQueue) => [...messageQueue, newMessage]);
      }
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
    position: fixed;
    bottom: 0;
  }
</style>

<main>
  <div class="messageQueue">
    {#each messageQueue as event, index}
      <Event {event} />
    {/each}
  </div>
</main>
