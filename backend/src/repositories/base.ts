import mongoose, { Model, QueryFilter } from 'mongoose'
import type { IRepository } from '../interfaces/repository'

type DBOptions = {
  uri: string
  user: string
  password: string
  name: string
}
export abstract class MongooseRepository<
  M extends { id: string },
> implements IRepository<M> {
  protected readonly model: Model<M>

  constructor(model: Model<M>) {
    this.model = model
  }

  public async findAll(): Promise<M[]> {
    const documents = await this.model.find().lean<M[]>()

    return documents
  }

  public async findById(id: string): Promise<M | null> {
    const document = await this.model
      .findOne({ id }) // UUID
      .lean<M>()

    return document
  }

  public async findByQuery(query: QueryFilter<M>): Promise<M[]> {
    const documents = await this.model.find(query).lean<M[]>()

    return documents
  }

  public async create(data: M): Promise<M> {
    const document = await this.model.create(data)

    return document.toObject() as M
  }

  public async createMany(data: M[]): Promise<M[]> {
    const documents = await this.model.create(data)

    return documents.map((doc) => doc.toObject()) as M[]
  }

  public async update(id: string, data: M): Promise<M> {
    const document = await this.model
      .findOneAndUpdate({ id }, data, { returnDocument: 'after' })
      .lean()

    return document as M
  }

  public async delete(id: string): Promise<void> {
    await this.model.deleteOne({ id })
  }
}

export const connect = async (options: DBOptions) => {
  const uri = options.uri
    .replace('{{user}}', encodeURIComponent(options.user))
    .replace('{{password}}', encodeURIComponent(options.password))

  mongoose.connect(uri, {
    dbName: options.name,
  })
}

export const getClient = () => {
  return mongoose.connection
}

export const getDB = () => {
  return mongoose.connection.db
}

export const closeDB = async () => {
  await mongoose.connection.close()
}
