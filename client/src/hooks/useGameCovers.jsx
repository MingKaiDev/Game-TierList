import { useEffect, useState } from 'react'

const useGameCovers = (title) => {
  const [coverUrl, setCoverUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!title) return

    const fetchCover = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cover?title=${encodeURIComponent(title)}`)
        const data = await res.json()
        if (res.ok && data.coverUrl) {
          setCoverUrl(data.coverUrl)
        } else {
          throw new Error(data.error || 'No cover found')
        }
      } catch (err) {
        console.error(err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCover()
  }, [title])

  return { coverUrl, loading, error }
}


export default useGameCovers
