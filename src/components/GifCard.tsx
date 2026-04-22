import type { GiphyGif } from '../types/giphy'

interface GifCardProps {
  gif: GiphyGif
  onCopy: (url: string) => void
}

function GifCard({ gif, onCopy }: GifCardProps) {
  const mp4Url = gif.images.original_mp4.mp4
  const width = gif.images.original_mp4.width
  const height = gif.images.original_mp4.height

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(gif.url)
      onCopy(gif.url)
    } catch {
      console.error('Failed to copy URL')
    }
  }

  return (
    <div className="gif-card">
      <video
        src={mp4Url}
        width={width}
        height={height}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="gif-card-overlay">
        <button className="copy-btn" onClick={handleCopy}>
          Copy URL
        </button>
      </div>
    </div>
  )
}

export default GifCard