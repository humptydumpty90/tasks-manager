import path from 'node:path'
import dotenv from 'dotenv'

import { Server } from 'node:http'

import { createApp } from './app'
import { initLogger } from './modules/logger'

import { connect, closeDB } from './repositories'

dotenv.config({ path: path.join(__dirname, '..', '.env') })

let server: Server | null = null

try {
  const {
    PORT,
    DB_URI,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    JWT_SECRET_KEY,
    COOKIE_SECRET_KEY,
    CLIENT_URLS,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,
    FRONTEND_URL,
  } = process.env

  if (!PORT) {
    console.error('PORT is not defined in environment variables')

    throw new Error('PORT is not defined in environment variables')
  }

  if (!DB_URI || !DB_PORT || !DB_NAME || !DB_USER || !DB_PASSWORD) {
    console.error(
      'One or more database environment variables are not defined (DB_URI, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)',
    )

    throw new Error(
      'One or more database environment variables are not defined (DB_URI, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)',
    )
  }

  if (!JWT_SECRET_KEY || !COOKIE_SECRET_KEY) {
    console.error(
      'JWT_SECRET_KEY or COOKIE_SECRET_KEY is not defined in environment variables',
    )

    throw new Error(
      'JWT_SECRET_KEY or COOKIE_SECRET_KEY is not defined in environment variables',
    )
  }

  if (!CLIENT_URLS) {
    console.error('CLIENT_URLS is not defined in environment variables')

    throw new Error('CLIENT_URLS is not defined in environment variables')
  }

  if (
    !GOOGLE_CLIENT_ID ||
    !GOOGLE_CLIENT_SECRET ||
    !GOOGLE_CALLBACK_URL ||
    !FRONTEND_URL
  ) {
    console.error(
      'One or more Google OAuth environment variables are not defined (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL, FRONTEND_URL)',
    )

    throw new Error(
      'One or more Google OAuth environment variables are not defined (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL, FRONTEND_URL)',
    )
  }

  connect({
    uri: DB_URI,
    name: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
  })
    .then(() => {
      const logsPath = path.join(__dirname, 'logs')
      const logger = initLogger(logsPath)
      const app = createApp({ loggerInstance: logger })

      logger.info('Connected to JSON Server database')

      server = app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`)
      })
    })
    .catch((error) => {
      console.error('Failed to connect to JSON Server database', { error })

      throw new Error('Failed to connect to JSON Server database')
    })
} catch (error) {
  console.error('Failed to start the application', { error })

  process.exit(1)
}

const closeServer = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (server) {
      server.close((err) => {
        if (err) return reject(err)
        console.log('HTTP server closed.')
        resolve()
      })
    } else {
      resolve()
    }
  })
}

const gracefulShutdown = async (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`)

  const timeout = setTimeout(() => {
    console.error(
      'Could not close connections in time, forcefully shutting down',
    )

    process.exit(1)
  }, 10000)

  try {
    await closeServer()
    await closeDB()

    clearTimeout(timeout)

    console.log('Graceful shutdown finished. Bye!')

    process.exit(0)
  } catch (e) {
    console.error('Error during shutdown', { error: e })
    process.exit(1)
  }
}
