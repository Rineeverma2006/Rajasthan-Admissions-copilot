import { useEffect, useState } from 'react'

export function useLocal<T>(key: string, init: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [v, setV] = useState<T>(() => {
    try {
      const r = localStorage.getItem(key)
      return r ? JSON.parse(r) : init
    } catch {
      return init
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v))
    } catch {
      /* storage unavailable */
    }
  }, [key, v])

  return [v, setV]
}

export const useSaved = () => {
  const [saved, set] = useLocal<string[]>('rac.saved', ['mnit', 'bits'])
  const toggle = (id: string) => {
    set(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
  }
  return { saved, toggle, isSaved: (id: string) => saved.includes(id) }
}

export const useCompare = () => {
  const [compared, set] = useLocal<string[]>('rac.compare', ['mnit', 'lnmiit'])
  const toggle = (id: string) => {
    set(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id)
      }
      if (prev.length >= 4) {
        // max 4 colleges in comparison table
        return [...prev.slice(1), id]
      }
      return [...prev, id]
    })
  }
  const clear = () => set([])
  return { compared, setCompared: set, toggle, clear, isCompared: (id: string) => compared.includes(id) }
}
