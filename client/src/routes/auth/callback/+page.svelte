<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { auth } from '$lib/auth';

  onMount(async () => {
    const token = $page.url.searchParams.get('token');
    console.log('Token received:', token); // Debug log
    
    if (!token) {
      console.error('No token found in URL');
      goto('/');
      return;
    }

    try {
      console.log('Processing token...'); // Debug log
      await auth.handleCallback(token);
      console.log('Token processed successfully'); // Debug log
      goto('/');
    } catch (error) {
      console.error('Error handling auth callback:', error);
      goto('/');
    }
  });
</script>

<div class="flex items-center justify-center min-h-screen">
  <div class="text-center">
    <h1 class="text-2xl font-semibold mb-4">Processing authentication...</h1>
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
  </div>
</div> 