import { redirect } from 'react-router';
import { DashboardLayout } from '../layouts';
import {
  BoardCreatePage,
  BoardEditPage,
  BoardPage,
  BoardTasksPage,
  TaskCreatePage,
  TaskEditPage,
  TaskViewPage,
} from '../pages';
import { CreateType } from '../interfaces/enums';

export const dashboardRoutes = {
  path: '/',
  Component: DashboardLayout,
  children: [
    {
      index: true,
      middleware: [() => {
        return redirect('/boards');
      }],
    },
    {
      path: 'boards',
      Component: BoardPage,
      handle: { createType: CreateType.BOARD },
      children: [
        {
          path: 'create',
          Component: BoardCreatePage,
          handle: { createType: CreateType.BOARD },
        },
        {
          path: ':boardId/edit',
          Component: BoardEditPage,
          handle: { createType: CreateType.BOARD },
        },
      ],
    },
    {
      path: 'boards/:boardId/tasks',
      Component: BoardTasksPage,
      handle: { createType: CreateType.TASK },
    },
    {
      path: 'tasks/:taskId',
      Component: TaskViewPage,
      handle: { createType: CreateType.TASK },
      children: [
        {
          path: 'edit',
          Component: TaskEditPage,
          handle: { createType: CreateType.TASK },
        },
      ],
    },
    {
      path: 'tasks/create',
      Component: TaskCreatePage,
      handle: { createType: CreateType.TASK },
    },
  ],
};
