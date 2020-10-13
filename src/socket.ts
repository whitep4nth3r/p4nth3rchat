import { PermittedEvents } from './types';
import type { ChatMessageData } from './types';
import type { Writable } from 'svelte/store';

export function WebsocketConnect(
  url: string,
  maxMessageCount: number,
  writableStore: Writable<ChatMessageData[]>
) {
  var socket = new WebSocket(url);

  socket.onopen = function () {
    console.log('Socket is open!');
    // subscribe to some channels
    socket.send(
      JSON.stringify({
        connected: 'I did connect, yo!',
      })
    );
  };

  socket.onmessage = (data) => {
    //TODO use ryan's safe data thing
    const event = JSON.parse(data.data).event;

    if (event === PermittedEvents.ChatMessage) {
      const newMessage = JSON.parse(data.data).data;

      if (newMessage) {
        writableStore.update((messageQueue) => {
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
      WebsocketConnect(url, maxMessageCount, writableStore);
    }, 1000);
  };

  socket.onerror = function (err) {
    console.error('Socket encountered error: ', err, 'Closing socket');
    socket.close();
  };
}
