<script lang="ts">
	const socket = new WebSocket('ws://localhost:8999');

	socket.addEventListener("message", (data) => {
		const message = JSON.parse(data.data).data;
	});

</script>

<main>
	<h1>Hello World!</h1>
</main>

<style>

</style>