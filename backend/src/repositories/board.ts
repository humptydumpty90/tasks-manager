import { MongooseRepository } from './base'
import { Board } from '../models'
import { IBoard } from '../interfaces'

export class BoardRepository extends MongooseRepository<IBoard> {
  constructor() {
    super(Board)
  }
}
