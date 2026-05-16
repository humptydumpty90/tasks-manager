import crypto from 'crypto'
import { validationResult } from 'express-validator'
import { Request } from 'express'
import { transformWorkflow } from '../utils'
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../common/errors'

import {
  type IBoard,
  type IRepository,
  ITaskRepository,
  WorkflowCode,
} from '../interfaces'
import type { ITask } from '../interfaces/entities/task'

type ConstructorParams = {
  boardRepository: IRepository<IBoard>
  taskRepository: ITaskRepository
}

export class TaskService {
  private boardRepository: IRepository<IBoard>
  private taskRepository: ITaskRepository

  constructor({ boardRepository, taskRepository }: ConstructorParams) {
    this.boardRepository = boardRepository
    this.taskRepository = taskRepository
  }

  // api/v1/tasks?boardId=:boardId
  public async getAllTasks(request: Request) {
    const { boardId = '' } = request.query!

    const result = validationResult(request)

    if (!result.isEmpty()) {
      throw new ValidationError('Validation failed', result.array())
    }

    const board = await this.boardRepository.findById(boardId as string)

    if (!board) {
      throw new NotFoundError('Board not found')
    }

    if (board && board.authorId !== request.user!.id) {
      throw new ForbiddenError(
        'You do not have permission to access this board',
      )
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

  public async getTaskById(req: Request, { id }: { id: string }) {
    const task = await this.taskRepository.findById(id)

    if (!task) {
      throw new NotFoundError('Task not found')
    }

    if (task.authorId !== req.user!.id) {
      throw new ForbiddenError('You do not have permission to access this task')
    }

    return {
      ...task,
      workflow: transformWorkflow(task.workflow as WorkflowCode),
    }
  }

  public async createTask(request: Request, { taskData }: { taskData: ITask }) {
    const result = validationResult(request)

    if (!result.isEmpty()) {
      throw new ValidationError('Validation failed', result.array())
    }

    const payload = {
      ...taskData,
      description: taskData.description || '',
      workflow: taskData.workflow || WorkflowCode.TODO,
      id: crypto.randomUUID(),
      authorId: request.user!.id as string,
    }

    return this.taskRepository.create(payload)
  }

  public async updateTask(
    request: Request,
    { id, taskData }: { id: string; taskData: ITask },
  ) {
    const result = validationResult(request)

    if (!result.isEmpty()) {
      throw new ValidationError('Validation failed', result.array())
    }

    const task = await this.taskRepository.findById(id)

    if (!task) {
      throw new NotFoundError('Task not found')
    }

    if (task.authorId !== request.user!.id) {
      throw new ForbiddenError('You do not have permission to update this task')
    }

    const updatedTask = await this.taskRepository.update(id, taskData)

    return {
      ...updatedTask,
      workflow: transformWorkflow(updatedTask.workflow as WorkflowCode),
    }
  }

  public async updateTaskWorkflow(
    request: Request,
    { id, taskData }: { id: string; taskData: Pick<ITask, 'workflow'> },
  ) {
    const result = validationResult(request)

    if (!result.isEmpty()) {
      throw new ValidationError('Validation failed', result.array())
    }

    const task = await this.taskRepository.findById(id)

    if (!task) {
      throw new NotFoundError('Task not found')
    }

    if (task.authorId !== request.user!.id) {
      throw new ForbiddenError('You do not have permission to update this task')
    }

    const updatedTask = await this.taskRepository.updateTaskWorkflow(
      id,
      taskData,
    )

    return {
      ...updatedTask,
      workflow: transformWorkflow(updatedTask.workflow as WorkflowCode),
    }
  }

  public async deleteTask(request: Request, { id }: { id: string }) {
    const task = await this.taskRepository.findById(id)

    if (!task) {
      throw new NotFoundError('Task not found')
    }

    if (task.authorId !== request.user!.id) {
      throw new ForbiddenError('You do not have permission to delete this task')
    }

    return this.taskRepository.delete(id)
  }
}
