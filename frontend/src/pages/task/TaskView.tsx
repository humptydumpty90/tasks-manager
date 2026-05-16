import { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router';
import { TaskView } from '../../components/task-view';
import { Loading } from '../../components/loading';
import { Error } from '../../components/error';
import {
  useDeleteTaskMutation,
  useGetTaskQuery,
  useTransitionWorkflowMutation,
} from '../../store/api';
import { useNotification } from '../../context';
import { getError, getErrorMessage } from '../../utils';
import type { WorkflowCode } from '../../interfaces';

import './style.scss';

export const TaskViewPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const api = useNotification();
  const { data, isLoading, error } = useGetTaskQuery(params.taskId!);
  const [submitDelete, payloadTaskDeletion] = useDeleteTaskMutation();
  const [submitTransition, payloadTransition] = useTransitionWorkflowMutation();

  const task = data?.data;

  const errorInfo = getError(task, error);

  const hasError = !isLoading && errorInfo;
  const hasData = !isLoading && !hasError;

  const handleEdit = (taskId: string) => {
    console.log('Edit task with id', taskId);
    navigate(`/tasks/${taskId}/edit`);
  };

  const handleDelete = (taskId: string) => {
    console.log('Delete task with id', taskId);
    submitDelete(taskId);
  };

  const transitionWorkflow = (taskId: string, workflow: WorkflowCode) => {
    console.log('Transition task with id', taskId, 'to workflow', workflow);
    submitTransition({ taskId, body: { workflow } });
  };

  useEffect(() => {
    if (payloadTaskDeletion.isSuccess) {
      api.success({
        title: 'Task has been deleted',
        description: 'The task has been successfully deleted.',
      });

      navigate('/boards');
    }

    if (payloadTaskDeletion.isError) {
      api.error({
        title: 'Failed to delete task',
        description: getErrorMessage(payloadTaskDeletion.error),
      });
    }
  }, [payloadTaskDeletion.isSuccess, payloadTaskDeletion.isError]);

  useEffect(() => {
    if (payloadTransition.isSuccess) {
      api.success({
        title: payloadTransition.data?.data.title,
        description: 'Task workflow has been successfully updated.',
      });
    }
    if (payloadTransition.isError) {
      api.error({
        title: payloadTransition.data?.data.title,
        description: getErrorMessage(payloadTransition.error),
      });
    }
  }, [payloadTransition.isSuccess, payloadTransition.isError]);

  return (
    <>
      <Outlet />
      <div className="tasks-manager__content-container task-view-page">
        <h2 className="tasks-manager__content-title task-view-page__title">
          { task?.title || 'No title available' }
        </h2>
        <div className="tasks-manager__content-body task-view-page__content">
          { isLoading && <Loading /> }
          { hasError && <Error { ...errorInfo } /> }
          { hasData && (
            <TaskView
              task={ data!.data }
              handleEdit={ handleEdit }
              handleDelete={ handleDelete }
              transitionWorkflow={ transitionWorkflow }
            />
          ) }
        </div>
      </div>
    </>
  );
};
