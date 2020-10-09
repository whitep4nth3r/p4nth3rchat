<script lang="ts">
  import type { ChatMessageData } from './types';
  import { loop_guard } from 'svelte/internal';
  import sanitizeHtml from 'sanitize-html';

  export let event: ChatMessageData;

  function processChat(event: ChatMessageData) {
    let tempMessage: string = event.message.replace(/<img/g, '<DEL');

    const emotes = [];

    // If the message has emotes, modify message to include img tags to the emote
    if (event.emotes) {
      let emoteSet = [];

      for (const emote of Object.keys(event.emotes)) {
        const emoteLocations = event.emotes[emote];
        emoteLocations.forEach((location) => {
          emoteSet.push(generateEmote(emote, location));
        });
      }

      // Order the emotes descending so we can iterate
      // through them with indexes
      emoteSet.sort((a, b) => {
        return b.end - a.end;
      });

      emoteSet.forEach((emote) => {
        emotes.push(emote.emoteUrl);

        let emoteMessage = tempMessage.slice(0, emote.start);
        emoteMessage += emote.emoteImageTag;
        emoteMessage += tempMessage.slice(emote.end + 1, tempMessage.length);
        tempMessage = emoteMessage;
      });
    }

    tempMessage = sanitizeHtml(tempMessage, {
      allowedAttributes: {
        img: ['class', 'src'],
      },
      allowedTags: [
        'marquee',
        'em',
        'strong',
        'b',
        'i',
        'code',
        'strike',
        'blink',
        'img',
      ],
    });

    tempMessage = tempMessage.replace(/@(\w*)/gm, `<span>$&</span>`);

    return {
      message: tempMessage,
      emotes: emotes.map((m) => m.emoteImageTag as string),
    };
  }

  function generateEmote(emoteId: string, position: string) {
    const [start, end] = position.split('-').map(Number);

    return {
      emoteId,
      emoteImageTag: `<img class='emote' src='https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/1.0'/>`,
      emoteUrl: `https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/1.0`,
      start,
      end,
    };
  }

  const processedChat = processChat(event);

  console.log(processedChat);
</script>

<style>
  :root {
    --top-border-size: 6px;
  }

  @keyframes slideIn {
    0% {
      transform: translateX(-400px);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .event {
    animation: slideIn 0.2s ease-in-out;
    background-color: var(--black);
    display: flex;
    flex-direction: row;
    width: 400px;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    border-top: var(--top-border-size) solid;
    border-image-slice: 1;
    border-image-source: linear-gradient(
      90deg,
      var(--yellow) 0%,
      var(--yellow) 100%
    );
    box-shadow: 0rem 0.6rem 1rem -0.4rem var(--black);
  }

  .event-vip {
    border-image-source: linear-gradient(
      90deg,
      var(--yellow) 0%,
      var(--vip) 100%
    );
  }

  .event-mod {
    border-image-source: linear-gradient(
      90deg,
      var(--yellow) 0%,
      var(--mod) 100%
    );
  }

  .event-broadcaster {
    border-image-source: linear-gradient(
      90deg,
      var(--yellow) 0%,
      var(--broadcaster) 100%
    );
  }

  .displayName {
    color: var(--white);
    font-size: 1rem;
    margin-bottom: 1rem;
    color: var(--yellow);
  }

  .message {
    color: var(--white);
    font-size: 1.2rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    word-break: break-word;
  }

  .avatarContainer {
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    flex: 0 0 100px;
    background-position-y: 50%;
    background-color: var(--black);
  }

  .messageContainer {
    padding: 1rem;
  }
</style>

<div
  class="event"
  class:event-vip={event.isVip === true}
  class:event-mod={event.isMod === true}
  class:event-broadcaster={event.isBroadcaster === true}>
  <div
    class="avatarContainer"
    style={`background-image: url(${event.logoUrl});`} />

  <div class="messageContainer">
    <p class="displayName">@{event.displayName}</p>

    <div class="message">
      {@html processedChat.message}
    </div>
  </div>
</div>
