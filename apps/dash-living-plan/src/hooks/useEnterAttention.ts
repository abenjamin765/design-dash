import { useEffect, useRef } from 'react'

const HYDRATED_FLAG = '__dashLivingPlanHydrated'

/** Call once from App after first paint — enables enter flashes for later mounts. */
export function markPlanHydrated() {
  ;(window as unknown as Record<string, boolean>)[HYDRATED_FLAG] = true
}

function isPlanHydrated() {
  return Boolean((window as unknown as Record<string, boolean>)[HYDRATED_FLAG])
}

/**
 * Marks an element with data-attention="enter" so CSS can draw the eye to
 * newly created or updated content mid-dash.
 *
 * Purpose (Emil): feedback + prevent jarring appearance when the agent
 * writes a Decision / flips a phase / hot-reloads MDX.
 * Frequency: occasional during a Design Dash — animation is warranted.
 *
 * Skips the initial full-page paint (no cascade of flashes). Flashes when:
 * - the plan is already hydrated and this component mounts (new content / HMR)
 * - flashKey changes after first mount (status / result flip)
 *
 * Respects prefers-reduced-motion.
 */
export function useEnterAttention<T extends HTMLElement = HTMLDivElement>(
  flashKey?: string | number,
) {
  const ref = useRef<T>(null)
  const isFirstMount = useRef(true)
  const prevKey = useRef(flashKey)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const keyChanged = prevKey.current !== flashKey
    prevKey.current = flashKey

    let shouldFlash = false
    if (isFirstMount.current) {
      // Late mount (agent wrote new component, or HMR remount) after plan is live
      shouldFlash = isPlanHydrated()
      isFirstMount.current = false
    } else if (keyChanged) {
      shouldFlash = true
    }

    if (!shouldFlash) return

    el.dataset.attention = 'enter'
    const t = window.setTimeout(() => {
      delete el.dataset.attention
    }, 700)

    return () => window.clearTimeout(t)
  }, [flashKey])

  return ref
}
