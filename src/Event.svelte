<script lang="ts">
  import type { ChatMessageData } from './types';

  export let event: ChatMessageData;
  export let isMostRecent: boolean;

  const generateEmoteUrl = (emoteId: string) => {
    return `https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/1.0`;
  };

  if (event.emotes) {
  }
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
    margin-top: 1rem;
    border-top: var(--top-border-size) solid;
    border-image-slice: 1;
  }

  .event-vip {
    border-image-source: linear-gradient(
      90deg,
      var(--black) 0%,
      var(--vip) 100%
    );
  }

  .event-mod {
    border-image-source: linear-gradient(
      90deg,
      var(--black) 0%,
      var(--mod) 100%
    );
  }

  .event-broadcaster {
    border-image-source: linear-gradient(
      90deg,
      var(--black) 0%,
      var(--broadcaster) 100%
    );
  }

  .displayName {
    color: var(--white);
    font-size: 0.9rem;
    margin-bottom: 1rem;
    color: var(--yellow);
  }

  .message {
    color: var(--white);
    font-size: 1.2rem;
  }

  .avatarContainer {
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    flex: 0 0 100px;
    background-size: 150px;
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
    <p class="displayName">{event.displayName}</p>
    <p class="message">{event.message}</p>
  </div>
</div>
