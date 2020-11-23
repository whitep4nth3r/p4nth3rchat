import type { ChatMessageData, FollowEvent, HostEvent, AlertQueueEvent } from './types';
import { Events } from './types'
import type { Writable } from 'svelte/store';
import { AlertQueue } from './AlertQueue'

let displayAlertQueue = AlertQueue(3000);

// TODO: @negue for the next time, add an interval that fills the follower queue

const addAlertToQueue = (store: Writable<AlertQueueEvent>, event: AlertQueueEvent) => {
  displayAlertQueue.push(() => {
    // once the queue item is "called", it is updating the store
    store.update((alertStore) => {
      return event;
    });
  });
}

const removeAlertOnNextCycle = (store: Writable<AlertQueueEvent>) => {
  displayAlertQueue.push(() => {
    // return  null to remove the alert from the display
    // and let the next alert show if there is one
    store.update((alertStore) => {
      return null;
    });
  });
}

export function EventReceiver(
  url: string,
  maxMessageCount: number,
  writableChatStore: Writable<ChatMessageData[]>,
  writableAlertStore: Writable<FollowEvent | HostEvent>
  ) {


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

    switch(event) {
      case Events.Host:
        const host = JSON.parse(data.data).data;

        if (host) {
          addAlertToQueue(writableAlertStore, host);
          removeAlertOnNextCycle(writableAlertStore);
        }
      break;
      case Events.BroadcasterFollow: 
        const newFollow = JSON.parse(data.data).data;

        if (newFollow) {
          addAlertToQueue(writableAlertStore, newFollow);
          removeAlertOnNextCycle(writableAlertStore);
        }
      break;
      case Events.ChatMessage:
        const newMessage = JSON.parse(data.data).data;

        if (newMessage) {
          writableChatStore.update((messageQueue) => {
            const oldMessages = messageQueue.slice(
              Math.max(messageQueue.length - maxMessageCount, 0)
            );
  
            return [...oldMessages, newMessage];
          });
        }
      default: 
        return;
    }
  };

  socket.onclose = function (err) {
    console.log(
      'Socket is closed. Reconnect will be attempted in 1 second.',
      err.reason
    );
    setTimeout(function () {
      EventReceiver(url, maxMessageCount, writableChatStore, writableAlertStore);
    }, 1000);
  };

  socket.onerror = function (err) {
    console.error('Socket encountered error: ', err, 'Closing socket');
    socket.close();
  };
}


