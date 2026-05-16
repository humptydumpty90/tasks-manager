import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from './base';
import type {
  IBoard,
  ICreateBoardResponse,
  IDeleteBoardResponse,
  IGetBoardListResponse,
  IGetBoardResponse,
  IGetBoardTaskListResponse,
  IUpdateBoardResponse,
} from '../../interfaces';

const BASE_URL = `${API_URL}/boards`;

const API_NAME = 'boardsApi';

type CreateBoardPayload = Pick<IBoard, 'name' | 'description'>;
type UpdateBoardPayload = {
  boardId: string
  body: Partial<CreateBoardPayload>
};

export const boardsApi = createApi({
  reducerPath: API_NAME,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
  }),
  tagTypes: ['Boards', 'BoardTasks'],
  endpoints: build => ({
    getBoards: build.query<IGetBoardListResponse, void>({
      query: () => '/',
      providesTags: ['Boards'],
    }),
    createBoard: build.mutation<ICreateBoardResponse, CreateBoardPayload>({
      query: body => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Boards'],
    }),
    editBoard: build.mutation<IUpdateBoardResponse, UpdateBoardPayload>({
      query: ({ boardId, body }) => ({
        url: `/${boardId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Boards'],
    }),
    deleteBoard: build.mutation<IDeleteBoardResponse, string>({
      query: (boardId: string) => ({
        url: `/${boardId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Boards'],
    }),
    getBoard: build.query<IGetBoardResponse, string>({
      query: (boardId: string) => `/${boardId}`,
    }),
    getBoardTasks: build.query<IGetBoardTaskListResponse, string>({
      query: (boardId: string) => `/${boardId}/tasks`,
      providesTags: ['BoardTasks'],
    }),
  }),
});

export const {
  useGetBoardsQuery,
  useCreateBoardMutation,
  useEditBoardMutation,
  useDeleteBoardMutation,
  useGetBoardQuery,
  useGetBoardTasksQuery,
} = boardsApi;

export { API_NAME as BOARDS_API_NAME };
