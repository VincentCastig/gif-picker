import { useEffect, useState, useCallback, useRef } from 'react'
import useGiphy from './hooks/useGiphy'
import SearchBar from './components/SearchBar'
import GifGrid from './components/GifGrid'
import Toast from './components/Toast'

function App() {
  const { gifs, loading, error, rateLimited, fetchGifs, fetchTrending } = useGiphy()
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get('q') || '')
  const [toast, setToast] = useState<string | null>(null)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    if (query) {
      fetchGifs(query)
    } else {
      fetchTrending()
    }
  }, [query, fetchGifs, fetchTrending])

  const handleSearch = useCallback((q: string) => {
    setQuery(q)
    fetchGifs(q, 0)
  }, [fetchGifs])

  const handleCopy = () => {
    setToast('GIF URL copied to clipboard!')
  }

  return (
    <div className="app">
      <header className="header">
        <h1>GIF Picker</h1>
        <SearchBar onSearch={handleSearch} initialValue={query} />
      </header>

      {rateLimited && (
        <div className="rate-limit-banner">
          ⚠️ API rate limit reached. Showing cached results.
        </div>
      )}

      {error && !rateLimited && (
        <div className="error-banner">{error}</div>
      )}

      <main>
        <GifGrid gifs={gifs} loading={loading} onCopy={handleCopy} />

        {/* {!loading && gifs.length > 0 && gifs.length < totalCount && (
          <button className="load-more-btn" onClick={handleLoadMore}>
            Load More
          </button>
        )} */}
      </main>

      {toast && (
        <Toast
          message={toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default App