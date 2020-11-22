import { PermittedEvents } from './types';
import type { ChatMessageData, BroadcasterFollowData } from './types';
import type { Writable } from 'svelte/store';
import { AlertQueue } from './AlertQueue'

// TODO: @negue for the next time, add an interval that fills the follower queue

export function WebsocketConnect(
  url: string,
  maxMessageCount: number,
  writableChatStore: Writable<ChatMessageData[]>,
  writableAlertStore: Writable<BroadcasterFollowData>
  ) {

  let displayAlertQueue = AlertQueue(3000);
  var socket = new WebSocket(url);

  socket.onopen = function () {
    console.log('Socket is open!');
    socket.send(
      JSON.stringify({
        connected: 'I did connect, yo!',
      })
    );
  };

  socket.onmessage = (data) => {
    //TODO use ryan's safe data thing
    const event = JSON.parse(data.data).event;

    if (event === PermittedEvents.BroadcasterFollow) {
      console.log('FOLLOW RECEIVED');
      
      const newAlert = JSON.parse(data.data).data;

      if (newAlert) {
        // New message comes in, pushed to the queue
        displayAlertQueue.push(() => {
          // once the queue item is "called", it is updating the store
          writableAlertStore.update((alertStore) => {
            return newAlert;
          });
        });

        displayAlertQueue.push(() => {
          writableAlertStore.update((alertStore) => {
            return null;
          });
        });
      }
    }

    if (event === PermittedEvents.ChatMessage) {
      const newMessage = JSON.parse(data.data).data;

      if (newMessage) {
        writableChatStore.update((messageQueue) => {
          const oldMessages = messageQueue.slice(
            Math.max(messageQueue.length - maxMessageCount, 0)
          );

          return [...oldMessages, newMessage];
        });
      }
    }
  };

  socket.onclose = function (err) {
    console.log(
      'Socket is closed. Reconnect will be attempted in 1 second.',
      err.reason
    );
    setTimeout(function () {
      WebsocketConnect(url, maxMessageCount, writableChatStore, writableAlertStore);
    }, 1000);
  };

  socket.onerror = function (err) {
    console.error('Socket encountered error: ', err, 'Closing socket');
    socket.close();
  };
}


