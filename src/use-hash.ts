import { useSyncExternalStore } from 'react'

export function useHash() {
  return useSyncExternalStore(
    subscribeHash,
    getHashSnapshot,
    getServerHashSnapshot
  )
}

function getHashSnapshot() {
  return window.location.hash
}

function getServerHashSnapshot() {
  return ''
}

function subscribeHash(onStoreChange: () => void) {
  window.addEventListener('hashchange', onStoreChange)
  return () => window.removeEventListener('hashchange', onStoreChange)
}