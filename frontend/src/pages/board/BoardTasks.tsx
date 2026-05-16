import BoardTasks from '../../components/board-tasks';
import { useParams } from 'react-router';
import { useGetBoardQuery, useGetBoardTasksQuery } from '../../store/api';
import { Error } from '../../components/error';
import { Loading } from '../../components/loading';
import { getError } from '../../utils';

export const BoardTasksPage = () => {
  const params = useParams();

  const {
    data: boardData,
    isLoading: boardLoading,
    error: boardError,
  } = useGetBoardQuery(params.boardId!);
  const {
    data: tasksData,
    isLoading: tasksLoading,
    error: tasksError,
  } = useGetBoardTasksQuery(params.boardId!);

  const errorInfo = getError(tasksData?.data, boardError || tasksError);

  const hasLoading = boardLoading || tasksLoading;
  const hasError = !hasLoading && errorInfo;
  const hasData = !hasLoading && !hasError;

  return (
    <div className="tasks-manager__content-container board-tasks-page">
      <h2 className="tasks-manager__content-title board-tasks-page__title">
        { boardData?.data?.name || 'Unknown Board' }
      </h2>
      <div className="tasks-manager__content-body board-tasks-page__content">
        { hasLoading && <Loading /> }
        { hasError && <Error { ...errorInfo } /> }
        { hasData && <BoardTasks tasks={ tasksData!.data } /> }
      </div>
    </div>
  );
};
