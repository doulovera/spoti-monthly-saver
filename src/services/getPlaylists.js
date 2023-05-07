import { SPOTIFY_API } from '../constants/keys.js'
import { getToken } from '../utils/token.js'
import { getUser } from '../utils/user.js'

export async function getAllPlaylists () {
  try {
    const token = (await getToken()).access_token

    const params = new URLSearchParams({
      limit: 49
    })

    const response = await fetch(SPOTIFY_API + 'v1/me/playlists', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }
    })

    if (!response.ok) throw new Error('Failed to fetch data: ' + response.status + ' ' + response.statusText)

    return response.json()
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function searchPlaylist ({ name }) {
  if (!name) throw new Error('Name is required.')

  const playlists = await getAllPlaylists()
  console.log(playlists)

  // const filteredPlaylists = playlists.filter((playlist) => {
  //   return playlist.name.toLowerCase().includes(name.toLowerCase())
  // })

  // return filteredPlaylists
}
