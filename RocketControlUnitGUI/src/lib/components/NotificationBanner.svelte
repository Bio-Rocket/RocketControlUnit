<script>
    import { notificationBanner } from '../stores';
    let banner = null;
    let isVisible = false; // Track visibility for fade-out effect

    // Watch for changes to the notificationBanner store
    $: if ($notificationBanner) {
        banner = $notificationBanner;
        console.log(banner.type)
        isVisible = true; // Make the banner visible

        // Automatically clear the banner after 3 seconds
        setTimeout(() => {
            isVisible = false; // Start fade-out
            setTimeout(() => {
                notificationBanner.set(null); // Clear the banner after fade-out
                banner = null; // Update local variable
            }, 500); // Match the CSS transition duration
        }, 3000);
    }
</script>

{#if banner}
    <div class="notification-banner {isVisible ? 'visible' : ''} variant-filled-{banner.type}">
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
        opacity: 0; /* Start hidden */
        transition: opacity 0.5s ease; /* Smooth fade-in and fade-out */
    }
    .notification-banner.visible {
        opacity: 1; /* Fully visible */
        color: white;
    }
</style>