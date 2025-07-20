import { useEffect, useState } from 'react'

// Shared queue + throttle mechanism
let queue = Promise.resolve()
const delay = ms => new Promise(res => setTimeout(res, ms))
const enqueue = async (fn, delayMs = 250) => {
  queue = queue.then(async () => {
    const result = await fn()
    await delay(delayMs) // wait before next
    return result
  })
  return queue
}

const useGameCovers = (title) => {
  const [coverUrl, setCoverUrl] = useState(null)
  const [source, setSource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!title) return

    const fetchCover = async () => {
      setLoading(true)
      try {
        await enqueue(async () => {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cover?title=${encodeURIComponent(title)}`)
          const data = await res.json()

          if (res.ok && data.coverUrl) {
            setCoverUrl(data.coverUrl)
            setSource(data.source || 'cover')
          } else {
            // 👇 Explicit fallback
            setCoverUrl(null)
            setSource('none')
          }
        }, 300)
      } catch (err) {
        console.error('Failed to fetch cover:', err)
        setError(err)
        setCoverUrl(null)
        setSource('none') // Ensure fallback kicks in even on error
      } finally {
        setLoading(false)
      }
    }

    fetchCover()
  }, [title])

  return { coverUrl, source, loading, error }
}

export default useGameCovers
