import { Router } from 'express'
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, SPOTIFY_ACCOUNT_API } from '../constants/keys.js'
import { getToken, storeInfoInToken } from '../utils/token.js'
import { getUserInfo } from '../services/getUserInfo.js'
import { storeInfoInUser } from '../utils/user.js'

const router = Router()

router.get('/login', (req, res) => {
  const scope = 'user-read-private user-read-email user-library-read' + ' playlist-modify-public playlist-modify-private'

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope
  }).toString()

  res.status(200).json({ url: `${SPOTIFY_ACCOUNT_API}authorize?${params}` })
})

router.get('/callback', async (req, res) => {
  try {
    const authCode = req.query.code
    await storeInfoInToken({ refresh_token: authCode })

    // 💡 TODO: improve this part :b
    if (!(await getToken()).access_token) {
      await fetch('http://localhost:8080/auth/refresh')
    }

    const userInfo = await getUserInfo()
    await storeInfoInUser(userInfo)

    res.status(200).json({ message: 'success' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

router.get('/refresh', async (req, res) => {
  // 💡 TODO: handle error if the token doesn't exists
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

export { router as authRouter }
