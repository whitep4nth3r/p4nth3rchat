<script lang="ts">
import type { ChatMessageData } from './types'

export let event: ChatMessageData;


</script>

<style></style>

<div class="event">
  {event.message}
</div>