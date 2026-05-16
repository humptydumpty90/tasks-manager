import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Task } from '../../components/task'
import { GridColumn, GridRow } from '../grid'
import { useNotification } from '../../context'
import {
  useDeleteTaskMutation,
  useTransitionWorkflowMutation,
} from '../../store/api'
import { filterByWorkflow, getErrorMessage } from '../../utils'
import { WorkflowCode, WorkflowLabel } from '../../interfaces/enums'
import type { ITaskList } from '../../interfaces'

import './style.scss'

interface BoardTasksProps {
  tasks: ITaskList
}

interface BoardTasksWorkflowProps {
  workflow: WorkflowLabel
  className?: string
}

interface BoardTasksDataProps {
  tasks: ITaskList
  className?: string
}

export const BoardTasks = ({ tasks }: BoardTasksProps) => {
  const todoTasks = filterByWorkflow(tasks, WorkflowCode.TODO)
  const inProgressTasks = filterByWorkflow(tasks, WorkflowCode.PROGRESS)
  const doneTasks = filterByWorkflow(tasks, WorkflowCode.DONE)

  return (
    <GridRow className="board-tasks__row">
      <GridColumn>
        <BoardTasksWorkflow
          workflow={WorkflowLabel.TODO}
          className="board-tasks__column-title"
        />
        <BoardTasksData
          tasks={todoTasks}
          className="board-tasks__column-tasks"
        />
      </GridColumn>
      <GridColumn>
        <BoardTasksWorkflow
          workflow={WorkflowLabel.PROGRESS}
          className="board-tasks__column-title"
        />
        <BoardTasksData
          tasks={inProgressTasks}
          className="board-tasks__column-tasks"
        />
      </GridColumn>
      <GridColumn>
        <BoardTasksWorkflow
          workflow={WorkflowLabel.DONE}
          className="board-tasks__column-title"
        />
        <BoardTasksData
          tasks={doneTasks}
          className="board-tasks__column-tasks"
        />
      </GridColumn>
    </GridRow>
  )
}

const BoardTasksWorkflow = ({
  workflow,
  className = '',
}: BoardTasksWorkflowProps) => {
  return <div className={`${className}`}>{workflow}</div>
}

const BoardTasksData = ({ tasks, className = '' }: BoardTasksDataProps) => {
  const navigate = useNavigate()
  const api = useNotification()
  const [submitTransition, payloadTransition] = useTransitionWorkflowMutation()
  const [submitDelete, payloadTaskDeletion] = useDeleteTaskMutation()

  const openTask = (taskId: string) => {
    console.log('Open task with id', taskId)
    navigate(`/tasks/${taskId}`)
  }

  const editTask = (taskId: string) => {
    navigate(`/tasks/${taskId}/edit`)
  }

  const deleteTask = (taskId: string) => {
    console.log('Delete task with id', taskId)
    submitDelete(taskId)
  }

  const transitionWorkflow = (taskId: string, workflow: WorkflowCode) => {
    submitTransition({ taskId, body: { workflow } })
  }

  useEffect(() => {
    if (payloadTaskDeletion.isSuccess) {
      api.success({
        title: 'Task has been deleted',
        description: 'The task has been successfully deleted.',
      })
    }

    if (payloadTaskDeletion.isError) {
      api.error({
        title: 'Failed to delete task',
        description: getErrorMessage(payloadTaskDeletion.error),
      })
    }
  }, [payloadTaskDeletion.isSuccess, payloadTaskDeletion.isError])

  useEffect(() => {
    if (payloadTransition.isSuccess) {
      api.success({
        title: payloadTransition.data?.data.title,
        description: 'Task workflow has been successfully updated.',
      })
    }
    if (payloadTransition.isError) {
      api.error({
        title: payloadTransition.data?.data.title,
        description: getErrorMessage(payloadTransition.error),
      })
    }
  }, [payloadTransition.isSuccess, payloadTransition.isError])

  const components = tasks.map((task) => (
    <Task
      key={task.id}
      task={task}
      openTask={openTask}
      editTask={editTask}
      deleteTask={deleteTask}
      transitionWorkflow={transitionWorkflow}
    />
  ))

  return <div className={`${className}`}>{components}</div>
}
