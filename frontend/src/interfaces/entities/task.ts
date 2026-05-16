import type { WorkflowCode, WorkflowLabel } from '../enums'

export interface ITask {
  id: string
  title: string
  description: string
  boardId: string
  authorId: string
  workflow: {
    code: WorkflowCode
    label: WorkflowLabel
  }
}

export type ITaskList = ITask[]
