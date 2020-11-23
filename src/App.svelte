<script lang="ts">
  import { writable } from 'svelte/store';
  import ChatEvent from './events/ChatEvent.svelte';
  import AlertEvent from './events/AlertEvent.svelte';
  import { EventReceiver } from './EventReceiver';
  import { Events, MAX_MESSAGE_COUNT } from './types';
  import type { ChatMessageEvent, AlertQueueEvent } from './types';

  let _writableChatStore = writable<ChatMessageEvent[]>([]);
  let _writableAlertStore = writable<AlertQueueEvent>(null);
  let messageQueue: ChatMessageEvent[] = [];
  let currentAlertToView: (AlertQueueEvent)[] = [];

  _writableChatStore.update((storeValue) => [...storeValue]);
  _writableChatStore.subscribe((storeValue: ChatMessageEvent[]) => {
    messageQueue = storeValue;
  });

  _writableAlertStore.update((storeValue) => storeValue);
  _writableAlertStore.subscribe((storeValue: AlertQueueEvent) => {
    
    if (storeValue) {
      currentAlertToView = [storeValue];
    } else {
      currentAlertToView = [];
    }
  });

  EventReceiver(process.env.MAINFRAME_URL, MAX_MESSAGE_COUNT, _writableChatStore, _writableAlertStore);

  // let alert_event = {
  //   type: Events.Follow,
  //   data: {
  //     bitCount: '123',
  //     followerName: 'paranoidandroidiot',
  //     logoUrl: 'https://static-cdn.jtvnw.net/jtv_user_pictures/403c25d0-3f5c-4b49-936e-32ffbc113d51-profile_image-300x300.png'
  //   }
  // }
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

  .alertQueue {
    width: 100%;
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

<main>
  <div class="alertQueue">
    <!-- for debug -->
    <!-- <AlertEvent alert={alert_event} /> -->
    {#each currentAlertToView as alert}
        <AlertEvent {alert} />
    {/each}
  </div>
  <div class="messageQueue">
    {#each messageQueue as chat_event, index (chat_event.messageId)}
      <ChatEvent {chat_event} />
    {/each}
  </div>
</main>
