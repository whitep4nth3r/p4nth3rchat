<script lang="ts">
  import { writable } from 'svelte/store';
  import Event from './Event.svelte';
  import { WebsocketConnect } from './socket';
  import type { ChatMessageData } from './types';

  const MAX_MESSAGE_COUNT = 7;
  let _writable = writable<ChatMessageData[]>([]);
  let messageQueue: ChatMessageData[] = [];

  _writable.update((storeValue) => [...storeValue]);
  _writable.subscribe((storeValue: ChatMessageData[]) => {
    messageQueue = storeValue;
  });

  WebsocketConnect(process.env.MAINFRAME_URL, MAX_MESSAGE_COUNT, _writable);
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
