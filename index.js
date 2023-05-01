import 'dotenv/config.js'
import express from 'express'

import { PORT } from './src/constants/keys.js'

// controllers
import { authRouter } from './src/controllers/auth.js'
import { userRouter } from './src/controllers/user.js'

const app = express()

// routes
app.use('/auth', authRouter)
app.use('/user', userRouter)

app.listen(PORT || 8080, () => {
  console.log(`Server is running on port ${PORT}.`)
})
