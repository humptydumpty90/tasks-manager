import 'cookie-session'
import { Logger } from 'winston'
import { IUser } from '../interfaces'

declare module 'cookie-session' {
  interface CookieSessionObject {
    jwt?: string
  }
}

declare global {
  namespace Express {
    interface Request {
      session:
        | (CookieSessionInterfaces.CookieSessionObject & {
            jwt?: string
          })
        | null
      log?: Logger
      user?: User
    }

    interface User extends Pick<IUser, 'id'> {
      id?: string
    }
  }
}
