import type { IAuth } from './auth'
import type { IBoard, IBoardList } from './entities/board'
import type { ITask, ITaskList } from './entities/task'

export interface IError<D = any[]> {
  code: string
  message: string
  details: D
}

export interface IApiResponse<T, E = any> {
  data: T
  error: E
}

type AuthResponse = IApiResponse<Omit<IAuth, 'password'>>

export type ISignUpResponse = IApiResponse<AuthResponse, IError>
export type ISignInResponse = IApiResponse<AuthResponse, IError>
export type IGetMeResponse = IApiResponse<AuthResponse, IError>

export type IGetBoardListResponse = IApiResponse<IBoardList, IError>
export type IGetBoardResponse = IApiResponse<IBoard, IError>
export type IGetBoardTaskListResponse = IApiResponse<ITaskList, IError>
export type ICreateBoardResponse = IApiResponse<IBoard, IError>
export type IUpdateBoardResponse = IApiResponse<IBoard, IError>
export type IDeleteBoardResponse = IApiResponse<void, IError>

export type IGetTaskResponse = IApiResponse<ITask, IError>
export type ICreateTaskResponse = IApiResponse<ITask, IError>
export type IUpdateTaskResponse = IApiResponse<ITask, IError>
export type IDeleteTaskResponse = IApiResponse<void, IError>
