import { Col } from 'antd';

interface GridColumnProps {
  children: React.ReactNode
  className?: string
}

export const GridColumn = ({ children, className = '' }: GridColumnProps) => {
  return (
    <Col
      span={ 8 }
      className={ `grid-column ${className}` }
    >
      { children }
    </Col>
  );
};
