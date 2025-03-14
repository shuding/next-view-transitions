import { useSyncExternalStore } from 'react'

/**
 * Hook to subscribe to URL hash changes
 * 
 * This hook provides a reactive way to access the current URL hash,
 * automatically re-rendering components when the hash changes.
 * 
 * @returns The current URL hash string
 */
export function useHash(): string {
  return useSyncExternalStore(
    subscribeHash,
    getHashSnapshot,
    getServerHashSnapshot
  )
}

/**
 * Get the current hash value from the browser
 * 
 * @returns The current URL hash string
 */
function getHashSnapshot(): string {
  return window.location.hash
}

/**
 * Provide a default hash value for server-side rendering
 * 
 * @returns Empty string as hash is not available on the server
 */
function getServerHashSnapshot(): string {
  return ''
}

/**
 * Subscribe to hash change events
 * 
 * @param onStoreChange - Callback function to execute when hash changes
 * @returns Cleanup function to remove the event listener
 */
function subscribeHash(onStoreChange: () => void): () => void {
  window.addEventListener('hashchange', onStoreChange)
  return () => window.removeEventListener('hashchange', onStoreChange)
}