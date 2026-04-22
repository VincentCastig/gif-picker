import type { GiphyGif } from '../types/giphy'
import GifCard from './GifCard'

interface GifGridProps {
  gifs: GiphyGif[]
  loading: boolean
  onCopy: (url: string) => void
}

function GifGrid({ gifs, loading, onCopy }: GifGridProps) {
  if (loading && gifs.length === 0) {
    return <div className="status">Loading...</div>
  }

  if (!loading && gifs.length === 0) {
    return <div className="status">No GIFs found. Try a different search!</div>
  }

  return (
    <div className="gif-grid">
      {gifs.map(gif => (
        <GifCard key={gif.id} gif={gif} onCopy={onCopy} />
      ))}
      {loading && <div className="status">Loading more...</div>}
    </div>
  )
}

export default GifGrid