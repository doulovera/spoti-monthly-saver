import { Router } from 'express'
import { SPOTIFY_API } from '../constants/keys.js'
import { getToken } from '../utils/token.js'
import { getMonthTracks } from '../services/getMonthTracks.js'
import { createPlaylist } from '../services/createPlaylist.js'
import { searchPlaylist } from '../services/getPlaylists.js'

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

    data.items.forEach((item) => {
      delete item.track.available_markets
      delete item.track.album.available_markets
    })

    res.status(200).json({ data })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

router.get('/saved-tracks/month', async (req, res) => {
  try {
    const { month, year } = req.query

    if (!month) throw new Error('Month is required.')

    const selectedYear = year || new Date().getFullYear()
    // const data = await getMonthTracks({ selectedYear, selectedMonth: month })
    const data = []

    const playlistName = `My ${month < 10 ? `0${month}` : month}/${selectedYear} playlist`
    const playlistDescription = `My ${month}/${selectedYear} playlist created with Spotify API. (https://github.com/doulovera/spoti-monthly-saver)`

    const playlists = await searchPlaylist({ name: playlistName })
    // console.log(playlists)

    // await createPlaylist({
    //   name: playlistName,
    //   description: playlistDescription
    // })

    // 💡 TODO: add save items from "data" into a playlist

    res.status(200).json({ data, size: data.length })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

export { router as userRouter }
