import { ITask } from './entities'

export interface IRepository<M extends { id: string } = any> {
  findAll(): Promise<M[]>
  findByQuery(query: Partial<M>): Promise<M[]>
  findById(id: string): Promise<M | null>
  create(data: M): Promise<M>
  createMany(data: M[]): Promise<M[]>
  update(id: string, data: Partial<M>): Promise<M>
  delete(id: string): Promise<void>
}

export interface ITaskRepository extends IRepository<ITask> {
  updateTaskWorkflow(id: string, data: Pick<ITask, 'workflow'>): Promise<ITask>
}

export type ConstructorParams<R extends IRepository = IRepository> = {
  repository: R
}
