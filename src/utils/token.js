import fs from 'node:fs/promises'

const FILE_PATH = `${process.cwd()}/src/public/token.json`

export async function storeInfoInToken (token) {
  try {
    if (token?.error) throw new Error(token.error)

    let data = '{}'
    try {
      data = await fs.readFile(FILE_PATH)
    } catch (error) {
      await fs.writeFile(FILE_PATH, JSON.stringify({}))
    }

    const json = JSON.parse(data)
    const newJson = { ...json, ...token }
    await fs.writeFile(FILE_PATH, JSON.stringify(newJson))
  } catch (error) {
    console.error(error)
  }
}

export async function getToken () {
  try {
    const data = await fs.readFile(FILE_PATH)
    return JSON.parse(data)
  } catch (error) {
    console.error(error)
  }
}
