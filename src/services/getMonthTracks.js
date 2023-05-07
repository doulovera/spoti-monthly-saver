import { SPOTIFY_API } from '../constants/keys.js'
import { getToken } from '../utils/token.js'

export async function getMonthTracks ({ selectedYear, selectedMonth }) {
  const token = (await getToken()).access_token

  // 💡 TODO: add a loop that checks if the last item in the array is the same month as the selected month
  // and if it is, fetch the next 50 items and add them to the array
  // until the last item is not the same month as the selected month

  const response = await fetch(SPOTIFY_API + 'v1/me/tracks?limit=50', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  })

  if (!response.ok) throw new Error('Failed to fetch data: ' + response.status + ' ' + response.statusText)

  const data = await response.json()

  const mappedData = data.items.map((item) => {
    const date = new Date(item.added_at)
    const itemYear = date.getFullYear()
    const itemMonth = date.getMonth() + 1

    if (itemYear === selectedYear && itemMonth === Number(selectedMonth)) {
      return {
        poster: item.track.album.images[1].url,
        artist: item.track.artists[0].name,
        title: item.track.name,
        addedAt: item.added_at,
        duration: item.track.duration_ms,
        url: item.track.external_urls.spotify
      }
    }

    return null
  })

  return mappedData.filter(Boolean)
}
