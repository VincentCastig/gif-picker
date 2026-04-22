import { useEffect, useState, useCallback } from 'react'
import useDebounce from '../hooks/useDebounce'

interface SearchBarProps {
  onSearch: (query: string) => void
  initialValue?: string
}

function SearchBar({ onSearch, initialValue = '' }: SearchBarProps) {
  const [value, setValue] = useState(initialValue)
  const debouncedValue = useDebounce(value, 400)

  const handleSearch = useCallback((query: string) => {
    onSearch(query)
    const url = new URL(window.location.href)
    url.searchParams.set('q', query)
    window.history.pushState({}, '', url)
  }, [onSearch])

  useEffect(() => {
    if (debouncedValue) {
      handleSearch(debouncedValue)
    }
  }, [debouncedValue, handleSearch])

  const handleClear = () => {
    setValue('')
    const url = new URL(window.location.href)
    url.searchParams.delete('q')
    window.history.pushState({}, '', url)
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for GIFs..."
        value={value}
        onChange={e => setValue(e.target.value)}
        autoFocus
      />
      {value && (
        <button className="clear-btn" onClick={handleClear}>✕</button>
      )}
    </div>
  )
}

export default SearchBar