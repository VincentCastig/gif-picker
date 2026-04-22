export interface GiphyImage {
  mp4: string
  mp4_size: string
  width: string
  height: string
}

export interface GiphyGif {
  id: string
  title: string
  url: string
  images: {
    original_mp4: GiphyImage
    fixed_width: GiphyImage
  }
}

export interface GiphyResponse {
  data: GiphyGif[]
  meta: {
    status: number
    msg: string
    response_id: string
  }
  pagination: {
    total_count: number
    count: number
    offset: number
  }
}