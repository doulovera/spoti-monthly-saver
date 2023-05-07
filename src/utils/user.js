import fs from 'node:fs/promises'

const FILE_PATH = `${process.cwd()}/src/public/user.json`

export async function storeInfoInUser (user) {
  try {
    let data = '{}'
    try {
      data = await fs.readFile(FILE_PATH)
    } catch (error) {
      await fs.writeFile(FILE_PATH, JSON.stringify({}))
    }

    const json = JSON.parse(data)
    const newJson = { ...json, ...user }
    await fs.writeFile(FILE_PATH, JSON.stringify(newJson))
  } catch (error) {
    console.error(error)
  }
}

export async function getUser () {
  try {
    const data = await fs.readFile(FILE_PATH)

    if (!data) throw new Error('User not found.')

    return JSON.parse(data)
  } catch (error) {
    console.error(error)
  }
}
