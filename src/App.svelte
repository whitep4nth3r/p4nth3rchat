<script lang="ts">
  import Event from './Event.svelte';
  import { writable } from 'svelte/store';
  import type { ChatMessageData } from './types';
  import { PermittedEvents } from './types';

  const socket = new WebSocket(process.env.MAINFRAME_URL);

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
