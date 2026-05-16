import { Card, theme, type CardProps } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';

import { GridColumn, GridRow } from '../grid';
import type { IBoardList, IBoard } from '../../interfaces';

import './style.scss';

interface BoardTasksProps {
  boards: IBoardList
  openBoardTasks(boardId: string): void
  editBoard(boardId: string): void
  deleteBoard(boardId: string): void
}

interface BoardCardProps {
  className?: string
  board: IBoard
  openBoardTasks(boardId: string): void
  editBoard(boardId: string): void
  deleteBoard(boardId: string): void
}

const { useToken } = theme;

export const Boards = ({
  boards,
  openBoardTasks,
  editBoard,
  deleteBoard,
}: BoardTasksProps) => {
  const boardsComponents = boards.map(board => (
    <GridColumn key={ board.id }>
      <BoardCard
        board={ board }
        openBoardTasks={ openBoardTasks }
        editBoard={ editBoard }
        deleteBoard={ deleteBoard }
      />
    </GridColumn>
  ));

  return (
    <div className="boards">
      <GridRow className="boards__row">
        { boardsComponents }
      </GridRow>
    </div>
  );
};

const BoardCard = ({
  className,
  board,
  openBoardTasks,
  editBoard,
  deleteBoard,
}: BoardCardProps) => {
  const { token } = useToken();

  const { name, description } = board;

  const styles: CardProps['styles'] = {
    header: {
      textAlign: 'left',
      backgroundColor: token.blue2,
      color: token.colorText,
    },
  };

  const actions = [
    <EyeOutlined
      style={ { fontSize: '1rem' } }
      onClick={ () => openBoardTasks(board.id) }
    />,
    <EditOutlined
      style={ { fontSize: '1rem' } }
      onClick={ () => editBoard(board.id) }
    />,
    <DeleteOutlined
      style={ { fontSize: '1rem' } }
      onClick={ () => deleteBoard(board.id) }
    />,
  ];

  return (
    <Card
      className={ `board-card ${className}` }
      styles={ { ...styles } }
      title={ <span>{ name }</span> }
      actions={ actions }
    >
      { description }
    </Card>
  );
};
