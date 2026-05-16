import { Row } from 'antd';

interface GridRowProps {
  children: React.ReactNode
  className?: string
}

export const GridRow = ({ children, className = '' }: GridRowProps) => {
  return (
    <Row
      className={ `grid-row ${className}` }
      align="stretch"
      gutter={ 24 }
    >
      { children }
    </Row>
  );
};
