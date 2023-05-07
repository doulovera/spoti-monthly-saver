import { SPOTIFY_API } from '../constants/keys.js'
import { getToken } from '../utils/token.js'
import { getUser } from '../utils/user.js'

export async function createPlaylist ({ name, description }) {
  const token = (await getToken()).access_token
  const user = await getUser()

  if (!name) throw new Error('Name is required.')

  const response = await fetch(SPOTIFY_API + `v1/users/${user.id}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token
    },
    body: JSON.stringify({
      name,
      description,
      public: false
    })
  })

  if (!response.ok) throw new Error('Failed to fetch data.')

  return true
}
