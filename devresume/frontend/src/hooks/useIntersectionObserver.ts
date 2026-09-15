import { useCallback, useEffect, useRef, useState } from 'react'

export function useIntersectionObserver<T extends Element>(options?: {
  threshold?: number
  once?: boolean
}): { ref: React.RefCallback<T>; isVisible: boolean } {
  const threshold = options?.threshold ?? 0.2
  const once = options?.once ?? true

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [isVisible, setIsVisible] = useState(prefersReducedMotion)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Clean up the observer on unmount
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  const ref = useCallback(
    (node: T | null) => {
      // Disconnect any previously observed element
      observerRef.current?.disconnect()

      // If reduced-motion is preferred, isVisible is already true — no observer needed
      if (prefersReducedMotion) return

      if (!node) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            if (once) {
              observer.disconnect()
            }
          }
        },
        { threshold }
      )

      observer.observe(node)
      observerRef.current = observer
    },
    [threshold, once, prefersReducedMotion]
  )

  return { ref, isVisible }
}
