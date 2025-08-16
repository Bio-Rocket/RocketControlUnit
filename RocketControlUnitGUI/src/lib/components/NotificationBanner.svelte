<script>
    import { notificationBanner } from '../stores';
    let banner = null;

    // Watch for changes to the notificationBanner store
    $: if ($notificationBanner) {
        banner = $notificationBanner;

        // Automatically clear the banner after 3 seconds
        setTimeout(() => {
            notificationBanner.set(null); // Clear the banner
            banner = null; // Update local variable
        }, 2500);
    }
</script>

{#if banner}
    <div class="notification-banner {banner.type}">
        {banner.message}
    </div>
{/if}

<style>
    .notification-banner {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding: 1rem;
        text-align: center;
        z-index: 1000;
        transition: opacity 0.5s ease; /* Smooth fade-out effect */
    }
    .notification-banner.error {
        background-color: red;
        color: white;
    }
    .notification-banner.success {
        background-color: green;
        color: white;
    }
</style>