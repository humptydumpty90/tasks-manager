import { Button, Tag } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  RightCircleOutlined,
  LeftCircleOutlined,
} from '@ant-design/icons';
import { WorkflowCode } from '../../interfaces/enums';
import type { ITask } from '../../interfaces';

import './style.scss';

interface TaskViewProps {
  task: ITask
  handleEdit(taskId: string): void
  handleDelete(taskId: string): void
  transitionWorkflow(taskId: string, workflow: WorkflowCode): void
}

interface ButtonActionProps {
  icon: React.ReactNode
  disabled?: boolean
  onClick?: () => void
}

export const TaskView = ({
  task,
  handleEdit,
  handleDelete,
  transitionWorkflow,
}: TaskViewProps) => {
  const tagMapping: Record<WorkflowCode, string> = {
    [WorkflowCode.TODO]: 'gray',
    [WorkflowCode.PROGRESS]: 'blue',
    [WorkflowCode.DONE]: 'green',
  };

  const generalActions = [
    <ButtonAction
      key="edit"
      icon={ <EditOutlined /> }
      onClick={ () => handleEdit(task.id) }
    />,
    <ButtonAction
      key="delete"
      icon={ <DeleteOutlined /> }
      onClick={ () => handleDelete(task.id) }
    />,
  ];

  const workflowActions: Record<WorkflowCode, React.ReactNode[]> = {
    [WorkflowCode.TODO]: [
      <ButtonAction
        key="move-prev"
        icon={ <LeftCircleOutlined /> }
        disabled
        onClick={ () => console.log('Nothing to move prev') }
      />,
      <ButtonAction
        key="move-next"
        icon={ <RightCircleOutlined /> }
        onClick={ () => transitionWorkflow(task.id, WorkflowCode.PROGRESS) }
      />,
    ],
    [WorkflowCode.PROGRESS]: [
      <ButtonAction
        key="move-prev"
        icon={ <LeftCircleOutlined /> }
        onClick={ () => transitionWorkflow(task.id, WorkflowCode.TODO) }
      />,
      <ButtonAction
        key="move-next"
        icon={ <RightCircleOutlined /> }
        onClick={ () => transitionWorkflow(task.id, WorkflowCode.DONE) }
      />,
    ],
    [WorkflowCode.DONE]: [
      <ButtonAction
        key="move-prev"
        icon={ <LeftCircleOutlined /> }
        onClick={ () => transitionWorkflow(task.id, WorkflowCode.PROGRESS) }
      />,
      <ButtonAction
        key="move-next"
        icon={ <RightCircleOutlined /> }
        onClick={ () => console.log('Nothing to move next') }
        disabled
      />,
    ],
  };

  return (
    <>
      <div className="task-view__content-row">
        <h3 className="task-view__content-title">Workflow</h3>
        { workflowActions[task?.workflow.code as WorkflowCode] }
      </div>

      <div className="task-view__content-row">
        <h3 className="task-view__content-title">Status</h3>
        <Tag
          className="task-view__content-status"
          variant="solid"
          color={ tagMapping[task?.workflow.code as WorkflowCode] }
        >
          { task?.workflow.label }
        </Tag>
      </div>

      <div className="task-view__content-row">
        <h3 className="task-view__content-title">Description</h3>
        <p>{ task?.description || 'No description available' }</p>
      </div>

      <div className="task-view__content-row">
        <h3 className="task-view__content-title">Actions</h3>
        { generalActions }
      </div>
    </>
  );
};

const ButtonAction = ({ icon, disabled = false, onClick }: ButtonActionProps) => {
  return (
    <Button
      shape="circle"
      className="task-view__content-action"
      icon={ icon }
      disabled={ disabled }
      onClick={ onClick }
    />
  );
};
