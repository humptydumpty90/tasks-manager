import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import {
  StatusCodes,
  WorkflowCode,
  type IApiResponse,
  type IError,
  type ITaskList,
} from '../interfaces';
import type { StatusKeys } from '../components/error';

const isEmpty = <T>(data: T | null | undefined): data is null | undefined => {
  if (data === null || data === undefined) {
    return true;
  }
  if (Array.isArray(data)) {
    return data.length === 0;
  }
  if (typeof data === 'object') {
    return Object.keys(data).length === 0;
  }

  return false;
};

export const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined,
): string => {
  if (!error) return 'An unknown error occurred.';

  if ('status' in error) {
    const serverError = error.data as IApiResponse<any, IError>;

    return serverError?.error?.message || `Error status: ${error.status}`;
  }

  return error.message || 'Network connection failed';
};

export const getError = (
  data: IApiResponse<any, IError>['data'],
  error: FetchBaseQueryError | SerializedError | undefined,
): { code: StatusKeys, title: string, message: string } | null => {
  if (isEmpty(data) && isEmpty(error)) {
    return {
      code: StatusCodes.NO_DATA,
      title: 'No Data',
      message: 'No data available.',
    };
  }

  if (isEmpty(error)) {
    return null;
  }

  if ('status' in error) {
    const serverData = error.data as IApiResponse<any, IError>;

    return {
      code: serverData?.error?.code as StatusKeys || StatusCodes.SERVER_ERROR,
      title: `${error.status}`,
      message: serverData?.error?.message || `Error status: ${error.status}`,
    };
  }

  return {
    code: StatusCodes.FETCH_ERROR,
    title: 'Fetch Error',
    message: error.message || 'Network connection failed',
  };
};

export const filterByWorkflow = (tasks: ITaskList, workflowCode: WorkflowCode): ITaskList => {
  return tasks.filter(task => task.workflow.code === workflowCode) as ITaskList;
};
