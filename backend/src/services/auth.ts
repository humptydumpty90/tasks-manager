import crypto from 'node:crypto'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'

import { Password } from '../modules/Password'
import {
  InvalidCredentialsError,
  NotFoundError,
  ValidationError,
} from '../common/errors'

import type { Request } from 'express'
import type {
  ConstructorParams,
  IRepository,
  IUser,
  UserDataReturn,
} from '../interfaces'

export class AuthService {
  private readonly repository: IRepository<IUser>

  constructor({ repository }: ConstructorParams) {
    this.repository = repository
  }

  public async getMe(request: Request): Promise<UserDataReturn> {
    const userId = request.user?.id

    if (!userId) {
      throw new NotFoundError('User not found')
    }

    const user = await this.repository.findById(userId)

    if (!user) {
      throw new NotFoundError('User not found')
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  }

  public async signUp(
    request: Request,
    { name, email, password }: Pick<IUser, 'name' | 'email' | 'password'>,
  ): Promise<UserDataReturn> {
    const result = validationResult(request)

    if (!result.isEmpty()) {
      throw new ValidationError('Validation failed', result.array())
    }

    const [existingUser] = await this.repository.findByQuery({ email })

    if (existingUser) {
      throw new ValidationError('User with this email already exists')
    }

    const hashedPassword = await Password.hash(password)

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
    }

    const createdUser = await this.repository.create(newUser)

    const token = jwt.sign(
      { user: { id: newUser.id } },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: '1h' },
    )

    request.session = {
      jwt: token,
    }

    const { password: _, ...userData } = createdUser

    return userData
  }

  public async signIn(
    request: Request,
    { email, password }: Pick<IUser, 'email' | 'password'>,
  ): Promise<UserDataReturn> {
    const result = validationResult(request)

    if (!result.isEmpty()) {
      throw new ValidationError('Validation failed', result.array())
    }

    const [existingUser] = (await this.repository.findByQuery({ email })) || []

    if (!existingUser) {
      throw new NotFoundError('User not found')
    }

    const verificationResult = await Password.verify(
      existingUser.password,
      password,
    )

    if (!verificationResult) {
      throw new InvalidCredentialsError('Invalid credentials')
    }

    const token = jwt.sign(
      { user: { id: existingUser.id } },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: '1h' },
    )

    request.session = {
      jwt: token,
    }

    const { password: _, ...userData } = existingUser

    return userData
  }
}
