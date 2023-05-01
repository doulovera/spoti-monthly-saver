import fs from 'node:fs/promises'

export async function storeInfoInToken (token) {
  try {
    if (token?.error) throw new Error(token.error)

    let data = '{}'
    try {
      data = await fs.readFile(`${process.cwd()}/src/public/token.json`)
    } catch (error) {
      await fs.writeFile(`${process.cwd()}/src/public/token.json`, JSON.stringify({}))
    }

    const json = JSON.parse(data)
    const newJson = { ...json, ...token }
    await fs.writeFile(`${process.cwd()}/src/public/token.json`, JSON.stringify(newJson))
  } catch (error) {
    console.error(error)
  }
}

export async function getToken () {
  try {
    const data = await fs.readFile(`${process.cwd()}/src/public/token.json`)
    return JSON.parse(data)
  } catch (error) {
    console.error(error)
  }
}
