import { Result } from 'antd';
import type { ResultStatusType } from 'antd/es/result';
import { StatusCodes } from '../../interfaces';

import './style.scss';

export type StatusKeys = Exclude<StatusCodes, 'VALIDATION_ERROR'>;

interface ErrorProps {
  className?: string
  code?: StatusKeys
  title?: string
  message?: string
}

type ErrorMap = {
  [key in StatusKeys]: ResultStatusType;
};

const statusMap: ErrorMap = {
  [StatusCodes.FETCH_ERROR]: 'error',
  [StatusCodes.NO_DATA]: '404',
  [StatusCodes.UNAUTHORIZED]: '403',
  [StatusCodes.INVALID_CREDENTIALS]: '403',
  [StatusCodes.FORBIDDEN]: '403',
  [StatusCodes.NOT_FOUND]: '404',
  [StatusCodes.SERVER_ERROR]: '500',
};

export const Error = ({
  title,
  message,
  code = StatusCodes.SERVER_ERROR,
  className = '',
}: ErrorProps) => {
  return (
    <div className={ `${className} error` }>
      <Result
        status={ statusMap[code] }
        title={ title }
        subTitle={ message }
      />
    </div>
  );
};
