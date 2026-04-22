import { useState } from 'react'
import type { GiphyGif, GiphyResponse } from '../types/giphy'

const API_KEY = import.meta.env.VITE_GIPHY_API_KEY
const BASE_URL = 'https://api.giphy.com/v1/gifs'
const LIMIT = 12

interface UseGiphyResult {
  gifs: GiphyGif[]
  loading: boolean
  error: string | null
  rateLimited: boolean
  totalCount: number
  fetchGifs: (query: string, offset?: number) => Promise<void>
  fetchTrending: () => Promise<void>
}

const cache: Record<string, GiphyGif[]> = {}

function useGiphy(): UseGiphyResult {
  const [gifs, setGifs] = useState<GiphyGif[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rateLimited, setRateLimited] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const fetchGifs = async (query: string, offset = 0) => {
    const cacheKey = `${query}-${offset}`

    if (cache[cacheKey]) {
      setGifs(prev => offset === 0 ? cache[cacheKey] : [...prev, ...cache[cacheKey]])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        api_key: API_KEY,
        q: query,
        limit: String(LIMIT),
        offset: String(offset),
      })

      const res = await fetch(`${BASE_URL}/search?${params}`)

      if (res.status === 429) {
        setRateLimited(true)
        setError('API rate limit reached. Showing cached results.')
        return
      }

      if (!res.ok) throw new Error('Failed to fetch GIFs')

      const data: GiphyResponse = await res.json()

      cache[cacheKey] = data.data
      setTotalCount(data.pagination.total_count)
      setGifs(prev => offset === 0 ? data.data : [...prev, ...data.data])
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchTrending = async () => {
    const cacheKey = 'trending'

    if (cache[cacheKey]) {
      setGifs(cache[cacheKey])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        api_key: API_KEY,
        limit: '3',
      })

      const res = await fetch(`${BASE_URL}/trending?${params}`)

      if (res.status === 429) {
        setRateLimited(true)
        setError('API rate limit reached.')
        return
      }

      if (!res.ok) throw new Error('Failed to fetch trending GIFs')

      const data: GiphyResponse = await res.json()
      cache[cacheKey] = data.data
      setGifs(data.data)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return { gifs, loading, error, rateLimited, totalCount, fetchGifs, fetchTrending }
}

export default useGiphy