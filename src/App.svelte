<script lang="ts">
  import { writable } from 'svelte/store';
  import ChatEvent from './events/ChatEvent.svelte';
  import AlertEvent from './events/AlertEvent.svelte';
  import { WebsocketConnect } from './socket';
  import type { ChatMessageData, BroadcasterFollowData } from './types';

  const MAX_MESSAGE_COUNT = 7;
  let _writableChatStore = writable<ChatMessageData[]>([]);
  let _writableAlertStore = writable<BroadcasterFollowData[]>([]);
  let messageQueue: ChatMessageData[] = [];
  let alertQueue: BroadcasterFollowData[] = [];

  _writableChatStore.update((storeValue) => [...storeValue]);
  _writableChatStore.subscribe((storeValue: ChatMessageData[]) => {
    messageQueue = storeValue;
  });

  _writableAlertStore.update((storeValue) => [...storeValue]);
  _writableAlertStore.subscribe((storeValue: BroadcasterFollowData[]) => {
    alertQueue = storeValue;
  });

  WebsocketConnect(process.env.MAINFRAME_URL, MAX_MESSAGE_COUNT, _writableChatStore, _writableAlertStore);

  let alert_event = {
    followerUserId: '123',
    followerName: 'paranoidandroidiot',
    logoUrl: 'https://static-cdn.jtvnw.net/jtv_user_pictures/403c25d0-3f5c-4b49-936e-32ffbc113d51-profile_image-300x300.png'
  }
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
    <AlertEvent {alert_event} />

    {#each alertQueue as alert_event, index (alert_event.followerUserId)}
      <AlertEvent {alert_event} />
    {/each}
  </div>
  <div class="messageQueue">
    {#each messageQueue as chat_event, index (chat_event.messageId)}
      <ChatEvent {chat_event} />
    {/each}
  </div>
</main>
