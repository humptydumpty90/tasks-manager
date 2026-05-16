import crypto from 'node:crypto'
import passport from 'passport'
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20'
import { AuthRepository } from '../repositories'
import { IUser } from '../interfaces'

export const initPassport = () => {
  const repository = new AuthRepository()

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env!.GOOGLE_CLIENT_ID!,
        clientSecret: process.env!.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env!.GOOGLE_CALLBACK_URL!,
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: any, user?: any) => void,
      ) => {
        try {
          if (!profile.id || !profile.emails || !profile.emails.length) {
            return done(new Error('No email found in Google profile'))
          }

          const name = profile.displayName
          const email = profile!.emails[0]!.value

          const [user] = (await repository.findByQuery({ email })) || []

          if (!user) {
            const userData: Omit<IUser, 'password'> = {
              id: crypto.randomUUID(),
              name,
              email,
            }
            const newUser = await repository.create({
              ...userData,
              password: '',
            })

            return done(null, newUser)
          }

          done(null, user)
        } catch (error) {
          done(error)
        }
      },
    ),
  )
}
