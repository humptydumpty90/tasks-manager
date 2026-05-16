import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { boardsApi } from './boards'
import { API_URL } from './base'
import type {
  ICreateTaskResponse,
  IDeleteTaskResponse,
  IGetTaskResponse,
  ITask,
  IUpdateTaskResponse,
  WorkflowCode,
} from '../../interfaces'

const BASE_URL = `${API_URL}/tasks`

const API_NAME = 'tasksApi'

type CreateTaskPayload = Pick<ITask, 'title' | 'description' | 'boardId'>
type UpdateTaskPayload = {
  taskId: string
  body: Partial<CreateTaskPayload>
}
type TransitionWorkflowPayload = {
  taskId: string
  body: {
    workflow: WorkflowCode
  }
}

export const tasksApi = createApi({
  reducerPath: API_NAME,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
  }),
  tagTypes: ['Task'],
  endpoints: (build) => ({
    getTask: build.query<IGetTaskResponse, string>({
      query: (taskId: string) => `/${taskId}`,
      providesTags: ['Task'],
    }),
    сreateTask: build.mutation<ICreateTaskResponse, CreateTaskPayload>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
    }),
    updateTask: build.mutation<IUpdateTaskResponse, UpdateTaskPayload>({
      query: ({ taskId, body }) => ({
        url: `/${taskId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: build.mutation<IDeleteTaskResponse, string>({
      query: (taskId: string) => ({
        url: `/${taskId}`,
        method: 'DELETE',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled
        dispatch(boardsApi.util.invalidateTags(['BoardTasks']))
      },
    }),
    transitionWorkflow: build.mutation<
      IUpdateTaskResponse,
      TransitionWorkflowPayload
    >({
      query: ({ taskId, body }) => ({
        url: `/${taskId}/workflow`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Task'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled
        dispatch(boardsApi.util.invalidateTags(['BoardTasks']))
      },
    }),
  }),
})

export const {
  useGetTaskQuery,
  useСreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useTransitionWorkflowMutation,
} = tasksApi

export { API_NAME as TASKS_API_NAME }
