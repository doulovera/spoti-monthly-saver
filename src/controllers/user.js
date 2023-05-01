import { Router } from 'express'
import { SPOTIFY_API } from '../constants/keys.js'
import { getToken } from '../utils/token.js'

const router = Router()
router.get('/saved-tracks', async (req, res) => {
  try {
    const token = (await getToken()).access_token

    const response = await fetch(SPOTIFY_API + 'v1/me/tracks?limit=2', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    const data = await response.json()

    res.status(200).json({ data })
  } catch (error) {
    console.error(error)
  }
})

export { router as userRouter }
