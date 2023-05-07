import { SPOTIFY_API } from '../constants/keys.js'
import { getToken } from '../utils/token.js'

export async function getUserInfo () {
  try {
    const token = (await getToken()).access_token

    const response = await fetch(SPOTIFY_API + 'v1/me', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }
    })

    if (!response.ok) throw new Error('Failed to fetch data: ' + response.status + ' ' + response.statusText)

    const data = await response.json()

    return {
      id: data.id,
      name: data.display_name,
      uri: data.uri
    }
  } catch (error) {
    console.error(error)
  }
}
