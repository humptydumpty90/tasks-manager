import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Boards } from '../../components/boards';
import { useDeleteBoardMutation, useGetBoardsQuery } from '../../store/api';
import { Error } from '../../components/error';
import { Loading } from '../../components/loading';
import { useNotification } from '../../context';
import { getError, getErrorMessage } from '../../utils';

export const BoardPage = () => {
  const navigate = useNavigate();
  const api = useNotification();
  const { data, isLoading, error } = useGetBoardsQuery();
  const [submit, payloadBoardDeletion] = useDeleteBoardMutation();

  const errorInfo = getError(data?.data, error);

  const hasError = !isLoading && errorInfo;
  const hasData = !isLoading && !hasError;

  const openBoardTasks = (boardId: string) => {
    navigate(`/boards/${boardId}/tasks`);
  };

  const editBoard = (boardId: string) => {
    navigate(`/boards/${boardId}/edit`);
  };

  const deleteBoard = (boardId: string) => {
    console.log(`Deleting board with ID: ${boardId}`);
    submit(boardId);
  };

  useEffect(() => {
    if (payloadBoardDeletion.isSuccess) {
      api.success({
        title: 'Board deleted successfully',
        description: 'The board has been deleted.',
      });

      navigate('/boards');
    }

    if (payloadBoardDeletion.isError) {
      api.error({
        title: 'Board deletion failed',
        description: getErrorMessage(payloadBoardDeletion.error),
      });
    }
  }, [payloadBoardDeletion.isSuccess, payloadBoardDeletion.isError]);

  return (
    <>
      <Outlet />
      <div className="tasks-manager__content-container boards-page">
        <h2 className="tasks-manager__content-title boards-page__title">Boards</h2>
        <div className="tasks-manager__content-body boards-page__content">
          { isLoading && <Loading /> }
          { hasError && <Error { ...errorInfo } /> }
          { hasData && (
            <Boards
              boards={ data!.data }
              openBoardTasks={ openBoardTasks }
              editBoard={ editBoard }
              deleteBoard={ deleteBoard }
            />
          ) }
        </div>
      </div>
    </>
  );
};
