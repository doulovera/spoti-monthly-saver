import { Router } from 'express'
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, SPOTIFY_ACCOUNT_API } from '../constants/keys.js'
import { getToken, storeInfoInToken } from '../utils/token.js'

const router = Router()

router.get('/login', (req, res) => {
  const scope = 'user-read-private user-read-email user-library-read'

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope
  }).toString()

  res.status(200).json({ url: `${SPOTIFY_ACCOUNT_API}authorize?${params}` })
})

router.get('/refresh', async (req, res) => {
  const authCode = (await getToken()).refresh_token

  try {
    const response = await fetch(SPOTIFY_ACCOUNT_API + 'api/token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: REDIRECT_URI
      })
    })
    const data = await response.json()

    await storeInfoInToken({ ...data, refresh_token: data.refresh_token })

    res.status(200).json({ message: 'access' })
  } catch (error) {
    console.error(error)
  }
})

router.get('/callback', async (req, res) => {
  const authCode = req.query.code
  await storeInfoInToken({ refresh_token: authCode })

  res.status(200).json({ message: 'success' })
})

export { router as authRouter }
