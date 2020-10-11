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
        'img',
      ],
    });

    tempMessage = tempMessage.replace(
      /@(\w*)/gm,
      `<span class="tag">$&</span>`
    );

    return {
      message: tempMessage,
      emotes: emotes.map((m) => m.emoteImageTag as string),
    };
  }

  function generateEmote(emoteId: string, position: string) {
    const [start, end] = position.split('-').map(Number);

    //todo - if only emote - make 3.0

    return {
      emoteId,
      emoteImageTag: `<img class='emote' src='https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/1.0'/>`,
      emoteUrl: `https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/1.0`,
      start,
      end,
    };
  }

  const processedChat = processChat(event);
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
    border-bottom-right-radius: 0.25rem;
    position: relative;
    overflow: hidden;
  }

  :global(.event-subscriber):after {
    content: '';
    position: absolute;
    right: -4px;
    bottom: -13px;
    transform: rotate(45deg);
    border-top: 20px solid transparent;
    border-bottom: 20px solid transparent;
    border-left: 20px solid var(--yellow);
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
    font-weight: var(--font-weight-bold);
  }

  .displayName-vip {
    background: linear-gradient(90deg, var(--yellow), var(--vip));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .displayName-mod {
    background: linear-gradient(90deg, var(--yellow), var(--mod));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .displayName-broadcaster {
    background: linear-gradient(90deg, var(--yellow), var(--broadcaster));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .message {
    color: var(--white);
    font-size: 1.4rem;
    display: inline-block;
    word-break: break-word;
    line-height: 1.6rem;
    font-weight: var(--font-weight-normal);
  }

  :global(.message-startsWithTag .tag):first-of-type {
    padding-left: 0;
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
    width: 100%;
  }

  :global(.tag) {
    color: var(--yellow);
    padding-left: 4px;
    padding-right: 4px;
  }

  :global(.emote) {
    display: inline-block;
    position: relative;
    top: 2px;
    margin-left: -4px;
    margin-right: -4px;
  }
</style>

<div
  class="event"
  class:event-vip={event.isVip === true}
  class:event-mod={event.isMod === true}
  class:event-broadcaster={event.isBroadcaster === true}
  class:event-subscriber={event.isSubscriber}>
  <div
    class="avatarContainer"
    style={`background-image: url(${event.logoUrl});`} />

  <div class="messageContainer">
    <p
      class="displayName"
      class:displayName-vip={event.isVip === true}
      class:displayName-mod={event.isMod === true}
      class:displayName-broadcaster={event.isBroadcaster === true}>
      @{event.displayName}
    </p>

    <div
      class="message"
      class:message-startsWithTag={processedChat.message.startsWith('<span class="tag">')}>
      {@html processedChat.message}
    </div>
  </div>
</div>
