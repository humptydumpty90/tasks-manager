import passport from 'passport'
import jwt from 'jsonwebtoken'
import { AuthService } from '../../../services'

import type { Request, NextFunction, Response } from 'express'
import { StatusCodes } from '../../../interfaces'

type ConstructorParams = {
  authService: AuthService
}

export class AuthController {
  private authService: AuthService

  constructor({ authService }: ConstructorParams) {
    this.authService = authService
  }

  public async getMe(req: Request, res: Response, next: NextFunction) {
    return this.authService
      .getMe(req)
      .then((user) => {
        res.status(StatusCodes.SUCCESS).json({ data: user })
      })
      .catch((error) => {
        req?.log?.error(`Failed to fetch user data`, { error })

        next(error)
      })
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    const { name, email, password } = req.body

    this.authService
      .signUp(req, { name, email, password })
      .then((user) => {
        return res.status(StatusCodes.CREATED).json({
          data: user,
          error: {},
        })
      })
      .catch((error) => {
        req?.log?.error(`Failed to create user`, { error })

        next(error)
      })
  }

  async signIn(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body

    this.authService
      .signIn(req, { email, password })
      .then((user) => {
        res.status(StatusCodes.SUCCESS).json({
          data: user,
          error: {},
        })
      })
      .catch((error) => {
        req?.log?.error(`Failed to sign in user with email ${email}`, { error })

        next(error)
      })
  }

  async signOut(req: Request, res: Response) {
    // Implement sign out logic if needed (e.g., invalidate tokens, clear cookies)
    req.session = null

    res.status(StatusCodes.SUCCESS).json({
      data: {},
      error: {},
    })
  }
  googleAuthCallback(req: Request, res: Response, next: NextFunction) {
    const authMiddleware = passport.authenticate(
      'google',
      { session: false, failureRedirect: process.env.FRONTEND_URL! },
      (err, user) => {
        if (err || !user) {
          return res.redirect(`${process.env.FRONTEND_URL}`)
        }

        const token = jwt.sign(
          { user: { id: user.id } },
          process.env.JWT_SECRET_KEY!,
          { expiresIn: '1h' },
        )

        req.session = {
          jwt: token,
        }

        res.redirect(`${process.env.FRONTEND_URL}`)
      },
    )

    return authMiddleware(req, res, next)
  }
}
