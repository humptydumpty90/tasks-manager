import { Spin } from 'antd';

import './style.scss';

export const Loading = ({ className = '' }) => {
  return (
    <div className={ `${className} loading` }>
      <Spin size="large" />
    </div>
  );
};
