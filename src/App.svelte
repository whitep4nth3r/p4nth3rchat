<script lang="ts">
  import { writable } from 'svelte/store';
  import ChatEvent from './events/ChatEvent.svelte';
  import FollowEventDisplay from './events/FollowEventDisplay.svelte';
  import { EventReceiver } from './EventReceiver';
  import type { ChatMessageData, FollowEvent } from './types';

  const MAX_MESSAGE_COUNT = 7;
  let _writableChatStore = writable<ChatMessageData[]>([]);
  let _writableAlertStore = writable<FollowEvent>(null);
  let messageQueue: ChatMessageData[] = [];
  let currentAlertToView: FollowEvent[] = [];

  _writableChatStore.update((storeValue) => [...storeValue]);
  _writableChatStore.subscribe((storeValue: ChatMessageData[]) => {
    messageQueue = storeValue;
  });

  _writableAlertStore.update((storeValue) => storeValue);
  _writableAlertStore.subscribe((storeValue: FollowEvent) => {
    if (storeValue) {
      currentAlertToView = [storeValue];
    } else {
      currentAlertToView = [];
    }
  });

  EventReceiver(process.env.MAINFRAME_URL, MAX_MESSAGE_COUNT, _writableChatStore, _writableAlertStore);

  
  // for debug
  // let alert_event = {
  //   followerUserId: '123',
  //   followerName: 'paranoidandroidiot',
  //   logoUrl: 'https://static-cdn.jtvnw.net/jtv_user_pictures/403c25d0-3f5c-4b49-936e-32ffbc113d51-profile_image-300x300.png'
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
    <!-- <FollowEventDisplay alertToView={alert_event} /> -->
    {#each currentAlertToView as alert}
        <FollowEventDisplay alert={alert} />
    {/each}
  </div>
  <div class="messageQueue">
    {#each messageQueue as chat_event, index (chat_event.messageId)}
      <ChatEvent {chat_event} />
    {/each}
  </div>
</main>
