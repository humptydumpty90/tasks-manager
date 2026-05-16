import crypto from 'node:crypto'
import { validationResult } from 'express-validator'
import { Request } from 'express'
import { transformWorkflow } from '../utils'
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../common/errors'

import type { IRepository, ITaskRepository, WorkflowCode } from '../interfaces'
import type { IBoard } from '../interfaces/entities/board'

type ConstructorParams = {
  boardRepository: IRepository<IBoard>
  taskRepository: ITaskRepository
}
export class BoardService {
  private boardRepository: IRepository<IBoard>
  private taskRepository: ITaskRepository

  constructor({ boardRepository, taskRepository }: ConstructorParams) {
    this.boardRepository = boardRepository
    this.taskRepository = taskRepository
  }

  // api/v1/boards/:boardId/tasks
  public async getBoardTasks(request: Request) {
    const { boardId } = request.params!

    const board = await this.boardRepository.findById(boardId as string)

    if (board && board.authorId !== request.user!.id) {
      throw new ForbiddenError(
        'You do not have permission to access this board',
      )
    }

    if (!board) {
      throw new NotFoundError('Board not found')
    }

    const tasks = await this.taskRepository.findByQuery({
      authorId: request.user!.id as string,
      boardId: boardId as string,
    })

    if (!tasks.length) {
      throw new NotFoundError('No tasks found')
    }

    return tasks.map((task) => ({
      ...task,
      workflow: transformWorkflow(task.workflow as WorkflowCode),
    }))
  }

  public async getAllBoards(request: Request) {
    const boards = await this.boardRepository.findByQuery({
      authorId: request.user!.id!,
    })

    if (!boards.length) {
      throw new NotFoundError('No boards found')
    }

    return boards
  }

  public async getBoardById(request: Request, { id }: { id: string }) {
    const board = await this.boardRepository.findById(id)

    if (board && board.authorId !== request.user!.id) {
      throw new ForbiddenError(
        'You do not have permission to access this board',
      )
    }

    if (!board) {
      throw new NotFoundError('Board not found')
    }

    return board
  }

  public async createBoard(
    request: Request,
    { boardData }: { boardData: IBoard },
  ) {
    const result = validationResult(request)

    if (!result.isEmpty()) {
      throw new ValidationError('Validation failed', result.array())
    }

    const payload = {
      ...boardData,
      id: crypto.randomUUID(),
      authorId: request.user!.id as string,
    }

    const newBoard = await this.boardRepository.create(payload)

    return newBoard
  }

  public async updateBoard(
    request: Request,
    { id, boardData }: { id: string; boardData: IBoard },
  ) {
    const board = await this.boardRepository.findById(id)

    if (!board) {
      throw new NotFoundError('Board not found')
    }

    if (board && board.authorId !== request.user!.id) {
      throw new ForbiddenError(
        'You do not have permission to update this board',
      )
    }

    const result = validationResult(request)

    if (!result.isEmpty()) {
      throw new ValidationError('Validation failed', result.array())
    }

    const updatedBoard = await this.boardRepository.update(id, boardData)

    if (!updatedBoard) {
      throw new NotFoundError('Board not found')
    }

    return updatedBoard
  }

  public async deleteBoard(request: Request, { id }: { id: string }) {
    const board = await this.boardRepository.findById(id)

    if (!board) {
      throw new NotFoundError('Board not found')
    }

    if (board && board.authorId !== request.user!.id) {
      throw new ForbiddenError(
        'You do not have permission to delete this board',
      )
    }

    const tasks = await this.taskRepository.findByQuery({
      boardId: id,
    })

    await Promise.all(tasks.map((task) => this.taskRepository.delete(task.id)))

    return this.boardRepository.delete(id)
  }
}
