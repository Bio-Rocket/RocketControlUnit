<script lang="ts" context="module">
    export type PausablePromptResponse = ["submit" | "cancel" | "pause" | undefined, string];
</script>

<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';

    const modalStore = getModalStore();

    export let heading: string = "";
    let inputValue: string = "";

    const finish = (value: PausablePromptResponse) => {
        $modalStore[0]?.response!(value);
        modalStore.close();
    }

    const submit = () => {
        finish(["submit", inputValue]);
    }

    const pause = () => {
        finish(["pause", inputValue]);
    }

    const cancel = () => {
        finish(["cancel", ""]);
    }
</script>

<div class="modal block overflow-y-auto bg-surface-100-800-token w-modal h-auto p-4 space-y-4 rounded-container-token shadow-xl">
    <header class="modal-header text-2xl font-bold">{heading}</header>
    <input class="modal-prompt-input input" bind:value={inputValue} type="text" />
    <footer class="modal-footer flex justify-end space-x-2">
        <button class="btn variant-ghost-surface" type="submit" on:click={cancel}>Cancel</button>
        <button class="btn variant-filled" type="submit" on:click={pause}>Pause</button>
        <button class="btn variant-filled" type="submit" on:click={submit}>Submit</button>
    </footer>
</div>