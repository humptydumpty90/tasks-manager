import { Card, Space, theme, Typography, type CardProps } from 'antd';
import {
  LeftCircleOutlined,
  RightCircleOutlined,
  EditOutlined,
  CheckOutlined,
  DashOutlined,
  EyeOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { WorkflowCode } from '../../interfaces/enums';
import type { ITask } from '../../interfaces';

import './style.scss';

interface TaskProps {
  task: ITask
  openTask(taskId: string): void
  editTask(taskId: string): void
  deleteTask(taskId: string): void
  transitionWorkflow(taskId: string, workflowCode: WorkflowCode): void
}

const { useToken } = theme;
const { Paragraph } = Typography;

export const Task = ({ task, openTask, editTask, deleteTask, transitionWorkflow }: TaskProps) => {
  const { token } = useToken();

  const { title, description, workflow } = task;
  const { code } = workflow;

  const bgStatusMap: Record<WorkflowCode, string> = {
    [WorkflowCode.TODO]: token.colorFillContent,
    [WorkflowCode.PROGRESS]: token.blue2,
    [WorkflowCode.DONE]: token.green2,
  };

  const colorStatusMap: Record<WorkflowCode, string> = {
    [WorkflowCode.TODO]: token.colorText,
    [WorkflowCode.PROGRESS]: token.blue8,
    [WorkflowCode.DONE]: token.green8,
  };

  const iconStatusMap: Record<WorkflowCode, React.ReactNode> = {
    [WorkflowCode.TODO]: <DashOutlined style={ { fontSize: '1em', color: token.colorText } } />,
    [WorkflowCode.PROGRESS]: <EditOutlined style={ { fontSize: '1em', color: token.blue8 } } />,
    [WorkflowCode.DONE]: <CheckOutlined style={ { fontSize: '1em', color: token.green8 } } />,
  };

  const generalActions = [
    <EyeOutlined
      className="task__icon"
      onClick={ () => openTask(task.id) }
    />,
    <EditOutlined
      className="task__icon"
      onClick={ () => editTask(task.id) }
    />,
    <DeleteOutlined
      className="task__icon"
      onClick={ () => deleteTask(task.id) }
    />,
  ];

  const workflowActions: Record<WorkflowCode, React.ReactNode[]> = {
    [WorkflowCode.TODO]: [
      <RightCircleOutlined
        className="task__icon task__icon--workflow"
        onClick={ () => transitionWorkflow(task.id, WorkflowCode.PROGRESS) }
      />,
    ],
    [WorkflowCode.PROGRESS]: [
      <LeftCircleOutlined
        className="task__icon task__icon--workflow"
        onClick={ () => transitionWorkflow(task.id, WorkflowCode.TODO) }
      />,
      <RightCircleOutlined
        className="task__icon task__icon--workflow"
        onClick={ () => transitionWorkflow(task.id, WorkflowCode.DONE) }
      />,
    ],
    [WorkflowCode.DONE]: [
      <LeftCircleOutlined
        className="task__icon task__icon--workflow"
        onClick={ () => transitionWorkflow(task.id, WorkflowCode.PROGRESS) }
      />,
    ],
  };

  const actions = [
    ...workflowActions[code],
    ...generalActions,
  ];

  const styles: CardProps['styles'] = {
    header: {
      textAlign: 'left',
      backgroundColor: bgStatusMap[code],
      color: colorStatusMap[code],
    },
  };

  return (
    <Card
      className="task"
      title={ <Space>{ iconStatusMap[code] } <span>{ title }</span></Space> }
      styles={ { ...styles } }
      actions={ actions }
    >
      <Paragraph
        style={ { maxWidth: '100%', height: '70px' } }
        ellipsis={ { rows: 3 } }
      >
        { description }
      </Paragraph>
    </Card>
  );
};
